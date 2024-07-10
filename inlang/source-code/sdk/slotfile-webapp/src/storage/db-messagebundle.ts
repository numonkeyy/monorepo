import { addRxPlugin } from "rxdb"
import { RxDBQueryBuilderPlugin } from "rxdb/plugins/query-builder"
import { loadProject } from "@inlang/sdk/v2"
import { createNewProject } from "@inlang/sdk"
import http from "isomorphic-git/http/web"

// NOTE: I use isomorphic git because i went crazy with cors :-/ was faster to spin up a iso proxy
// import git, { pull, add, commit, push, statusMatrix } from "isomorphic-git"
import { defaultProjectSettings } from "../../../dist/v2/defaultProjectSettings.js"

import type { Repository } from "@lix-js/client"

addRxPlugin(RxDBQueryBuilderPlugin)

const dir = "/"

const createAwaitable = () => {
	let resolve: () => void = () => {}
	let reject: () => void = () => {}

	const promise = new Promise<void>((res, rej) => {
		resolve = res
		reject = rej
	})

	return [promise, resolve, reject] as [
		awaitable: Promise<void>,
		resolve: () => void,
		reject: (e: unknown) => void
	]
}

export const openProject = async (
	repo: Repository,
	gittoken: string,
	githubRepo: string,
	projectPath: string
) => {
	try {
		await createNewProject({
			projectPath,
			repo: repo as any,
			projectSettings: defaultProjectSettings as any,
		})
	} catch (e) {
		console.warn("existed already")
	}

	const inlangProject = await loadProject({
		projectPath,
		repo: repo as any,
	})

	const pullChangesAndReloadSlots = async () => {
		await pull({
			fs,
			http,
			dir: dir,
			author: {
				email: "user@user.de",
				name: "Meeee",
			},
		})
		await repo.pull({})
		await inlangProject.internal.bundleStorage.loadSlotFilesFromWorkingCopy(true)
		await inlangProject.internal.messageStorage.loadSlotFilesFromWorkingCopy(true)
	}

	const pushChangesAndReloadSlots = async () => {
		// TODO use lix repo instead
		// await push({
		// 	fs,
		// 	http,
		// 	dir,
		// 	onAuth: () => {
		// 		return { username: gittoken }
		// 	},
		// })
		// await inlangProject.internal.bundleStorage.loadSlotFilesFromWorkingCopy(true)
		// await inlangProject.internal.messageStorage.loadSlotFilesFromWorkingCopy(true)
	}

	let ongoingCommit = undefined as any

	const commitChanges = async () => {
		// TODO use lix repo instead
		if (ongoingCommit) {
			await ongoingCommit.then(commitChanges)
			return
		}
		const awaitable = createAwaitable()
		ongoingCommit = awaitable[0]
		const done = awaitable[1]

		const filenames = (await repo.statusList({ includeStatus: ["materialized"] }))
			.filter(([name, fileState]) => fileState !== "unmodified")
			.map(([name]) => name)
		if (filenames.length == 0) {
			return
		}

		try {
			await repo.commit({ message: "test commit", include: filenames })
		} catch (e) {
			// eslint-disable-next-line no-console
			console.log(e)
		}
		ongoingCommit = undefined
		done()
	}

	return {
		inlangProject,
		projectPath,
		pullChangesAndReloadSlots,
		pushChangesAndReloadSlots,
		commitChanges,
	}
}
