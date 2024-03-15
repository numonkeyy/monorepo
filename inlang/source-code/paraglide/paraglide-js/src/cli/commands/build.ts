import { Command } from "commander"
import { openRepository, findRepoRoot } from "@lix-js/client"
import { loadProject, type InlangProject } from "@inlang/sdk"
import fs from "node:fs/promises"
import { execSync } from "node:child_process"
import { resolve } from "node:path"
import { rewriteFile } from "../../services/build/rewrite.js"

export const buildCommand = new Command()
	.name("build")
	.summary("Wraps your framework's build command to orchestrate building all languages separately")
	.requiredOption("--project <path>", 'The path to the inlang project. Example: "./project.inlang"')
	.requiredOption(
		"--routes-dir <path>",
		'Path to the folder containing your routes. Example: "./src/app/"'
	)
	.action(async (options: { project: string; routesDir: string }, env) => {
		const projectPath = resolve(process.cwd(), options.project)
		const routesDirectory = resolve(process.cwd(), options.routesDir)
		const tmpDir = resolve(process.cwd(), ".tmp")
		const buildCommand = env.args.join(" ")

		const repoRoot = await findRepoRoot({ nodeishFs: fs, path: projectPath })
		const repo = await openRepository(repoRoot || process.cwd(), {
			nodeishFs: fs,
		})

		const project = exitIfErrors(
			await loadProject({
				projectPath,
				repo,
				appId: "library.inlang.paraglideJs",
			})
		)

		const projectSettings = project.settings()

		// copy the routes directory to a temporary directory
		await fs.cp(routesDirectory, tmpDir, { recursive: true })

		//wipe the routes directory
		await fs.rm(routesDirectory, { recursive: true, force: true })

		// resolve the directory for each language
		const languageDirectories: Record<string, string> = {}
		for (const language of projectSettings.languageTags) {
			languageDirectories[language] = resolve(routesDirectory, language)
		}

		// create a language directory for each language
		for (const languageDir of Object.values(languageDirectories)) {
			await repo.nodeishFs.cp(tmpDir, languageDir, { recursive: true })
		}

		// Walk through the language directories and rewrite imports
		for (const [language, languageDir] of Object.entries(languageDirectories)) {
			await walk({
				path: languageDir,
				rewrite: ({ path, content }) => rewriteFile({ content, path, targetLanguage: language }),
			})
		}

		const build = safeExecSync(buildCommand, { stdio: "inherit" })
		if (!build.ok) {
			console.error(build.stderr)
		}

		// move the routes directory back
		await cleanup(tmpDir, routesDirectory)

		async function cleanup(tempDir: string, routesDir: string) {
			await fs.rm(routesDir, { recursive: true, force: true })
			await fs.cp(tempDir, routesDir, { recursive: true })
			await fs.rm(tempDir, { recursive: true, force: true })
		}
	})

/**
 * Utility function to exit when the project has errors.
 */
const exitIfErrors = (project: InlangProject) => {
	if (project.errors().length > 0) {
		console.warn(`The project has errors:`)
		for (const error of project.errors()) {
			console.error(error)
		}
		process.exit(1)
	}
	return project
}

function safeExecSync(
	...args: Parameters<typeof execSync>
): { ok: true; stdout: string } | { ok: false; stderr: string } {
	try {
		return { ok: true, stdout: execSync(...args).toString() }
	} catch (err: any) {
		return { ok: false, stderr: err.stderr.toString() }
	}
}

/**
 * Recursively walk through a directory & rewrite all files in-place
 */
async function walk(options: {
	path: string
	rewrite: (args: { path: string; content: string; depth: number }) => string

	/**
	 * Check if we should continue walking down a directory
	 */
	predicate?: (options: { path: string }) => boolean
	depth?: number
}) {
	const predicate = options.predicate ?? (() => true)
	const currentDepth = options.depth ?? 0
	const entries = await fs.readdir(options.path)
	for (const entry of entries) {
		const path = resolve(options.path, entry)
		const stat = await fs.stat(path)
		if (stat.isDirectory()) {
			if (predicate({ path }) === true) {
				await walk({
					path,
					depth: currentDepth + 1,
					rewrite: options.rewrite,
					predicate: options.predicate,
				})
			}
		} else {
			const content = await fs.readFile(path, "utf8")
			const rewritten = options.rewrite({ path, content, depth: currentDepth })
			await fs.writeFile(path, rewritten, { encoding: "utf-8" })
		}
	}
}
