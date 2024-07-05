import { type ExtensionContext, ExtensionMode } from "vscode"

let instance: ReturnType<typeof createExtension> | undefined = undefined

const createExtension = (ctx: ExtensionContext) => {
	const isProductionMode = (): boolean => ctx.extensionMode === ExtensionMode.Production

	return { isProductionMode }
}

export const getExtensionInstance = (ctx?: ExtensionContext) => {
	if (!instance && ctx) {
		instance = createExtension(ctx)
	} else if (!instance) {
		throw new Error("Extension instance not created. Please provide a valid context.")
	}

	return instance
}
