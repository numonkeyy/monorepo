import { tryCatch } from "@inlang/result"
import { TypeCompiler } from "@sinclair/typebox/compiler"
import { validatedPluginSettings } from "./validatedPluginSettings.js"
import {
	InlangPlugin2,
	type ResolvePlugin2Function,
	type ResolvedPlugin2Api,
} from "./types/plugin.js"
import {
	PluginError,
	PluginImportError,
	PluginHasNoExportsError,
	PluginExportIsInvalidError,
	PluginSettingsAreInvalidError,
	PluginReturnedInvalidCustomApiError,
} from "./types/plugin-errors.js"

const PluginCompiler = TypeCompiler.Compile(InlangPlugin2)

export const resolvePlugins: ResolvePlugin2Function = async (args) => {
	const _import = args._import

	const meta: Awaited<ReturnType<ResolvePlugin2Function>>["meta"] = []
	const pluginErrors: Array<PluginError> = []
	const resolvedPlugins: Record<string, ResolvedPlugin2Api> = {}

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

		const pluginKey = importedPlugin.data.default.key
		meta.push({
			plugin,
			id: pluginKey,
		})

		const pluginData: ResolvedPlugin2Api = {}

		if (typeof importedPlugin.data.default.toBeImportedFiles === "function") {
			pluginData.toBeImportedFiles = importedPlugin.data.default.toBeImportedFiles
		}

		if (typeof importedPlugin.data.default.importFiles === "function") {
			// TODO: Fix type
			// @ts-expect-error
			pluginData.importFiles = importedPlugin.data.default.importFiles
		}

		if (typeof importedPlugin.data.default.exportFiles === "function") {
			pluginData.exportFiles = importedPlugin.data.default.exportFiles
		}

		if (typeof importedPlugin.data.default.addCustomApi === "function") {
			const { data: customApi, error } = tryCatch(() =>
				importedPlugin.data.default.addCustomApi!({
					settings: args.settings,
				})
			)
			if (error) {
				// TODO: Fix type
				// @ts-expect-error
				pluginErrors.push(new PluginReturnedInvalidCustomApiError({ key: pluginKey, cause: error }))
			} else if (typeof customApi !== "object") {
				pluginErrors.push(
					// TODO: Fix type
					// @ts-expect-error
					new PluginReturnedInvalidCustomApiError({
						key: pluginKey,
						cause: new Error(`The return value must be an object. Received "${typeof customApi}".`),
					})
				)
			} else {
				pluginData.customApi = customApi
			}
		}

		resolvedPlugins[pluginKey] = pluginData
	}

	await Promise.all(args.settings.modules.map(resolvePlugin))

	return {
		meta,
		plugins: resolvedPlugins,
		errors: pluginErrors,
	}
}
