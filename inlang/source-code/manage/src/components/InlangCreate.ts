import type { TemplateResult } from "lit"
import { html } from "lit"
import { customElement } from "lit/decorators.js"
import { TwLitElement } from "../common/TwLitElement.js"

@customElement("inlang-create")
export class InlangCreate extends TwLitElement {
	override render(): TemplateResult {
		return html`<div
			class="w-full h-full flex fixed z-[99] inset-0 bg-black/50 justify-center items-center"
		>
			<div class="w-[400px] h-[400px] bg-white rounded-lg shadow-lg flex flex-col p-8">
				<h1 class="text-xl font-bold mb-4">Create a new project</h1>
			</div>
		</div>`
	}
}
