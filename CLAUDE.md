# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

This is a greenfield project. The repository currently contains only a stub
`README.md`; the extension source described below is the agreed design and has
yet to be implemented. When implementing, follow the
architecture in this file rather than reaching for the existing
`markdown-it-criticmarkup` npm package — that package is pinned to markdown-it
^8 (VSCode bundles 14) and pulls in unneeded KaTeX/footnote dependencies.

## What this is

A VSCode extension that renders [CriticMarkup](http://criticmarkup.com/) in
VSCode's **built-in** Markdown preview. There is no custom webview and no build
step — the extension hooks the markdown-it instance the preview already uses.

## Architecture

The single integration point is VSCode's `markdown.markdownItPlugins`
contribution point. The flow:

1. `package.json` declares `contributes.markdown.markdownItPlugins: true` and
   registers `contributes.markdown.previewStyles` (the CSS for the rendered
   tags).
2. The extension's `activate()` returns an object exposing
   `extendMarkdownIt(md)`. VSCode calls this with its live markdown-it instance
   and the extension registers the plugin via `md.use(...)`.
3. The plugin adds an **inline rule** (`md.inline.ruler.before('emphasis', ...)`)
   that matches CriticMarkup spans and pushes real markdown-it tokens.

Three files, no transpilation: `package.json`, `extension.js`, `critic.css`.
`main` points directly at `extension.js`.

### Why an inline rule (not a core/text-replacement pass)

This is the key design decision. A pre-pass that rewrites `state.src` (a `core`
rule) would also rewrite CriticMarkup-like characters **inside code fences**. An
inline rule by construction does not run inside code blocks and naturally
supports nested Markdown within the span.

Because the rule emits real tokens (`*_open` / `*_close`) rather than a raw
`html_inline` block, rendering works regardless of the preview's `html` option.

### CriticMarkup → token mapping

| Syntax | Rendered as | Meaning |
| --- | --- | --- |
| `{++ … ++}` | `<ins class="critic-ins">` | insertion |
| `{-- … --}` | `<del class="critic-del">` | deletion |
| `{== … ==}` | `<mark class="critic-mark">` | highlight |
| `{>> … <<}` | `<span class="critic-comment">` | comment |
| `{~~ old ~> new ~~}` | `<del class="critic-del">old</del><ins class="critic-ins">new</ins>` | substitution |

Span bodies are re-parsed as inline Markdown so nested formatting is preserved.

## Developing / testing

No build, lint, or unit-test tooling is set up. Test interactively:

1. Open the extension folder in VSCode and press `F5` to launch the Extension
   Development Host.
2. Open a `.md` file containing CriticMarkup.
3. Open the preview with `Ctrl+Shift+V` (`Cmd+Shift+V` on macOS).

The extension activates lazily on the first preview render.
