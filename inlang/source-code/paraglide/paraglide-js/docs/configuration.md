## Configuration
Most of the configuration is done in `./project.inlang/settings.json`, except for paraglide's output directory, which needs to be passed in when calling the compiler.

## Languages

You can declare which languages you support in the `languageTags` array.

```json
// project.inlang/settings.json
{
	"languageTags": ["en", "de"]
}
```

Create the corresponding `messages/{lang}.json` files and get translating!

## Moving the Translation Files

If you want your language files to be in a different location you can change the `pathPattern` of the [Inlang-Message-Format plugin](https://inlang.com/m/reootnfj/plugin-inlang-messageFormat).

```diff
// project.inlang/settings.json
{
	"plugin.inlang.messageFormat": {
-		"pathPattern": "./messages/{languageTag}.json"
+		"pathPattern": "./i18n/{languageTag}.json"
	}
}
```

## Moving the Output Directory

This depends on _how_ the paragldie compiler is being called. 

If you're calling via the CLI, add a `--outdir` flag to the command to change the destination. If you're using a bundler / framework plugin, then the outdir will be configured in your bundler settings.