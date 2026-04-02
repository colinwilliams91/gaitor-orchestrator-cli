---
name: 'IDO Context Sync'
description: 'Prompt a CONTEXT.md refresh at the end of a human-in-loop or IDO session'
tags: ['automation', 'context', 'ido']
---

# IDO Context Sync Hook

This hook package runs `.github/scripts/sync-context.sh` when a Copilot session stops.
It is intended for human-in-loop workflows such as Issue-Driven Orchestration, where a
human or agent has just completed a milestone and wants to prompt the Documenter agent
to refresh `CONTEXT.md` and its recent milestones.

## Overview

The workspace-level hook file lives at `.github/hooks/ido-context-sync.json` because
VS Code discovers hook configuration from `.github/hooks/*.json`.

## Files

- `trigger-sync.sh` — Unix-like wrapper that runs `.github/scripts/sync-context.sh`
- `trigger-sync.ps1` — Windows wrapper that locates `bash`/`sh` and runs the same script

## Installation

Ensure the Unix-like wrapper is executable on macOS and Linux:

```bash
chmod +x .github/hooks/ido-context-sync/trigger-sync.sh
```

## Behavior

- Runs on the VS Code `Stop` hook event
- Calls `.github/scripts/sync-context.sh`
- Can be disabled with `SKIP_CONTEXT_SYNC_HOOK=true`

## Notes

- This hook prints the existing Documenter prompt from `.github/scripts/sync-context.sh`
- Use it alongside `.github/pull_request_template.md` and `.github/ISSUE_TEMPLATE/new_ticket.yaml` for IDO workflows
