---
description: >
  Review and refine SPEC.md into a clearer, more implementation-ready project
  specification. Use this when the current spec is rough, ambiguous, or missing
  acceptance detail.
argument-hint: "[optional focus area or product slice]"
---

# Refine Project Spec

Use this prompt to improve `SPEC.md` with the human.

## Inputs

- `SPEC.md` — current project requirements draft
- `CONTEXT.md` — current workspace context and conventions
- `$ARGUMENTS` — optional focus area, feature slice, or problem area

## Workflow

1. Read `SPEC.md` and identify ambiguity, missing scope boundaries, weak acceptance criteria, and unresolved assumptions.
2. Ask the user only the highest-value clarifying questions needed to improve the spec.
3. Group questions so the user can answer efficiently.
4. If the user has not yet answered enough to justify edits, stop after the questions.
5. Only update `SPEC.md` when one of these user gestures exists:
   - the user explicitly invoked `/refine-spec` and asked you to apply improvements now
   - the user explicitly says to update or rewrite `SPEC.md`
   - the user answers your clarification questions and explicitly approves applying the refined spec
   - you have been given prior override permissions such as "Bypass Approvals", "Autopilot", or "YOLO" mode.
6. When editing `SPEC.md`:
   - preserve existing requirement IDs where possible
   - convert vague statements into observable requirements or open questions
   - narrow overly broad scope into clearer delivery slices
   - avoid inventing facts that the user did not provide
7. Summarize what changed and list any remaining open questions.

## Guardrails

- Treat `SPEC.md` as product and delivery intent, not as architecture notes.
- Do not modify implementation files during spec refinement.
- If there is significant uncertainty, prefer adding entries to **Open Questions** over making assumptions.

## Output

- Clarifying questions for the user, or
- an updated `SPEC.md` plus a concise summary of changes and remaining gaps
