export default {
	rules: {
		"no-restricted-imports": [
			"error",
			{
				name: "next/link",
				message: "[paraglide-next] Please import { Link } from `@/lib/i18n` instead.",
			},
			{
				name: "next/navigation",
				importNames: ["useRouter", "usePathname", "redirect", "permanentRedirect"],
				message:
					"[paraglide-next] Please import { useRouter, usePathname, redirect, permanentRedirect } from `@/lib/i18n` instead.",
			},
		],
	},
}
