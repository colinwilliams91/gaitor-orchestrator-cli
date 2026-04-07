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
gaitor my-project
```

The source for the published package lives in `packages/cli` inside the `gaitor-orchestrator-cli` repository.

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
  -h, --help               display help for command
```

## What gets scaffolded

### Core files (always included)

| File | Purpose |
|------|---------|
| `CONTEXT.md` | Single source of truth and inter-agent bus |
| `SPEC.md` | Project specification draft |
| `.gitignore` | Standard gitignore with node + AI/LLM additions |

---

**The following harness support files need to be considered in the scaffolding business logic:**

| File | Purpose |
|------|---------|
| `AGENTS.md` | Adapter for non-Copilot harnesses |
| `CLAUDE.md` | Adapter for Claude harnesses |
| `.cursorrules` | Adapter for Cursor agent interactions |
| `.github/copilot-instructions.md` | Adapter for GitHub Copilot workspace |

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

## Examples

```bash
# Minimal workspace — only core files
npx gaitor-orchestrator-cli my-project --no-agents --no-instructions --no-prompts --no-hooks --no-ido --no-tools --no-skills

# Workspace without IDO or local tools
npx gaitor-orchestrator-cli my-project --no-ido --no-tools
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
