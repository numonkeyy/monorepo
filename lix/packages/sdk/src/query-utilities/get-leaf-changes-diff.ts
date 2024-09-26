import type { Change, LixReadonly } from "@lix-js/sdk";
import type { LixPlugin } from "../plugin.js";

export async function getLeafChangesDiff(args: {
	plugins: LixPlugin[];
	sourceDb: LixReadonly["db"];
	targetDb?: LixReadonly["db"];
	sourceBranchId?: string;
	targetBranchId?: string;
}): Promise<{ toDelete: Change[]; toChange: Change[] }> {
	if (!args.targetDb) {
		args.targetDb = args.sourceDb;
	}
	if (!args.sourceBranchId) {
		args.sourceBranchId = (
			await args.sourceDb
				.selectFrom("branch")
				.select("id")
				.where("active", "=", true)
				.executeTakeFirstOrThrow()
		).id;
	}
	if (!args.targetBranchId) {
		args.targetBranchId = (
			await args.targetDb
				.selectFrom("branch")
				.select("id")
				.where("active", "=", true)
				.executeTakeFirstOrThrow()
		).id;
	}
	const result: Change[] = [];

	const leafChangesInSource = await args.sourceDb
		.selectFrom("change_view")
		.selectAll()
		.where("branch_id", "=", args.sourceBranchId)
		.where(
			"id",
			"not in",
			// @ts-ignore - no idea what the type issue is
			args.sourceDb
				.selectFrom("change_view")
				.select("parent_id")
				.where("parent_id", "is not", undefined)
				.where("branch_id", "=", args.sourceBranchId)
				.distinct(),
		)
		.execute();

	const sourceChangesByValueId = leafChangesInSource.reduce((agg, change) => {
		// @ts-ignore
		agg[change.value.id] = change;
		return agg;
	}, {});

	const leafChangesInTarget = await args.targetDb
		.selectFrom("change_view")
		.selectAll()
		.where("branch_id", "=", args.targetBranchId)
		.where(
			"id",
			"not in",
			// @ts-ignore - no idea what the type issue is
			args.targetDb
				.selectFrom("change_view")
				.select("parent_id")
				.where("parent_id", "is not", undefined)
				.where("branch_id", "=", args.targetBranchId)
				.distinct(),
		)
		.execute();

	const targetChangesByValueId = leafChangesInTarget.reduce((agg, change) => {
		// @ts-ignore
		agg[change.value.id] = change;
		return agg;
	}, {});

	const toDelete = [];
	for (const change of leafChangesInTarget) {
		// @ts-ignore
		if (!sourceChangesByValueId[change.value.id]) {
			toDelete.push(change);
		}
	}

	const plugin = args.plugins[0]!;
	const toChange = [];

	for (const change of leafChangesInSource) {
		// @ts-ignore
		const targetChange = targetChangesByValueId[change.value.id];
		if (change.id === targetChange.id) {
			continue;
		}

		// @ts-ignore
		const old = targetChangesByValueId[change.value!.id] as Change | undefined;

		const diff = await plugin.diff[change.type]!({
			neu: change.value,
			old: old?.value,
		});

		if (diff.length) {
			toChange.push(change);
		}
		// console.log({ diff });
	}

	// console.log(
	// 	JSON.stringify(
	// 		{
	// 			targetChangesByValueId,
	// 			sourceChangesByValueId,

	// 			toDelete,
	// 			toChange,
	// 		},
	// 		null,
	// 		4,
	// 	),
	// );

	return { toDelete, toChange };
}
