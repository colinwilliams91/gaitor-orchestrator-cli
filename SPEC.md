# Project Specification — gaitor-orchestrator-cli

Status: In Progress — v0.1.0 CLI scaffolding implemented

Purpose: Define the product, feature, and delivery requirements for the `gaitor-orchestrator-cli` tool.

---

## How To Use This File

- Start rough. Bullet points and partial answers are enough.
- Let agents ask clarifying questions and turn vague ideas into concrete requirements.
- Prefer user outcomes and acceptance criteria over implementation detail.
- Keep unresolved items in **Open Questions** rather than hiding assumptions.
- Use `CONTEXT.md` for current workspace state and team conventions. Use this file for project scope and requirements.

---

## 1. Problem Statement

Developers who want to use the AI-DDLC template must manually clone or copy the GitHub repository and then manually remove the files they don't need. This is friction-heavy and error-prone.

- **Problem:** No streamlined, opt-in method to scaffold an AI-DDLC workspace.
- **Current pain:** Cloning the whole repo gives too much; picking files manually is tedious.
- **Desired outcome:** Run one command, answer a few questions, get a lean workspace.

## 2. Goals And Non-Goals

### 2.1 Goals

- Provide an `npx gaitor-orchestrator-cli <project-name>` experience similar to `create-react-app`.
- Allow users to opt in or out of features interactively (or via flags).
- Scaffold a clean workspace with `CONTEXT.md`, `SPEC.md`, agents, instructions, prompts, hooks, IDO templates, local tools, and shared skills.
- Apply `{{PROJECT_NAME}}` substitution so generated files reference the real project.

### 2.2 Non-Goals

- No GUI or web interface.
- No plugin system in v0.1.
- No remote template fetching in v0.1 (templates are embedded in the package).

## 3. Users And Core Workflows

### 3.1 Primary Users

- **Developer / AI-DDLC adopter** who wants to bootstrap a new AI-augmented project.
- Comfortable with the command line; familiar with GitHub Copilot or similar AI coding tools.

### 3.2 Core Workflows

1. **Full interactive scaffolding**
   - Trigger: `npx gaitor-orchestrator-cli my-app`
   - Steps: prompted for project name (if not given) → feature checkbox → files generated.
   - Outcome: `./my-app/` directory with selected files, project name substituted.

2. **Silent / CI scaffolding**
   - Trigger: `npx gaitor-orchestrator-cli my-app --yes`
   - Steps: all defaults accepted, no prompts.
   - Outcome: full workspace generated non-interactively.

3. **Selective feature exclusion**
   - Trigger: `npx gaitor-orchestrator-cli my-app --no-ido --no-tools`
   - Steps: flags override interactive defaults.
   - Outcome: workspace without IDO templates or local dev-tools package.

## 4. Scope

### 4.1 In Scope (v0.1)

- Core files: `CONTEXT.md`, `SPEC.md`, `AGENTS.md`, `CLAUDE.md`, `.gitignore`, `.github/copilot-instructions.md`.
- Opt-in features: agents, instructions, prompts, hooks, IDO, local tools, skills.
- `{{PROJECT_NAME}}` substitution in all text template files.
- `--yes` flag for non-interactive use.
- `--no-<feature>` flags for flag-based opt-out.

### 4.2 Out Of Scope

- Publishing to npm registry (deferred to a future release).
- Remote template sources / plugins.
- Monorepo / workspace sub-directory scaffolding.

## 5. Functional Requirements

- `FR-001` — The CLI must accept an optional `[project-name]` positional argument.
- `FR-002` — If no project name is provided, the CLI must prompt interactively.
- `FR-003` — The CLI must display a checkbox list of opt-in features, all checked by default.
- `FR-004` — `--yes` must skip all prompts and scaffold all features.
- `FR-005` — `--no-<feature>` flags must disable the corresponding feature without prompting.
- `FR-006` — If the target directory already exists, the CLI must exit with a clear error.
- `FR-007` — All text template files must have `{{PROJECT_NAME}}` replaced with the project name.
- `FR-008` — Template files prefixed with `_` must be written with a `.` prefix (e.g., `_gitignore` → `.gitignore`).

## 6. Non-Functional Requirements

- `NFR-001` — The CLI must run on Node.js ≥ 20.
- `NFR-002` — Total install size (including dependencies) must remain reasonable for an `npx`-first tool.
- `NFR-003` — All third-party dependencies must be checked for known vulnerabilities before adoption.

## 7. Constraints And Dependencies

### 7.1 Constraints

- CLI must be usable via `npx` without a global install.
- Templates are embedded in the package (no network calls at scaffold time).

### 7.2 Dependencies

- `commander` ^14 — CLI argument parsing.
- `@inquirer/prompts` ^8 — Interactive prompts.

## 8. Success Criteria

- `npx gaitor-orchestrator-cli my-app --yes` creates a complete workspace in `./my-app/`.
- `node packages/cli/bin/create-gaitor.js --help` prints the usage summary.
- All scaffolded files contain the correct project name (no `{{PROJECT_NAME}}` literals).
- Existing directory triggers a clear error message and non-zero exit code.

## 9. Delivery Slices

### Slice 1 — MVP CLI (v0.1.0) ✅

- User-visible outcome: Developer can scaffold a workspace with all or a subset of AI-DDLC files in one command.
- Key requirements: FR-001 through FR-008, NFR-001.
- Done when: `--help` works, `--yes` scaffolds all files correctly, minimal scaffold works.

### Slice 2 — npm publish + README (future)

- User-visible outcome: `npx gaitor-orchestrator-cli` works without cloning the repo.
- Key requirements: Published to npm, `README.md` updated with install instructions.
- Done when: `npm publish` succeeds; `npx gaitor-orchestrator-cli --version` works from any machine.

### Slice 3 — `mcp.local.json` template feature (future)

- User-visible outcome: User can opt into an MCP config template.
- Key requirements: New `--mcp` feature that writes a starter `mcp.local.json` (gitignored).
- Done when: Feature added to interactive prompt and scaffolded correctly.

## 10. Open Questions

- `OQ-001` — Should the CLI be published to npm as `gaitor-orchestrator-cli` or as `create-gaitor` (allowing `npm create gaitor`)?
- `OQ-002` — Should `mcp.local.json` generation be added as an opt-in feature in Slice 3?
- `OQ-003` — Should remote template sources (GitHub repos) be supported in a future slice?

## 11. Notes For Agents

- Ask clarifying questions when requirements are ambiguous or conflicting.
- Preserve requirement IDs when refining the spec.
- Propose narrower delivery slices if the scope is too broad.
- Do not silently convert assumptions into facts.
- When implementing or reviewing, treat this file as the product and delivery spec.

---

_Updated by Copilot after v0.1.0 CLI implementation._
