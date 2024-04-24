import type { NodeishFilesystem } from "@lix-js/fs"
import { fetch as isoFetch } from "../../vendored/isomorphic-git/index.js"

let nextFetchOids = undefined as undefined | Set<string>
let requestedFetches = [] as { resolve: (value: unknown) => void; reject: (reason?: any) => void }[]
export async function fetchBlobsFromRemoteThrottled(args: {
	fs: NodeishFilesystem
	gitdir: string
	http: any
	ref: string
	oids: string[]
}) {
	const fetchRequestPromise = new Promise((resolve, reject) => {
		requestedFetches.push({
			reject,
			resolve,
		})
	})

	if (nextFetchOids === undefined) {
		nextFetchOids = new Set<string>()

		for (const oid of args.oids) {
			nextFetchOids.add(oid)
		}
		setTimeout(() => {
			if (!nextFetchOids) {
				throw new Error("next nextFetchOids was manipulated somehow from the outside?")
			}
			const oIdsToFetch = [...nextFetchOids]
			nextFetchOids = undefined
			const requestedFetchesBatch = [...requestedFetches]
			requestedFetches = []

			isoFetch({
				fs: args.fs,
				gitdir: args.gitdir,
				// this time we fetch with blobs but we skip all objects but the one that was requested by fs
				http: args.http,
				// httpWithLazyInjection(args.http, {
				// 	noneBlobFilter: false,
				// 	// we don't need to override the haves any more since adding the capabilities
				// 	// allow-tip-sha1-in-want allow-reachable-sha1-in-want to the request enable us to request objects explicetly
				// 	filterRefList: { ref: args.ref },
				// 	overrideWants: oIdsToFetch,
				// }),
				depth: 1,
				singleBranch: true,
				tags: false,
			})
				.then((value) => {
					for (const request of requestedFetchesBatch) {
						request.resolve(value)
					}
				})
				.catch((reason) => {
					for (const request of requestedFetchesBatch) {
						request.reject(reason)
					}
				})
		}, 1)
	} else {
		for (const oid of args.oids) {
			nextFetchOids.add(oid)
		}
	}

	return fetchRequestPromise
}
