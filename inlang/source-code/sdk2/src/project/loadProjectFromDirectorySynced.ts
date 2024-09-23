import { loadProjectInMemory } from "./loadProjectInMemory.js";
import { merge, type Lix } from "@lix-js/sdk";
// eslint-disable-next-line no-restricted-imports
import fs from "node:fs";
import type {
	InlangPlugin,
	NodeFsPromisesSubsetLegacy,
} from "../plugin/schema.js";
import type { ProjectSettings } from "../json-schema/settings.js";
import type { InlangProject, ResourceFile } from "./api.js";
import {
	loadProjectFromDirectory,
	WarningLocalPluginImport,
} from "./loadProjectFromDirectory.js";
import { saveProjectToDirectory } from "./saveProjectToDirectory.js";
import { PluginImportError } from "../plugin/errors.js";

/**
 * Loads a project from a directory.
 *
 * Main use case are dev tools like vscode extension that wants to keep in sync with the fs.
 */
export async function loadProjectFromDirectorySynced(
	args: { path: string; fs: typeof fs; syncInterval: number } & Omit<
		Parameters<typeof loadProjectInMemory>[0],
		"blob"
	>
) {
	// start loading it from disc
	let fsProject = await loadProjectFromDirectory({
		path: args.path,
		fs: args.fs,
	});

	// create a clone from the fs Project so we are aware of the same set of changes
	const project = await loadProjectInMemory({
		blob: await fsProject.toBlob(),
	});

	let canceled = false;

	const doSync = async () => {
		// initialize the project with the existing blob and wait for the changes from the fs to be realized
		fsProject = await loadProjectFromDirectory({
			path: args.path,
			fs: args.fs,
			onTopOfState: await fsProject.toBlob(),
		});

		// now merge the changes from fs into the appProject
		await merge({ sourceLix: fsProject.lix, targetLix: project.lix });

		// TODO use fs state on conflict
		await project.lix.settled();

		const mergedBlob = await project.toBlob();
		const helperProject = loadProjectInMemory({
			blob: mergedBlob,
		});

		// replace the db object with the newly created one
		project.db = (await helperProject).db;

		// now merge the changes from appProject into the fs project
		await merge({ sourceLix: project.lix, targetLix: fsProject.lix });
		await fsProject.lix.settled();

		// finaly save changes to disc
		await saveProjectToDirectory({
			fs: args.fs.promises,
			path: args.path,
			// TODO double check if we need to replace the sqlite table in this case aswell
			project: fsProject,
		});

		if (canceled) {
			return;
		}
		setTimeout(() => {
			currentExecution = doSync();
		}, args.syncInterval);
	};

	let currentExecution = doSync();

	return {
		...project,
		cancelSync: () => {
			canceled = true;
		},
		errors: {
			get: async () => {
				const errors = await project.errors.get();
				return [
					...withLocallyImportedPluginWarning(errors),
					// TODO add errors comming from the import into fs project
					// ...localImport.errors,
					// ...importedResourceFileErrors,
				];
			},
			subscribe: (
				callback: Parameters<InlangProject["errors"]["subscribe"]>[0]
			) => {
				return project.errors.subscribe((value) => {
					callback([
						...withLocallyImportedPluginWarning(value),
						// TODO add errors comming from the import into fs project
						// ...localImport.errors,
						// ...importedResourceFileErrors,
					]);
				});
			},
		},
	};
}

function withLocallyImportedPluginWarning(errors: readonly Error[]) {
	return errors.map((error) => {
		if (
			error instanceof PluginImportError &&
			error.plugin.startsWith("http") === false
		) {
			return new WarningLocalPluginImport(error.plugin);
		}
		return error;
	});
}