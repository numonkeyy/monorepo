import isoGit from "../../vendored/isomorphic-git/index.js"
import type { RepoContext } from "../repoContext.js"

export function add(ctx: RepoContext, filepath: string | string[]) {
	return isoGit.add({
		fs: ctx.rawFs,
		// withProxy({
		// 	nodeishFs: ctx.rawFs,
		// 	verbose: ctx.debug,
		// 	description: "add",
		// }),
		parallel: true,
		dir: ctx.dir,
		cache: ctx.cache,
		filepath,
	})
}
