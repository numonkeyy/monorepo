import { defineConfig } from "vite"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
	plugins: [tailwindcss()],
	server: {
		host: "0.0.0.0",
		headers: {
			"Cross-Origin-Opener-Policy": "same-origin",
			"Cross-Origin-Embedder-Policy": "require-corp",
		},
	},
	optimizeDeps: {
		exclude: ["@sqlite.org/sqlite-wasm", "sqlocal"],
	},
})
