import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig(({}) => ({
	plugins: [react()],
	base: "",
	server: {
		port: 3000,
		strictPort: true,
		hmr: {
			protocol: "ws",
			host: "localhost",
			port: 3000,
		},
	},
	build: {
		outDir: "../../../dist/bundle-component",
		emptyOutDir: true,
		manifest: true, // Enable manifest file generation
		rollupOptions: {
			input: "./src/main.tsx", // Ensure this matches your entry point
		},
	},
}))
