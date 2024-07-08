import type { Pattern } from "@inlang/sdk/v2"
import { LitElement, css, html } from "lit"
import { customElement, property, state } from "lit/decorators.js"
import { ref, createRef, type Ref } from "lit/directives/ref.js"
import { createEditor } from "lexical"
import { mergeRegister } from "@lexical/utils"
import { registerPlainText } from "@lexical/plain-text"
import { $getRoot, $getSelection, $createParagraphNode, $createTextNode } from "lexical"

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

	contentEditableElementRef: Ref<HTMLDivElement> = createRef()

	editor = createEditor(config)

	//props
	@property({ type: Array })
	pattern: Pattern | undefined

	override createRenderRoot() {
		return this
	}

	override async firstUpdated() {
		const contentEditableElement = this.contentEditableElementRef.value
		console.log("connected", { contentEditableElement })
		if (contentEditableElement) {
			//patchGetSelection()
			this.editor.setRootElement(contentEditableElement)
			registerPlainText(this.editor)

			this.editor.update(() => {
				// Get the RootNode from the EditorState
				const root = $getRoot()

				// Get the selection from the EditorState
				const selection = $getSelection()

				// Create a new ParagraphNode
				const paragraphNode = $createParagraphNode()

				// Create a new TextNode
				const textNode = $createTextNode("Hello world")

				// Append the text node to the paragraph
				paragraphNode.append(textNode)

				// Finally, append the paragraph to the root
				root.append(paragraphNode)
			})

			this.editor.registerTextContentListener((textContent) => {
				// The latest text content of the editor!
				console.log("content listener", { textContent })
			})
		}
	}

	// override async firstUpdated() {
	// 	await this.updateComplete
	// 	const contentEditableElement = document.getElementById("editable-div")
	// 	if (contentEditableElement) {
	// 		editorElement = this.shadowRoot
	// 		//patchGetSelection()
	// 		editor.setRootElement(contentEditableElement)
	// 		registerPlainText(editor)

	// 		editor.update(() => {
	// 			// Get the RootNode from the EditorState
	// 			const root = $getRoot()

	// 			// Get the selection from the EditorState
	// 			const selection = $getSelection()

	// 			// Create a new ParagraphNode
	// 			const paragraphNode = $createParagraphNode()

	// 			// Create a new TextNode
	// 			const textNode = $createTextNode("Hello world")

	// 			// Append the text node to the paragraph
	// 			paragraphNode.append(textNode)

	// 			// Finally, append the paragraph to the root
	// 			root.append(paragraphNode)
	// 		})

	// 		editor.registerTextContentListener((textContent) => {
	// 			// The latest text content of the editor!
	// 			console.log(textContent)
	// 		})
	// 	}
	// }

	override render() {
		return html`
			<div class="editor-wrapper">
				Test
				<div contenteditable ${ref(this.contentEditableElementRef)}></div>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"inlang-pattern-editor": InlangPatternEditor
	}
}

/**
 * Patch
 */

/**
 * We need to hack the window.getSelection method to use the shadow DOM,
 * since the mobiledoc editor internals need to get the selection to detect
 * cursor changes. First, we walk down into the shadow DOM to find the
 * actual focused element. Then, we get the root node of the active element
 * (either the shadow root or the document itself) and call that root's
 * getSelection method.
 */

export function patchGetSelection() {
	console.log("patch")
	const oldGetSelection = window.getSelection.bind(window)
	window.getSelection = (useOld: boolean = false) => {
		const activeElement = findActiveElementWithinShadow()
		const shadowRootOrDocument: ShadowRoot | Document = activeElement
			? (activeElement.getRootNode() as ShadowRoot | Document)
			: document

		try {
			const selection = (shadowRootOrDocument as any).getSelection()
			if (!selection || useOld) return oldGetSelection()
			return selection
		} catch (error) {
			if (error instanceof TypeError) {
				console.error("getSelection: Not working for safari and safari mobile")
				return getSelectionWithinShadow(activeElement as HTMLElement)
			}
			return oldGetSelection()
		}
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

export function getSelectionWithinShadow(element: HTMLElement): Selection {
	const range = document.createRange()
	range.setStart(element.firstChild || element, 0)
	range.setEnd(element.firstChild || element, 0)

	return {
		anchorNode: element,
		anchorOffset: 0,
		focusNode: element,
		focusOffset: 0,
		isCollapsed: true,
		rangeCount: 1,
		type: "Caret",
		addRange: () => {},
		collapse: () => {},
		collapseToEnd: () => {},
		collapseToStart: () => {},
		deleteFromDocument: () => {},
		empty: () => {},
		extend: () => {},
		getRangeAt: () => range,
		removeAllRanges: () => {},
		removeRange: () => {},
		selectAllChildren: () => {},
		setBaseAndExtent: () => {},
		setPosition: () => {},
		modify: () => {},
		containsNode: (node, allowPartialContainment) => true,
	}
}
