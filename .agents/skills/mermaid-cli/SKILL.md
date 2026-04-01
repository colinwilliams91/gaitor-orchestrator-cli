---
name: mermaid-cli
description: Render Mermaid diagram definitions to image files (SVG, PNG, PDF) from the command line. Use when asked to generate or convert Mermaid diagrams to visual output files.
compatibility: Requires @mermaid-js/mermaid-cli, available as a devDependency in this project. Run `npm install` then use `npx mmdc` or `npm run diagram --`.
allowed-tools: Bash(mmdc:*) Bash(npx:*) Bash(npm:*)
---

# Diagram Rendering with mermaid-cli

## Quick start

```bash
# via the project npm script (-- passes args to mmdc)
npm run diagram -- -i input.mmd -o output.svg

# or directly via npx (uses local devDependency)
npx mmdc -i input.mmd -o output.svg
```

## Commands

### Convert a file

```bash
# SVG (default)
mmdc -i diagram.mmd -o diagram.svg

# PNG
mmdc -i diagram.mmd -o diagram.png

# PDF
mmdc -i diagram.mmd -o diagram.pdf
```

### Read from stdin

```bash
echo "graph LR; A-->B" | mmdc -i - -o out.svg
```

### Common options

| Flag | Long form | Description |
|------|-----------|-------------|
| `-i` | `--input` | Input `.mmd` file, or `-` for stdin |
| `-o` | `--output` | Output file path (`.svg`, `.png`, `.pdf`) |
| `-t` | `--theme` | Theme: `default` \| `dark` \| `forest` \| `neutral` |
| `-b` | `--backgroundColor` | Background colour (`white`, `transparent`, `#ffffff`) |
| `-w` | `--width` | Canvas width in pixels (PNG only) |
| `-H` | `--height` | Canvas height in pixels (PNG only) |
| `-s` | `--scale` | Scale factor for PNG (default: `1`) |
| `-f` | `--configFile` | Path to Mermaid config JSON |
| `-C` | `--cssFile` | Path to custom CSS file |

### Examples

```bash
# Dark-themed PNG at 1200 px wide
mmdc -i architecture.mmd -o architecture.png -t dark -w 1200

# Transparent-background SVG
mmdc -i flow.mmd -o flow.svg -b transparent

# Neutral theme with custom config
mmdc -i sequence.mmd -o sequence.svg -t neutral -f mermaid.config.json
```

## Installation

`@mermaid-js/mermaid-cli` is a devDependency of this project. After `npm install`, invoke the binary via `npx`:

```bash
npx --no-install mmdc --version
```

If working outside this project and the command is not yet available locally:

```bash
npm install --save-dev @mermaid-js/mermaid-cli@latest
```

## Reference

- [mermaid-cli GitHub](https://github.com/mermaid-js/mermaid-cli)
- [Mermaid diagram syntax](https://mermaid.js.org/intro/)
