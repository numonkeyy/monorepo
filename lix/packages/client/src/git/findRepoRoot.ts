import type { NodeishFilesystem } from "@lix-js/fs"
import { findRoot } from "../../vendored/isomorphic-git/index.js"

export async function findRepoRoot(args: {
	nodeishFs: NodeishFilesystem
	path: string
}): Promise<string | undefined> {
	const gitroot = await findRoot({
		fs: args.nodeishFs,
		filepath: args.path,
	}).catch(() => undefined)

	return gitroot ? "file://" + gitroot : undefined
}
