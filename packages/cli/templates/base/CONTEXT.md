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

*Agents share state exclusively through `CONTEXT.md` and the workspace file tree.*

---

## Project Overview

**{{PROJECT_NAME}}** — scaffolded with [gaitor-orchestrator-cli](https://github.com/colinwilliams91/ai-ddlc-template).

This workspace provides a scaffold for AI-driven development with multiple collaborating agents.

### Goals

- Provide a lightweight, language-agnostic scaffold for AI-driven development.
- Facilitate multi-agent parallelisation with a clear inter-agent protocol.
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
| AD-001 | Copilot workspace files live under `.github/` | GitHub Copilot discovers workspace instructions and routes them to `CONTEXT.md`; keeps root clean |
| AD-002 | Claude implements, OpenAI reviews | Leverage model diversity for adversarial quality checks |
| AD-003 | RALPH loop drives iteration | Structured reflection prevents aimless cycling |
| AD-004 | `CONTEXT.md` is the inter-agent bus | Stateless agents need a shared, file-based state store |
| AD-005 | Secrets never committed | `.gitignore` blocks `.env`, `*.secret.md`, `mcp.local.json`, etc. |
| AD-006 | Issue-Driven Orchestration is an opt-in human-team workflow | When a human enables IDO for a repository or workstream, implementation work is organized through GitHub Issues |

---

## Active Work

*No tasks currently in flight. Update this section when work begins.*

| Task | Agent | Status | Branch |
|------|-------|--------|--------|
| — | — | — | — |

---

## Directory Map

| Path | Purpose |
|------|---------|
| `.github/agents/` | Agent persona definitions (`.agent.md`) |
| `.github/instructions/` | Coding standards & best-practice rules (`.instructions.md`) |
| `.github/prompts/` | Reusable task prompts (`.prompt.md`) |
| `.github/hooks/` | Git automation hooks |
| `.agents/skills/` | Shared capability modules for multi-harness reuse |
| `SPEC.md` | Project-scoped specification draft refined by the user and agents |
| `CONTEXT.md` | Live workspace state – updated by the documenter agent |
| `context-history.md` | Historical milestone log kept outside the session-critical context file |

---

## Conventions

- See [.github/instructions/coding-standards.instructions.md](.github/instructions/coding-standards.instructions.md) for full rules.

---

## Agent Roster

| Agent | File | LLM Preference | Status |
|-------|------|----------------|--------|
| Orchestrator | `.github/agents/orchestrator.agent.md` | Any | Active |
| Implementer | `.github/agents/implementer.agent.md` | Claude | Active |
| Reviewer | `.github/agents/reviewer.agent.md` | OpenAI | Active |
| Documenter | `.github/agents/documenter.agent.md` | Any | Active |
| RALPH | `.github/agents/ralph.agent.md` | Any | Active |

---

## Open Questions

| ID | Question | Owner | Deadline |
|----|----------|-------|---------|
| OQ-001 | What is the primary tech stack for this project? | Human | TBD |

---

## Recent Milestones

| Date | Change | Agent |
|------|--------|-------|
| — | Project scaffolded with gaitor-orchestrator-cli | — |

---

*Last updated by: gaitor-orchestrator-cli scaffold — agents should keep this current.*
