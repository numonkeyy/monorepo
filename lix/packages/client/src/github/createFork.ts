import type { RepoContext } from "../repoContext.js"

export async function createFork(ctx: RepoContext) {
	return ctx.githubClient.createFork({
		owner: ctx.owner,
		repo: ctx.repoName,
	})
}
