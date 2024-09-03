import { html, nothing } from "lit"
import { customElement, state } from "lit/decorators.js"
import { poll } from "./reactivity"
import { BaseElement } from "./baseElement"

@customElement("file-view")
export class FileView extends BaseElement {
	@state() files: any = []
	lix: any
	openFile: any
	view: any

	doOpen

	connectedCallback() {
		// @ts-ignore
		super.connectedCallback()
		poll(
			async () => {
				const result: any = await this.lix?.db.selectFrom("file").select(["id", "path"]).execute()

				if (result && result.length > 0) {
					for (const file of result) {
						const uncommittedChanges = await this.lix?.db
							.selectFrom("change")
							.select("id")
							.where("file_id", "=", file.id)
							.where("commit_id", "is", null)
							.execute()
						file.uncommittedChanges = uncommittedChanges!.length
					}
				}

				return result ?? []
			},
			(files) => {
				this.files = files
				if (!this.openFile && files.length > 0) {
					this.doOpen(files[0]?.path)
				}
			}
		)
	}

	render() {
		return html`
			<div class="h-full bg-[#edf0f7] justify-center items-start inline-flex">
				<div class="self-stretch pt-6 pb-2 flex-col justify-start items-start inline-flex">
					${this.files.map((file: any) => {
						const active = this.openFile === file.path || this.view === "review"

						return html`
							<div
								@click=${() => this.doOpen(file.path)}
								class="w-[258px] cursor-pointer px-4 py-3 ${active
									? "bg-[#9aafd5]"
									: ""} justify-start items-center gap-2.5 inline-flex"
							>
								<div
									class="grow shrink basis-0 text-[#2d3648] text-sm font-medium leading-normal"
									style="${active ? "font-weight: 800" : ""}"
								>
									${file.path}
								</div>

								${file.uncommittedChanges
									? html`
											<div
												class="grow shrink basis-0 text-right text-[#4b5466] text-sm font-medium leading-normal whitespace-nowrap"
											>
												${file.uncommittedChanges} unconfirmed changes
											</div>
									  `
									: nothing}
							</div>
						`
					})}
				</div>

				<div class="w-[1px] h-full bg-[#2d3648]"></div>
			</div>
		`
	}
}

// <div style="display: flex; gap: 1rem">
// 		<button
// 			@click=${async () => {
// 				const result = await this.lix?.db
// 					.selectFrom("file")
// 					.select("data")
// 					.where("path", "=", file.path)
// 					.executeTakeFirstOrThrow()
// 				const blob = new Blob([result!.blob])
// 				const url = URL.createObjectURL(blob)
// 				const a = document.createElement("a")
// 				a.href = url
// 				a.download = file.path
// 				a.click()
// 			}}
// 		>
// 			Download
// 		</button>
// 		<button
// 			@click=${async () => {
// 				await this.lix?.db
// 					.deleteFrom("file")
// 					.where("path", "=", file.path)
// 					.execute()
// 			}}
// 		>
// 			Delete
// 		</button>
// 	</div>
