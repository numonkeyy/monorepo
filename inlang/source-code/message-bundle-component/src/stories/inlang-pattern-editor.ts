import type { Pattern } from "@inlang/sdk/v2"
import { LitElement, css, html } from "lit"
import { customElement, property } from "lit/decorators.js"
import Quill from "quill"

const options = {
	debug: "info",
	modules: {
		toolbar: true,
	},
	placeholder: "Compose an epic...",
	theme: "snow",
}

@customElement("inlang-pattern-editor")
export default class InlangPatternEditor extends LitElement {
	static override styles = [
		css`
			.editor-wrapper {
				background-color: #f0f0f0;
			}
		`,
	]

	//props
	@property({ type: Array })
	pattern: Pattern | undefined

	override async firstUpdated() {
		await this.updateComplete
		const contentEditableElement = this.shadowRoot?.getElementById("quillEditor")
		if (contentEditableElement) {
			const quill = new Quill(contentEditableElement, options)

			document.addEventListener("selectionchange", (...args) => {
				//quill.selection.update()
			})
		}
	}

	override render() {
		return html`
			<link href="https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.snow.css" rel="stylesheet" />
			<div id="quillEditor">
				<p>Hello World!</p>
				<p>Some initial <strong>bold</strong> text</p>
				<p><br /></p>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"inlang-pattern-editor": InlangPatternEditor
	}
}

export function patchGetSelection() {
	const oldGetSelection = window.getSelection.bind(window)
	window.getSelection = (useOld: boolean = false) => {
		const activeElement = findActiveElementWithinShadow()
		const shadowRootOrDocument: ShadowRoot | Document = activeElement
			? (activeElement.getRootNode() as ShadowRoot | Document)
			: document
		const selection = (shadowRootOrDocument as any).getSelection()

		if (!selection || useOld) return oldGetSelection()
		return selection
	}
}

/**
 * Recursively walks down the DOM tree to find the active element within any
 * shadow DOM that it might be contained in.
 */
function findActiveElementWithinShadow(
	element: Element | null = document.activeElement
): Element | null {
	if (element?.shadowRoot) {
		return findActiveElementWithinShadow(element.shadowRoot.activeElement)
	}
	return element
}
