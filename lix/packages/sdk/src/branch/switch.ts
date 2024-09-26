import type { initDb } from "../database/initDb.js";
import { getLeafChangesDiff } from "./get-leaf-changes-diff.js";
import type { LixPlugin } from "../plugin.js";
import type { Change } from "../database/schema.js";

export async function switchBranch(args: {
	plugins: LixPlugin[];
	db: ReturnType<typeof initDb>;
	branchId?: string;
	name?: string;
}) {
	await args.db.transaction().execute(async (trx) => {
		if (!args.branchId) {
			if (!args.name) {
				throw new Error();
			}
			args.branchId = (
				await trx
					.selectFrom("branch")
					.where("name", "=", args.name)
					.select("id")
					.executeTakeFirstOrThrow()
			).id;
		}
		const currentBranchId = (
			await trx
				.selectFrom("branch")
				.where("active", "=", true)
				.select("id")
				.executeTakeFirstOrThrow()
		).id;
		await trx
			.updateTable("branch")
			.where("active", "=", true)
			.set({ active: false })
			.execute();

		await trx
			.updateTable("branch")
			.where("id", "=", args.branchId)
			.set({ active: true })
			.execute();

		const leafChangesDiff = await getLeafChangesDiff({
			sourceDb: trx,
			plugins: args.plugins,
			sourceBranchId: currentBranchId,
			targetBranchId: args.branchId,
		});

		const plugin = args.plugins[0];

		const changesByFileId: Record<string, typeof leafChangesDiff> =
			leafChangesDiff.reduce((agg, change) => {
				// @ts-ignore
				if (!agg[change.file_id]) {
					// @ts-ignore
					agg[change.file_id] = [];
				}
				// @ts-ignore
				agg[change.file_id].push(change);
				return agg;
			}, {});

		for (const [fileId, changes] of Object.entries(changesByFileId)) {
			const file = await trx
				.selectFrom("file")
				.selectAll()
				.where("id", "=", fileId)
				.executeTakeFirstOrThrow();

			const { fileData } = await plugin!.applyChanges!({
				lix: { db: args.db, plugins: args.plugins },
				file,
				// @ts-ignore
				changes: changes.filter((change) => !change._toDelete),
				// @ts-ignore
				obsoleteChanges: changes.filter((change) => !!change._toDelete),
			});

			await trx
				.updateTable("file_internal")
				.set("data", fileData!)
				.where("id", "=", file.id)
				.execute();
		}
	});
}
