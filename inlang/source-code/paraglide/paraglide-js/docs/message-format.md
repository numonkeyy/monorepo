# Working with the Inlang Message Format

Paraglide is part of the highly modular Inlang Ecosystem which supports many different Message Formats. By default, the [Inlang Message Format](https://inlang.com/m/reootnfj/plugin-inlang-messageFormat) is used. 

It expects messages to be in `messages/{lang}.json` relative to your repo root.

```json
//messages/en.json
{
	//the $schema key is automatically ignored 
	"$schema": "https://inlang.com/schema/inlang-message-format",
	"hello_world: "Hello World!",
	"greeting": "Hello {name}!"
}
```

The `messages/{lang}.json` file contains a flat map of message IDs and their translations. You can use curly braces to insert `{parameters}` into translations

**Nesting purposely isn't supported and likely won't be**. Nested messages are way harder to interact with from complementary tools like the [Sherlock IDE Extension](https://inlang.com/m/r7kp499g/app-inlang-ideExtension), the [Parrot Figma Plugin](https://inlang.com/m/gkrpgoir/app-parrot-figmaPlugin), or the [Fink Localization editor](https://inlang.com/m/tdozzpar/app-inlang-finkLocalizationEditor). Intellisense also becomes less helpful since it only shows the messages at the current level, not all messages. Additionally enforcing an organization-style side-steps organization discussions with other contributors. 

## Complex Formatting

The Message Format is still quite young, so advanced formats like plurals, param-formatting, and markup interpolation are currently not supported but are all on our roadmap.

If you need complex formatting, like plurals, dates, currency, or markup interpolation you can achieve them like so:

For a message with multiple cases, aka a _select message_, you can define a message for each case & then use a Map in JS to index into it.

```ts
import * as m from "./paraglide/messages.js"

const season = {
	spring: m.spring,
	summer: m.summer,
	autumn: m.autumn,
	winter: m.winter,
} as const

const msg = season["spring"]() // Hello spring!
```

For date & currency formatting use the `.toLocaleString` method on the `Date` or `Number`.

```ts
import * as m from "./paraglide/messages.js"
import { languageTag } from "./paraglide/runtime.js"

const todaysDate = new Date();
m.today_is_the({ 
	date: todaysDate.toLocaleString(languageTag()) 
})

const price = 100;
m.the_price_is({
	price: price.toLocaleString(languageTag(), {
		style: "currency",
		currency: "EUR",
	})
})
```

You can put HTML into the messages. This is useful for links and images. 

```json
// messages/en.json
{
	"you_must_agree_to_the_tos": "You must agree to the <a href='/en/tos'>Terms of Service</a>."
}
```
```json
// messages/de.json
{
	you_must_agree_to_the_tos": "Sie müssen den <a href='/de/agb'>Nutzungsbedingungen</a> zustimmen."
}
```

There is currently no way to interpolate full-blown components into the messages. If you require components mid-message you will need to create a one-off component for that bit of text.
