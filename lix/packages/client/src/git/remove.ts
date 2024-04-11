import isoGit from "../../vendored/isomorphic-git/index.js"
import type { RepoContext } from "../repoContext.js"

export function remove(ctx: RepoContext, filepath: string) {
	return isoGit.remove({
		fs: ctx.rawFs,
		dir: ctx.dir,
		cache: ctx.cache,
		filepath,
	})
}
