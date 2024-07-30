import { tryCatch } from "@inlang/result"
import { TypeCompiler } from "@sinclair/typebox/compiler"
import { validatedPluginSettings } from "./validatedPluginSettings.js"
import {
	Plugin2,
	InlangPlugin2,
	type ResolvePluginsFunction,
	type ResolvePlugin2Function,
} from "./types/plugin.js"
import {
	PluginError,
	PluginImportError,
	PluginHasNoExportsError,
	PluginExportIsInvalidError,
	PluginSettingsAreInvalidError,
	PluginReturnedInvalidCustomApiError,
	PluginImportFilesFunctionAlreadyDefinedError,
	PluginExportFilesFunctionAlreadyDefinedError,
	PluginToBeImportedFilesFunctionAlreadyDefinedError,
	PluginHasInvalidIdError,
	PluginHasInvalidSchemaError,
	PluginsDoNotProvideImportOrExportFilesError,
} from "./types/plugin-errors.js"
import { deepmerge } from "deepmerge-ts"

const PluginCompiler = TypeCompiler.Compile(InlangPlugin2)

export const resolvePlugins: ResolvePlugin2Function = async (args) => {
	const _import = args._import

	const allPlugins: Array<Plugin2> = []
	const meta: Awaited<ReturnType<ResolvePlugin2Function>>["meta"] = []
	const pluginErrors: Array<PluginError> = []

	async function resolvePlugin(plugin: string) {
		const importedPlugin = await tryCatch<InlangPlugin2>(() => _import(plugin))

		// -- FAILED TO IMPORT --
		if (importedPlugin.error) {
			console.error(`Failed to import plugin: ${plugin}`, importedPlugin.error)
			pluginErrors.push(
				new PluginImportError({
					plugin,
					cause: importedPlugin.error as Error,
				})
			)
			return
		}

		// -- PLUGIN DOES NOT EXPORT ANYTHING --
		if (importedPlugin.data?.default === undefined) {
			console.error(`Plugin has no exports: ${plugin}`)
			pluginErrors.push(
				new PluginHasNoExportsError({
					plugin,
				})
			)
			return
		}

		// -- CHECK IF PLUGIN IS SYNTACTICALLY VALID --
		const isValidPlugin = PluginCompiler.Check(importedPlugin.data)
		if (!isValidPlugin) {
			const errors = [...PluginCompiler.Errors(importedPlugin.data)]
			console.error(`Plugin schema is invalid for: ${plugin}`, errors)
			pluginErrors.push(
				new PluginExportIsInvalidError({
					plugin,
					errors,
				})
			)
			return
		}

		// -- VALIDATE PLUGIN SETTINGS
		const result = validatedPluginSettings({
			settingsSchema: importedPlugin.data.default.settingsSchema,
			pluginSettings: (args.settings as any)[importedPlugin.data.default.key],
		})
		if (result !== "isValid") {
			console.error(`Plugin settings are invalid for: ${plugin}`, result)
			pluginErrors.push(new PluginSettingsAreInvalidError({ plugin, errors: result }))
			return
		}

		meta.push({
			plugin,
			id: importedPlugin.data.default.key,
		})

		allPlugins.push(importedPlugin.data.default as Plugin2)
	}

	await Promise.all(args.settings.modules.map(resolvePlugin))

	const result: Awaited<ReturnType<ResolvePluginsFunction>> = {
		data: {
			toBeImportedFiles: {},
			importFiles: {},
			exportFiles: {},
			customApi: {},
		},
		errors: [...pluginErrors],
	}

	for (const plugin of allPlugins) {
		const errors = [...PluginCompiler.Errors(plugin)]

		// -- USES INVALID SCHEMA --
		if (errors.length > 0) {
			console.error(`Plugin uses invalid schema: ${plugin.key}`, errors)
			result.errors.push(
				new PluginHasInvalidSchemaError({
					key: plugin.key,
					errors: errors,
				})
			)
		}

		// -- CHECK FOR ALREADY DEFINED IMPORTER / EXPORTER --
		if (typeof plugin.toBeImportedFiles === "function") {
			if (result.data.toBeImportedFiles[plugin.key]) {
				result.errors.push(
					new PluginToBeImportedFilesFunctionAlreadyDefinedError({ key: plugin.key })
				)
			} else {
				result.data.toBeImportedFiles[plugin.key] = plugin.toBeImportedFiles
			}
		}

		if (typeof plugin.importFiles === "function") {
			if (result.data.importFiles[plugin.key]) {
				result.errors.push(new PluginImportFilesFunctionAlreadyDefinedError({ key: plugin.key }))
			} else {
				result.data.importFiles[plugin.key] = plugin.importFiles
			}
		}

		if (typeof plugin.exportFiles === "function") {
			if (result.data.exportFiles[plugin.key]) {
				result.errors.push(new PluginExportFilesFunctionAlreadyDefinedError({ key: plugin.key }))
			} else {
				result.data.exportFiles[plugin.key] = plugin.exportFiles
			}
		}

		// -- ADD APP SPECIFIC API --
		if (typeof plugin.addCustomApi === "function") {
			const { data: customApi, error } = tryCatch(() =>
				plugin.addCustomApi!({
					settings: args.settings,
				})
			)
			if (error) {
				console.error(`Plugin returned invalid custom API: ${plugin.key}`, error)
				result.errors.push(
					new PluginReturnedInvalidCustomApiError({ key: plugin.key, cause: error })
				)
			} else if (typeof customApi !== "object") {
				console.error(`Plugin returned invalid custom API type: ${plugin.key}`, typeof customApi)
				result.errors.push(
					new PluginReturnedInvalidCustomApiError({
						key: plugin.key,
						cause: new Error(`The return value must be an object. Received "${typeof customApi}".`),
					})
				)
			} else {
				result.data.customApi = deepmerge(result.data.customApi, customApi)
			}
		}

		// -- CONTINUE IF ERRORS --
		if (errors.length > 0) {
			continue
		}
	}

	return {
		meta,
		plugins: allPlugins,
		resolvedPluginApi: result.data,
		errors: result.errors,
	}
}
