import type { NodeishFilesystem } from "@lix-js/fs"
import path from "node:path"
import { pathExists } from "../file-handling/exists.js"

/**
 * Attempts to find the package.json file that's closest to the current working directory.
 *
 * @param fs The filesystem to use.
 * @returns The path to the package.json file, or undefined if none was found.
 */
export async function findPackageJson(fs: NodeishFilesystem): Promise<string | undefined> {
	const potentialPackageJsonPath = path.resolve(process.cwd(), "package.json")

	const packageJsonExists = await pathExists(potentialPackageJsonPath, fs)
	if (packageJsonExists) return potentialPackageJsonPath
	return undefined
}
