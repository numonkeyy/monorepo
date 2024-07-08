import "./inlang-pattern-editor.ts"
import type { Meta, StoryObj } from "@storybook/web-components"
import { LitElement, html } from "lit"
import { pluralBundle } from "@inlang/sdk/v2-mocks"
import { customElement } from "lit/decorators.js"
import "./example-wrapper.ts"

const meta: Meta = {
	component: "inlang-pattern-editor",
	title: "Public/inlang-pattern-editor",
}

export default meta

export const Simple: StoryObj = {
	render: () =>
		html`
			<inlang-pattern-editor .pattern=${pluralBundle.messages[0].variants[2].pattern}>
			</inlang-pattern-editor>
			<!-- <example-wrapper>
				<example-wrapper>
					<example-wrapper>
						<inlang-pattern-editor .pattern=${pluralBundle.messages[0].variants[2].pattern}>
						</inlang-pattern-editor>
					</example-wrapper>
				</example-wrapper>
			</example-wrapper> -->
		`,
}
