import { it, expect } from "vitest"
import { parse } from "./messageReferenceMatchers.js"

it('should detect FlutterI18n.translate("key")', async () => {
	const sourceCode = `
    const x = FlutterI18n.translate(buildContext, "some-key")
    `
	const matches = parse(sourceCode)
	expect(matches).toHaveLength(1)
	expect(matches[0]?.messageId).toBe("some-key")
	expect(matches[0]?.position.start.line).toBe(2)
	expect(matches[0]?.position.start.character).toBe(37)
	expect(matches[0]?.position.end.line).toBe(2)
	expect(matches[0]?.position.end.character).toBe(61)
})

it('should detect FlutterI18n.plural("key")', async () => {
	const sourceCode = `
    const x = FlutterI18n.plural(buildContext, "some-key")
    `
	const matches = parse(sourceCode)
	expect(matches).toHaveLength(1)
	expect(matches[0]?.messageId).toBe("some-key")
	expect(matches[0]?.position.start.line).toBe(2)
	expect(matches[0]?.position.start.character).toBe(34)
	expect(matches[0]?.position.end.line).toBe(2)
	expect(matches[0]?.position.end.character).toBe(58)
})

it('should detect I18nText("key")', async () => {
	const sourceCode = `
    const x = I18nText("some-key")
    `
	const matches = parse(sourceCode)
	expect(matches).toHaveLength(1)
	expect(matches[0]?.messageId).toBe("some-key")
	expect(matches[0]?.position.start.line).toBe(2)
	expect(matches[0]?.position.start.character).toBe(24)
	expect(matches[0]?.position.end.line).toBe(2)
	expect(matches[0]?.position.end.character).toBe(34)
})

it('should detect I18nPlural("key")', async () => {
	const sourceCode = `
    const x = I18nPlural("some-key")
    `
	const matches = parse(sourceCode)
	expect(matches).toHaveLength(1)
	expect(matches[0]?.messageId).toBe("some-key")
	expect(matches[0]?.position.start.line).toBe(2)
	expect(matches[0]?.position.start.character).toBe(26)
	expect(matches[0]?.position.end.line).toBe(2)
	expect(matches[0]?.position.end.character).toBe(36)
})

it("should not match a function that does not correspond to a Flutter localization function", async () => {
	const sourceCode = `
    const x = someOtherFunction("some-key")
    `
	const matches = parse(sourceCode)
	expect(matches).toHaveLength(0)
})

it("should not match a function that ends with t but is not a Flutter localization function", async () => {
	const sourceCode = `
    const x = somet("some-key")
    `
	const matches = parse(sourceCode)
	expect(matches).toHaveLength(0)
})

it("should match multiple localization function calls in a single source", async () => {
	const sourceCode = `
    const x = FlutterI18n.translate(buildContext, "key-one")
    const y = I18nText("key-two")
    `
	const matches = parse(sourceCode)
	expect(matches).toHaveLength(2)
	expect(matches[0]?.messageId).toBe("key-one")
	expect(matches[0]?.position.start.line).toBe(2)
	expect(matches[0]?.position.start.character).toBe(15)
	expect(matches[0]?.position.end.line).toBe(2)
	expect(matches[0]?.position.end.character).toBe(58)
	expect(matches[1]?.messageId).toBe("key-two")
	expect(matches[1]?.position.start.line).toBe(3)
	expect(matches[1]?.position.start.character).toBe(15)
	expect(matches[1]?.position.end.line).toBe(3)
	expect(matches[1]?.position.end.character).toBe(34)
})
