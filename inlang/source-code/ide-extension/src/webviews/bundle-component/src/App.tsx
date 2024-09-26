import React from "react"

interface AppProps {
	vscode: any
	initialData: any
}

const App: React.FC<AppProps> = ({ vscode, initialData }) => {
	console.log("initialData", initialData)

	const [bundle, setBundle] = React.useState(initialData.bundle)

	// Example of sending a message to the extension
	const updateBundle = () => {
		vscode.postMessage({
			command: "updateBundle",
			bundle: bundle, // Send the updated bundle
		})
	}

	// Example of handling messages from the extension
	React.useEffect(() => {
		window.addEventListener("message", (event) => {
			const message = event.data
			switch (message.command) {
				case "updateBundle":
					setBundle(message.bundle)
					break
				// Handle other commands
			}
		})
	}, [])

	return (
		<div>
			<h1>Inlang Bundle</h1>
			{/* Render your bundle components here */}
			<pre>{JSON.stringify(bundle, null, 2)}</pre>
			<button onClick={updateBundle}>Update Bundle</button>
		</div>
	)
}

export default App
