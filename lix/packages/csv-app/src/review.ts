import { html } from "lit"
import { Task } from "@lit/task"
import { customElement, state, property } from "lit/decorators.js"
import { BaseElement } from "./baseElement"
import Papa from "papaparse"

// import { classMap } from "lit/directives/class-map.js"

@customElement("review-view")
export class Review extends BaseElement {
	@state() files: any = []
	lix: any
	@property() changes: any[] = []
	openFile: any
	@property() username: any
	@property() commitedChanges: any[] = []

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
		await this.lix?.commit({
			userId: this.username,
			// TODO unbundle description from commits
			description: "update",
		})
	}

	// updated(props): void {
	// 	if (props.has("lix")) {
	// 		this.getChangeData.run()
	// 	}
	// }

	render() {
		return html`
			${this.changes.length
				? html`<div
						style="width: 163px; height: 40px; padding-left: 12px; padding-right: 12px; padding-top: 8px; padding-bottom: 8px; background: #1D3158; border-radius: 6px; overflow: hidden; cursor: pointer; justify-content: center; align-items: center; gap: 8px; display: inline-flex; float: right; margin-right: 100px; "
						@click=${this.confirm}
				  >
						<div
							style="color: white; font-size: 14px; font-weight: 700; line-height: 24px; word-wrap: break-word"
						>
							Confirm ${this.changes.length} Changes
						</div>
				  </div>`
				: ""}
			${this.changes?.length
				? this.getChangeData.render({
						loading: () => html`<p>Loading...</p>`,

						error: (error) => html`<p>Error: ${error}</p>`,

						complete: (csvs) => {
							return html`<h2 style="margin-top: 60px;">Your unconfirmed Changes</h2>
								${renderChanges(this.changes, csvs, this.lix, this.undo)}`
						},
				  })
				: ""}

			<h2 style="margin-top: 60px;">Confirmed History</h2>

			${this.getChangeData.render({
				loading: () => html`<p>Loading...</p>`,

				error: (error) => html`<p>Error: ${error}</p>`,

				complete: (csvs) => {
					return renderChanges(this.commitedChanges, csvs, this.lix)
				},
			})}
		`
	}
}

function renderChanges(changes, csvs, lix, undo: any = null) {
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
											${!change.parent?.value.text ? "created:" : ""} ${row[field]}
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
				${undo
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
					: ""}
			</div>`
	})
}
