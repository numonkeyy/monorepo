import { describe, it, expect, vi, beforeEach } from "vitest"
import type { Mock } from "vitest"
import { exec } from "node:child_process"
import { getGitUsername } from "./getGitUsername.js"

vi.mock("node:child_process", () => ({
	exec: vi.fn(),
}))

describe("getGitUsername", () => {
	beforeEach(() => {
		vi.resetAllMocks()
	})

	it("returns a hash when git username is found", async () => {
		;(exec as unknown as Mock).mockImplementation(
			(_cmd: string, callback: (error: Error | undefined, stdout: string | undefined) => void) => {
				callback(undefined, "testUsername")
			}
		)

		const result = await getGitUsername()
		expect(result).toContain("7bbe06e63b61b200a23b0bc7d13fbb6b90f30a7433585c3f8ad0bf4bae76b3cc")
	})

	it("returns an error when git command fails", async () => {
		;(exec as unknown as Mock).mockImplementation(
			(_cmd: string, callback: (error: Error | undefined, stdout: string | undefined) => void) => {
				callback(new Error("git command failed"), undefined)
			}
		)

		const result = await getGitUsername()
		expect(result).toEqual("Error: git command failed")
	})

	it("returns an error when git username is not found", async () => {
		;(exec as unknown as Mock).mockImplementation(
			(_cmd: string, callback: (error: Error | undefined, stdout: string | undefined) => void) => {
				callback(undefined, "")
			}
		)

		const result = await getGitUsername()
		expect(result).toEqual("Git username not found")
	})
})
