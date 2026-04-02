# ai-ddlc-template

Lightweight, language-agnostic scaffold for an **AI-Driven Development Lifecycle (AI-DDLC)**
using GitHub Copilot in VSCode with multi-agent parallelisation.

---

## Quick Start

1. **Clone or use as template** – click *Use this template* on GitHub.
2. **Open in VSCode** – Copilot will automatically pick up
   `.github/copilot-instructions.md` as workspace instructions.
3. **Start with `SPEC.md`** – capture the project problem, scope, and acceptance criteria.
   Agents can refine this with you until the work reaches a spec-driven state.
4. **Read `CONTEXT.md`** – this is the live state document that all agents share.
   Use `context-history.md` only for older repository milestones.
5. **Refine the spec when needed** – use `/refine-spec` to turn a rough `SPEC.md`
   draft into something implementation-ready with explicit user approval.
6. **Copy a prompt** – use `.github/prompts/task-template.prompt.md` to kick off
   any new task.
7. **Drive iteration with RALPH** – use `.github/prompts/ralph-loop.prompt.md`
   when you need structured improvement cycles.
8. **Create intentional commits** – use `/checkpoint-commit` for diff-based
   Conventional Commits during active agentic work.

---

## Directory Structure

```text
.github/
├── agents/               # AI persona definitions (.agent.md)
│   ├── orchestrator.agent.md   – task decomposition & dispatch
│   ├── implementer.agent.md    – code writing (Claude)
│   ├── reviewer.agent.md       – adversarial review (OpenAI)
│   ├── documenter.agent.md     – keeps CONTEXT.md current
│   └── ralph.agent.md          – RALPH loop driver
├── instructions/         # Coding standards (.instructions.md)
│   ├── coding-standards.instructions.md
│   └── browser-tooling.instructions.md  – two-tier browser tool architecture
├── hooks/                # Workspace hook files and supporting scripts
│   ├── session-auto-commit.json
│   ├── ido-context-sync.json
│   ├── session-auto-commit/   – auto-stage + fallback autosave scripts
│   └── ido-context-sync/      – prompts `sync-context.sh` for IDO milestones
├── plugins/              # Bundled plugin configs
│   └── context7/         – Context7 MCP docs plugin
├── prompts/              # Reusable task prompts (.prompt.md)
│   ├── task-template.prompt.md
│   ├── ralph-loop.prompt.md
│   ├── refine-spec.prompt.md
│   └── browser-workflow.prompt.md  – human-AI browser collaboration template
├── scripts/              # Utility/maintenance scripts
│   └── sync-context.sh   – reminds Documenter to refresh CONTEXT.md
└── copilot-instructions.md  – master workspace instructions for Copilot
.agents/
└── skills/               # Shared capability modules for multi-harness workflows
   ├── checkpoint-commit/     – diff-based commit checkpoint slash command
   └── playwright-cli/        – browser automation CLI (multi-harness)
SPEC.md                      # Project-scoped specification draft for the current project
template-spec.md             # Internal specification for maintaining this template itself
CONTEXT.md                   # Centralized agent-alignment document
context-history.md           # Historical repository milestones kept out of session-critical context
AGENTS.md                    # Root adapter for agentic tools that read AGENTS.md
CLAUDE.md                    # Root adapter for Claude-style harnesses
.cursorrules                # Root adapter for Cursor-style harnesses
```

---

## Multi-Agent Protocol

```text
User → Orchestrator → Implementer (Claude)
                    ↘ Reviewer (OpenAI) ←→ RALPH loop
                    → Documenter → CONTEXT.md
```

- **Claude** writes and refactors code.
- **OpenAI** performs adversarial review until consensus.
- **RALPH** (Reflect → Assess → Learn → Plan → Hypothesize) drives each iteration.
- **Documenter** keeps `CONTEXT.md` current so all agents stay aligned.

---

## Browser Tooling

- Architecture, decision rules, and portability: `.github/instructions/browser-tooling.instructions.md`
- Human ↔ agent session workflow: `.github/prompts/browser-workflow.prompt.md`
- `playwright-cli` command reference: `.agents/skills/playwright-cli/SKILL.md`

Prefer a project-local `playwright-cli` installation and invoke it via `npx playwright-cli` when available. Use `playwright-cli open --extension <url>` when the human and agent should share a single, existing browser session. Use `playwright-cli open https://localhost:3000 --headed` to spawn a new browser instance. VS Code built-in browser tools remain a Copilot-only fallback and should be used only per the decision table.

Use `/browser-workflow` in VS Code chat to start a structured browser session.

---

## Secrets & Safety

All AI-sensitive patterns are git-ignored (see `.gitignore`):

- `*.secret.md`, `*.private.md` – private prompt/instruction variants
- `.context7/`, `ai-cache/` – Context7 and general AI caches
- `mcp.local.json` – machine-local MCP config (may contain API keys)
- `**/output/` – raw LLM output scratch files

---

## Adapting to a New Project

1. Rewrite `SPEC.md` so it describes the new project's problem, scope, and success criteria.
2. Use `/refine-spec` to iteratively tighten the spec with explicit human approval for spec edits.
3. Update the **Project Overview** section of `CONTEXT.md`.
4. Add project-specific instructions to `.github/instructions/`.
5. Add task prompts to `.github/prompts/`.
6. Drop shared capability modules into `.agents/skills/` as needed.
7. Everything else stays the same — the scaffold is stack-agnostic.
