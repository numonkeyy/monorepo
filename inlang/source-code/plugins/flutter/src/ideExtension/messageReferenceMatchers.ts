/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Parsimmon from "parsimmon"

// Helper function to create the parser
const createParser = () => {
	return Parsimmon.createLanguage({
		entry: (r) => {
			return Parsimmon.alt(r.FunctionCall!, Parsimmon.any)
				.many()
				.map((matches) => {
					return matches.filter((match) => typeof match === "object")
				})
		},

		stringLiteral: (r) => {
			return Parsimmon.alt(r.doubleQuotedString!, r.singleQuotedString!)
		},

		doubleQuotedString: () => {
			return Parsimmon.string('"').then(Parsimmon.regex(/[^"]*/)).skip(Parsimmon.string('"'))
		},

		singleQuotedString: () => {
			return Parsimmon.string("'").then(Parsimmon.regex(/[^']*/)).skip(Parsimmon.string("'"))
		},

		FunctionCall: (r) => {
			return Parsimmon.seqMap(
				Parsimmon.regex(/[^a-zA-Z0-9]/), // no preceding letters or numbers
				Parsimmon.alt(
					Parsimmon.regex(/\bFlutterI18n\.(?:plural|translate)\b/),
					Parsimmon.regex(/\bI18n(?:Plural|Text)\b/)
				), // starts with FlutterI18n.translate, FlutterI18n.plural, I18nPlural, or I18nText
				Parsimmon.string("("), // then an opening parenthesis
				Parsimmon.index, // start position
				Parsimmon.regex(/\s*[^\s,]+/), // capture the first argument (buildContext or other)
				Parsimmon.string(",").then(Parsimmon.optWhitespace).then(r.stringLiteral!), // then the key
				Parsimmon.index, // end position
				Parsimmon.regex(/[^)]*/), // ignore the rest of the function call
				Parsimmon.string(")"), // end with a closing parenthesis
				(_, __, ___, start, ____, key, end) => {
					return {
						messageId: key,
						position: {
							start: {
								line: start.line,
								character: start.column,
							},
							end: {
								line: end.line,
								character: end.column,
							},
						},
					}
				}
			)
		},
	})
}

export function parse(sourceCode: string) {
	const parser = createParser()
	try {
		return parser.entry!.tryParse(sourceCode)
	} catch (error) {
		console.error("Parsing error:", error)
		return []
	}
}
