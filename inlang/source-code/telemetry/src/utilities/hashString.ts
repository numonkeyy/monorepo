export async function hashString(data: string): Promise<string> {
	let hashBuffer: ArrayBuffer

	if (typeof crypto !== "undefined" && crypto.subtle && typeof TextEncoder !== "undefined") {
		// Running in a browser
		const encoder = new TextEncoder()
		const dataEncoded = encoder.encode(data)
		hashBuffer = await crypto.subtle.digest("SHA-256", dataEncoded)
	} else {
		// Assuming Node.js environment
		// Dynamically import the Node.js crypto module to avoid errors in a browser environment
		const { createHash } = await import("node:crypto")
		const hash = createHash("sha256")
		hash.update(data)
		hashBuffer = hash.digest()
	}

	const hashArray = [...new Uint8Array(hashBuffer)]
	const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
	return hashHex
}
