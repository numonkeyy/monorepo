# Philosophy

## Lean
We want ParaglideJS itself to stay as minimal as possible. It's job is to render strings in a Webapp. We purpousefully omit features that aren't crucial, such as:

- Localised routing
- Namespaces
- Reactivity

These features may be provided in companion libraries, such as [Paraglide-Next](https://inlang.com/m/osslbuzt/paraglide-next-i18n), but we do not aim to include them in ParaglideJS itself. 

## Organization-Free
Paraglide should never require you to organize your messages in order to achieve best results. This includes: 

- Sorting your messages into Namespaces
- Grouping messages for loading
- Agreeing with other contributors on how to organize your messages

Messages are ephemoral. They get created, edited and deleted at will. The need for organisation is an inefficiency we aim to eliminate. Creating, editing and finding messages is a job for tools, not convention. 

This of course doesn't _prevent_ you from having naming-conventions, but paraglide will not enforce or endorse doing so. 

## Tooling Ecosystem




## Environment Independent

Paraglide's output should be isomorphic, meaning it can be used on both the server and the client. 

It should be standalone. It shouldn't requre any additional dependencies, which would tie you to a package manager.

The output is etirely file-based and written to disk, not tieing you to any specific bundler or ecosystem. 

## Optimized for the Modern Web