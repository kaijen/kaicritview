# Usage

kaicritview works entirely inside VS Code's built-in Markdown preview — there are
no commands or keybindings to learn.

## Open a preview

1. Open any `.md` file containing CriticMarkup, for example:

   ```markdown
   The quick {--brown--}{++red++} fox {==jumps==} over the lazy dog.

   This sentence needs {~~clarifcation~>clarification~~}. {>>fixed a typo<<}
   ```

2. Open the built-in Markdown preview:
   - `Ctrl+Shift+V` (`Cmd+Shift+V` on macOS) — open preview, or
   - `Ctrl+K V` (`Cmd+K V`) — **Markdown: Open Preview to the Side**.

The CriticMarkup spans are rendered with distinct colors. The preview updates
live as you type, and the extension activates lazily the first time a preview is
rendered.

## How it works

The extension registers a `markdown-it` **inline rule** via VS Code's
`markdown.markdownItPlugins` contribution point and ships its styling through
`markdown.previewStyles`.

Because the rule emits real `markdown-it` tokens (rather than raw HTML), the
rendering works regardless of the preview's `html` option, and nested Markdown
inside a CriticMarkup span is parsed naturally. See
[`CLAUDE.md`](https://github.com/kaijen/kaicritview/blob/main/CLAUDE.md) in the
repository for the full architecture and the rationale behind using an inline
rule rather than a source-rewriting pass.

## Tip: pair with an editor

kaicritview only *renders* CriticMarkup. To insert markers and accept or reject
changes from inside the editor, install the companion extension
[kaicrit](https://github.com/kaijen/kaicrit) alongside it.
