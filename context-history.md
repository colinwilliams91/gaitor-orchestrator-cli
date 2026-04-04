# Context History

Historical repository milestones live here so `CONTEXT.md` can stay compact and focused on the current agent-facing state.

Use this file for semantic milestone history.
Use git history when you need exact diffs, authorship, or commit-level details.

## Historical Milestones

This file is the append-only archive for milestones moved out of the last 10 entries in `CONTEXT.md`'s Recent Milestones table.
An entry should live in only one table at a time.

| Date | Change | Agent |
|------|--------|-------|
| 2026-02-21 | Initial scaffold created | Copilot |
| 2026-03-09 | Documented `.agents/skills/` as the canonical shared skills path and added root harness adapters | Copilot |
| 2026-03-09 | Added a root Cursor adapter that routes to `CONTEXT.md` | Copilot |
| 2026-03-24 | Updated the session auto-commit hook to use summarized Conventional Commits at session end without timestamps or auto-push | Copilot |
| 2026-03-25 | Implemented three-layer Git workflow automation with PostToolUse auto-stage hooks, a portable `checkpoint-commit` skill, and Stop-hook fallback autosave | Copilot |
| 2026-03-26 | Split `CONTEXT.md` history into compact Recent Milestones and a separate historical timeline file | Copilot |
| 2026-03-26 | Replaced the root `SPEC.md` with a project-spec starter template and moved template-internal specification notes to `template-spec.md` | Copilot |
| 2026-03-26 | Added `/refine-spec` and documented a human-gated spec sync workflow for Orchestrator and Implementer | Copilot |
| 2026-04-05 | Deleted `template-spec.md` as it became redundant | Copilot |
