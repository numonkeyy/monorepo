import type { Change, DiffReport, LixPlugin } from "@lix-js/sdk";
import { Bundle, Message, Variant } from "../schema/schemaV2.js";
import { loadDatabaseInMemory } from "sqlite-wasm-kysely";
import { initKysely } from "../database/initKysely.js";

export const inlangLixPluginV1: LixPlugin<{
	bundle: Bundle;
	message: Message;
	variant: Variant;
}> = {
	key: "inlang-lix-plugin-v1",
	glob: "*",
	// TODO
	// idea:
	//   1. runtime reflection for lix on the change schema
	//   2. lix can validate the changes based on the schema
	// schema: {
	// 	bundle: Bundle,
	// 	message: Message,
	// 	variant: Variant,
	// },
	merge: {
		file: async ({ file, ownLix, incomingLix }) => {
			const conflicts = [];
			// todo: separate merge api because
			//       - it simplifies the conflict api of a plugin by separating the concerns
			//         of "reporting conflicts" and "auto resolving conflicts"
			//       - the UX could be increased by offering an "autoResolveConficts = false" option
			const merges: Change[] = [];
			const incomingChanges = await relativeComplementOfIncomingChanges({
				ownLix,
				incomingLix,
				fileId: file.id,
			});
			for (const incomingChange of incomingChanges) {
				if (incomingChange.operation === "create") {
					// no conflict possible
					continue;
				} else if (incomingChange.operation === "update") {
					// naive every update operation is a conflict in step 1
					// the conflict detection can incrementally be improved
					conflicts.push({
						// optional metadata for the conflict
						meta: {},
						reason: "The changes are conflicting",
						change_id: incomingChange.id,
						other_change_id: incomingChange.id,
					});
				} else if (incomingChange.operation === "delete") {
					const ownParent = await ownLix.db
						.select("change")
						.where("id", "=", incomingChange.parent_id)
						.executeTakeFirst();
					const incomingParent = await incomingLix.db
						.select("change")
						.where("id", "=", incomingChange.parent_id)
						.executeTakeFirst();
					// pseudocode comparison, needs to use the diff functions
					if (ownParent !== incomingParent) {
						// the parent changes differ, hence the child changes are conflicting
						conflicts.push({
							// optional metadata for the conflict
							meta: {},
							reason: `
							  The ${incomingChange.type} has been deleted
								in the incoming change but has been updated
								in the meantime. The other person not aware
								of the update.
							`,
							change_id: incomingChange.id,
							other_change_id: incomingChange.id,
						});
					}
				}
			}
			return conflicts;
		},
	},
	diff: {
		// TODO does not account for deletions
		file: async ({ old, neu }) => {
			// can only handle the database for now
			if (neu === undefined || neu.path?.endsWith("db.sqlite") === false) {
				return [];
			}
			const result: DiffReport[] = [];
			const oldDb = old
				? initKysely({ sqlite: await loadDatabaseInMemory(old.data) })
				: undefined;
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const newDb = neu
				? initKysely({
						sqlite: await loadDatabaseInMemory(neu.data),
				  })
				: undefined;

			const newProjectBundles = await newDb
				?.selectFrom("bundle")
				.selectAll()
				.execute();

			const newProjectMessages = await newDb
				?.selectFrom("message")
				.selectAll()
				.execute();
			const newProjectVariants = await newDb
				?.selectFrom("variant")
				.selectAll()
				.execute();

			for (const bundle of newProjectBundles ?? []) {
				const oldBundle = await oldDb
					?.selectFrom("bundle")
					.selectAll()
					.where("id", "=", bundle.id)
					.executeTakeFirst();
				result.push(
					...(await inlangLixPluginV1.diff.bundle({
						old: oldBundle,
						neu: bundle,
					}))
				);
			}
			for (const message of newProjectMessages ?? []) {
				const oldMessage = await oldDb
					?.selectFrom("message")
					.selectAll()
					.where("id", "=", message.id)
					.executeTakeFirst();

				result.push(
					...(await inlangLixPluginV1.diff.message({
						old: oldMessage,
						neu: message,
					}))
				);
			}
			for (const variant of newProjectVariants ?? []) {
				const oldVariant = await oldDb
					?.selectFrom("variant")
					.selectAll()
					.where("id", "=", variant.id)
					.executeTakeFirst();
				result.push(
					...(await inlangLixPluginV1.diff.variant({
						old: oldVariant,
						neu: variant,
					}))
				);
			}

			return result;
		},
		bundle: ({ old, neu }) =>
			jsonStringifyComparison({ old, neu, type: "bundle" }),
		message: ({ old, neu }) =>
			jsonStringifyComparison({ old, neu, type: "message" }),
		variant: ({ old, neu }) =>
			jsonStringifyComparison({ old, neu, type: "variant" }),
	},
};

function jsonStringifyComparison({
	old,
	neu,
	type,
}: {
	old?: Bundle | Message | Variant;
	neu?: Bundle | Message | Variant;
	type: "bundle" | "message" | "variant";
}): DiffReport[] {
	if (old === undefined && neu) {
		return [{ type, old, neu, operation: "create" } satisfies DiffReport];
	} else if (old !== undefined && neu === undefined) {
		return [{ type, old, neu, operation: "delete" } satisfies DiffReport];
	} else if (old && neu) {
		const hasDiff = JSON.stringify(old) !== JSON.stringify(neu);
		if (hasDiff) {
			return [
				{
					type,
					operation: "update",
					old,
					neu,
				} satisfies DiffReport,
			];
		}
	}
	return [];
}
