import { vscode } from "./utils/vscode"
import { VSCodeButton } from "@vscode/webview-ui-toolkit/react"
import "./App.css"
import { getFs, MessageChannelAdapter } from "@inlang/sdk/v2"
import * as Comlink from "comlink"
import { useEffect } from "react"

const ep = MessageChannelAdapter.wrap({
	postMessage(data) {
		console.log("webview postmessage", data)
		vscode.postMessage(data)
	},
	addEventListener: (type, listener) => {
		window.addEventListener(type, (ev) => {
			console.log("webview event", ev)
			listener(ev)
		})
	},
	removeEventListener: (type, listener) => {
		window.removeEventListener(type, listener)
	},
})

const fs = getFs(ep)

function App() {
	function handleHowdyClick() {
		vscode.postMessage({
			command: "hello",
			text: "Hey there partner! 🤠",
		})
	}

	useEffect(() => {
		fs.readFile("/Users/felixhaberle/Desktop/git/monorepo/cla.md", { encoding: "utf-8" }).then(
			(content) => console.log(content)
		)
	})

	return (
		<main>
			<h1 className="text-lg bg-vscode-panel-border">Hello World from</h1>
			<VSCodeButton onClick={handleHowdyClick}>Message into VS Code!</VSCodeButton>
		</main>
	)
}

export default App
