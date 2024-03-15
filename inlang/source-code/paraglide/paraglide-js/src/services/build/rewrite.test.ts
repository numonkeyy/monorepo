import { describe, it, expect } from "vitest"
import { rewriteFile } from "./rewrite.js"

describe("rewriteFile", () => {
	it("should replace imports from messages.js with imports from messages.{lang}.js", () => {
		const content = `
            import * as m from "paraglide/messages.js"
        `

		expect(rewriteFile({ content, path: "/", targetLanguage: "en" })).toContain(
			'import * as m from "paraglide/messages/en.js"'
		)

		expect(rewriteFile({ content, path: "/", targetLanguage: "de" })).toContain(
			'import * as m from "paraglide/messages/de.js"'
		)
	})

	it("should not replace imports if a message uses the { languageTag: 'lang' } option", () => {
		const inline = `
            import * as m from "paraglide/messages.js"
            m.my_message({}, { languageTag: "en" });
        `

		const indirect = `
            import * as m from "paraglide/messages.js"
            const options = { languageTag: "en" };
            m.my_message({}, options);
        `

		const asParam = `
            import * as m from "paraglide/messages.js"

            // this is OK
            m.my_message({ languageTag: "en" });
        `

		expect(rewriteFile({ content: inline, path: "/", targetLanguage: "en" })).not.toContain(
			'import * as m from "paraglide/messages/en.js"'
		)

		expect(rewriteFile({ content: indirect, path: "/", targetLanguage: "en" })).not.toContain(
			'import * as m from "paraglide/messages/en.js"'
		)

		expect(rewriteFile({ content: asParam, path: "/", targetLanguage: "en" })).toContain(
			'import * as m from "paraglide/messages/en.js"'
		)
	})
})
