---
applyTo: "**"
---

# Issue-Driven Orchestration (IDO)

Issue-Driven Orchestration is an optional workflow for repositories or workstreams that a human developer has explicitly chosen to run through GitHub Issues.

Unless the human explicitly opts in, treat IDO as disabled.

When IDO is disabled:

- Do not block implementation because no GitHub Issue exists.
- Do not require GitHub Projects, labels, or issue routing ceremony.
- Do not assume every task must start from the issue template.

Treat IDO as enabled only when at least one of the following is true:

- The human explicitly says to enable IDO for the repository or the current workstream.
- The current task is explicitly routed from an existing GitHub Issue as part of an IDO workflow.
- `CONTEXT.md` or repository-specific instructions explicitly mark the current workstream as IDO-enabled.

When IDO is enabled:

- Start implementation work from a GitHub Issue with a problem statement and clear acceptance criteria.
- Prefer `.github/ISSUE_TEMPLATE/new_ticket.yaml` when filing new work.
- Link implementation PRs back to the issue with `Closes #N` or equivalent.
- Keep human approval in the merge path.
- Update `CONTEXT.md` after meaningful workflow or architecture changes.

Recommended flow for IDO-enabled work:

```text
Issue filed -> triage -> agent assigned -> PR opened (Closes #N) -> review consensus -> human approval -> merge -> Documenter updates CONTEXT.md
```

Current template support:

- Present now: `.github/ISSUE_TEMPLATE/new_ticket.yaml`, `.github/pull_request_template.md`, `.github/prompts/ralph-loop.prompt.md`, and this instructions file.
- Not scaffolded yet: a dedicated `issue-intake.agent.md`, a `resolve-issue.prompt.md`, and a repository label manifest such as `.github/labels.yml`.

Label conventions are optional project policy, not a global requirement of this template. If a repository adopts labels for IDO routing, recommended namespaces are `type:*`, `agent:*`, `status:*`, and `priority:*`.

For Copilot coding-agent workflows in an IDO-enabled repository, a project may choose to use a convention like `agent:copilot` for routing, but that convention is optional unless the human has adopted it for the repository.
