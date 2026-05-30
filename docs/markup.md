# Markup Types

kaicritview renders the five CriticMarkup types into the Markdown preview, each
with a distinct, theme-friendly color. Span bodies are re-parsed as inline
Markdown, so nested formatting such as `{++ **bold** text ++}` is preserved.

## Syntax Overview

| Syntax | Rendered as | Meaning |
| --- | --- | --- |
| `{++ … ++}` | `<ins class="critic-ins">` | insertion |
| `{-- … --}` | `<del class="critic-del">` | deletion |
| `{== … ==}` | `<mark class="critic-mark">` | highlight |
| `{>> … <<}` | `<span class="critic-comment">` | editor comment |
| `{~~ old ~> new ~~}` | `<del>old</del><ins>new</ins>` | substitution |

## Rendering Behavior

- **Insertion** — shown with a green background.
- **Deletion** — shown with a red background and a strike-through.
- **Highlight** — shown with a yellow background.
- **Comment** — shown italic with a dotted underline and a leading `»` marker.
- **Substitution** — the old text renders as a deletion, the new text as an
  insertion. If the `~>` arrow is missing, the whole body is treated as a
  deletion rather than being dropped.

Colors are intentionally semi-transparent so they read well on both the light
and dark preview themes.

## Code is left untouched

CriticMarkup is matched by a `markdown-it` **inline rule**, not by rewriting the
document source. By construction the rule never runs inside inline code or
fenced code blocks, so CriticMarkup-like characters in your code samples are
rendered verbatim.

## Customization

Styling ships through VS Code's `markdown.previewStyles` contribution point. You
can override the colors by adding your own preview stylesheet via the
`markdown.styles` setting and targeting the classes above:

```css
.critic-ins  { background-color: rgba(70, 200, 70, 0.25); }
.critic-del  { background-color: rgba(220, 60, 60, 0.25); }
.critic-mark { background-color: rgba(255, 220, 40, 0.45); }
.critic-comment { font-style: italic; }
```
