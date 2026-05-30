'use strict';

// VSCode entry point. The `markdown.markdownItPlugins` contribution in
// package.json tells the built-in Markdown preview to call extendMarkdownIt
// with its live markdown-it instance, so there is no webview and no build step.
function activate() {
  return {
    extendMarkdownIt(md) {
      return md.use(criticMarkupPlugin);
    }
  };
}

function deactivate() {}

// CriticMarkup span definitions, keyed by the two characters that follow the
// opening brace. `sub` is special-cased (it splits on `~>`); the rest map to a
// single HTML tag + class.
const SPANS = {
  '++': { close: '++}', tag: 'ins', cls: 'critic-ins' },
  '--': { close: '--}', tag: 'del', cls: 'critic-del' },
  '==': { close: '==}', tag: 'mark', cls: 'critic-mark' },
  '>>': { close: '<<}', tag: 'span', cls: 'critic-comment' }
};

function criticMarkupPlugin(md) {
  // Inline rule (not a core src-rewrite pass) so CriticMarkup inside code
  // fences/spans is left untouched and nested Markdown is parsed naturally.
  // `{` is already a terminator char for markdown-it's text rule, so the inline
  // parser hands us control whenever it sees one.
  md.inline.ruler.before('emphasis', 'criticmarkup', critic);
}

function critic(state, silent) {
  const src = state.src;
  const start = state.pos;

  if (src.charCodeAt(start) !== 0x7B /* { */) return false;

  const marker = src.slice(start + 1, start + 3);
  const contentStart = start + 3;

  // Substitution: {~~ old ~> new ~~}
  if (marker === '~~') {
    const closeIdx = src.indexOf('~~}', contentStart);
    if (closeIdx < 0) return false;
    if (silent) return true;

    const arrowIdx = src.indexOf('~>', contentStart);
    if (arrowIdx >= 0 && arrowIdx < closeIdx) {
      pushSpan(state, 'del', 'critic-del', contentStart, arrowIdx);
      pushSpan(state, 'ins', 'critic-ins', arrowIdx + 2, closeIdx);
    } else {
      // No arrow: treat the whole body as a deletion rather than dropping it.
      pushSpan(state, 'del', 'critic-del', contentStart, closeIdx);
    }
    state.pos = closeIdx + 3;
    return true;
  }

  const def = SPANS[marker];
  if (!def) return false;

  const closeIdx = src.indexOf(def.close, contentStart);
  if (closeIdx < 0) return false;
  if (silent) return true;

  pushSpan(state, def.tag, def.cls, contentStart, closeIdx);
  state.pos = closeIdx + def.close.length;
  return true;
}

// Emit `<tag class="cls">`, re-parse src[from, to) as inline Markdown into the
// token stream, then emit the closing tag.
function pushSpan(state, tag, cls, from, to) {
  const open = state.push(tag + '_open', tag, 1);
  open.attrSet('class', cls);

  const oldPos = state.pos;
  const oldMax = state.posMax;
  state.pos = from;
  state.posMax = to;
  state.md.inline.tokenize(state);
  state.pos = oldPos;
  state.posMax = oldMax;

  state.push(tag + '_close', tag, -1);
}

module.exports = { activate, deactivate };
