import type { TemplateResult } from "lit"
import { html } from "lit"
import { customElement } from "lit/decorators.js"
import { TwLitElement } from "../common/TwLitElement.js"

@customElement("inlang-uninstall")
export class InlangInstall extends TwLitElement {
	override render(): TemplateResult {
		return html`<div class="w-full h-full flex inset-0 bg-black/50"></div>`
	}
}
