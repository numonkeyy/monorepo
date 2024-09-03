import { html } from "lit"
import { Task } from "@lit/task"
import { customElement, state, property } from "lit/decorators.js"
import { BaseElement } from "./baseElement"
import Papa from "papaparse"
// import { classMap } from "lit/directives/class-map.js"

@customElement("incoming-view")
export class Incoming extends BaseElement {
	@state() files: any = []
	@property() lix: any
	@property() tempLix: any
	@property() changes: any[] = []
	openFile: any
	@property() username: any
	@property() commitedChanges: any[] = []

	@property() incomingChanges: any[] = []
	@property() conflictingChanges: any[] = []

	@property() resetIncomming = () => {}

	@state() winners: {} = {}

	getChangeData = new Task(this, {
		args: () => [],
		task: async () => {
			const results = await this.lix?.db
				.selectFrom("file")
				.select(["id", "data", "path"])
				// .where("path", "=", this.openFile!)
				.orderBy("path", "asc")
				.execute()
			// this.fileId = result!.id

			return results.map((result) => {
				const decoder = new TextDecoder()
				const str = decoder.decode(result!.data)
				return { ...result, csv: Papa.parse(str, { header: true }) }
			})
		},
	})

	async undo(change) {
		// await this.lix?.deleteChange({
	}

	async confirm() {
		for (const change of [...this.incomingChanges, ...this.conflictingChanges]) {
			const file = await this.lix.db
				.selectFrom("file")
				.selectAll()
				// todo fix changes for one plugin can belong to different files
				.where(
					"id",
					"=",
					// todo handle multiple files
					change.file_id
				)
				.executeTakeFirst()

			let winner

			if (change.conflict) {
				if (this.winners[change.conflict.id]) {
					winner = change.conflict
				} else {
					winner = change
				}
			} else {
				winner = change
			}

			const { fileData } = await this.lix.plugins[0].applyChanges({
				changes: [winner],
				file,
				lix: this.lix,
			})

			await this.lix?.db.transaction().execute(async (trx) => {
				await trx
					.updateTable("file")
					.set({
						data: fileData,
					})
					.where("id", "=", change.file_id)
					.execute()
			})
		}

		await this.lix.settled()

		await this.lix?.commit({
			userId: this.username,
			// TODO unbundle description from commits
			description: "merge",
		})

		await this.resetIncomming()
	}

	// updated(props): void {
	// 	if (props.has("lix")) {
	// 		this.getChangeData.run()
	// 	}
	// }

	render() {
		const self = this
		function renderChanges(changes, csvs, lix, tempLix, undo: any = null) {
			return changes.map((change) => {
				const csv = csvs.find((csv) => csv.id === change.file_id).csv

				const row = csv.data.find((row) => {
					const rowId = lix.plugins[0].getId(row)
					return change.value.id.startsWith(rowId)
				})

				return html`<div
						style="color: #000; margin-top: 60px;
						font-feature-settings: 'calt' off;
						font-size: 16px;
						font-style: normal;
						font-weight: 700;
						line-height: 24px; /* 150% */
						letter-spacing: -0.16px;"
					>
						${change.created_at}
					</div>
					<div style="display: flex; gap: 42px;">
						<table>
							<thead>
								<tr>
									${csv.meta.fields!.map((field) => html`<th>${field}</th>`)}
								</tr>
							</thead>
							<tbody>
								<tr>
									${csv.meta.fields!.map((field) => {
										// const cellId =lix.plugins[0].getId(row) + field

										// const uncommittedChanges =uncommittedChanges.filter(
										// 	(change) => change.value?.id === cellId
										// )
										// const conflicts =conflicts.filter(
										// 	(change) => change.value.id === cellId
										// )
										// const hasUncommittedChanges = uncommittedChanges.length > 0
										// const hasConflicts = conflicts.length > 0

										// const changes =changes.filter((change) => change.value?.id === cellId)

										// const hasChanges = changes.length > 0

										if (change.value.column === field) {
											return html`<td>
												${change.parent?.value.text
													? html`<div class="flex px-6 py-4 text-red-700 line-through">
															${change.parent?.value.text}
													  </div>`
													: ""}

												<div class="flex px-6 py-4 text-green-700">
													${change.conflict
														? self.winners[change.conflict.id]
															? html`
																	<div class="p-2 border-solid border-green-500">
																		winner: ${change.conflict.value.text}
																	</div>
																	<div class="p-2 border-dashed border-green-500">
																		${change.value.text}
																		<button
																			@click=${() => {
																				delete self.winners[change.conflict.id]
																			}}
																		>
																			choose instread
																		</button>
																	</div>
															  `
															: html`
																	<div class="p-2 border-dashed border-green-500">
																		${change.conflict.value.text}
																		<button
																			@click=${() => {
																				self.winners[change.conflict.id] = true
																			}}
																		>
																			choose instread
																		</button>
																	</div>
																	<div class="p-2 border-solid border-green-500">
																		winner: ${change.value.text}
																	</div>
															  `
														: change.value.text}
												</div>
											</td>`
										}

										return html`<td>
											<div class="flex px-6 py-4">${row[field]}</div>
										</td>`
									})}
								</tr>
							</tbody>
						</table>
						 ${
								undo && !change.conflict
									? html`<div
											@click=${() => {
												// @ts-ignore
												row[change.value.column] = change.parent?.value?.text || ""
												// manually saving file to lix
												console.log(row)
												lix?.db
													.updateTable("file")
													.set({
														data: new TextEncoder().encode(Papa.unparse(csv.data)),
													})
													.where("id", "=", change.file_id!)
													.execute()
											}}
											style="cursor: pointer; width: 56px; height: 32px; padding-left: 8px; padding-right: 8px; padding-top: 4px; padding-bottom: 4px; border-radius: 6px; overflow: hidden; border: 2px #2D3648 solid; justify-content: center; align-items: center; gap: 8px; display: inline-flex; margin-top: 23px;"
									  >
											<div
												style="color: #2D3648; font-size: 16px; font-weight: 700; line-height: 24px; word-wrap: break-word"
											>
												undo
											</div>
									  </div>`
									: ""
							}
		</div>
		
					</div>
			
					`
			})
		}

		return html`
			<div
				style="width: 163px; height: 40px; padding-left: 12px; padding-right: 12px; padding-top: 8px; padding-bottom: 8px; background: #1D3158; border-radius: 6px; overflow: hidden; cursor: pointer; justify-content: center; align-items: center; gap: 8px; display: inline-flex; float: right; margin-right: 100px; "
				@click=${this.confirm}
			>
				<div
					style="color: white; font-size: 14px; font-weight: 700; line-height: 24px; word-wrap: break-word"
				>
					Apply ${this.incomingChanges.length + this.conflictingChanges.length} Changes
				</div>
			</div>

			${this.conflictingChanges?.length
				? this.getChangeData.render({
						loading: () => html`<p>Loading...</p>`,

						error: (error) => html`<p>Error: ${error}</p>`,

						complete: (csvs) => {
							return html`<h2 style="margin-top: 60px;">Conflicts</h2>
								${renderChanges(this.conflictingChanges, csvs, this.lix, this.tempLix, this.undo)} `
						},
				  })
				: ""}
			${this.incomingChanges?.length
				? this.getChangeData.render({
						loading: () => html`<p>Loading...</p>`,

						error: (error) => html`<p>Error: ${error}</p>`,

						complete: (csvs) => {
							return html`<h2 style="margin-top: 60px;">Incomming Changes</h2>
								${renderChanges(this.incomingChanges, csvs, this.lix, this.tempLix, this.undo)}`
						},
				  })
				: ""}
		`
	}
}

// <p style="    white-space: pre-wrap;">${JSON.stringify(change, null, 2)}</p>
