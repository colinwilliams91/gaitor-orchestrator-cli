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
template-spec.md          Template-maintainer design notes
```

## Development

```bash
npm install
npm test --workspace=packages/cli
node packages/cli/bin/create-gaitor.js demo-project --yes
```

## Release Flow

- Release automation is managed with `release-please` in manifest mode.
- Only `packages/cli` is versioned and published.
- Merging a release PR on `main` creates the GitHub release and publishes the package to npm.
- `release-please-config.json` pins the first automated release to `v1.0.0`; remove `release-as` after that initial release lands.

## Package Docs

For end-user CLI usage and scaffold details, see `packages/cli/README.md`.
