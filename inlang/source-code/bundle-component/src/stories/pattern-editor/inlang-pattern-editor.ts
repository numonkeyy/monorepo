import type { Pattern } from "@inlang/sdk/v2"
import { LitElement, css, html } from "lit"
import { customElement, property } from "lit/decorators.js"
import { ref, createRef, type Ref } from "lit/directives/ref.js"
import { createEditor } from "lexical"
import { registerPlainText } from "@lexical/plain-text"
import { $getRoot, $getSelection, $createParagraphNode, $createTextNode } from "lexical"
import patternToString from "../../helper/crud/pattern/patternToString.js"
import stringToPattern from "../../helper/crud/pattern/stringToPattern.js"

//editor config
const config = {
	namespace: "MyEditor",
	onError: console.error,
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

	// refs
	contentEditableElementRef: Ref<HTMLDivElement> = createRef()

	// props
	@property({ type: Array })
	pattern: Pattern | undefined

	// dispatch `change-pattern` event with the new pattern
	dispatchOnChangePattern(pattern: Pattern) {
		const onChangePattern = new CustomEvent("change-pattern", {
			detail: {
				argument: pattern,
			},
		})
		this.dispatchEvent(onChangePattern)
	}

	//disable shadow root -> because of contenteditable selection API
	override createRenderRoot() {
		return this
	}

	// create editor
	editor = createEditor(config)

	override async firstUpdated() {
		const contentEditableElement = this.contentEditableElementRef.value
		if (contentEditableElement) {
			// set root element of editor and register plain text
			this.editor.setRootElement(contentEditableElement)
			registerPlainText(this.editor)

			// initiallize editor with pattern from varinat
			this.editor.update(() => {
				const root = $getRoot()
				const paragraphNode = $createParagraphNode()
				const textNode = $createTextNode(
					this.pattern ? patternToString({ pattern: this.pattern }) : ""
				)
				paragraphNode.append(textNode)
				root.append(paragraphNode)
			})

			// listen to text content changes and dispatch `change-pattern` event
			this.editor.registerTextContentListener((textContent) => {
				// The latest text content of the editor!
				this.dispatchOnChangePattern(stringToPattern({ text: textContent }))
			})
		}
	}

	override render() {
		return html`
			<style>
				div {
					box-sizing: border-box;
					font-size: 13px;
				}
				p {
					margin: 0;
				}
				.inlang-pattern-editor-wrapper {
					background-color: #ffffff;
					padding: 14px 12px;
					min-height: 44px;
					width: 100%;
					color: #242424;
				}
				.inlang-pattern-editor-wrapper:hover {
					background-color: #f9f9f9;
					color: #000;
				}
				inlang-pattern-editor {
					width: 100%;
				}
			</style>
			<div
				class="inlang-pattern-editor-wrapper"
				contenteditable
				${ref(this.contentEditableElementRef)}
			></div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"inlang-pattern-editor": InlangPatternEditor
	}
}
