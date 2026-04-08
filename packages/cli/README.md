# gaitor-orchestrator-cli

<p align="center">
  <img src="https://res.cloudinary.com/dbdyc4klu/image/upload/c_scale,w_400/v1775255978/gaitor-orchestrator-00_r6llds_c_pad_w_500_h_500_ar_1_1_1_jpd0up.webp" alt="Gaitor Orchestrator"/>
</p>

> Scaffold a new **AI-Driven Development Lifecycle (AI-DDLC)** workspace in seconds.

## Quick start

```bash
# Interactive (recommended)
npx gaitor-orchestrator-cli my-project

# Skip prompts and include all features
npx gaitor-orchestrator-cli my-project --yes

# Or install globally
npm install -g gaitor-orchestrator-cli
gaitor create my-project
```

The source for the published package lives in `packages/cli` inside the `gaitor-orchestrator-cli` repository.

The published package exposes these entrypoints: `gaitor`, `gaitor-create`, and `gaitor-orchestrator-cli`.
The CLI also accepts the `gaitor create` workflow, which keeps the common global-install path concise.

## Usage

```text
Usage: gaitor [options] [project-name]

Scaffold a new AI-Driven Development Lifecycle (AI-DDLC) workspace

Arguments:
  project-name             Name of the project directory to create

Options:
  -V, --version            output the version number
  -y, --yes                Skip interactive prompts and accept all defaults
  --no-agents              Exclude agent persona files
  --no-instructions        Exclude instruction files
  --no-prompts             Exclude prompt template files
  --no-hooks               Exclude git hook files
  --no-ido                 Exclude Issue-Driven Orchestration files
  --no-tools               Exclude local dev-tools package.json
  --no-skills              Exclude shared skill modules
  --no-mcp                 Exclude mcp.local.json plug-n-play config
  -h, --help               display help for command

Aliases:
  gaitor create [project-name]
  gaitor-create [project-name]
```

## What gets scaffolded

### Core files (always included)

| File | Purpose |
|------|---------|
| `CONTEXT.md` | Single source of truth for all agents |
| `SPEC.md` | Project specification draft |
| `.gitignore` | Standard gitignore with AI/LLM additions |

---

**The following harness support files need to be considered in the scaffolding business logic:**

| File | Purpose |
|------|---------|
| `AGENTS.md` | Adapter for non-Copilot harnesses |
| `CLAUDE.md` | Adapter for Claude harnesses |
| `.cursorrules` | Adapter for Cursor agent interactions |
| `.github/copilot-instructions.md` | GitHub Copilot workspace instructions |

### Opt-in features

| Feature flag | What it includes |
|-------------|-----------------|
| `--agents` (default on) | `.github/agents/` — Orchestrator, Implementer, Reviewer, Documenter, and RALPH agent definitions |
| `--instructions` (default on) | `.github/instructions/` — Coding standards, IDO rules, and browser-tooling guidelines |
| `--prompts` (default on) | `.github/prompts/` — RALPH loop, spec refinement, task template, and API security audit prompts |
| `--hooks` (default on) | `.github/hooks/` — Session auto-commit and ido-context-sync hooks for PostToolUse and/or Stop events |
| `--ido` (default on) | `.github/ISSUE_TEMPLATE/` and `.github/pull_request_template.md` for IDO-enabled repositories |
| `--tools` (default on) | Root `package.json` with `@playwright/cli` and `@mermaid-js/mermaid-cli` devDependencies |
| `--skills` (default on) | `.agents/skills/` — Portable `playwright-cli`, `mermaid-cli`, `frontend-design` and `checkpoint-commit` skill modules |
| `--mcp` (default on) | Root `mcp.local.json` with plug-n-play config for all scaffolded features (rename to ~\\Users\\<username>\\mcp-config.json OR C:\\Users\\<username>\\AppData\\Roaming\\Code\\User\\mcp.json or intra-project path) |

## Examples

```bash
# Minimal workspace — only core files
npx gaitor-orchestrator-cli my-project --no-agents --no-instructions --no-prompts --no-hooks --no-ido --no-tools --no-skills --no-mcp

# Workspace without IDO or local tools
npx gaitor-orchestrator-cli my-project --no-ido --no-tools

# Global install workflow with explicit create verb
gaitor create my-project --yes
gaitor-create my-project --yes
```

## After scaffolding

```bash
cd my-project

# If you included local tools:
npm install

# Open in your editor and read CONTEXT.md
```

## License

GNU AGPL

---

## Development

### Prerequisites

- Node.js ≥ 20
- Run `npm install` from the repository root (or `packages/cli/`) before running tests

### Running the CLI locally from this repo

For contributors working inside this monorepo, use the root script alias if you do not want to install globally.

```bash
# this will collocate my-project in packages/cli/ for easy access to the source code and test files
npm run gaitor -- --help
npm run gaitor -- my-project
```

That script builds `packages/cli` and then runs the CLI, so you do not need to invoke the bin file manually.

For published-package usage as an end user, keep using:

```bash
npx gaitor-orchestrator-cli my-project
# or install globally
npm i -g gaitor-orchestrator-cli
gaitor create my-project
gaitor-create my-project
```

### Running tests

```bash
# From the repository root
npm test --workspace=packages/cli

# Or directly from the package directory
cd packages/cli
npm test
```

The test runner is the built-in **Node.js `node:test`** module — no extra framework required.

### Test suite

Tests live in `src/__tests__/`:

| File | What it covers |
|------|---------------|
| `cli.test.js` | End-to-end CLI behaviour via `spawnSync`: `--help` output, `--version`, all `--no-*` flags, `--yes` non-interactive scaffolding, `{{PROJECT_NAME}}` substitution, and non-zero exit when the target directory already exists |
| `scaffold.test.js` | Unit tests for `scaffold()`: base file creation, every opt-in feature (agents, instructions, prompts, hooks, ido, tools, skills, mcp), `_underscore`→`.dot` file/directory renaming, template substitution, and graceful handling of unknown feature IDs |
| `prompts.test.js` | Unit tests for the `FEATURES` registry shape (keys, `label`, `description` fields) and the non-interactive fast-path of `askProjectName` |
