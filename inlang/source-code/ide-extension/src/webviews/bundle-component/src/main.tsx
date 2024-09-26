import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"

// Access the initial data passed from the extension
declare global {
	interface Window {
		acquireVsCodeApi: any
		initialData: any
	}
}

const vscode = window.acquireVsCodeApi()

console.log("initialData in main.tsx", window.initialData)

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<App vscode={vscode} initialData={window.initialData} />
	</React.StrictMode>
)
