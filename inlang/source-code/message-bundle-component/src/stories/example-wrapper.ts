import { LitElement, html } from "lit"
import { customElement } from "lit/decorators.js"

@customElement("example-wrapper")
export class ExampleWrapper extends LitElement {
	override render() {
		return html`<div>
			<hr />
			<slot></slot>
			<hr />
		</div>`
	}
}
