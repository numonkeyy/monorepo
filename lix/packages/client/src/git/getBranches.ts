import type { RepoContext } from "../openRepository.js"
import isoGit from "../../vendored/isomorphic-git/index.js"
import { makeHttpClient } from "../git-http/client.js"

export async function getBranches(ctx: RepoContext) {
	if (!ctx.gitUrl) {
		throw new Error("Could not find repo url, only github supported for getBranches at the moment")
	}
	const serverRefs = await isoGit
		.listServerRefs({
			url: ctx.gitUrl,
			corsProxy: ctx.gitProxyUrl,
			prefix: "refs/heads",
			http: makeHttpClient({ verbose: ctx.debug, description: "getBranches" }),
		})
		.catch((error) => {
			return { error }
		})

	if ("error" in serverRefs) {
		return undefined
	}

	return (
		serverRefs
			.filter((ref) => !ref.ref.startsWith("refs/heads/gh-readonly-queue/"))
			.map((ref) => ref.ref.replace("refs/heads/", "")) || undefined
	)
}
