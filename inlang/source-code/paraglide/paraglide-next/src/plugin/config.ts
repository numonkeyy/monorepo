export type ParaglideNextConfig = {
	/**
	 * Where the Inlang Project that defines the languages
	 * and messages is located.
	 *
	 * This should be a relative path starting from the project root.
	 *
	 * @example "./project.inlang"
	 */
	project: string

	/**
	 * Where the paraglide output files should be placed. This is usually
	 * inside a `src/paraglide` folder.
	 *
	 * This should be a relative path starting from the project root.
	 *
	 * @example "./src/paraglide"
	 */
	outdir: string

	/**
	 * If true, the paraglide compiler will only log errors to the console
	 *
	 * @default false
	 */
	silent?: boolean
}

const knownKeys = ["project", "outdir", "silent"]
const requiredKeys = ["project", "outdir"]

/**
 * Enforce that the config is actually valid
 * @param config
 * @returns
 */
export function isParaglideNextConfig(config: unknown): config is {
	paraglide: ParaglideNextConfig
} {
	if (typeof config !== "object") return false
	if (config === null) return false

	//config has the "paraglide" key
	if (!("paraglide" in config)) return false

	const paraglideConfig: unknown = config["paraglide"]
	if (typeof paraglideConfig !== "object") return false
	if (paraglideConfig === null) return false

	const keys = Object.keys(paraglideConfig)
	for (const key of keys) {
		if (!knownKeys.includes(key)) return false
	}

	for (const requiredKey of requiredKeys) {
		if (!keys.includes(requiredKey)) return false
	}

	const configWithValidKeys = paraglideConfig as {
		project: unknown
		outdir: unknown
		silent?: unknown
	}

	if (configWithValidKeys["silent"] && typeof configWithValidKeys["silent"] !== "boolean")
		return false

	if (typeof configWithValidKeys["project"] !== "string") return false
	if (typeof configWithValidKeys["outdir"] !== "string") return false

	return true
}
