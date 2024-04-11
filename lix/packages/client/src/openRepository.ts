// git-only functions
import { commit, isoCommit } from "./git/commit.js"
import { statusList } from "./git/status-list.js"
import { status } from "./git/status.js"
import { add } from "./git/add.js"
import { remove } from "./git/remove.js"
import { listRemotes } from "./git/listRemotes.js"
import { log } from "./git/log.js"
import { getOrigin } from "./git/getOrigin.js"
import { getBranches } from "./git/getBranches.js"
import { getCurrentBranch } from "./git/getCurrentBranch.js"
import { checkout } from "./git/checkout.js"

// github depenedent
import { getMeta } from "./github/getMeta.js"
import { forkStatus } from "./github/forkStatus.js"
import { createFork } from "./github/createFork.js"

// lix specific functions
import { getFirstCommitHash } from "./lix/getFirstCommitHash.js"
import { emptyWorkdir } from "./lix/emptyWorkdir.js"
import { checkOutPlaceholders } from "./lix/checkoutPlaceholders.js"

import { repoContext } from "./repoContext.js"
import { repoState } from "./repoState.js"
import { lixFs } from "./lixFs.js"

// types
import type { NodeishFilesystem } from "@lix-js/fs"
// import type { Repository } from "./api.js"

export type { RepoContext } from "./repoContext.js"
export type { RepoState } from "./repoState.js"
export type Repository = Awaited<ReturnType<typeof openRepository>>

export type Author = {
	name?: string
	email?: string
	timestamp?: number
	timezoneOffset?: number
}

// TODO: --filter=tree:0 for commit history?

export async function openRepository(
	url: string,
	args: {
		author?: any
		nodeishFs?: NodeishFilesystem
		workingDirectory?: string
		branch?: string
		debug?: boolean

		// Do not expose internal args, if using in app code needs ts ignore and comment
		// sparseFilter?: any

		experimentalFeatures?: {
			lixFs?: boolean
			lazyClone?: boolean
			lixCommit?: boolean
		}
	}
) {
	// Promise<Repository>
	const ctx = await repoContext(url, args)
	const state = await repoState(ctx, args as Parameters<typeof repoState>[1])

	return {
		_experimentalFeatures: ctx.experimentalFeatures,
		_rawFs: ctx.rawFs,
		nodeishFs: state.nodeishFs,

		commit: commit.bind(null, ctx, state),
		status: status.bind(null, ctx, state),
		statusList: statusList.bind(null, ctx, state),
		forkStatus: forkStatus.bind(null, ctx, state),
		getMeta: getMeta.bind(null, ctx),
		listRemotes: listRemotes.bind(null, ctx, state),
		log: log.bind(null, ctx),
		getOrigin: getOrigin.bind(null, ctx, state),
		getBranches: getBranches.bind(null, ctx, state),
		getCurrentBranch: getCurrentBranch.bind(null, ctx, state),
		getFirstCommitHash: getFirstCommitHash.bind(null, ctx, state),
		checkout: checkout.bind(null, ctx, state),
		createFork: createFork.bind(null, ctx),

		...(ctx.experimentalFeatures.lixFs ? lixFs(state.nodeishFs) : {}),

		// only exposed for testing
		_emptyWorkdir: emptyWorkdir.bind(null, ctx, state),
		_checkOutPlaceholders: checkOutPlaceholders.bind(null, ctx, state),
		_add: add.bind(null, ctx),
		_remove: remove.bind(null, ctx),
		_isoCommit: isoCommit.bind(null, ctx),
	}
}
