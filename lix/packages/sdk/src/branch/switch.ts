import type { initDb } from "../database/initDb.js";
import { getLeafChangesDiff } from "../query-utilities/get-leaf-changes-diff.js";
import type { LixPlugin } from "../plugin.js";

export async function switchBranch(args: {
	plugins: LixPlugin[];
	db: ReturnType<typeof initDb>;
	lix: any;
	branchId?: string;
	name?: string;
}) {
	console.log(args.lix);

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

		await plugin?.applyChanges(leafChangesDiff);
	});
}
