import { html } from "lit"
import { customElement, state } from "lit/decorators.js"
import { Ref, createRef, ref } from "lit/directives/ref.js"
import { newLixFile, openLixInMemory, merge, getLeafChangesOnlyInSource } from "@lix-js/sdk"

import "./file-view"
import "./review"
import "./csv-view"
import "./incoming"
import plugin from "./csv-plugin.js"
import { poll } from "./reactivity"
import { BaseElement } from "./baseElement"
import "@shoelace-style/shoelace"
import { v4 as uuid } from "uuid"

const lixOPFSPath = "-country-project.lix"

function humanFileSize(bytes, si = false, dp = 1) {
	const thresh = si ? 1000 : 1024

	if (Math.abs(bytes) < thresh) {
		return bytes + " B"
	}

	const units = si
		? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
		: ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"]
	let u = -1
	const r = 10 ** dp

	do {
		bytes /= thresh
		++u
	} while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1)

	return bytes.toFixed(dp) + " " + units[u]
}

const getDirectoryEntriesRecursive = async (relativePath = ".") => {
	// @ts-ignore
	const directoryHandle = await navigator.storage.getDirectory()
	const fileHandles = []
	const directoryHandles = []

	// Get an iterator of the files and folders in the directory.
	// @ts-ignore
	const directoryIterator = directoryHandle.values()
	const directoryEntryPromises = []
	for await (const handle of directoryIterator) {
		const nestedPath = `${relativePath}/${handle.name}`
		if (handle.kind === "file") {
			// @ts-ignore
			fileHandles.push({ handle, nestedPath })
			directoryEntryPromises.push(
				// @ts-ignore
				handle.getFile().then((file) => {
					return {
						name: handle.name,
						file,
						size: humanFileSize(file.size),
						relativePath: nestedPath,
						handle,
					}
				})
			)
		} else if (handle.kind === "directory") {
			// @ts-ignore
			directoryHandles.push({ handle, nestedPath })
			directoryEntryPromises.push(
				// @ts-ignore
				(async () => {
					return {
						name: handle.name,
						// @ts-ignore
						file,
						// @ts-ignore
						size: humanFileSize(file.size),
						relativePath: nestedPath,
						// @ts-ignore
						entries: await getDirectoryEntriesRecursive(handle, nestedPath),
						handle,
					}
				})()
			)
		}
	}
	return await Promise.all(directoryEntryPromises)
}

@customElement("csv-app")
export class App extends BaseElement {
	constructor() {
		super()
		// @ts-ignore
		this.username = "User " + this.getAttribute("name")
		// @ts-ignore
		this.dbName = this.getAttribute("name") + lixOPFSPath
		const self = this

		if (this.lix === undefined) {
			getDirectoryEntriesRecursive().then((res) => {
				// @ts-ignore
				window.files = res
				self.files = res
				console.log(res)
			})

			navigator.storage.getDirectory().then(async (dir) => {
				try {
					const handle = await dir.getFileHandle(self.dbName, {
						create: false,
					})

					const dbBlob = await (await handle.getFile()).arrayBuffer()

					if (self.dbName.startsWith("A")) {
						await new Promise((resolve) => setTimeout(resolve, 200))
					}
					self.lix = await openLixInMemory({ arrayBuffer: dbBlob, providePlugins: [plugin] })
				} catch (e) {
					console.log(e)
				}
				setInterval(() => this.getChanges(), 1000)
			})
		}
	}

	async runTests() {
		await this.demo()
	}

	async handleOpenLix(event: any) {
		const file: File = event.target.files[0]
		if (!file) {
			return
		}
		this.lix = await openLixInMemory({
			arrayBuffer: await file.arrayBuffer(),
			providePlugins: [plugin],
		})
	}

	@state() tempLix: any
	openLixInputRef: Ref<HTMLInputElement> = createRef()

	async resetIncomming() {
		this.view = "edit"
		this.incomingChanges = []
		this.conflictingChanges = []

		await this.tempLix?.close()
		this.tempLix = undefined
	}

	async handleMerge(event: any) {
		console.log({this: this})
		const file: File = event.target.files[0]
		if (!file) {
			return
		}

		const dbBlob = await file.arrayBuffer()

		this.tempLix = await openLixInMemory({
			arrayBuffer: await (await this.lix.toBlob()).arrayBuffer(),
			providePlugins: [plugin],
		})

		await merge({
			targetLix: this.tempLix,
			sourceLix: await openLixInMemory({ arrayBuffer: dbBlob, providePlugins: [plugin] }),
			// userId: this.username,
		})

		// window.inc = this.tempLix

		const leafChangesOnlyInSource = await getLeafChangesOnlyInSource({
			sourceLix: this.tempLix,
			targetLix: this.lix,
		})

		// change_id
		// :
		// "a1eef79f-2263-4a6d-a05c-c478caa474dd"
		// conflicting_change_id
		// :
		// "14799cdc-d44e-45e3-a961-34abe3393307"
		// meta
		// :
		// null
		// reason
		// :
		// "The snapshots of the change do not match. More sophisticated reasoning will be added later."
		// resolved_with_change_id
		// :
		// null
		const conflicts = (await this.tempLix.db.selectFrom("conflict").selectAll().execute()).reduce(
			(agg, change) => {
				agg[change.change_id] = change
				agg[change.conflicting_change_id] = change
				return agg
			},
			{}
		)

		this.incomingChanges = []

		this.conflictingChanges = []

		// console.log(conflicts)

		for (const change of leafChangesOnlyInSource) {
			if (change.parent_id) {
				const parent = await this.lix.db
					.selectFrom("change")
					.selectAll()
					.where("change.id", "=", change.parent_id)
					.executeTakeFirstOrThrow()

				// @ts-ignore
				change.parent = parent
			}
			if (conflicts[change.id]) {
				const conflict = conflicts[change.id]
				// if (conflict.resolved_with_change_id) {
				// 	continue
				// }
				let conflictingChangeId

				if (conflict.conflicting_change_id === change.id) {
					conflictingChangeId = conflict.change_id
				} else {
					conflictingChangeId = conflict.conflicting_change_id
				}
				// @ts-ignore
				change.conflict = await this.tempLix.db
					.selectFrom("change")
					.selectAll()
					.where("id", "=", conflictingChangeId)
					.executeTakeFirst()

				if (change.conflict.parent_id) {
					const parent = await this.lix.db
						.selectFrom("change")
						.selectAll()
						.where("change.id", "=", change.conflict.parent_id)
						.executeTakeFirstOrThrow()

					// @ts-ignore
					change.conflict.parent = parent
				}
				this.conflictingChanges.push(change)
			} else {
				this.incomingChanges.push(change)
			}
		}

		// console.log(this.incomingChanges, this.conflictingChanges)
		if (leafChangesOnlyInSource.length) {
			this.view = "incoming"
		}
	}
	mergeInputRef: Ref<HTMLInputElement> = createRef()

	async getChanges() {
		if (!this.lix) return
		const changes = await this.lix.db
			.selectFrom("change")
			.selectAll()
			.orderBy("created_at", "desc")
			// .where("commit_id", "is", null)
			.execute()

		await Promise.all(
			changes.map(async (change) => {
				if (change.parent_id) {
					const parent = await this.lix.db
						.selectFrom("change")
						.selectAll()
						.where("change.id", "=", change.parent_id)
						.executeTakeFirstOrThrow()

					change.parent = parent
				}
			})
		)

		// file_id :  "31d400ca-f3e0-4d70-b940-4cf77d563af7othercsv"
		// id
		// :
		// "fca0c17b-f7ba-494d-80a2-17ea88c2ee50"
		// meta
		// :
		// null
		// operation
		// :
		// "create"
		// parent_id
		// :
		// null
		// plugin_key
		// :
		// "csv"
		// type
		// :
		// "cell"
		// value
		// :
		// {id: '1-a', text: '1'}

		this.changes = changes.filter((change) => !change.commit_id)
		this.commitedChanges = changes.filter((change) => change.commit_id)
		// .map((change) => {
		// 	// console.log(change)
		// 	return `${JSON.stringify(change, null, 2)}`
		// })
	}

	connectedCallback(): void {
		// @ts-ignore
		super.connectedCallback()
		poll(
			async () => {
				const numUncommittedChanges = await this.lix?.db
					.selectFrom("change")
					.select(({ fn }) => [fn.count("id").as("count")])
					.where("commit_id", "is", null)
					.executeTakeFirst()
				const comittedChanges = await this.lix?.db
					.selectFrom("change")
					.select(({ fn }) => [fn.count("id").as("count")])
					.where("commit_id", "is not", null)
					.executeTakeFirst()
				return { numUncommittedChanges, comittedChanges }
			},
			({ numUncommittedChanges, comittedChanges }) => {
				if (numUncommittedChanges && comittedChanges) {
					this.numUncommittedChanges = numUncommittedChanges!.count
					this.numCommittedChanges = comittedChanges!.count
				}
			}
		)
	}

	@state() incomingChanges: any[] = []
	@state() conflictingChanges: any[] = []

	@state() numUncommittedChanges = 0

	@state() numCommittedChanges = 0

	async handleCreateLix() {
		this.lix = await openLixInMemory({ blob: await newLixFile(), providePlugins: [plugin] })
	}

	async download() {
		// const opfsRoot = await navigator.storage.getDirectory()
		// // TODO file names based on UUID to avoid collisions
		// const fileHandle = await opfsRoot.getFileHandle(this.dbName, {
		// 	create: false,
		// })
		const blob = await this.lix.toBlob()

		// const file = await fileHandle.getFile()

		// const result = await file.arrayBuffer()
		// const blob = new Blob([result])

		const url = URL.createObjectURL(blob)
		const a = document.createElement("a")
		a.href = url
		a.download = this.dbName
		a.click()
	}

	async demo() {
		await this.handleCreateLix()

		const demoFiles = [
			{
				name: "countries.csv",
				data: await fetch("/mock/countries.csv").then((res) => res.arrayBuffer()),
			},
			{
				name: "presidents.csv",
				data: await fetch("/mock/presidents.csv").then((res) => res.arrayBuffer()),
			},
		]

		await Promise.all(
			demoFiles.map(async (file) => {
				return this.lix?.db
					.insertInto("file")
					.values({
						// uuid.{file extension}
						// jsi2089-28nz92.csv
						id: uuid() + file.name.split(".").join(""),
						path: file.name,
						data: await file.data,
					})
					.execute()
			})
		)

		await this.lix.settled()

		await this.lix?.commit({
			userId: this.username,
			// TODO unbundle description from commits
			description: "Initial commit",
		})
	}

	async resetB() {
		const opfsRoot = await navigator.storage.getDirectory()
		// TODO file names based on UUID to avoid collisions
		const fileHandleA = await opfsRoot.getFileHandle("A" + lixOPFSPath, {
			create: false,
		})

		const fileA = await (await fileHandleA.getFile()).arrayBuffer()

		const fileHandleB = await opfsRoot.getFileHandle("B" + lixOPFSPath, {
			create: true,
		})

		const writable = await fileHandleB.createWritable()
		await writable.write(fileA)
		await writable.close()
	}

	async merge() {
		navigator.storage.getDirectory().then(async (dir) => {
			try {
				const handle = await dir.getFileHandle("B" + lixOPFSPath, {
					create: false,
				})

				const dbBlob = await (await handle.getFile()).arrayBuffer()

				await merge({
					targetLix: this.lix,
					sourceLix: await openLixInMemory({ arrayBuffer: dbBlob, providePlugins: [plugin] }),
					// userId: this.username,
				})
			} catch (e) {
				console.log(e)
			}
		})
	}

	async save() {
		await saveInOPFS({ blob: await this.lix.toBlob(), path: this.dbName }).then(() =>
			console.log(this.dbName + " saved to opfs")
		)
	}

	async inspect() {
		// @ts-ignore
		window.lix = this.lix
		console.log(this.lix)
	}

	async deleteFiles() {
		this.files.forEach(async (file: any) => {
			await file.handle.remove()
		})
	}

	@state() files = []

	@state() view = "edit"

	@state() dbName = ""

	@state() lix

	@state() openFile

	@state() username = ""

	@state() changes = []

	@state() commitedChanges = []

	render() {
		return html`
			<div
				class="w-full h-[98px] bg-[#edf0f7] flex-col justify-start items-start inline-flex"
				style="border-bottom: 1px solid #2d3648;"
			>
				<div class="self-stretch pl-10 pr-10 py-6 justify-between items-center inline-flex">
					<div class="justify-start items-center gap-8 flex">
						<div class="justify-start items-start gap-4 flex">
							<div
								@click="${() => {
									this.view = "edit"
								}}"
								class="flex-col justify-start items-start inline-flex cursor-pointer"
							>
								<div class="px-4 py-3 rounded-md justify-center items-center gap-2 inline-flex">
									<div
										class="${this.view === "edit"
											? "text-[#2d3648]"
											: "text-[#717d96]"} text-base font-bold leading-normal"
									>
										Edit
									</div>
								</div>

								${this.view === "edit"
									? html`<div class="self-stretch h-[0px] border border-[#2d3648]"></div>`
									: ""}
							</div>

							<div
								@click="${() => {
									this.view = "review"
								}}"
								class="flex-col justify-start items-start inline-flex  cursor-pointer"
							>
								<div class="px-4 py-3 rounded-md justify-center items-center gap-2 inline-flex">
									<div
										class="${this.view === "review"
											? "text-[#2d3648]"
											: "text-[#717d96]"}  text-base font-bold leading-normal"
									>
										Review Changes
									</div>

									<div
										class="${this.view === "review"
											? "text-[#2d3648]"
											: "text-[#717d96]"}  text-base font-bold leading-normal"
									>
										${this.numUncommittedChanges}
									</div>
								</div>

								${this.view === "review"
									? html`<div class="self-stretch h-[0px] border border-[#2d3648]"></div>`
									: ""}
							</div>

							${this.incomingChanges?.length || this.conflictingChanges?.length
								? html`<div
										@click="${() => {
											this.view = "incoming"
										}}"
										review
										class="flex-col justify-start items-start inline-flex  cursor-pointer"
								  >
										<div class="px-4 py-3 rounded-md justify-center items-center gap-2 inline-flex">
											<div
												class="${this.view === "incoming"
													? "text-[#2d3648]"
													: "text-[#717d96]"}  text-base font-bold leading-normal"
											>
												Review Incoming Changes
												${this.incomingChanges.length + this.conflictingChanges.length}
											</div>
										</div>

										${this.view === "incoming"
											? html`<div class="self-stretch h-[0px] border border-[#2d3648]"></div>`
											: ""}
								  </div>`
								: ""}
						</div>
					</div>

					<div class="justify-end items-start gap-4 flex">
						<button
							title="${this.numUncommittedChanges || !this.lix
								? "Please confirm your changes before downloading your project"
								: ""}"
							class="bg-transparent border-none flex-col justify-start items-start inline-flex"
							@click=${() => {
								if (!this.numUncommittedChanges) {
									this.download()
								} else {
									alert("Please confirm your changes before downloading your project")
								}
							}}
						>
							<div
								class="px-4 py-3 rounded-md justify-center items-center gap-2 inline-flex  cursor-pointer"
							>
								<div
									class="${this.numUncommittedChanges || !this.lix
										? "text-[#717d96]"
										: ""} text-base font-bold leading-normal"
								>
									Download Project
								</div>
							</div>
						</button>

						<div
							@click=${() => this.openLixInputRef.value?.click()}
							class="px-4 py-3 rounded-md border justify-center items-center gap-2 flex  cursor-pointer"
						>
							<div class="text-[#2d3648] text-base font-bold leading-normal">Open Project</div>
							<input
								${ref(this.openLixInputRef)}
								style="display: none;"
								type="file"
								name="hello"
								@change=${this.handleOpenLix}
							/>
						</div>

						<div
							@click=${() => this.mergeInputRef.value?.click()}
							class="px-4 py-3 rounded-md border border-[#2d3648] justify-center items-center gap-2 flex  cursor-pointer"
						>
							<div class="text-[#2d3648] text-base font-bold leading-normal">Import and Merge</div>
							<input
								${ref(this.mergeInputRef)}
								style="display: none;"
								type="file"
								name="hello"
								@change=${this.handleMerge}
							/>
						</div>
					</div>
				</div>
			</div>

			${this.view === "edit"
				? html`<file-view
						.view=${this.view}
						.lix=${this.lix}
						.openFile=${this.openFile}
						.doOpen=${(filename) => {
							this.openFile = filename
						}}
				  ></file-view>`
				: ""}

			<main
				style="${!this.lix
					? "align-content: center;"
					: ""} position: absolute; overflow:scroll; padding-bottom: 60px; top: 105px; ${this.lix &&
				this.view === "edit"
					? "left: 320px; width: calc(100% - 320px);"
					: " left: 40px;width: 100%;"} height: calc(100vh - 170px);"
			>
				${this.lix
					? this.view === "edit"
						? html`<csv-view .lix=${this.lix} .openFile=${this.openFile}></csv-view>`
						: this.view === "incoming"
						? html`<incoming-view
								.resetIncomming=${() => this.resetIncomming()}
								style="padding-top: 40px;"
								.username=${this.username}
								.openFile=${this.openFile}
								.changes=${this.changes}
								.commitedChanges=${this.commitedChanges}
								.conflictingChanges=${this.conflictingChanges}
								.incomingChanges=${this.incomingChanges}
								.lix=${this.lix}
						  />`
						: html`<review-view
								style="padding-top: 40px;"
								.username=${this.username}
								.openFile=${this.openFile}
								.changes=${this.changes}
								.commitedChanges=${this.commitedChanges}
								.lix=${this.lix}
						  />`
					: html`<div
							style="max-width: fit-content; margin-inline: auto; margin-left: auto; margin-right: auto;"
					  >
							<div
								style=" width: 247px; height: 184px; flex-direction: column; justify-content: flex-start; align-items: center; gap: 32px; display: inline-flex"
							>
								<div
									style="justify-content: flex-start; align-items: flex-start; gap: 16px; display: inline-flex"
								>
									<div
										style="padding-left: 20px; padding-right: 20px; padding-top: 12px; padding-bottom: 12px; border-radius: 6px; overflow: hidden; border: 2px black solid; justify-content: center; align-items: center; gap: 8px; display: flex"
									>
										<div
											@click=${() => this.openLixInputRef.value?.click()}
											style="color: black; font-size: 16px; font-weight: 700; line-height: 24px; word-wrap: break-word; cursor: pointer"
										>
											Open a Project File
										</div>
									</div>
								</div>
								<div
									style="align-self: stretch; justify-content: flex-start; align-items: center; gap: 16px; display: inline-flex"
								>
									<div style="width: 100px; height: 0px; border: 1px black solid"></div>
									<div
										style="color: black; font-size: 16px; font-weight: 300; line-height: 24px; word-wrap: break-word"
									>
										or
									</div>
									<div style="width: 100px; height: 0px; border: 1px black solid"></div>
								</div>
								<div
									style="background: #2D3648; border-radius: 6px; justify-content: flex-start; align-items: flex-start; gap: 16px; display: inline-flex"
								>
									<div
										@click=${this.demo}
										style="cursor: pointer; padding-left: 20px; padding-right: 20px; padding-top: 12px; padding-bottom: 12px; border-radius: 6px; overflow: hidden; justify-content: center; align-items: center; gap: 8px; display: flex"
										id="create-demo-button"
									>
										<div
											style="color: white; font-size: 16px; font-weight: 700; line-height: 24px; word-wrap: break-word;"
										>
											Create Demo Projekt
										</div>
									</div>
								</div>
							</div>
					  </div>`}
			</main>

			<footer style="position: fixed; bottom: 0; padding: 17px; right: 0;">
				<button @click=${this.runTests}>Run tests</button>
				<button @click=${this.handleCreateLix}>Create new lix file</button>
				<file-importer .lix=${this.lix}></file-importer>
				<button @click=${this.resetB}>Reset B to A</button>
				<button @click=${this.merge}>Merge B into A</button>
				<button @click=${this.save}>Save to OPFS</button>
				<button @click=${this.inspect}>Inspect in console</button>
				<button @click=${this.deleteFiles}>Delete all opfs files</button>
			</footer>
		`

		// <lix-actions .username=${this.username} .lix=${this.lix}></lix-actions>
	}
}

@customElement("lix-actions")
export class LixActions extends BaseElement {
	lix: any
	connectedCallback(): void {
		// @ts-ignore
		super.connectedCallback()
		poll(
			async () => {
				const numUncommittedChanges = await this.lix?.db
					.selectFrom("change")
					.select(({ fn }) => [fn.count("id").as("count")])
					.where("commit_id", "is", null)
					.executeTakeFirst()
				const comittedChanges = await this.lix?.db
					.selectFrom("change")
					.select(({ fn }) => [fn.count("id").as("count")])
					.where("commit_id", "is not", null)
					.executeTakeFirst()
				return { numUncommittedChanges, comittedChanges }
			},
			({ numUncommittedChanges, comittedChanges }) => {
				if (numUncommittedChanges && comittedChanges) {
					this.numUncommittedChanges = numUncommittedChanges!.count
					this.numCommittedChanges = comittedChanges!.count
				}
			}
		)
	}

	@state() numUncommittedChanges = 0

	@state() numCommittedChanges = 0

	username: string = ""

	async handleCommit() {
		await this.lix!.commit({
			userId: this.username,
			// TODO unbundle description from commits
			description: "",
		})
	}

	render() {
		return html`
			<div>
				<label for="name">Name</label>
				<input
					id="name"
					type="text"
					.value=${this.username}
					@input=${(e: any) => {
						this.username = e.target.value
					}}
				/>
			</div>

			<div class="flex gap-4 justify-between">
				<div class="flex gap-4">
					<p>Uncommitted changes: ${this.numUncommittedChanges}</p>
					<p>Committed changes: ${this.numCommittedChanges}</p>
				</div>
				<button @click=${this.handleCommit}>Commit</button>
			</div>
		`
	}
}

@customElement("file-importer")
export class InlangFileImport extends BaseElement {
	lix: any

	async handleFileSelection(event: any) {
		const file: File = event.target.files[0]
		await this.lix?.db
			.insertInto("file")
			.values({
				// uuid.{file extension}
				// jsi2089-28nz92.csv
				id: uuid() + file.name.split(".").join(""),
				path: file.name,
				data: await file.arrayBuffer(),
			})
			.execute()
	}

	importInputRef: Ref<HTMLInputElement> = createRef()

	render() {
		return html`
			<input
				${ref(this.importInputRef)}
				style="display: none;"
				type="file"
				id="selected-file"
				name="hello"
				@change=${this.handleFileSelection}
			/>
			<button @click=${() => this.importInputRef.value?.click()}>Import csv file</button>
		`
	}
}

/**
 * Imports a project from a blob into OPFS.
 */
async function saveInOPFS(args: { blob: Blob; path: string }) {
	const opfsRoot = await navigator.storage.getDirectory()
	// TODO file names based on UUID to avoid collisions
	const fileHandle = await opfsRoot.getFileHandle(args.path, {
		create: true,
	})
	const writable = await fileHandle.createWritable()
	await writable.write(args.blob)
	await writable.close()
}
