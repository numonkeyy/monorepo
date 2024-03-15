import { Command } from "commander"
import { compileCommand } from "./commands/compile.js"
import { initCommand } from "./commands/init.js"
import { version } from "./state.js"
import { buildCommand } from "./commands/build.js"

export const cli = new Command()
	.name("paraglide-js")
	.addCommand(compileCommand)
	.addCommand(initCommand)
	.addCommand(buildCommand)
	.showHelpAfterError()
	.version(version)
