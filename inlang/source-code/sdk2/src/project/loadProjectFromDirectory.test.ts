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

test("errors from importing translation files should be shown", async () => {
	const mock = {
		"/project.inlang/settings.json": JSON.stringify({
			baseLocale: "en",
			locales: ["en", "de"],
			modules: [],
		} satisfies ProjectSettings),
	};

	const fs = Volume.fromJSON(mock);

	const proxiedFs = new Proxy(fs, {
		get: (target, prop) => {
			if (prop === "promises") {
				// Intercept the 'promises' object
				return new Proxy(target.promises, {
					get: (promisesTarget, promisesProp) => {
						if (promisesProp === "readFile") {
							// @ts-expect-error - we are mocking the fs
							return (path, ...args) => {
								if (path.endsWith("some-file.json")) {
									throw new Error("MOCK ERROR");
								}
								return promisesTarget.readFile(path, ...args);
							};
						}
						return Reflect.get(promisesTarget, promisesProp);
					},
				});
			}
			return Reflect.get(target, prop);
		},
	});

	const mockPlugin: InlangPlugin = {
		key: "mock-plugin",
		importFiles: async () => {
			return { bundles: [] };
		},
		toBeImportedFiles: async () => {
			return [{ path: "./some-file.json", locale: "mock" }];
		},
	};

	const project = await loadProjectFromDirectory({
		fs: proxiedFs as any,
		path: "/project.inlang",
		providePlugins: [mockPlugin],
	});

	const errors = await project.errors.get();
	// TODO deactivated for now - we need to proxy fs.promises or change the signature of loadProject
	expect(errors).toHaveLength(1);
	expect(errors[0]).toBeInstanceOf(ResourceFileImportError);
});

// it happens often that a resource file doesn't exist yet on import
test("errors from importing translation files that are ENOENT should not be shown", async () => {
	const mock = {
		"/project.inlang/settings.json": JSON.stringify({
			baseLocale: "en",
			locales: ["en", "de"],
			modules: [],
		} satisfies ProjectSettings),
	};

	const fs = Volume.fromJSON(mock);

	const mockPlugin: InlangPlugin = {
		key: "mock-plugin",
		importFiles: async () => {
			return { bundles: [] };
		},
		toBeImportedFiles: async () => {
			return [{ path: "./some-non-existing-file.json", locale: "mock" }];
		},
	};

	const project = await loadProjectFromDirectory({
		fs: fs as any,
		path: "/project.inlang",
		providePlugins: [mockPlugin],
	});

	const errors = await project.errors.get();
	expect(errors).toHaveLength(0);
});

test("it should provide plugins from disk for backwards compatibility but warn that those plugins are not portable", async () => {
	const mockRepo = {
		"/local-plugins/mock-plugin.js": "export default { key: 'mock-plugin' }",
		"/local-plugins/mock-rule.js":
			"export default { id: 'messageLintRule.mock }",
		"/website/project.inlang/settings.json": JSON.stringify({
			baseLocale: "en",
			locales: ["en", "de"],
			modules: [
				"../local-plugins/mock-plugin.js",
				"../local-plugins/mock-rule.js",
			],
		} satisfies ProjectSettings),
	};

	const fs = Volume.fromJSON(mockRepo);

	const project = await loadProjectFromDirectory({
		fs: fs as any,
		path: "/website/project.inlang",
	});

	const plugins = await project.plugins.get();
	const errors = await project.errors.get();
	const settings = await project.settings.get();

	expect(plugins.length).toBe(1);
	expect(plugins[0]?.key).toBe("mock-plugin");

	// old mock lint rule import is number two import
	// it's hard to model the import of a lint rule
	// best if they are removed
	expect(errors.length).toBe(3);
	expect(errors[0]).toBeInstanceOf(WarningLocalPluginImport);
	expect(errors[1]).toBeInstanceOf(WarningLocalPluginImport);
	expect(errors[2]).toBeInstanceOf(WarningDeprecatedLintRule);

	// it should not remove the module from the settings
	// else roundtrips would not work
	expect(settings.modules?.[0]).toBe("../local-plugins/mock-plugin.js");
});

// https://github.com/opral/inlang-sdk/issues/174
test("plugin calls that use fs should be intercepted to use an absolute path", async () => {
	process.cwd = () => "/";

	const mockRepo = {
		"/messages/en.json": JSON.stringify({
			key1: "value1",
			key2: "value2",
		}),
		"/project.inlang/settings.json": JSON.stringify({
			baseLocale: "en",
			locales: ["en", "de"],
			"plugin.mock-plugin": {
				pathPattern: "./messages/{locale}.json",
			},
		} satisfies ProjectSettings),
	};

	const mockPlugin: InlangPlugin = {
		key: "mock-plugin",
		loadMessages: async ({ nodeishFs, settings }) => {
			const pathPattern = settings["plugin.mock-plugin"]?.pathPattern.replace(
				"{locale}",
				"en"
			) as string;
			const file = await nodeishFs.readFile(pathPattern);
			// reading the file should be possible without an error
			expect(file.toString()).toBe(
				JSON.stringify({
					key1: "value1",
					key2: "value2",
				})
			);
			return [];
		},
		saveMessages: async ({ nodeishFs, settings }) => {
			const pathPattern = settings["plugin.mock-plugin"]?.pathPattern.replace(
				"{locale}",
				"en"
			) as string;
			const file = new TextEncoder().encode(
				JSON.stringify({
					key1: "value1",
					key2: "value2",
					key3: "value3",
				})
			);
			await nodeishFs.writeFile(pathPattern, file);
		},
		toBeImportedFiles: async ({ settings }) => {
			const pathPattern = settings["plugin.mock-plugin"]?.pathPattern.replace(
				"{locale}",
				"en"
			) as string;
			return [
				{
					path: pathPattern,
					locale: "en",
				},
			];
		},
	};

	const fs = Volume.fromJSON(mockRepo);

	const loadMessagesSpy = vi.spyOn(mockPlugin, "loadMessages");
	const saveMessagesSpy = vi.spyOn(mockPlugin, "saveMessages");
	const toBeImportedFilesSpy = vi.spyOn(mockPlugin, "toBeImportedFiles");
	const fsReadFileSpy = vi.spyOn(fs.promises, "readFile");
	const fsWriteFileSpy = vi.spyOn(fs.promises, "writeFile");

	const project = await loadProjectFromDirectory({
		fs: fs as any,
		path: "/project.inlang",
		providePlugins: [mockPlugin],
	});

	expect(loadMessagesSpy).toHaveBeenCalled();
	expect(fsReadFileSpy).toHaveBeenCalledWith("/messages/en.json", undefined);

	// todo test that saveMessages works too.
	// await project.db.insertInto("bundle").defaultValues().execute();

	// const translationFile = await fs.readFile("/messages/en.json", "utf-8");

	// expect(translationFile).toBe(
	// 	JSON.stringify({
	// 		key1: "value1",
	// 		key2: "value2",
	// 		key3: "value3",
	// 	})
	// );

	// expect(fsWriteFileSpy).toHaveBeenCalledWith(
	// 	"/messages/en.json",
	// 	JSON.stringify({
	// 		key1: "value1",
	// 		key2: "value2",
	// 		key3: "value3",
	// 	}),
	// 	"utf-8"
	// );

	// expect(saveMessagesSpy).toHaveBeenCalled();
	// expect(toBeImportedFilesSpy).toHaveBeenCalled();
});

test("errors from importing translation files should be shown", async () => {
	const mock = {
		"/project.inlang/settings.json": JSON.stringify({
			baseLocale: "en",
			locales: ["en", "de"],
			modules: [],
		} satisfies ProjectSettings),
	};

	const fs = Volume.fromJSON(mock);

	const proxiedFs = new Proxy(fs, {
		get: (target, prop) => {
			if (prop === "promises") {
				// Intercept the 'promises' object
				return new Proxy(target.promises, {
					get: (promisesTarget, promisesProp) => {
						if (promisesProp === "readFile") {
							// @ts-expect-error - we are mocking the fs
							return (path, ...args) => {
								if (path.endsWith("some-file.json")) {
									throw new Error("MOCK ERROR");
								}
								return promisesTarget.readFile(path, ...args);
							};
						}
						return Reflect.get(promisesTarget, promisesProp);
					},
				});
			}
			return Reflect.get(target, prop);
		},
	});

	const mockPlugin: InlangPlugin = {
		key: "mock-plugin",
		importFiles: async () => {
			return { bundles: [] };
		},
		toBeImportedFiles: async () => {
			return [{ path: "./some-file.json", locale: "mock" }];
		},
	};

	const project = await loadProjectFromDirectory({
		fs: proxiedFs as any,
		path: "/project.inlang",
		providePlugins: [mockPlugin],
	});

	const errors = await project.errors.get();
	// TODO deactivated for now - we need to proxy fs.promises or change the signature of loadProject
	expect(errors).toHaveLength(1);
	expect(errors[0]).toBeInstanceOf(ResourceFileImportError);
});

// it happens often that a resource file doesn't exist yet on import
test("errors from importing translation files that are ENOENT should not be shown", async () => {
	const mock = {
		"/project.inlang/settings.json": JSON.stringify({
			baseLocale: "en",
			locales: ["en", "de"],
			modules: [],
		} satisfies ProjectSettings),
	};

	const fs = Volume.fromJSON(mock);

	const mockPlugin: InlangPlugin = {
		key: "mock-plugin",
		importFiles: async () => {
			return { bundles: [] };
		},
		toBeImportedFiles: async () => {
			return [{ path: "./some-non-existing-file.json", locale: "mock" }];
		},
	};

	const project = await loadProjectFromDirectory({
		fs: fs as any,
		path: "/project.inlang",
		providePlugins: [mockPlugin],
	});

	const errors = await project.errors.get();
	expect(errors).toHaveLength(0);
});

test("it should provide plugins from disk for backwards compatibility but warn that those plugins are not portable", async () => {
	const mockRepo = {
		"/local-plugins/mock-plugin.js": "export default { key: 'mock-plugin' }",
		"/local-plugins/mock-rule.js":
			"export default { id: 'messageLintRule.mock }",
		"/website/project.inlang/settings.json": JSON.stringify({
			baseLocale: "en",
			locales: ["en", "de"],
			modules: [
				"../local-plugins/mock-plugin.js",
				"../local-plugins/mock-rule.js",
			],
		} satisfies ProjectSettings),
	};

	const fs = Volume.fromJSON(mockRepo);

	const project = await loadProjectFromDirectory({
		fs: fs as any,
		path: "/website/project.inlang",
	});

	const plugins = await project.plugins.get();
	const errors = await project.errors.get();
	const settings = await project.settings.get();

	expect(plugins.length).toBe(1);
	expect(plugins[0]?.key).toBe("mock-plugin");

	// old mock lint rule import is number two import
	// it's hard to model the import of a lint rule
	// best if they are removed
	expect(errors.length).toBe(3);
	expect(errors[0]).toBeInstanceOf(WarningLocalPluginImport);
	expect(errors[1]).toBeInstanceOf(WarningLocalPluginImport);
	expect(errors[2]).toBeInstanceOf(WarningDeprecatedLintRule);

	// it should not remove the module from the settings
	// else roundtrips would not work
	expect(settings.modules?.[0]).toBe("../local-plugins/mock-plugin.js");
});

// https://github.com/opral/inlang-sdk/issues/174
test("plugin calls that use fs should be intercepted to use an absolute path", async () => {
	process.cwd = () => "/";

	const mockRepo = {
		"/messages/en.json": JSON.stringify({
			key1: "value1",
			key2: "value2",
		}),
		"/project.inlang/settings.json": JSON.stringify({
			baseLocale: "en",
			locales: ["en", "de"],
			"plugin.mock-plugin": {
				pathPattern: "./messages/{locale}.json",
			},
		} satisfies ProjectSettings),
	};

	const mockPlugin: InlangPlugin = {
		key: "mock-plugin",
		loadMessages: async ({ nodeishFs, settings }) => {
			const pathPattern = settings["plugin.mock-plugin"]?.pathPattern.replace(
				"{locale}",
				"en"
			) as string;
			const file = await nodeishFs.readFile(pathPattern);
			// reading the file should be possible without an error
			expect(file.toString()).toBe(
				JSON.stringify({
					key1: "value1",
					key2: "value2",
				})
			);
			return [];
		},
		saveMessages: async ({ nodeishFs, settings }) => {
			const pathPattern = settings["plugin.mock-plugin"]?.pathPattern.replace(
				"{locale}",
				"en"
			) as string;
			const file = new TextEncoder().encode(
				JSON.stringify({
					key1: "value1",
					key2: "value2",
					key3: "value3",
				})
			);
			await nodeishFs.writeFile(pathPattern, file);
		},
		toBeImportedFiles: async ({ settings }) => {
			const pathPattern = settings["plugin.mock-plugin"]?.pathPattern.replace(
				"{locale}",
				"en"
			) as string;
			return [
				{
					path: pathPattern,
					locale: "en",
				},
			];
		},
	};

	const fs = Volume.fromJSON(mockRepo);

	const loadMessagesSpy = vi.spyOn(mockPlugin, "loadMessages");
	const saveMessagesSpy = vi.spyOn(mockPlugin, "saveMessages");
	const toBeImportedFilesSpy = vi.spyOn(mockPlugin, "toBeImportedFiles");
	const fsReadFileSpy = vi.spyOn(fs.promises, "readFile");
	const fsWriteFileSpy = vi.spyOn(fs.promises, "writeFile");

	const project = await loadProjectFromDirectory({
		fs: fs as any,
		path: "/project.inlang",
		providePlugins: [mockPlugin],
	});

	expect(loadMessagesSpy).toHaveBeenCalled();
	expect(fsReadFileSpy).toHaveBeenCalledWith("/messages/en.json", undefined);

	// todo test that saveMessages works too.
	// await project.db.insertInto("bundle").defaultValues().execute();

	// const translationFile = await fs.readFile("/messages/en.json", "utf-8");

	// expect(translationFile).toBe(
	// 	JSON.stringify({
	// 		key1: "value1",
	// 		key2: "value2",
	// 		key3: "value3",
	// 	})
	// );

	// expect(fsWriteFileSpy).toHaveBeenCalledWith(
	// 	"/messages/en.json",
	// 	JSON.stringify({
	// 		key1: "value1",
	// 		key2: "value2",
	// 		key3: "value3",
	// 	}),
	// 	"utf-8"
	// );

	// expect(saveMessagesSpy).toHaveBeenCalled();
	// expect(toBeImportedFilesSpy).toHaveBeenCalled();
});