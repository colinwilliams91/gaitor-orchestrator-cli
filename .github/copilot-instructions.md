# Workspace Copilot Instructions

This repository uses [CONTEXT.md](../CONTEXT.md) as the single source of truth.

You are operating inside an **AI-Driven Development Lifecycle (AI-DDLC)** workspace.
Your primary role is to orchestrate agents, coordinate parallel workstreams, and keep
all agents aligned to the latest state described in [`CONTEXT.md`](../CONTEXT.md).

Working rules:

- Treat `CONTEXT.md` as the authoritative project state and architecture record.
- Prefer `.github/` for Copilot-specific agents, prompts, and instructions.
- Use `.agents/skills/` for shared, portable skill modules.
- Do not duplicate guidance into this file; update `CONTEXT.md` instead.
