import { hashString } from "@inlang/telemetry"
import { exec } from "node:child_process"

export async function getGitUsername(): Promise<string> {
	try {
		const command = "git config user.name"
		const execPromise = (cmd: string): Promise<string> =>
			new Promise((resolve, reject) => {
				exec(cmd, (error, stdout) => {
					if (error) {
						reject(error)
						return
					}
					resolve(stdout.trim())
				})
			})

		const username = await execPromise(command)
		if (!username) {
			return "Git username not found"
		}

		const hash = hashString(username)
		return hash
	} catch (error: any) {
		return `Error: ${error.message}`
	}
}
