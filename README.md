# gaitor-orchestrator-cli

Source repository for the `gaitor-orchestrator-cli` npm package.

The publishable package lives in `packages/cli`. The repository root remains a private workspace wrapper for development, docs, and release automation.

## Quick Start

```bash
# Interactive scaffold
npx gaitor-orchestrator-cli my-project

# Non-interactive scaffold
npx gaitor-orchestrator-cli my-project --yes

# Global install
npm install -g gaitor-orchestrator-cli
gaitor my-project
```

## Repository Layout

```text
.github/                  Release workflows, prompts, instructions, and templates
packages/cli/             Publishable CLI package
packages/cli/templates/   Files embedded into the scaffolded workspace
CONTEXT.md                Shared project state for agents
SPEC.md                   Product and delivery specification for the CLI
```

## Development

```bash
# Install dependencies (first time only)
npm install

# Run all tests
npm test --workspace=packages/cli

# Smoke-test the CLI manually
node packages/cli/bin/create-gaitor.js demo-project --yes
```

### Test suite

Tests live in `packages/cli/src/__tests__/` and use the built-in Node.js test runner (`node:test`). No extra test framework is needed.

| File | What it covers |
|------|---------------|
| `cli.test.js` | End-to-end CLI behaviour: `--help`, `--version`, `--yes` scaffolding, `{{PROJECT_NAME}}` substitution, and non-zero exit on conflicting directory |
| `scaffold.test.js` | Unit tests for every `scaffold()` path: base files, each opt-in feature, `_underscore` → `.dot` renaming, template substitution, and unknown-feature resilience |
| `prompts.test.js` | Unit tests for `FEATURES` registry shape and the non-interactive fast-path of `askProjectName` |

## Release Flow

- Release automation is managed with `release-please` in manifest mode.
- Only `packages/cli` is versioned and published.
- Merging a release PR on `main` creates the GitHub release and publishes the package to npm.
- `release-please-config.json` pins the first automated release to `v1.0.0`; remove `release-as` after that initial release lands.

## Package Docs

For end-user CLI usage and scaffold details, see `packages/cli/README.md`.
