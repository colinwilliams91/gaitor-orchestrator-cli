---
name: checkpoint-commit
description: Create a deliberate git checkpoint commit from staged or current working changes using a diff-based, model-written Conventional Commit message. Use when you want a clean commit boundary during intensive agentic iteration.
argument-hint: "[optional intent or scope]"
disable-model-invocation: true
---

# Checkpoint Commit

Use this skill when you want a real commit, not an autosave fallback.

## Required Workflow

1. Confirm the current directory is inside a git repository.
2. Inspect `git status --short`.
3. If staged changes already exist, use them as the commit boundary.
4. If nothing is staged but the working tree is dirty, stage the current work with `git add -A` because the user explicitly invoked a commit checkpoint.
5. If there are still no changes, stop and report that there is nothing to commit.
6. Gather commit context from the staged diff:
   - `git diff --cached --name-status`
   - `git diff --cached --stat`
   - `git diff --cached --unified=2`
   - `git log --oneline -5`
7. Write the commit message from the actual diff.
8. Create the commit immediately unless the user explicitly asked for a preview only.

## Commit Message Rules

- Follow Conventional Commits.
- Choose `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `perf`, or `ci` based on the behavioral change shown in the diff, not only file names.
- Add a scope only when it is obvious and materially helpful.
- Keep the subject line concise, imperative, and specific.
- Use the user's `$ARGUMENTS` as optional intent if it improves the message.
- Add a body only when the diff spans multiple tightly related changes and the extra context is genuinely useful.
- Do not use timestamps.
- Do not use placeholder phrases like `update files` or `misc changes`.
- Do not expose hidden reasoning or chain-of-thought.

## Guardrails

- Prefer one logical commit. If the staged diff spans unrelated concerns, stop and tell the user to split the change set.
- Do not push.
- Do not amend unless the user explicitly asks.
- If `git commit` fails, report the failure and the proposed commit message clearly.

## Output

After committing, report:

1. The final commit subject.
2. Whether a commit body was used.
3. The files included in the staged set.
