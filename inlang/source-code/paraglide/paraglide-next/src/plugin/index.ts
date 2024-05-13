import type { NextConfig } from "next"
import { addAlias } from "./alias"
import { once } from "./utils"
import { useCompiler } from "./useCompiler"
import { ParaglideNextConfig, isParaglideNextConfig } from "./config"

type Config = NextConfig & {
	paraglide: ParaglideNextConfig
}

/**
 * Add this to your next.config.js.
 * It will register any aliases required by Paraglide-Next,
 * and register the build plugin.
 */
export function paraglide(userConfig: Config): NextConfig {
	const config: unknown = userConfig
	if (!isParaglideNextConfig(config)) throw new Error("Invalid config provided to plugin.")

	const aliasPath = config.paraglide.outdir.endsWith("/")
		? config.paraglide.outdir + "runtime.js"
		: config.paraglide.outdir + "/runtime.js"

	addAlias(config, {
		"$paraglide/runtime.js": aliasPath,
	})

	// Next calls `next.config.js` TWICE. Once in a worker and once in the main process.
	// We only want to compile the Paraglide project once, so we only do it in the main process.
	once(() => {
		useCompiler({
			project: config.paraglide.project,
			outdir: config.paraglide.outdir,
			watch: process.env.NODE_ENV === "development",
			silent: config.paraglide.silent ?? false,
		})
	})

	const nextConfig: NextConfig = config
	delete nextConfig.paraglide

	return nextConfig
}
