import * as vscode from "vscode"
import * as Comlink from "comlink"
import { getUri } from "./utils/getUri.js"
import { getNonce } from "./utils/getNonce.js"
import { getExtensionInstance } from "./helpers/Extension.js"
import { makeFsAvailableTo, MessageChannelAdapter } from "@inlang/sdk/v2"
import * as fs from "node:fs/promises"

function webviewEndpoint(webview: vscode.Webview): Comlink.Endpoint {
	const listeners = new Map<any, vscode.Disposable>()

	return {
		postMessage(message) {
			console.log("main thread postmessage", message)
			webview.postMessage(message)
		},

		addEventListener(_, listener) {
			const disposable = webview.onDidReceiveMessage((data) => {
				console.log("main thread onmessage", data)
				if ("handleEvent" in listener) {
					const ev = new MessageEvent("message", { data })
					listener.handleEvent(ev)
				} else {
					const ev = new MessageEvent("message", { data })
					listener(ev)
				}
			})

			listeners.set(listener, disposable)
		},

		removeEventListener(_, listener) {
			const disposable = listeners.get(listener)
			if (disposable) disposable.dispose()
		},
	}
}

function getHtmlForWebview(webview: vscode.Webview, context: vscode.ExtensionContext): string {
	const file = "src/index.tsx"
	const localPort = "5173"
	const localServerUrl = `localhost:${localPort}`

	const stylesUri = getUri(webview, context.extensionUri, [
		"webview-ui",
		"build",
		"assets",
		"index.css",
	])

	let scriptUri
	const ext = getExtensionInstance(context)
	console.log("Extension instance", ext, ext.isProductionMode())

	const isProd = false
	if (isProd) {
		scriptUri = getUri(webview, context.extensionUri, ["webview-ui", "build", "assets", "index.js"])
	} else {
		scriptUri = `http://${localServerUrl}/${file}`
	}

	const nonce = getNonce()

	const reactRefresh = /*html*/ `
      <script type="module">
        import RefreshRuntime from "http://localhost:${localPort}/@react-refresh"
        RefreshRuntime.injectIntoGlobalHook(window)
        window.$RefreshReg$ = () => {}
        window.$RefreshSig$ = () => (type) => type
        window.__vite_plugin_react_preamble_installed__ = true
      </script>`

	const reactRefreshHash = "sha256-YmMpkm5ow6h+lfI3ZRp0uys+EUCt6FOyLkJERkfVnTY="

	const csp = [
		`default-src 'none';`,
		`script-src 'unsafe-eval' https://* ${
			isProd
				? `'nonce-${nonce}'`
				: `http://${localServerUrl} http://0.0.0.0:${localPort} '${reactRefreshHash}' 'nonce-${nonce}'`
		};`,
		`style-src ${webview.cspSource} 'self' 'unsafe-inline' https://*;`,
		`font-src ${webview.cspSource};`,
		`connect-src https://* ${
			isProd
				? ``
				: `ws://${localServerUrl} ws://0.0.0.0:${localPort} http://${localServerUrl} http://0.0.0.0:${localPort}`
		};`,
	].join(" ")

	return /*html*/ `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="Content-Security-Policy" content="${csp}">
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" type="text/css" href="${stylesUri}">
        <title>VSCode React Starter</title>
      </head>
      <body>
        <div id="root"></div>
        ${isProd ? "" : reactRefresh}
        <script type="module" nonce="${nonce}" src="${scriptUri}"></script>
      </body>
    </html>`
}

function setWebviewMessageListener(webview: vscode.Webview) {
	const ep = MessageChannelAdapter.wrap(webviewEndpoint(webview))
	makeFsAvailableTo(
		{
			readFile: (path, options) => {
				console.log("readFile", path, options)
				return fs.readFile(path, options)
			},
			readdir: fs.readdir,
			writeFile: fs.writeFile,
			watch: fs.watch,
			mkdir: fs.mkdir,
		},
		{
			postMessage(message, transfer) {
				console.log("postMessage", message)
				ep.postMessage(message, transfer)
			},
			addEventListener: ep.addEventListener.bind(ep),
			removeEventListener: ep.removeEventListener.bind(ep),
		}
	)

	webview.onDidReceiveMessage((message: any) => {
		const command = message.command
		const text = message.text
		console.log("Received message", message)

		switch (command) {
			case "hello":
				vscode.window.showInformationMessage(text)
				return
			case "setMessageBundle":
				console.info("Received message", message)
				break
			case "setFixLint":
				console.info("Received fix lint", message)
				break
			// Add more switch cases as needed
		}
	})
}

export async function messageBundlePanel(args: { context: vscode.ExtensionContext }) {
	const panel = vscode.window.createWebviewPanel(
		"messageBundlePanel",
		"fs test",
		vscode.ViewColumn.One,
		{
			enableScripts: true,
			localResourceRoots: [vscode.Uri.file(args.context.extensionPath)],
		}
	)

	// const ep = webviewEndpoint(panel.webview)

	panel.webview.html = getHtmlForWebview(panel.webview, args.context)

	setWebviewMessageListener(panel.webview)
}
