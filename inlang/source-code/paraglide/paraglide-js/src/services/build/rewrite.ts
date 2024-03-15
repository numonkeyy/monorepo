/**
 * Matches an `m` function that has two arguments, even if they're inlined with curly braces.
 * It may have some false positives, but that's ok
 *
 * @example
 *  ✓ m.my_message({}, { languageTag: 'en' });
 *  ✓ m.my_message(params, options);
 *  ✓ m.my_message({}, options);
 *  X m.my_message({ languageTag: 'en' });
 */
const messageWithOptionRegex =
	/m\.\w+\(\s*([a-zA-Z_$][\w$]*|{[^}]*})\s*,\s*([a-zA-Z_$][\w$]*|{[^}]*})\s*\)/g

/**
 * Matches paraglide/messages(.js) imports, but not paraglide/messages.{lang}(.js)
 */
const matchMessageIndexImport = /paraglide\/messages[^/]/g

export function rewriteFile({
	content,
	targetLanguage,
}: {
	content: string
	path: string
	targetLanguage: string
}): string {
	if (content.match(messageWithOptionRegex)) {
		return content
	}

	const matches = content.match(matchMessageIndexImport) ?? []
	for (const match of matches) {
		const path = match.replace("paraglide/messages", "paraglide/messages/" + targetLanguage)
		content = content.replace(match, path)
	}
	return content
}
