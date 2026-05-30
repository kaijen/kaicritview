# CriticMarkup Preview (kaicritview)

A small VSCode extension that renders [CriticMarkup](http://criticmarkup.com/)
in VSCode's **built-in** Markdown preview. There is no custom webview and no
build step — the extension hooks the markdown-it instance the preview already
uses, so it stays fast and works with every preview theme.

## Supported syntax

| Syntax | Rendered as | Meaning |
| --- | --- | --- |
| `{++ … ++}` | <ins>insertion</ins> | insertion |
| `{-- … --}` | <del>deletion</del> | deletion |
| `{== … ==}` | <mark>highlight</mark> | highlight |
| `{>> … <<}` | comment | editor comment |
| `{~~ old ~> new ~~}` | <del>old</del><ins>new</ins> | substitution |

Span bodies are re-parsed as inline Markdown, so nested formatting such as
`{++ **bold** text ++}` is preserved. CriticMarkup inside inline code or fenced
code blocks is left untouched.

## Installation

### From source (development)

1. Clone this repository:
   ```bash
   git clone https://github.com/kaijen/kaicritview.git
   ```
2. Open the folder in VSCode.
3. Press `F5` to launch an **Extension Development Host** window with the
   extension loaded.

### As a packaged `.vsix`

1. Install the packaging tool once:
   ```bash
   npm install -g @vscode/vsce
   ```
2. From the repository root, build the package:
   ```bash
   vsce package
   ```
3. Install the generated file into VSCode:
   ```bash
   code --install-extension kaicritview-0.1.0.vsix
   ```
   (or in VSCode: **Extensions** view → `…` menu → **Install from VSIX…**)

## Usage

1. Open any `.md` file containing CriticMarkup, for example:
   ```markdown
   The quick {--brown--}{++red++} fox {==jumps==} over the lazy dog.

   This sentence needs {~~clarifcation~>clarification~~}. {>>fixed a typo<<}
   ```
2. Open the built-in Markdown preview with `Ctrl+Shift+V`
   (`Cmd+Shift+V` on macOS), or **Markdown: Open Preview to the Side**
   (`Ctrl+K V` / `Cmd+K V`).

The CriticMarkup spans are rendered with distinct colors. The extension
activates lazily the first time a preview is rendered.

## How it works

The extension registers a markdown-it **inline rule** via VSCode's
`markdown.markdownItPlugins` contribution point and ships its styling through
`markdown.previewStyles`. See [`CLAUDE.md`](./CLAUDE.md) for the full
architecture and the rationale behind using an inline rule rather than a
source-rewriting pass.

## License

MIT
