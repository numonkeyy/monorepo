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
		file: async ({ own, other ownLix, otherLix }) => {
			const diffs = await this.diff.file({ old: own, neu: other });
			const changes: Change[] = [];
			// todo should operate on changes instead of diffs
			for (const diff of diffs) {
				// benefits of exposing lix:
				//   - plugins can implement their own merging logic
				//   - changes are loaded on demand by the plugin
				//     (instead of lix assuming what the plugin needs)
				const ownHistory = await ownLix.db
					.selectFrom("change")
					.selectAll()
					.where("type", "=", diff.type)
					.where("value.id", "=", diff.neu.id)
					.execute();
				const otherHistory = await otherLix.db
					.selectFrom("change")
					.selectAll()
					.where("type", "=", diff.type)
					.where("value.id", "=", diff.neu.id)
					.execute();
				const lastOwnChange = ownHistory.at(-1);
				const lastOtherChange = otherHistory.at(-1);
				if (diff.operation === "create") {
					// the other history can only be of length 1 for a create operation
					changes.push(otherHistory[0]);
				} else if (
					// very simple conflict resolution
					// that does not account for "in-between" updates
					// like someone changing the message.description
					// while someone else edits the selectors
					diff.operation === "update" ||
					(diff.operation === "delete" &&
						lastOwnChange.id !== lastOtherChange.parent_id)
				) {
					for (const change of otherHistory) {
						const ownChange = ownLix.db.select("change")
						if (ownHistory.some((c) => c.id === change.id)) {
							// common change, skip. we care about changes when the history differs
							continue;
						}
						if (changes.type === "variant"){
							checkIfMessageHasNoConflictWithVariant(change)

							const ownMessage =
							const otherMessage 
							if (otherMessage.locale !== ownMessage.locale) {
								conflict.push({
									change: change.id,
									otherChange: ownMessage.lastChange.id
								})
							} 
						}
						// change is not in common, add it and mark the last
						// other change as conflicting with the last own change
						changes.push(change);
						// TODO marking a change conflict is marked once, not N
						// TODO times. hence, a change conflict table that i
						// TODO could push "this change conflicts with that change"
						// TODO seems easier
						changes.at(-1).conflicts_with_change_id = lastOwnChange.id;
					}
				} else if (
					diff.operation === "delete" &&
					lastOwnChange.id === lastOtherChange.parent_id
				) {
					// the change has been deleted with no diverging history
					changes.push(lastOtherChange);
				} else {
					throw new Error("Unexhaustive match");
				}
			}
			return { changes };
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
