# CONTEXT.md — Workspace State

> **Owner:** Documenter Agent (`/.github/agents/documenter.agent.md`)
> **Protocol:** This file is the single source of truth for all agents. Read it at
> the start of every session. Request an update after any meaningful change.

---

## Multi-Agent Protocol

- **Orchestrator** (`agents/orchestrator.agent.md`) decomposes tasks and dispatches agents.
- **Implementer** (`agents/implementer.agent.md`) writes code (Claude LLM preferred).
- **Reviewer** (`agents/reviewer.agent.md`) performs adversarial review (OpenAI preferred).
- **Documenter** (`agents/documenter.agent.md`) keeps `CONTEXT.md` and `context-history.md` current.
- **RALPH** (`agents/ralph.agent.md`) drives iterative improvement loops.
- **Portable skill path** (`.agents/skills/`) contains reusable capability modules for multi-harness workflows (e.g. `playwright-cli`).
- **Doc context tool** (Context7 MCP) provides on-demand access to library documentation without hallucination.

***If IDO is explicitly enabled by the human for the current repository or workstream:***

- An optional Issue Intake step may triage new issues, apply labels, and route work to downstream agents.

*Agents share state exclusively through `CONTEXT.md` and the workspace file tree.*

---

## Project Overview

This repository is the **`gaitor-orchestrator-cli`** — a Node.js CLI tool that scaffolds new AI-Driven Development Lifecycle (AI-DDLC) workspaces, similar to `create-react-app`. Users run `npx gaitor-orchestrator-cli <project-name>` to get an interactive setup with opt-in features.

The CLI source lives in `packages/cli/`. The template files it scaffolds live in `packages/cli/templates/`.

### Goals

- Provide a lightweight, language-agnostic scaffold for AI-driven development.
- Facilitate multi-agent parallelization with a clear inter-agent protocol.
- Easily adapt to any project stack.

## Core Principles

1. **CONTEXT.md is the source of truth.** Always read it before acting and request the
   documenter agent updates it after any meaningful change. Keep `CONTEXT.md` concise; store older milestone history in `context-history.md`.
2. **`SPEC.md` is the project requirements draft.** Use it for product scope, acceptance criteria, and delivery intent. Refine it with the user when requirements are incomplete or ambiguous.
3. **A user gesture is required for spec writes unless overridden with permissions.** Agents may consult `SPEC.md` by default for feature work, but they must not update it unless the user explicitly requests a spec update, invokes `/refine-spec`, or approves applying proposed spec changes.
4. **Parallelise wherever safe.** Independent sub-tasks should be dispatched to separate
   agents simultaneously. Serialise only when there is a true data dependency.
5. **Claude implements; OpenAI reviews.** Implementation agents (Claude) write or refactor
   code. Adversarial review agents (OpenAI) critique until consensus is reached.
6. **RALPH loop governs iteration.** Every significant cycle follows:
   Reflect → Assess → Learn → Plan → Hypothesize before executing.
7. **Language/framework agnostic.** All scaffolding must remain generic. No
   project-specific assumptions belong here.
8. **Secrets never leave the machine.** Never include API keys, tokens, or credentials
   in any committed file. Use `.env` (already git-ignored) or a secrets manager.

---

## Architecture Decisions

| ID | Decision | Rationale |
|----|----------|-----------|
| AD-001 | Copilot workspace files live under `.github/` | GitHub Copilot discovers workspace instructions there; keeps root clean |
| AD-002 | Claude implements, OpenAI reviews | Leverage model diversity for adversarial quality checks |
| AD-003 | RALPH loop drives iteration | Structured reflection prevents aimless cycling |
| AD-004 | `CONTEXT.md` is the inter-agent bus | Stateless agents need a shared, file-based state store |
| AD-005 | Context7 MCP for library docs | Avoids hallucinated APIs; future caching will reduce token cost |
| AD-006 | Secrets never committed | `.gitignore` blocks `.env`, `*.secret.md`, `mcp.local.json`, etc. |
| AD-007 | Issue-Driven Orchestration is an opt-in human-team workflow | When a human enables IDO for a repository or workstream, implementation work is organized through GitHub Issues. This template currently provides the core instructions plus issue and PR templates; teams may add intake agents, routing prompts, and label automation as needed. |
| AD-008 | Shared skills live under `.agents/skills/` | Matches the multi-harness installer layout and keeps reusable skills portable across Copilot, Claude, Codex, Cursor, and similar tools |
| AD-009 | Root adapter files point back to `CONTEXT.md` | Gives non-Copilot harnesses a stable entrypoint without duplicating project guidance |
| AD-010 | Git workflow automation uses three layers | `PostToolUse` stages touched files, `checkpoint-commit` creates intentional diff-based commits, and `Stop` provides fallback autosave only when staged changes remain |
| AD-011 | Root `SPEC.md` is project-scoped | Downstream projects should refine `SPEC.md` with the user and agents, while template-maintainer design rationale lives in `template-spec.md` |
| AD-012 | Spec updates require an explicit human gesture | Agents read `SPEC.md` for feature work by default, but spec edits require `/refine-spec`, an explicit user request, or explicit approval of proposed spec changes |
| AD-013 | Two-tier browser tooling: playwright-cli + VS Code built-ins (fallback) | `playwright-cli` is the portable browser automation layer across harnesses; harness-specific DevTools or MCP diagnostics may augment shared sessions when available; VS Code built-in browser tools remain Copilot-only fallback |
| AD-014 | delete and remove references to: `browser-workflow.prompt.md`, `REFERENCE.md` artifact, `CHEAT_SHEET.md` and agent-browser skill | Replaced by the more robust and flexible `playwright-cli` workflow and consolidated README, SKILL and instruction files; see AD-013 for the new architecture |
| AD-015 | Human-in-loop workflows may use a stop hook to prompt context synchronization | `.github/hooks/ido-context-sync.json` runs `.github/scripts/sync-context.sh` at session end so IDO milestone work can hand off a `CONTEXT.md` refresh to the Documenter agent without adding GitHub-side automation yet |
| AD-016 | `packages/cli` is the only releaseable component and is published via release-please manifest automation | The repository root stays private for workspace orchestration and docs, while release-please versions `packages/cli`, generates `packages/cli/CHANGELOG.md`, creates GitHub releases, and drives npm publication from the subdirectory package |

---

## Active Work

*No tasks currently in flight. Update this section when work begins if IDO is not enabled. If IDO *is* enabled this should be managed via GitHub Issues and GitHub Projects.*

| Task | Agent | Status | Branch |
|------|-------|--------|--------|
| — | — | — | — |

---

## Issue-Driven Orchestration (IDO) — Opt-in Workflow

*Not enabled by default. Use only when the human explicitly opts in for the repository or the current workstream.*

When IDO is enabled, implementation work starts from a GitHub Issue with a clear
problem statement and acceptance criteria. If the repository adopts routing labels,
use them consistently, but label taxonomy is optional project policy rather than a
global requirement of this template.

```text
Issue filed → optional triage → agent dispatched → PR opened (Closes #N) →
Reviewer consensus → human approval → merge → Documenter updates CONTEXT.md
```

### Entry points

| You want to… | Use… |
|-------------|------|
| File new work | `.github/ISSUE_TEMPLATE/new_ticket.yaml` |
| Open a linked implementation PR | `.github/pull_request_template.md` |
| Run a RALPH improvement cycle | `.github/prompts/ralph-loop.prompt.md` |

### Copilot coding agent assignment

If an IDO-enabled repository chooses to use an `agent:copilot` routing label,
assign the issue to `copilot-swe-agent` via the GitHub web UI or the API. Pass the
issue's acceptance criteria plus the following as `customInstructions`:

```text
Repository context: .github/copilot-instructions.md and CONTEXT.md.
Coding standards: .github/instructions/coding-standards.instructions.md.
IDO rules: .github/instructions/issue-driven-orchestration.instructions.md.
Open a draft PR immediately; convert to ready when all AC pass.
Commit style: Conventional Commits. Link PR with "Closes #N".
```

### TODO:

Full IDO protocol: `.github/instructions/issue-driven-orchestration.instructions.md`
Current template support: issue template + PR template + RALPH prompt
Optional future extensions: issue intake agent, routing prompt, and label manifest

---

## Directory Map

| Path | Purpose |
|------|---------|
| `.github/agents/` | Agent persona definitions (`.agent.md`) |
| `.github/hooks/` | Workspace hook registrations and supporting automation scripts |
| `.github/instructions/` | Coding standards & best-practice rules (`.instructions.md`) |
| `.github/prompts/` | Reusable task prompts (`.prompt.md`) |
| `.github/plugins/` | Bundled plugin configurations |
| `.github/scripts/` | Utility/maintenance scripts |
| `.agents/skills/` | Shared capability modules installed for multi-harness reuse |
| `packages/cli/` | `gaitor-orchestrator-cli` — the Node.js scaffolding CLI |
| `packages/cli/templates/` | Template files embedded in the CLI package for scaffolding |
| `SPEC.md` | Project-scoped specification draft refined by the user and agents |
| `template-spec.md` | Internal design rationale for maintaining this scaffold |
| `CONTEXT.md` | Live workspace state – updated by the documenter agent |
| `context-history.md` | Historical milestone log kept outside the session-critical context file |
| `AGENTS.md` / `CLAUDE.md` | Thin root adapters for non-Copilot harnesses |

---

## Conventions

- See [.github/instructions/coding-standards.instructions.md](.github/instructions/coding-standards.instructions.md) for full rules.

---

## Agent Roster

| Agent | File | LLM Preference | Status |
|-------|------|----------------|--------|
| Issue Intake | Not scaffolded in this template | Any | Optional extension |
| Orchestrator | `.github/agents/orchestrator.agent.md` | Any | Active |
| Implementer | `.github/agents/implementer.agent.md` | Claude | Active |
| Reviewer | `.github/agents/reviewer.agent.md` | OpenAI | Active |
| Documenter | `.github/agents/documenter.agent.md` | Any | Active |
| RALPH | `.github/agents/ralph.agent.md` | Any | Active |

---

## Open Questions

| ID | Question | Owner | Deadline |
|----|----------|-------|---------|
| OQ-001 | Context7 caching strategy — local file vs. Redis vs. SQLite? | Human | Cancelled |
| OQ-002 | Should a custom harness live inside this repo or as a separate package? | Human | Cancelled |
| OQ-003 | Which CLI agent orchestrator (if any) to add later? | Human | TBD |

---

## Recent Milestones

This table keeps only the last 10 milestones.
When a new milestone would become the 11th entry, move the oldest row to `context-history.md` and remove it from this table in the same update.
Do not duplicate archived entries here. Use git history when you need exact diffs, authorship, or commit-level details.

| Date | Change | Agent |
|------|--------|-------|
| 2026-04-04 | Added subdirectory package release automation for `packages/cli`, including release-please manifest config, npm publish workflow, publish-facing package metadata, and dynamic runtime versioning for the initial `v1.0.0` release path | Copilot |
| 2026-04-02 | Added an `ido-context-sync` workspace hook package that runs `.github/scripts/sync-context.sh` on session stop so human-in-loop and IDO workflows can prompt `CONTEXT.md` and milestone refreshes | Copilot |
| 2026-04-01 | Implemented `gaitor-orchestrator-cli` v0.1.0 in `packages/cli/` — interactive CLI scaffolding tool with opt-in features for agents, instructions, prompts, hooks, IDO, tools, and skills | Copilot |
| 2026-04-01 | Clarified IDO as a human opt-in workflow, added the issue-driven instructions document, and aligned source-of-truth references with the assets that actually exist in the template | Copilot |
| 2026-03-29 | Replaced `agent-browser` skill with `playwright-cli`; added `browser-tooling.instructions.md`, `browser-workflow.prompt.md`, and established the browser tooling architecture captured in AD-013 | Copilot |
| 2026-03-31 | delete and remove references to: `browser-workflow.prompt.md`, `REFERENCE.md` artifact, `CHEAT_SHEET.md` and agent-browser skill | Replaced by the more robust and flexible `playwright-cli` workflow and consolidated README, SKILL and instruction files; see AD-013 for the new architecture |

---

*Last updated by: Copilot — agents should keep this current.*
