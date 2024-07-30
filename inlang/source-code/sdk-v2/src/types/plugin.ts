import { type Static, Type, type TObject } from "@sinclair/typebox"
import type { JSONObject } from "@inlang/json-types"
import type { CustomApiInlangIdeExtension } from "./customApis/app.inlang.ideExtension.js"
import {
	type ProjectSettings2,
	type ExternalProjectSettings as ExternalProjectSettingsType,
	ExternalProjectSettings,
} from "./project-settings.js"
import type {
	PluginHasNoExportsError,
	PluginImportError,
	PluginHasInvalidIdError,
	PluginHasInvalidSchemaError,
	PluginReturnedInvalidCustomApiError,
	PluginImportFilesFunctionAlreadyDefinedError,
	PluginExportFilesFunctionAlreadyDefinedError,
	PluginsDoNotProvideImportOrExportFilesError,
	PluginToBeImportedFilesFunctionAlreadyDefinedError,
} from "./plugin-errors.js"
import { NestedBundle } from "./schema.js"
import { TranslationFile, type TranslationFile as TranslationFileType } from "./translation-file.js"
import type { ImportFunction } from "../resolve-plugins/import.js"
import type { NodeishFilesystem } from "@lix-js/fs"

// ---------------------------- RUNTIME VALIDATION TYPES ---------------------------------------------

/**
 * The plugin API is used to extend inlang's functionality.
 *
 * You can use your own settings by extending the plugin with a generic:
 *
 * ```ts
 *  type PluginSettings = {
 *    filePath: string
 *  }
 *
 *  const plugin: Plugin<{
 *    "plugin.your.id": PluginSettings
 *  }>
 * ```
 */
export type Plugin2<
	ExternalSettings extends Record<keyof ExternalProjectSettingsType, JSONObject> | unknown = unknown
> = Omit<
	Static<typeof Plugin2>,
	"toBeImportedFiles" | "importFiles" | "exportFiles" | "addCustomApi" | "settingsSchema"
> & {
	settingsSchema?: TObject
	/**
	 * Import / Export files.
	 * see https://linear.app/opral/issue/MESDK-157/sdk-v2-release-on-sqlite
	 */
	toBeImportedFiles?: (args: {
		settings: ProjectSettings2 & ExternalSettings
		nodeFs: unknown
	}) => Promise<Array<TranslationFileType>> | Array<TranslationFileType>
	importFiles?: (args: { files: Array<TranslationFileType> }) => { bundles: NestedBundle }
	exportFiles?: (args: {
		bundles: NestedBundle
		settings: ProjectSettings2 & ExternalSettings
	}) => Array<TranslationFileType>
	/**
	 * Define app specific APIs.
	 *
	 * @example
	 * addCustomApi: () => ({
	 *   "app.inlang.ide-extension": {
	 *     messageReferenceMatcher: () => {}
	 *   }
	 *  })
	 */
	addCustomApi?: (args: {
		settings: ProjectSettings2 & ExternalSettings
	}) =>
		| Record<`app.${string}.${string}`, unknown>
		| { "app.inlang.ideExtension": CustomApiInlangIdeExtension }
}

export const Plugin2 = Type.Object({
	key: Type.String(),
	settingsSchema: Type.Optional(Type.Object({}, { additionalProperties: true })),
	/**
	 * see https://linear.app/opral/issue/MESDK-157/sdk-v2-release-on-sqlite
	 */
	toBeImportedFiles: Type.Optional(
		Type.Function(
			[Type.Object({ settings: ExternalProjectSettings, nodeFs: Type.Any() })],
			Type.Array(TranslationFile)
		)
	),
	importFiles: Type.Optional(
		Type.Function(
			[Type.Object({ files: Type.Array(TranslationFile) })],
			Type.Object({ bundles: NestedBundle })
		)
	),
	exportFiles: Type.Optional(
		Type.Function(
			[Type.Object({ bundles: NestedBundle, settings: ExternalProjectSettings })],
			Type.Array(TranslationFile)
		)
	),
	addCustomApi: Type.Optional(Type.Function([Type.Object({ settings: Type.Any() })], Type.Any())),
})

/**
 * Function that resolves (imports and initializes) the plugins.
 */
export type ResolvePlugins2Function = (args: {
	plugins: Array<Plugin2>
	settings: ProjectSettings2
}) => Promise<{
	data: ResolvedPlugin2Api
	errors: Array<
		| PluginReturnedInvalidCustomApiError
		| PluginToBeImportedFilesFunctionAlreadyDefinedError
		| PluginImportFilesFunctionAlreadyDefinedError
		| PluginExportFilesFunctionAlreadyDefinedError
		| PluginHasInvalidIdError
		| PluginHasInvalidSchemaError
		| PluginsDoNotProvideImportOrExportFilesError
	>
}>

/**
 * The API after resolving the plugins.
 */
export type ResolvedPlugin2Api = {
	/**
	 * Importer / Exporter functions.
	 * see https://linear.app/opral/issue/MESDK-157/sdk-v2-release-on-sqlite
	 */

	toBeImportedFiles?: Plugin2["toBeImportedFiles"]
	importFiles?: Plugin2["importFiles"]
	exportFiles?: Plugin2["exportFiles"]
	customApi?: Record<`app.${string}.${string}` | `library.${string}.${string}`, unknown>
}

// ---------------------------- RESOLVE PLUGIN API TYPES ---------------------------------------------
/**
 * An inlang plugin module has a default export that is a plugin.
 *
 * @example
 *   export default myPlugin
 */
// not using Static<infer T> here because the type is not inferred correctly
// due to type overwrites in modules.
export const InlangPlugin2 = Type.Object({
	default: Plugin2,
})
export type InlangPlugin2 = Static<typeof InlangPlugin2>

/**
 * Function that resolves modules from the config.
 *
 * Pass a custom `_import` function to override the default import function.
 */
export type ResolvePlugin2Function = (args: {
	settings: ProjectSettings2
	_import: ImportFunction
}) => Promise<{
	/**
	 * Metadata about the resolved module.
	 *
	 * @example
	 * [{
	 * 	  id: "plugin.inlang.json",
	 * 	  module: "https://myplugin.com/index.js"
	 * }]
	 */
	meta: Array<{
		/**
		 * The plugin link.
		 *
		 * @example "https://myplugin.com/index.js"
		 */
		plugin: string
		/**
		 * The resolved item id of the module.
		 */
		id: Plugin2["key"]
	}>
	/**
	 * The resolved api provided by plugins.
	 */
	plugins: Record<string, ResolvedPlugin2Api>
	/**
	 * Errors during the resolution process.
	 *
	 * This includes errors from:
	 * - importing module
	 * - resolving plugins
	 * - resolving the runtime plugin api
	 */
	errors: Array<
		| PluginHasNoExportsError
		| PluginImportError
		| Awaited<ReturnType<ResolvePlugins2Function>>["errors"][number]
	>
}>

/**
 * The filesystem is a subset of project lisa's nodeish filesystem.
 *
 * - only uses minimally required functions to decrease the API footprint on the ecosystem.
 */
export type NodeishFilesystemSubset = Pick<
	NodeishFilesystem,
	"readFile" | "readdir" | "mkdir" | "writeFile" | "watch"
>
