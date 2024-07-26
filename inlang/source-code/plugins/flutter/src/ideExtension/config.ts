import type { CustomApiInlangIdeExtension, Plugin } from "@inlang/plugin"
import { parse } from "./messageReferenceMatchers.js"

export const ideExtensionConfig = (): ReturnType<Exclude<Plugin["addCustomApi"], undefined>> => ({
	"app.inlang.ideExtension": {
		messageReferenceMatchers: [
			async (args: { documentText: string }) => {
				return parse(args.documentText)
			},
		],
		extractMessageOptions: [
			{
				callback: (args: { messageId: string }) => {
					return {
						messageId: args.messageId,
						messageReplacement: `FlutterI18n.translate(buildContext, "${args.messageId}")`,
					}
				},
			},
			{
				callback: (args: { messageId: string }) => {
					return {
						messageId: args.messageId,
						messageReplacement: `FlutterI18n.plural(buildContext, "${args.messageId}")`,
					}
				},
			},
			{
				callback: (args: { messageId: string }) => {
					return {
						messageId: args.messageId,
						messageReplacement: `I18nText("${args.messageId}")`,
					}
				},
			},
			{
				callback: (args: { messageId: string }) => {
					return {
						messageId: args.messageId,
						messageReplacement: `I18nPlural("${args.messageId}")`,
					}
				},
			},
			{
				callback: (args: { messageId: string }) => {
					return {
						messageId: args.messageId,
						messageReplacement: args.messageId,
					}
				},
			},
		],
		documentSelectors: [{ language: "dart" }],
	} satisfies CustomApiInlangIdeExtension,
})
