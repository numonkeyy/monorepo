// ensure_OPRAL_upper_case

import type { MessageBundleLintRule } from "../types/lint.js"

type Fixes = {
	title: `Fix spelling of ${string}`
}

const id = "messageBundleLintRule.inlangdev.enforceCapitalization"

const enforceCapitalization: MessageBundleLintRule = {
	id: id,
	displayName: "Ensure brand names are properly capitalized",
	description: "Warns if words are not properly capitalized",

	run: ({ report, messageBundle }) => {
		const words = ["OPRAL", "Inlang", "SvelteKit"] //(settings[id]?.words || []) as string[]
		const regexes: [string, RegExp][] = words.map((word) => [
			word,
			new RegExp(`\\b${word}\\b`, "gi"),
		])

		for (const message of messageBundle.messages) {
			for (const variant of message.variants) {
				const text = variant.pattern
					.filter((el): el is Extract<typeof el, { type: "text" }> => el.type === "text")
					.reduce((acc, el) => acc + el.value, "")

				const misspelledWords = []

				for (const [word, regex] of regexes) {
					const matches = text.match(regex)
					if (!matches) continue
					const badMatches = matches.filter((match) => match !== word)
					if (badMatches.length === 0) continue
					misspelledWords.push(word)
				}

				if (misspelledWords.length === 0) continue

				const fixes: Fixes[] = misspelledWords.map((word) => ({
					title: `Fix spelling of ${word}`,
				}))

				report({
					body: `The word(s) ${misspelledWords.join(", ")} are not properly capitalized.`,
					messageBundleId: messageBundle.id,
					messageId: message.id,
					variantId: variant.id,
					locale: message.locale,
					fixes: fixes,
				})
			}
		}
	},
	fix: async ({ report, fix, messageBundle }) => {
		const word = fix.title.slice("Fix spelling of ".length)
		if (!word) return messageBundle

		const regex = new RegExp(`\\b${word}\\b`, "gi")

		if (!report.variantId || !report.messageId)
			throw new Error("report must have variantId and messageId")

		const msg = messageBundle.messages.find((msg) => msg.id === report.messageId)
		if (!msg) throw new Error(`message ${report.messageId} not found on bundle ${messageBundle.id}`)

		const variant = msg.variants.find((variant) => variant.id === report.variantId)
		if (!variant) throw new Error(`variant ${report.variantId} not found on message ${msg.id}`)

		variant.pattern = variant.pattern.map((el) => {
			if (el.type !== "text") return el
			el.value = el.value.replaceAll(regex, word)
			return el
		})

		return messageBundle
	},
}

export default enforceCapitalization
