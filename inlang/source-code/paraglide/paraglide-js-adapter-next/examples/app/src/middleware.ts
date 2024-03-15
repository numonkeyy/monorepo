import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { isAvailableLanguageTag, sourceLanguageTag } from "./paraglide/runtime"

export async function middleware(request: NextRequest) {
	const localisedPathname = decodeURI(request.nextUrl.pathname)

	if (localisedPathname.startsWith("/_next") || localisedPathname === "/favicon.png")
		return NextResponse.next()

	const maybeLang = localisedPathname.split("/")[1]

	const lang = isAvailableLanguageTag(maybeLang) ? maybeLang : sourceLanguageTag
	const headers = new Headers(request.headers)
	headers.set("x-language-tag", lang)

	const pathWithoutLanguage =
		(isAvailableLanguageTag(maybeLang)
			? localisedPathname.split("/").filter(Boolean).slice(1).join("/")
			: localisedPathname.split("/").filter(Boolean).join("/")) ?? "/"
	const pathWithLanguage = `/${lang}/${pathWithoutLanguage}`

	return NextResponse.rewrite(new URL(pathWithLanguage, request.url), { headers })
}
