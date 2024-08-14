import type { LixPlugin } from "../plugin.js";
import { Kysely, ParseJSONResultsPlugin, sql } from "kysely";
import type { LixDatabase, LixFile } from "../schema.js";
import { commit } from "../commit.js";
import { v4 } from "uuid";
import {
	contentFromDatabase,
	createDialect,
	type SqliteDatabase,
} from "sqlite-wasm-kysely";
import { minimatch } from "minimatch";

// start a new normalize path function that has the absolute minimum implementation.
function normalizePath(path: string) {
	if (!path.startsWith("/")) {
		return "/" + path;
	}
	return path;
}

// TODO: fix in fink to not use time ordering!
// .orderBy("commit.created desc")

/**
 * Common setup between different lix environments.
 */
export async function openLix(args: {
	database: SqliteDatabase;
	/**
	 * Usecase are lix apps that define their own file format,
	 * like inlang (unlike a markdown, csv, or json plugin).
	 *
	 * (+) avoids separating app code from plugin code and
	 *     resulting bundling logic.
	 * (-) such a file format must always be opened with the
	 *     file format sdk. the file is not portable
	 *
	 * @example
	 *   const lix = await openLixInMemory({ blob: await newLixFile(), providePlugin: [myPlugin] })
	 */
	providePlugins?: LixPlugin[];
}) {
	const db = new Kysely<LixDatabase>({
		dialect: createDialect({ database: args.database }),
		plugins: [new ParseJSONResultsPlugin()],
	});

	const plugins = await loadPlugins(db);
	if (args.providePlugins && args.providePlugins.length > 0) {
		plugins.push(...args.providePlugins);
	}

	args.database.createFunction({
		name: "triggerWorker",
		arity: 0,
		// @ts-expect-error - dynamic function
		xFunc: () => {
			// TODO: abort current running queue?
			queueWorker();
		},
	});

	
	let pending: Promise<void> | undefined;
	let resolve: () => void;
	// run number counts the worker runs in a current batch and is used to prevent race conditions where a trigger is missed because a previous run is just about to reset the hasMoreEntriesSince flag
	let runNumber = 1;
	// If a queue trigger happens during an existing queue run we might miss updates and use hasMoreEntriesSince to make sure there is always a final immediate queue worker execution
	let hasMoreEntriesSince: number | undefined = undefined;
	async function queueWorker(trail = false) {
		if (pending && !trail) {
			hasMoreEntriesSince = runNumber;
			// console.log({ hasMoreEntriesSince });
			return;
		}
		runNumber++;

		if (!pending) {
			pending = new Promise((res) => {
				resolve = res;
			});
		}

		const entry = await db
			.selectFrom("queue")
			.selectAll()
			.orderBy("id asc")
			.limit(1)
			.executeTakeFirst();

		if (entry) {
			const oldFile = await db
				.selectFrom("file_internal")
				.select("data")
				.select("path")
				.where("id", "=", entry.file_id)
				.limit(1)
				.executeTakeFirst();

			if (oldFile?.data) {
				await handleFileChange({
					queueEntry: entry,
					old: {
						id: entry.file_id,
						path: oldFile?.path,
						data: oldFile?.data,
					},
					neu: {
						id: entry.file_id,
						path: entry.path,
						data: entry.data,
					},
					plugins,
					db,
				})
			} else {
				await handleFileInsert({
					queueEntry: entry,
					neu: {
						id: entry.file_id,
						path: entry.path,
						data: entry.data,
					},
					plugins,
					db,
				})
			}
		}

		// console.log("getrting { numEntries }");

		const { numEntries } = await db
			.selectFrom("queue")
			.select((eb) => eb.fn.count<number>("id").as("numEntries"))
			.executeTakeFirstOrThrow();

		// console.log({ numEntries });

		if (
			!hasMoreEntriesSince ||
			(numEntries === 0 && hasMoreEntriesSince < runNumber)
		) {
			resolve!(); // TODO: fix type
			pending = undefined;
			hasMoreEntriesSince = undefined;
			// console.log("resolving");
		}

		// TODO: handle endless tries on failing quee entries
		// we either execute the queue immediately if we know there is more work or fall back to polling
		setTimeout(() => queueWorker(true), hasMoreEntriesSince ? 0 : 1000);
	}
	queueWorker();

	async function settled() {
		// console.log("settled", pending);
		await pending;
	}

	return {
		db,
		settled,
		toBlob: async () => {
			await settled();
			return new Blob([contentFromDatabase(args.database)]);
		},
		plugins,
		close: async () => {
			args.database.close();
			await db.destroy();
		},
		commit: (args: { userId: string; description: string }) => {
			return commit({ db, ...args });
		},
	};
}

async function loadPlugins(db: Kysely<LixDatabase>) {
	const pluginFiles = (
		await sql`
    SELECT * FROM file
    WHERE path GLOB 'lix/plugin/*'
  `.execute(db)
	).rows as unknown as LixFile[];

	const decoder = new TextDecoder("utf8");
	const plugins: LixPlugin[] = [];
	for (const plugin of pluginFiles) {
		const text = btoa(decoder.decode(plugin.data));
		const pluginModule = await import(
			/* @vite-ignore */ "data:text/javascript;base64," + text
		);
		plugins.push(pluginModule.default);
		if (pluginModule.default.setup) {
			await pluginModule.default.setup();
		}
	}
	return plugins as LixPlugin[];
}

// // TODO register on behalf of apps or leave it up to every app?
// //      - if every apps registers, components can be lazy loaded
// async function registerDiffComponents(plugins: LixPlugin[]) {
// 	for (const plugin of plugins) {
// 		for (const type in plugin.diffComponent) {
// 			const component = plugin.diffComponent[type]?.()
// 			const name = "lix-plugin-" + plugin.key + "-diff-" + type
// 			if (customElements.get(name) === undefined) {
// 				// @ts-ignore
// 				customElements.define(name, component)
// 			}
// 		}
// 	}
// }

async function getChangeHistory({
	atomId,
	depth,
	fileId,
	pluginKey,
	diffType,
	db,
}: {
	atomId: string;
	depth: number;
	fileId: string;
	pluginKey: string;
	diffType: string;
	db: Kysely<LixDatabase>;
}): Promise<any[]> {
	if (depth > 1) {
		// TODO: walk change parents until depth
		throw new Error("depth > 1 not supported yet");
	}

	const { commit_id } = await db
		.selectFrom("ref")
		.select("commit_id")
		.where("name", "=", "current")
		.executeTakeFirstOrThrow();

	let nextCommitId = commit_id;
	let firstChange;
	while (!firstChange && nextCommitId) {
		const commit = await db
			.selectFrom("commit")
			.selectAll()
			.where("id", "=", nextCommitId)
			.executeTakeFirst();

		if (!commit) {
			break;
		}
		nextCommitId = commit.parent_id;

		firstChange = await db
			.selectFrom("change")
			.selectAll()
			.where("commit_id", "=", commit.id)
			.where((eb) => eb.ref("value", "->>").key("id"), "=", atomId)
			.where("plugin_key", "=", pluginKey)
			.where("file_id", "=", fileId)
			.where("type", "=", diffType)
			.executeTakeFirst();
	}

	const changes: any[] = [firstChange];

	return changes;
}

async function handleFileChange(args: {
	queueEntry: any;
	old: LixFile;
	neu: LixFile;
	plugins: LixPlugin[];
	db: Kysely<LixDatabase>;
}) {
	const fileId = args.neu?.id ?? args.old?.id;

	const pluginDiffs: any[] = [];

	for (const plugin of args.plugins) {
		// glob expressions are expressed relative without leading / but path has leading /
		if (!minimatch(normalizePath(args.neu.path), "/" + plugin.glob)) {
			break;
		}

		const diffs = await plugin.diff!.file!({
			old: args.old,
			neu: args.neu,
		});

		pluginDiffs.push({
			diffs,
			pluginKey: plugin.key,
			pluginDiffFunction: plugin.diff,
		});
	}

	await args.db.transaction().execute(async (trx) => {
		for (const { diffs, pluginKey, pluginDiffFunction } of pluginDiffs) {
			for (const diff of diffs ?? []) {
				// assume an insert or update operation as the default
				// if diff.neu is not present, it's a delete operationd
				const value = diff.neu ?? diff.old;

				// TODO: save hash of changed fles in every commit to discover inconsistent commits with blob?

				const previousUncomittedChange = await trx
					.selectFrom("change")
					.selectAll()
					.where((eb) => eb.ref("value", "->>").key("id"), "=", value.id)
					.where("type", "=", diff.type)
					.where("file_id", "=", fileId)
					.where("plugin_key", "=", pluginKey)
					.where("commit_id", "is", null)
					.executeTakeFirst();

				const previousCommittedChange = (
					await getChangeHistory({
						atomId: value.id,
						depth: 1,
						fileId,
						pluginKey,
						diffType: diff.type,
						db: trx,
					})
				)[0];

				if (previousUncomittedChange) {
					// working change exists but is different from previously committed change
					// -> update the working change or delete if it is the same as previous uncommitted change
					// overwrite the (uncomitted) change
					// to avoid (potentially) saving every keystroke change
					let previousCommittedDiff = [];

					// working change exists but is identical to previously committed change
					if (previousCommittedChange) {
						previousCommittedDiff = await pluginDiffFunction?.[diff.type]?.({
							old: previousCommittedChange.value,
							neu: diff.neu,
						});

						if (previousCommittedDiff.length === 0) {
							// drop the change because it's identical
							await trx
								.deleteFrom("change")
								.where((eb) => eb.ref("value", "->>").key("id"), "=", value.id)
								.where("type", "=", diff.type)
								.where("file_id", "=", fileId)
								.where("plugin_key", "=", pluginKey)
								.where("commit_id", "is", null)
								.execute();
							continue;
						}
					}

					if (!previousCommittedChange || previousCommittedDiff.length) {
						await trx
							.updateTable("change")
							.where((eb) => eb.ref("value", "->>").key("id"), "=", value.id)
							.where("type", "=", diff.type)
							.where("file_id", "=", fileId)
							.where("plugin_key", "=", pluginKey)
							.where("commit_id", "is", null)
							.set({
								id: v4(),
								// @ts-expect-error - database expects stringified json
								value: JSON.stringify(value),
								operation: diff.operation,
								meta: JSON.stringify(diff.meta),
							})
							.execute();
					}
				} else {
					await trx
						.insertInto("change")
						.values({
							id: v4(),
							type: diff.type,
							file_id: fileId,
							plugin_key: pluginKey,
							parent_id: previousCommittedChange?.id,
							// @ts-expect-error - database expects stringified json
							value: JSON.stringify(value),
							meta: JSON.stringify(diff.meta),
							operation: diff.operation,
						})
						.execute();
				}
			}
		}

		await trx
			.deleteFrom("queue")
			.where("id", "=", args.queueEntry.id)
			.execute();
	});
}

// creates initial changes for new files
async function handleFileInsert(args: {
	neu: LixFile;
	plugins: LixPlugin[];
	db: Kysely<LixDatabase>;
	queueEntry: any;
}) {
	const pluginDiffs: any[] = [];

	// console.log({ args });
	for (const plugin of args.plugins) {
		// glob expressions are expressed relative without leading / but path has leading /
		if (!minimatch(normalizePath(args.neu.path), "/" + plugin.glob)) {
			break;
		}

		const diffs = await plugin.diff!.file!({
			old: undefined,
			neu: args.neu,
		});
		// console.log({ diffs });

		pluginDiffs.push({ diffs, pluginKey: plugin.key });
	}

	await args.db.transaction().execute(async (trx) => {
		for (const { diffs, pluginKey } of pluginDiffs) {
			for (const diff of diffs ?? []) {
				const value = diff.neu ?? diff.old;

				await trx
					.insertInto("change")
					.values({
						id: v4(),
						type: diff.type,
						file_id: args.neu.id,
						plugin_key: pluginKey,
						operation: diff.operation,
						// @ts-expect-error - database expects stringified json
						value: JSON.stringify(value),
						meta: JSON.stringify(diff.meta),
						// add queueId interesting for debugging or knowning what changes were generated in same worker run
					})
					.execute();
			}
		}

		// TODO: decide if TRIGGER or in js land with await trx.insertInto('file_internal').values({ id: args.fileId, blob: args.newBlob, path: args.newPath }).execute()
		await trx
			.deleteFrom("queue")
			.where("id", "=", args.queueEntry.id)
			.execute();
	});
}
