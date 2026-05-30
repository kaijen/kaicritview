# kaicritview — CriticMarkup for the VS Code Markdown preview

kaicritview renders [CriticMarkup](https://github.com/CriticMarkup/CriticMarkup-toolkit)
in VS Code's **built-in** Markdown preview. There is no custom webview and no
build step — the extension hooks the `markdown-it` instance the preview already
uses, so it stays fast and works with every preview theme.

## What is CriticMarkup?

[CriticMarkup](https://github.com/CriticMarkup/CriticMarkup-toolkit) is a
plain-text standard for tracking changes and inline comments. It works in any
text file using simple bracket syntax. The
[full specification](https://github.com/CriticMarkup/CriticMarkup-toolkit/blob/master/README.md)
is maintained in the CriticMarkup-toolkit repository on GitHub.

## About

Made by [0x2e6b6169](https://blog.0x2e6b6169.de). Source on
[GitHub](https://github.com/kaijen/kaicritview).

If you also want to *edit* CriticMarkup — insert markers, navigate between them,
and accept or reject changes — see the companion extension
[kaicrit](https://github.com/kaijen/kaicrit).

## Installation

### From a packaged `.vsix`

Download the latest `kaicritview-*.vsix` from the
[Releases page](https://github.com/kaijen/kaicritview/releases), then install it:

```bash
code --install-extension kaicritview-*.vsix
```

### From source (development)

```bash
git clone https://github.com/kaijen/kaicritview.git
```

Open the folder in VS Code and press `F5` to launch an **Extension Development
Host** window with the extension loaded.

The extension activates lazily the first time a Markdown preview is rendered.
