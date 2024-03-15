const messageWithOptionRegex = /m\.\w+\(\s*[a-zA-Z_$][\w$]*\s*,\s*[a-zA-Z_$][\w$]*\s*\)/g

export function rewriteFile({
	content,
	targetLanguage,
}: {
	content: string
	path: string
	targetLanguage: string
}): string {
	return content.replaceAll("paraglide/messages", `paraglide/messages/${targetLanguage}`)
}
