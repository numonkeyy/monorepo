/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { beforeEach, describe, expect, test, vi } from "vitest";
import { ProjectSettings } from "../json-schema/settings.js";
import { fs, vol, Volume } from "memfs";
import {
	loadProjectFromDirectory,
	ResourceFileImportError,
	WarningDeprecatedLintRule,
	WarningLocalPluginImport,
} from "./loadProjectFromDirectory.js";
import { selectBundleNested } from "../query-utilities/selectBundleNested.js";
import { Text } from "../json-schema/pattern.js";
import type { InlangPlugin } from "../plugin/schema.js";
import type {
	MessageV1,
	VariantV1,
} from "../json-schema/old-v1-message/schemaV1.js";
import { saveProjectToDirectory } from "./saveProjectToDirectory.js";
import { insertBundleNested } from "../query-utilities/insertBundleNested.js";
import { loadProjectFromDirectorySynced } from "./loadProjectFromDirectorySynced.js";

test("plugin.loadMessages and plugin.saveMessages must not be condigured together with import export", async () => {
	const mockLegacyPlugin: InlangPlugin = {
		key: "mock-legacy-plugin",
		loadMessages: async () => {
			return [];
		},
		saveMessages: async () => {},
	};

	const mockLegacyPlugin2: InlangPlugin = {
		key: "mock-legacy-plugin-2",
		loadMessages: async () => {
			return [];
		},
		saveMessages: async () => {},
	};

	const mockImportExportPlugin: InlangPlugin = {
		key: "mock-import-export-plugin",
		exportFiles: () => {
			return [];
		},
		importFiles: () => {
			return {} as any;
		},
	};

	await expect(
		(async () => {
			await loadProjectFromDirectory({
				fs: Volume.fromJSON({
					"./project.inlang/settings.json": JSON.stringify({
						baseLocale: "en",
						locales: ["en", "de"],
						modules: [],
					} satisfies ProjectSettings),
				}) as any,
				path: "./project.inlang",
				providePlugins: [
					mockLegacyPlugin,
					mockLegacyPlugin2,
					mockImportExportPlugin,
				],
			});
		})()
	).rejects.toThrowError();

	await expect(
		(async () => {
			await loadProjectFromDirectory({
				fs: Volume.fromJSON({
					"./project.inlang/settings.json": JSON.stringify({
						baseLocale: "en",
						locales: ["en", "de"],
						modules: [],
					} satisfies ProjectSettings),
				}) as any,
				path: "./project.inlang",
				providePlugins: [
					mockLegacyPlugin,
					mockLegacyPlugin2,
					mockImportExportPlugin,
				],
			});
		})()
	).rejects.toThrowError();
});

test("plugin.loadMessages and plugin.saveMessages should work for legacy purposes", async () => {
	const mockLegacyPlugin: InlangPlugin = {
		id: "mock-legacy-plugin",
		// @ts-expect-error - id is deprecated, key can be undefined
		key: undefined,
		loadMessages: async ({ nodeishFs, settings }) => {
			const pathPattern = settings["plugin.mock-plugin"]?.pathPattern as string;

			const messages: MessageV1[] = [];

			// @ts-expect-error - language tag is always given by the sdk v2
			for (const languageTag of settings.languageTags) {
				const data = await nodeishFs.readFile(
					pathPattern.replace("{languageTag}", languageTag)
				);

				for (const [key, value] of Object.entries(
					JSON.parse(data.toString())
				)) {
					const exisitngMessage = messages.find(
						(message) => message.id === key
					);
					const variant = {
						languageTag: languageTag,
						match: [],
						pattern: [{ type: "Text", value: value }],
					} as VariantV1;
					if (exisitngMessage !== undefined) {
						exisitngMessage.variants.push(variant);
					} else {
						messages.push({
							alias: {},
							id: key,
							selectors: [],
							variants: [variant],
						});
					}
				}
			}

			return messages;
		},
		saveMessages: async ({ messages, nodeishFs, settings }) => {
			const pathPattern = settings["plugin.mock-plugin"]?.pathPattern as string;
			for (const languageTag of settings.languageTags!) {
				const messagesInLanguage = {} as Record<string, string>;
				for (const message of messages) {
					const variantsInLanguage = message.variants.filter(
						(variant) => variant.languageTag === languageTag
					);
					if (variantsInLanguage.length > 1) {
						// data will get lost during export => throw?
					} else if (variantsInLanguage.length === 1) {
						if (
							variantsInLanguage[0]!.pattern.length != 1 ||
							variantsInLanguage[0]!.pattern[0]?.type !== "Text"
						) {
							// throw?
						}
						messagesInLanguage[message.id] = (
							variantsInLanguage[0]!.pattern[0]! as any
						).value;
					}
					// else no-op
				}
				await nodeishFs.writeFile(
					pathPattern.replace("{languageTag}", languageTag),
					JSON.stringify(messagesInLanguage, null, 2)
				);
			}
		},
	};
	const mockRepo = {
		"./README.md": "# Hello World",
		"./src/index.js": "console.log('Hello World')",
		"./src/translations/en.json": JSON.stringify({
			key1: "value1",
			key2: "value2",
		}),
		"./src/translations/de.json": JSON.stringify({
			key1: "wert1",
			key2: "wert2",
		}),
		"./project.inlang/settings.json": JSON.stringify({
			baseLocale: "en",
			locales: ["en", "de"],
			modules: ["./mock-module.js"],
			"plugin.mock-plugin": {
				pathPattern: "./src/translations/{languageTag}.json",
			},
		} satisfies ProjectSettings),
	};

	const fs = Volume.fromJSON(mockRepo);

	let project = await loadProjectFromDirectory({
		fs: fs as any,
		path: "./project.inlang",
		providePlugins: [mockLegacyPlugin],
	});

	await insertBundleNested(project.db, {
		id: "key-id",
		messages: [
			{
				id: "mock-message",
				bundleId: "mock-bundle",
				locale: "en",
				selectors: [],
				variants: [
					{
						messageId: "mock-message",
						pattern: [
							{
								type: "text",
								value: "JOJO",
							},
						],
					},
				],
			},
		],
	});

	await saveProjectToDirectory({
		fs: fs.promises as any,
		path: "./project.inlang",
		project,
	});

	project = await loadProjectFromDirectory({
		fs: fs as any,
		path: "./project.inlang",
		providePlugins: [mockLegacyPlugin],
	});

	const bundles = await selectBundleNested(project.db).execute();

	const bundlesOrdered = bundles.sort((a, b) => a.id.localeCompare(b.id));

	expect(bundles.length).toBe(3);
	expect(bundlesOrdered[0]?.messages[0]?.locale).toBe("en");
	expect(
		(bundlesOrdered[0]?.messages[0]?.variants[0]?.pattern[0] as Text)?.value
	).toBe("JOJO");

	// TODO fix
	// expect(bundlesOrdered[0]?.messages[9]?.locale).toBe("en");
	// expect(
	// 	(bundlesOrdered[0]?.messages[1]?.variants[0]?.pattern[0] as Text)?.value
	// ).toBe("wert1");

	// expect(bundlesOrdered[1]?.messages[0]?.locale).toBe("en");
	// expect(
	// 	(bundlesOrdered[1]?.messages[0]?.variants[0]?.pattern[0] as Text)?.value
	// ).toBe("value2");

	// expect(bundlesOrdered[1]?.messages[1]?.locale).toBe("de");
	// expect(
	// 	(bundlesOrdered[1]?.messages[1]?.variants[0]?.pattern[0] as Text)?.value
	// ).toBe("wert2");
});

const mockSettings = {
	baseLocale: "en",
	locales: ["en", "de"],
	modules: [],
} satisfies ProjectSettings;

const mockDirectory = {
	"/project.inlang/cache/plugin/29j49j2": "cache value",
	"/project.inlang/.gitignore": "git value",
	"/project.inlang/prettierrc.json": "prettier value",
	"/project.inlang/README.md": "readme value",
	"/project.inlang/settings.json": JSON.stringify(mockSettings),
};

describe("it should keep files between the inlang directory and lix in sync", async () => {
	test("files from directory should be available via lix after project has been loaded from directory", async () => {
		const syncInterval = 100;
		const fs = Volume.fromJSON(mockDirectory);

		const project = await loadProjectFromDirectorySynced({
			fs: fs as any,
			path: "/project.inlang",
			syncInterval: syncInterval,
		});

		const files = await project.lix.db.selectFrom("file").selectAll().execute();

		expect(files.length).toBe(
			5 + 1 /* the db.sqlite file */ + 1 /* project_id */
		);

		const filesByPath = files.reduce((acc, file) => {
			acc[file.path] = new TextDecoder().decode(file.data);
			return acc;
		}, {} as any);

		expect(filesByPath["/cache/plugin/29j49j2"]).toBe("cache value");
		expect(filesByPath["/.gitignore"]).toBe("git value");
		expect(filesByPath["/prettierrc.json"]).toBe("prettier value");
		expect(filesByPath["/README.md"]).toBe("readme value");
		expect(filesByPath["/settings.json"]).toBe(JSON.stringify(mockSettings));
	});

	test("updates on settings.json should be avaialable in lix ", async () => {
		const syncInterval = 100;
		const fs = Volume.fromJSON(mockDirectory);

		const project = await loadProjectFromDirectorySynced({
			fs: fs as any,
			path: "/project.inlang",
			syncInterval: syncInterval,
		});

		const fileInLixBefore = await project.lix.db
			.selectFrom("file")
			.selectAll()
			.where("path", "=", "/settings.json")
			.executeTakeFirstOrThrow();

		// "changes to a file on disk should reflect in lix
		fs.writeFileSync(
			"/project.inlang/settings.json",
			JSON.stringify({
				...mockSettings,
				baseLocale: "brand-new-locale-written-to-fs-file",
			})
		);

		// console.log("wrting fs settings");
		await new Promise((resolve) => setTimeout(resolve, syncInterval + 10));
		const fileInLix = await project.lix.db
			.selectFrom("file")
			.selectAll()
			.where("path", "=", "/settings.json")
			.executeTakeFirstOrThrow();

		const settingsAfterUpdateOnDisk = JSON.parse(
			new TextDecoder().decode(fileInLix.data)
		);

		expect(settingsAfterUpdateOnDisk.baseLocale).toBe(
			"brand-new-locale-written-to-fs-file"
		);
	});

	test("updates on settings.json file in lix should be avaialable in fs ", async () => {
		const syncInterval = 100;
		const fs = Volume.fromJSON(mockDirectory);

		const project = await loadProjectFromDirectorySynced({
			fs: fs as any,
			path: "/project.inlang",
			syncInterval: syncInterval,
		});

		// console.log("wrting lix settings");
		// changes to a file in lix should reflect in the project directory
		await project.lix.db
			.updateTable("file")
			.where("path", "=", "/settings.json")
			.set({
				data: new TextEncoder().encode(
					JSON.stringify({ ...mockSettings, baseLocale: "brand-new-locale2" })
				),
			})
			.execute();

		// lets wait a seconds to allow the sync process catch up
		await new Promise((resolve) => setTimeout(resolve, syncInterval + 10));

		const fileOnDisk = fs.readFileSync("/project.inlang/settings.json");
		const settings = JSON.parse(fileOnDisk.toString());

		expect(settings.baseLocale).toBe("brand-new-locale2");
	});

	// TODO how should we model the conflict caese?
	test.skip("settings.json file updated in fs and lix (conflicting) should result in the fs state", async () => {
		const syncInterval = 100;
		const fs = Volume.fromJSON(mockDirectory);

		const project = await loadProjectFromDirectory({
			fs: fs as any,
			path: "/project.inlang",
		});

		// console.log("wrting fs settings simultanous");
		// changes to a file on disk and lix at the same time should lead to the fs version
		fs.writeFileSync(
			"/project.inlang/settings.json",
			JSON.stringify({ ...mockSettings, baseLocale: "fs-version" })
		);

		// console.log("wrting lix settings simultanous");
		await project.lix.db
			.updateTable("file")
			.where("path", "=", "/settings.json")
			.set({
				data: new TextEncoder().encode(
					JSON.stringify({ ...mockSettings, baseLocale: "lix-version" })
				),
			})
			.execute();

		// lets wait a seconds to allow the sync process catch up
		await new Promise((resolve) => setTimeout(resolve, 1010));

		const fileOnDiskUpdated = fs.readFileSync("/project.inlang/settings.json");
		const settingsUpdated = JSON.parse(fileOnDiskUpdated.toString());

		expect(settingsUpdated.baseLocale).toBe("fs-version");

		const fileInLixUpdated = await project.lix.db
			.selectFrom("file")
			.selectAll()
			.where("path", "=", "/settings.json")
			.executeTakeFirstOrThrow();

		const settingsAfterUpdateOnDiskAndLix = JSON.parse(
			new TextDecoder().decode(fileInLixUpdated.data)
		);

		expect(settingsAfterUpdateOnDiskAndLix.baseLocale).toBe("fs-version");
	});
});
