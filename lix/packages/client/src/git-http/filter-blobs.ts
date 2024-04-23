import {
	encodePkLine,
	decodeGitPackLines,
	addBlobNoneFilter,
	overrideHaves,
	addWantsCapabilities,
	overrideWants,
} from "./helpers.js"

/***
 * This takes the request, decodes the request body and extracts each line in the format of the git-upload-pack protocol (https://git-scm.com/docs/gitprotocol-v2)
 * and allows us to rewrite the request to add filters like blob:none (noneBlobFilter) or request only specific oids (overrideWants) or block list specific oids (overrideHaves)
 */
export async function filteredBlobReq(
	gitConfig: {
		noneBlobFilter: boolean
		overrideHaves?: string[] | undefined
		filterRefList?: {
			ref: string | undefined
		}
		overrideWants: string[] | undefined
	},
	{
		method,
		url,
		body,
	}: {
		method: string
		url: string
		body?: any
	}
) {
	// "http://localhost:3001/git-proxy//github.com/inlang/example/info/refs?service=git-upload-pack"
	if (url.endsWith("info/refs?service=git-upload-pack")) {
		if (gitConfig.filterRefList !== undefined) {
			const uploadPackUrl = url.replace("info/refs?service=git-upload-pack", "git-upload-pack")
			// create new body
			const lines = []

			lines.push(encodePkLine("command=ls-refs")) // TODO #1459 check if we have to ask for the symrefs
			// 0001 - Delimiter Packet (delim-pkt) - separates sections of a message
			lines.push(encodePkLine("agent=git/isomorphic-git@1.24.5") + "0001")
			// TODO #1459 we prefix refs/heads hardcoded here since the ref is set to main....
			if (gitConfig.filterRefList?.ref) {
				lines.push(encodePkLine("ref-prefix refs/heads/" + gitConfig.filterRefList?.ref))
			}
			lines.push(encodePkLine("ref-prefix HEAD"))
			lines.push(encodePkLine("symrefs"))
			lines.push(encodePkLine(""))

			return {
				url: uploadPackUrl,
				body: lines.join(""),
				headers: {
					accept: "application/x-git-upload-pack-result",
					"content-type": "application/x-git-upload-pack-request",
					"git-protocol": "version=2",
				},
			}
		} else if (method === "POST") {
			// decode the lines to be able to change them
			let rawLines = decodeGitPackLines(body[0])

			if (gitConfig.noneBlobFilter) {
				rawLines = addBlobNoneFilter(rawLines)
			}

			if (gitConfig.overrideHaves) {
				rawLines = overrideHaves(rawLines, gitConfig.overrideHaves)
			}

			if (gitConfig.overrideWants) {
				rawLines = addWantsCapabilities(rawLines)
				rawLines = overrideWants(rawLines, gitConfig.overrideWants)
			}

			return {
				// encode lines again to send them in a request
				body: rawLines.map((updatedRawLine: any) =>
					new TextEncoder().encode(encodePkLine(updatedRawLine))
				),
			}
		}
	}
}

export async function filteredBlobRes({
	origUrl,
	resBody,
	statusCode,
	resHeaders,
}: {
	origUrl: string
	usedUrl: string
	resBody: Uint8Array
	statusCode: number
	resHeaders: Record<string, string>
}) {
	if (origUrl.endsWith("info/refs?service=git-upload-pack")) {
		if (statusCode === 200) {
			let headSymref = ""

			const capabilites =
				"multi_ack thin-pack side-band side-band-64k ofs-delta shallow deepen-since deepen-not deepen-relative no-progress include-tag multi_ack_detailed allow-tip-sha1-in-want allow-reachable-sha1-in-want no-done filter object-format=sha1"
			const lines = decodeGitPackLines(resBody)
			const rawLines = ["# service=git-upload-pack\n", ""]
			for (const line of lines) {
				if (line.includes("HEAD symref-target")) {
					// 0050d7e62aef79d771d1771cb44c9e01faa4b7a607fe HEAD symref-target: -> length
					headSymref = "refs" + line.slice(64)
					headSymref = headSymref.endsWith("\n") ? headSymref.slice(0, -1) : headSymref
					const headBlob = line.slice(0, 40)
					rawLines.push(headBlob + " HEAD" + capabilites + " symref=HEAD:" + headSymref)

					rawLines.push(headBlob + " " + headSymref)
				} else {
					rawLines.push(line)
				}
			}

			rawLines.push("")

			const headers = {} as any
			// @ts-expect-error
			for (const [key, value] of response.headers.entries()) {
				headers[key] = value
			}
			headers["content-type"] = "application/x-git-upload-pack-advertisement"
			const bodyString = rawLines.map((updatedRawLine) => encodePkLine(updatedRawLine)).join("")
			const uintArray = [new TextEncoder().encode(bodyString)]

			return {
				statusCode: 200,
				statusMessage: "OK",
				headers: headers,
				body: uintArray,
			}
		}
	}
}
