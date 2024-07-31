import { Kysely, ParseJSONResultsPlugin } from "kysely"
import { SQLocalKysely } from "sqlocal/kysely"
import type { Database, Settings } from "../schema/schema.js"
import { openLixFromOpfs } from "@lix-js/sdk"
import { deepmerge } from "deepmerge-ts"

/**
 *
 */
export async function loadProjectFromOpfs(args: { path: string }) {
	const lix = await openLixFromOpfs({ path: args.path })

	const { dialect, sql } = new SQLocalKysely({
		storage: {
			type: "memory",
		},
	})

	const db = new Kysely<Database>({
		dialect,
		plugins: [new ParseJSONResultsPlugin()],
	})

	const settingsFile = await lix.db
		.selectFrom("file")
		.select("blob")
		.where("path", "=", "/settings.json")
		.executeTakeFirstOrThrow()

	let settings = JSON.parse(new TextDecoder().decode(settingsFile.blob)) as Settings

	return {
		db,
		settings: {
			get: () => settings,
			set: async (newSettings: Partial<Settings>) => {
				// merge settings
				const merged = deepmerge(settings, newSettings)
				// save settings in lix
				await lix.db
					.updateTable("file")
					.where("path", "is", "/settings.json")
					.set({
						blob: await new Blob([JSON.stringify(merged, undefined, 2)]).arrayBuffer(),
					})
					.execute()
				// if successful, update local settings
				settings = merged as Settings
			},
		},
		toBlob: () => lix.toBlob,
		sql,
		lix,
	}
}