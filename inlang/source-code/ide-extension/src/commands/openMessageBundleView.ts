import { commands } from "vscode"
import { telemetry } from "../services/telemetry/implementation.js"
import { messageBundlePanel } from "../utilities/messages/messageBundleView.js"
import vscode from "vscode"

export const openMessageBundleViewCommand = {
	command: "sherlock.openMessageBundleView",
	title: "Sherlock: Open Message Bundle View",
	register: commands.registerCommand,
	callback: async function (context: vscode.ExtensionContext) {
		await messageBundlePanel({ context })

		telemetry.capture({
			event: "IDE-EXTENSION Message Bundle View opened",
		})
		return undefined
	},
}
