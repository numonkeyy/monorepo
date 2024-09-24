import { getLeafChange, type LixPlugin } from "@lix-js/sdk";
import { contentFromDatabase, loadDatabaseInMemory } from "sqlite-wasm-kysely";
import { initDb } from "../database/initDb.js";

export const applyChanges: NonNullable<LixPlugin["applyChanges"]> = async ({
	lix,
	file,
	changes,
}) => {
	// todo make transactional

	if (file.path?.endsWith("db.sqlite")) {
		const sqlite = await loadDatabaseInMemory(file.data);
		const db = initDb({ sqlite });

		// the award for the most inefficient deduplication goes to...
		const leafChanges = [
			...new Set(
				await Promise.all(
					changes.map(async (change) => {
						const leafChange = await getLeafChange({ change, lix });
						// enable string comparison to avoid duplicates
						return JSON.stringify(leafChange);
					})
				)
			),
		].map((v) => JSON.parse(v));

		// changes need to be applied in order of foreign keys to avoid constraint violations
		// 1. bundles
		// 2. messages
		// 3. variants
		const applyOrder: Record<string, number> = {
			bundle: 1,
			message: 2,
			variant: 3,
		};

		// future optimization potential here but sorting in one go
		const orderedLeafChanges = [...leafChanges].sort((a, b) => {
			const orderA = applyOrder[a.type];
			const orderB = applyOrder[b.type];

			if (orderA === undefined || orderB === undefined) {
				throw new Error(
					`Received an unknown entity type: ${a.type} && ${
						b.type
					}. Expected one of: ${Object.keys(applyOrder)}`
				);
			}

			return orderA - orderB;
		});
		for (const leafChange of orderedLeafChanges) {
			// deletion
			if (leafChange.value === undefined) {
				await db
					.deleteFrom(leafChange.type as "bundle" | "message" | "variant")
					.where("id", "=", leafChange.meta?.id)
					.execute();
				continue;
			}

			// upsert the value
			const value = leafChange.value as any;
			await db
				.insertInto(leafChange.type as "bundle" | "message" | "variant")
				.values(value)
				.onConflict((c) => c.column("id").doUpdateSet(value))
				.execute();
		}
		return { fileData: contentFromDatabase(sqlite) };
	} else if (file.path?.endsWith("settings.json")) {
		const leafChange = [
			...new Set(
				await Promise.all(
					changes.map(async (change) => {
						const leafChange = await getLeafChange({ change, lix });
						// enable string comparison to avoid duplicates
						return JSON.stringify(leafChange);
					})
				)
			),
		].map((v) => JSON.parse(v));

		if (leafChange.length === 0) {
			console.log("NO CHANGE", new TextDecoder().decode(file.data));
			return { fileData: file.data };
		}
		console.log(leafChange.length);
		if (leafChange.length !== 1) {
			throw new Error(
				"we only save a snapshot from the settings file - there must be only one change " +
					leafChange.length +
					" found" +
					JSON.stringify(changes)
			);
		}
		if (leafChange[0].operation === "create") {
			console.log("CREATE!!!! " + JSON.stringify(leafChange[0].value));
			return { fileData: new TextEncoder().encode( JSON.stringify(leafChange[0].value.data)) };
		} else if (leafChange[0].operation === "update") {
			console.log("UPDATE!!!! " + JSON.stringify(leafChange[0].value));
			return { fileData: new TextEncoder().encode( JSON.stringify(leafChange[0].value.data)) };
		} else {
			throw new Error(
				`Operation ${leafChange[0].operation} on settings file currently not supported`
			);
		}
	} else {
		throw new Error(
			"Unimplemented. Only the db.sqlite file can be handled for now."
		);
	}
};
