import React, { useEffect, useState } from "react"
import { createComponent } from "@lit/react"
import { InlangBundle } from "@inlang/bundle-component"
import { ProjectSettings2 } from "../../src/types/project-settings.js"
import { InlangProject } from "../../src/types/project.js"
import { LintReport } from "../../src/types/lint.js"
import { LanguageTag } from "../../src/types/language-tag.js"
import { NestedBundle } from "../../src/index.js"

export const MessageBundleComponent = createComponent({
	tagName: "inlang-bundle",
	elementClass: InlangBundle,
	react: React,
	events: {
		changeMessageBundle: "change-message-bundle",
		insertMessage: "insert-message",
		updateMessage: "update-message",

		insertVariant: "insert-variant",
		updateVariant: "update-variant",
		fixLint: "fix-lint",
	},
})
type MessageBundleViewProps = {
	bundle: NestedBundle // TODO SDK2 make SDK Bundle a reactive query that delivers the bundle instead
	// reports: Subject<LintReport[]>
	projectSettings: ProjectSettings2
	project: InlangProject
	filteredLocales: LanguageTag[]
}
function MessageBundleView({
	bundle,
	// reports,
	projectSettings,
	project,
	filteredLocales,
}: MessageBundleViewProps) {
	const [currentBundle, setBundle] = useState(bundle)

	console.log("render MessageBundle View")
	useEffect(() => {
		// Assume bundle$ is an RxJS Subject or Observable
		// const subscription = bundle.$.subscribe((updatedBundle) => {
		// 	console.log("updateing Bundle from subscribe", updatedBundle)
		// 	// Handle the bundle update
		// 	setBundle(updatedBundle)
		// })
		// return () => {
		// 	// Clean up the subscription when the component unmounts or when bundle changes
		// 	subscription.unsubscribe()
		// }
	}, [bundle])

	const onBundleChange = (messageBundle: { detail: { argument: NestedBundle } }) => {
		// eslint-disable-next-line no-console
		// TODO SDK-V2 check how we update the bundle in v2 sql
		// project.messageBundleCollection?.upsert(messageBundle.detail.argument)
	}

	const onMesageInsert = (event: { detail: { argument: NestedBundle } }) => {
		console.log("onMesageInsert", event)
	}
	const onMesageUpdate = (event: { detail: { argument: NestedBundle } }) => {
		console.log("onMesageUpdate", event)
	}
	const onVariantInsert = (event: { detail: { argument: NestedBundle } }) => {
		console.log("onVariantInsert", event)
	}
	const onVariantUpdate = (event: { detail: { argument: NestedBundle } }) => {
		console.log("onVariantUpdate", event)
	}

	return (
		<MessageBundleComponent
			key={bundle.id}
			bundle={currentBundle}
			settings={projectSettings}
			changeMessageBundle={onBundleChange as any}
			insertMessage={onMesageInsert as any}
			updateMessage={onMesageUpdate as any}
			insertVariant={onVariantInsert as any}
			updateVariant={onVariantUpdate as any}
			filteredLocales={filteredLocales.length > 0 ? filteredLocales : undefined}
			fixLint={(e: any) => {
				const { fix, lintReport } = e.detail.argument as {
					fix: string
					lintReport: LintReport
				}

				project.fix(lintReport, { title: fix })
			}}
		/>
	)
}
// Custom comparison function to compare the logical contents of the bundle
const areEqual = (prevProps: MessageBundleViewProps, nextProps: MessageBundleViewProps) => {
	console.log("check")
	// Assuming bundle has an id property to identify the logical record
	return (
		prevProps.bundle.id === nextProps.bundle.id && true // deepEqual(prevProps.filteredLocales, nextProps.filteredLocales)
	)
}
export const MessageBundleViewMemoed = React.memo(MessageBundleView, areEqual)