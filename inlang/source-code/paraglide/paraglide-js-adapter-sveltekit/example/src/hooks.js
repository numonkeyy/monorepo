import { i18n } from "$lib/i18n"
import { dev } from "$app/environment"

/** @type {import("@sveltejs/kit").Reroute} */
export const reroute = dev ? i18n.reroute() : () => {}
