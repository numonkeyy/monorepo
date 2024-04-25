import {
	decodeGitPackLines,
	addBlobNoneFilter,
	overrideHaves,
	addWantsCapabilities,
	overrideWants,
	encodePackLine,
} from "./helpers.js"

/***
 * This takes the request, decodes the request body and extracts each line in the format of the git-upload-pack protocol (https://git-scm.com/docs/gitprotocol-v2)
 * and allows us to rewrite the request to add filters like blob:none (noneBlobFilter) or request only specific oids (overrideWants) or block list specific oids (overrideHaves)
 */
export async function optimizeReq(
	gitConfig: {
		noneBlobFilter?: boolean
		filterRefList?: {
			ref: string | undefined
		}

		overrideHaves?: string[]
		overrideWants?: string[]
	} = {},
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
	// FIXME: document url + method api, how to get tree for commit just filter file blobs
	// "http://localhost:3001/git-proxy//github.com/inlang/example/info/refs?service=git-upload-pack"
	if (url.endsWith("info/refs?service=git-upload-pack") && gitConfig.filterRefList !== undefined) {
		const uploadPackUrl = url.replace("info/refs?service=git-upload-pack", "git-upload-pack")
		const lines = []

		// TODO #1459 check if we have to ask for the symrefs
		lines.push(encodePackLine("command=ls-refs"))

		// 0001 - Delimiter Packet (delim-pkt) - separates sections of a message
		lines.push(encodePackLine("agent=lix") + "0001")

		// TODO #1459 we prefix refs/heads hardcoded here since the ref is set to main....
		if (gitConfig.filterRefList?.ref) {
			lines.push(encodePackLine("ref-prefix refs/heads/" + gitConfig.filterRefList?.ref))
		}

		lines.push(encodePackLine("ref-prefix HEAD"))
		lines.push(encodePackLine("symrefs"))
		lines.push(encodePackLine(""))

		return {
			url: uploadPackUrl,
			body: lines.join(""),
			method: "POST",
			headers: {
				accept: "application/x-git-upload-pack-result",
				"content-type": "application/x-git-upload-pack-request",
				"git-protocol": "version=2",
			},
		}
	}

	if (method === "POST") {
		// decode the lines to be able to change them
		let rawLines = decodeGitPackLines(body)

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

		// encode lines again to send them in a reques
		// const newBody = rawLines.map((updatedRawLine: any) =>
		// 	new TextEncoder().encode(encodePackLine(updatedRawLine))
		// )

		return {
			body: rawLines.join(""),
		}
	}

	return undefined
}

export async function optimizeRes({
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
	if (!origUrl.endsWith("info/refs?service=git-upload-pack") || statusCode !== 200) {
		return undefined
	}

	let headSymref = ""

	const capabilites = [
		"multi_ack",
		"thin-pack",
		"side-band",
		"side-band-64k",
		"ofs-delta",
		"shallow",
		"deepen-since",
		"deepen-not",
		"deepen-relative",
		"no-progress",
		"include-tag",
		"multi_ack_detailed",
		"allow-tip-sha1-in-want",
		"allow-reachable-sha1-in-want",
		"no-done",
		"filter",
		"object-format=sha1",
	]

	const origLines = decodeGitPackLines(resBody)
	const rewrittenLines = ["# service=git-upload-pack\n", ""]
	for (const line of origLines) {
		if (line.includes("HEAD symref-target")) {
			// 0050d7e62aef79d771d1771cb44c9e01faa4b7a607fe HEAD symref-target: -> length
			headSymref = "refs" + line.slice(64)
			headSymref = headSymref.endsWith("\n") ? headSymref.slice(0, -1) : headSymref
			const headBlob = line.slice(0, 40)
			rewrittenLines.push(
				headBlob + " HEAD" + "\x00" + capabilites.join(" ") + " symref=HEAD:" + headSymref
			)

			rewrittenLines.push(headBlob + " " + headSymref)
		}
	}

	rewrittenLines.push("")

	resHeaders["content-type"] = "application/x-git-upload-pack-advertisement"
	const bodyString = rewrittenLines.map((updatedRawLine) => encodePackLine(updatedRawLine)).join("")

	return {
		resHeaders,
		resBody: [new TextEncoder().encode(bodyString)],
	}
}
