/* eslint-disable unicorn/no-null */
import { expect, test, vi } from "vitest";
import { openLixInMemory } from "./open/openLixInMemory.js";
import { newLixFile } from "./newLix.js";
import type { DiffReport, LixPlugin } from "./plugin.js";

test("should use queue and settled correctly", async () => {
	const mockPlugin: LixPlugin<{
		text: { id: string; text: string };
	}> = {
		key: "mock-plugin",
		glob: "*",
		diff: {
			file: async ({ old, neu }) => {
				const dec = new TextDecoder();
				// console.log("diff", neu, old?.data, neu?.data);
				const newText = dec.decode(neu?.data);
				const oldText = dec.decode(old?.data);

				if (newText === oldText) {
					return [];
				}

				return await mockPlugin.diff.text({
					old: old
						? {
								id: "test",
								text: oldText,
							}
						: undefined,
					neu: neu
						? {
								id: "test",
								text: newText,
							}
						: undefined,
				});
			},
			text: async ({ old, neu }) => {
				// console.log("text", old, neu);
				if (old?.text === neu?.text) {
					return [];
				}

				return [
					!old
						? {
								type: "text",
								operation: "create",
								old: undefined,
								neu: {
									id: "test",
									text: neu?.text,
								},
							}
						: {
								type: "text",
								operation: "update",
								old: {
									id: "test",
									text: old?.text,
								},
								neu: {
									id: "test",
									text: neu?.text,
								},
							},
				];
			},
		},
	};

	const lix = await openLixInMemory({
		blob: await newLixFile(),
		providePlugins: [mockPlugin],
	});

	const branches = await lix.db.selectFrom("branch").selectAll().execute();

	expect(branches).toEqual([
		{
			id: branches[0]?.id,
			name: "main",
			base_branch: null,
			active: 1,
		},
	]);

	const enc = new TextEncoder();

	await lix.db
		.insertInto("file")
		.values({ id: "test", path: "test.txt", data: enc.encode("test orig") })
		.execute();

	const internalFiles = await lix.db
		.selectFrom("file_internal")
		.selectAll()
		.execute();

	expect(internalFiles).toEqual([]);

	const queue = await lix.db.selectFrom("change_queue").selectAll().execute();

	expect(queue).toEqual([
		{
			id: 1,
			file_id: "test",
			metadata: null,
			path: "test.txt",
			data: queue[0]?.data,
		},
	]);
	await lix.settled();

	expect(
		(await lix.db.selectFrom("change_queue").selectAll().execute()).length,
	).toBe(0);

	const internalFilesAfter = await lix.db
		.selectFrom("file_internal")
		.selectAll()
		.execute();

	expect(internalFilesAfter).toEqual([
		{
			data: internalFilesAfter[0]?.data,
			id: "test",
			path: "test.txt",
			metadata: null,
		},
	]);

	const changes = await lix.db.selectFrom("change").selectAll().execute();

	expect(changes).toEqual([
		{
			id: changes[0]?.id,
			author: null,
			created_at: changes[0]?.created_at,
			parent_id: null,
			type: "text",
			file_id: "test",
			plugin_key: "mock-plugin",
			value: {
				id: "test",
				text: "test orig",
			},
			meta: null,
			operation: "create",
		},
	]);

	const branchChanges = await lix.db
		.selectFrom("branch_change")
		.selectAll()
		.execute();

	expect(branchChanges).toEqual([
		{
			branch_id: branches[0]?.id,
			change_id: changes[0]?.id,
			id: branchChanges[0]?.id,
			seq: 1,
		},
	]);

	await lix.db
		.updateTable("file")
		.set({ data: enc.encode("test updated text") })
		.where("id", "=", "test")
		.execute();

	// repeat same update
	await lix.db
		.updateTable("file")
		.set({ data: enc.encode("test updated text") })
		.where("id", "=", "test")
		.execute();

	// re apply same change
	await lix.db
		.updateTable("file")
		.set({ data: enc.encode("test updated text") })
		.where("id", "=", "test")
		.execute();

	await lix.db
		.updateTable("file")
		.set({ data: enc.encode("test updated text second update") })
		.where("id", "=", "test")
		.execute();

	const queue2 = await lix.db.selectFrom("change_queue").selectAll().execute();
	expect(queue2).toEqual([
		{
			id: 3,
			file_id: "test",
			path: "test.txt",
			metadata: null,
			data: queue2[0]?.data,
		},
		{
			id: 4,
			file_id: "test",
			path: "test.txt",
			metadata: null,
			data: queue2[1]?.data,
		},
		{
			id: 5,
			file_id: "test",
			path: "test.txt",
			metadata: null,
			data: queue2[2]?.data,
		},
	]);

	await lix.settled();

	expect(
		(await lix.db.selectFrom("change_queue").selectAll().execute()).length,
	).toBe(0);

	const updatedChanges = await lix.db
		.selectFrom("change")
		.selectAll()
		.execute();

	expect(updatedChanges).toEqual([
		{
			id: changes[0]?.id,
			author: null,
			created_at: changes[0]?.created_at,
			parent_id: null,
			type: "text",
			file_id: "test",
			plugin_key: "mock-plugin",
			value: {
				id: "test",
				text: "test orig",
			},
			meta: null,
			operation: "create",
		},
		{
			author: null,
			id: updatedChanges[1]?.id,
			created_at: updatedChanges[1]?.created_at,
			parent_id: changes[0]?.id,
			type: "text",
			file_id: "test",
			operation: "update",
			plugin_key: "mock-plugin",
			value: {
				id: "test",
				text: "test updated text",
			},
			meta: null,
		},
		{
			id: updatedChanges[2]?.id,
			author: null,
			parent_id: updatedChanges[1]?.id,
			type: "text",
			file_id: "test",
			plugin_key: "mock-plugin",
			operation: "update",
			value: { id: "test", text: "test updated text second update" },
			meta: null,
			created_at: updatedChanges[2]?.created_at,
		},
	]);

	const branchChanges2 = await lix.db
		.selectFrom("branch_change")
		.selectAll()
		.execute();

	expect(branchChanges2).toEqual([
		{
			branch_id: branches[0]?.id,
			change_id: updatedChanges[0]?.id,
			id: branchChanges2[0]?.id,
			seq: 1,
		},
		{
			branch_id: branches[0]?.id,
			change_id: updatedChanges[1]?.id,
			id: branchChanges2[1]?.id,
			seq: 2,
		},
		{
			branch_id: branches[0]?.id,
			change_id: updatedChanges[2]?.id,
			id: branchChanges2[2]?.id,
			seq: 3,
		},
	]);

	// test change_view

	const changesFromView = await lix.db
		.selectFrom("change_view")
		.where("branch_id", "=", branches[0]!.id)
		.selectAll()
		.execute();

	expect(changesFromView).toEqual([
		{
			author: null,
			id: changesFromView[0]?.id,
			parent_id: null,
			type: "text",
			file_id: "test",
			plugin_key: "mock-plugin",
			operation: "create",
			value: { id: "test", text: "test orig" },
			meta: null,
			created_at: changesFromView[0]?.created_at,
			branch_id: branches[0]?.id,
			seq: 1,
		},
		{
			author: null,
			id: changesFromView[1]?.id,
			file_id: "test",
			parent_id: changesFromView[0]?.id,
			type: "text",
			plugin_key: "mock-plugin",
			operation: "update",
			value: { id: "test", text: "test updated text" },
			meta: null,
			created_at: changesFromView[1]?.created_at,
			branch_id: branches[0]?.id,
			seq: 2,
		},
		{
			author: null,
			id: changesFromView[2]?.id,
			parent_id: changesFromView[1]?.id,
			file_id: "test",
			type: "text",
			plugin_key: "mock-plugin",
			operation: "update",
			value: { id: "test", text: "test updated text second update" },
			meta: null,
			created_at: changesFromView[2]?.created_at,
			branch_id: branches[0]?.id,
			seq: 3,
		},
	]);

		
});

test("changes should contain the author", async () => {
	const mockPlugin: LixPlugin = {
		key: "mock-plugin",
		glob: "*",
		diff: {
			file: vi.fn().mockResolvedValue([
				{
					type: "mock",
					operation: "create",
					old: undefined,
					neu: {} as any,
				},
			] satisfies DiffReport[]),
		},
	};
	const lix = await openLixInMemory({
		blob: await newLixFile(),
		providePlugins: [mockPlugin],
	});

	await lix.currentAuthor.set("some-id");

	// testing an insert

	await lix.db
		.insertInto("file")
		.values({
			id: "mock",
			data: new Uint8Array(),
			path: "/mock-file.json",
		})
		.execute();

	await lix.settled();

	const changes1 = await lix.db.selectFrom("change").selectAll().execute();

	expect(changes1[0]?.author).toBe("some-id");

	// testing an update

	await lix.db
		.updateTable("file")
		.set({
			data: new Uint8Array(),
		})
		.where("id", "=", "mock")
		.execute();

	await lix.settled();

	const changes2 = await lix.db.selectFrom("change").selectAll().execute();

	expect(changes2[1]?.author).toBe("some-id");

	// testing setting the author
	await lix.currentAuthor.set("some-other-id");

	await lix.db
		.updateTable("file")
		.set({
			data: new Uint8Array(),
		})
		.where("id", "=", "mock")
		.execute();

	await lix.settled();

	const changes3 = await lix.db.selectFrom("change").selectAll().execute();

	expect(changes3.at(-1)?.author).toBe("some-other-id");
});
