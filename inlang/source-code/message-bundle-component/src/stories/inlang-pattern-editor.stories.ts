import "./inlang-pattern-editor.ts"
import type { Meta, StoryObj } from "@storybook/web-components"
import { html } from "lit"
import { pluralBundle } from "@inlang/sdk/v2-mocks"

const meta: Meta = {
	component: "inlang-pattern-editor",
	title: "Public/inlang-pattern-editor",
}

export default meta

export const Simple: StoryObj = {
	render: () =>
		html`<inlang-pattern-editor
			.pattern=${pluralBundle.messages[0].variants[2].pattern}
		>
            <div contenteditable slot="editable-div"><div>
        </inlang-pattern-editor>`,
}
