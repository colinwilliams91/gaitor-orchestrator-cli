---
name: 'Session Auto-Commit'
description: 'Auto-stage edited files after tool use and create a fallback autosave commit when a Copilot agent session stops'
tags: ['automation', 'git', 'productivity']
---

# Git Workflow Hooks

This hook package implements a three-layer Git workflow for GitHub Copilot in VS Code:

- `PostToolUse` auto-stages touched files after successful tool calls
- `/checkpoint-commit` performs intentional, diff-based commits with model-written messages
- `Stop` creates a fallback autosave commit only if staged changes remain at session end

## Overview

The workspace-level hook file lives at `.github/hooks/session-auto-commit.json` because VS Code discovers hook configuration from `.github/hooks/*.json`.

The hook package scripts live in this directory and are referenced by that top-level JSON file.

## Features

- **Granular staging**: Agent-edited files are staged immediately after tool execution
- **Intentional commits**: Use the `checkpoint-commit` skill for real diff-based commit messages
- **Fallback autosave**: If a session ends with staged changes, they are committed safely without push
- **Cross-platform hooks**: Separate PowerShell and shell scripts are used for Windows and Unix-like environments

## Installation

1. Ensure the shell scripts are executable on macOS and Linux:
   ```bash
   chmod +x .github/hooks/session-auto-commit/auto-commit.sh
   chmod +x .github/hooks/session-auto-commit/auto-stage.sh
   ```

2. Commit the hook configuration and skill files to your repository.

## Configuration

The workspace hook file uses the VS Code lifecycle events `PostToolUse` and `Stop`:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "type": "command",
        "windows": "powershell -ExecutionPolicy Bypass -File .github\\hooks\\session-auto-commit\\auto-stage.ps1",
        "linux": ".github/hooks/session-auto-commit/auto-stage.sh",
        "osx": ".github/hooks/session-auto-commit/auto-stage.sh"
      }
    ],
    "Stop": [
      {
        "type": "command",
        "windows": "powershell -ExecutionPolicy Bypass -File .github\\hooks\\session-auto-commit\\auto-commit.ps1",
        "linux": ".github/hooks/session-auto-commit/auto-commit.sh",
        "osx": ".github/hooks/session-auto-commit/auto-commit.sh"
      }
    ]
  }
}
```

## How It Works

1. After every successful tool call, the `PostToolUse` hook runs
2. The auto-stage script reads the hook input and stages touched files only
3. During active work, use `/checkpoint-commit` to create a logical commit boundary from the staged diff
4. If the session stops with staged changes still present, the `Stop` hook creates `chore(autosave): save staged changes`

## Why This Split Works

- Staging is cheap and reversible, so it can happen frequently
- Commit creation is intentional and should use the model plus the staged diff
- Autosave commits are a safety net, not the primary history you review later

## Checkpoint Commit Skill

This hook package is designed to work with the portable skill at `.agents/skills/checkpoint-commit/SKILL.md`.

Invoke it with:

```text
/checkpoint-commit
```

You can optionally append a short intent, for example:

```text
/checkpoint-commit split out the review workflow changes
```

## Customization

You can customize the workflow by modifying these files:

- `auto-stage.sh` / `auto-stage.ps1`: change how touched files are detected or staged
- `auto-commit.sh` / `auto-commit.ps1`: adjust fallback autosave behavior
- `.agents/skills/checkpoint-commit/SKILL.md`: tune how diff-based commit messages are generated

## Disabling

To temporarily disable the workflow:

1. Remove or comment out the `PostToolUse` and `Stop` entries in `.github/hooks/session-auto-commit.json`
2. Or set `SKIP_AUTO_COMMIT=true` to disable only the fallback autosave commit

## Notes

- VS Code uses `Stop` as the session-end hook event, not `sessionEnd`
- Workspace hook files must be top-level JSON files in `.github/hooks/`
- VS Code currently ignores Claude-style matcher filters, so the auto-stage scripts inspect the hook payload directly
- The portable `checkpoint-commit` skill works across VS Code and GitHub Copilot CLI, but hook discovery behavior is runtime-specific
