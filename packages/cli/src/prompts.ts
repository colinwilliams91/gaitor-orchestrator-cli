/**
 * Interactive prompts for gaitor-orchestrator-cli.
 * Gathers project configuration from the user via the terminal.
 */

import { input, checkbox } from '@inquirer/prompts';

/** Metadata describing a single opt-in feature. */
export interface FeatureMeta {
  label: string;
  description: string;
}

/** All available opt-in feature IDs and their display labels. */
export const FEATURES: Record<string, FeatureMeta> = {
  agents: {
    label: 'Agent personae (.github/agents/)',
    description: 'Orchestrator, Implementer, Reviewer, Documenter, and RALPH agent definitions',
  },
  instructions: {
    label: 'Instruction files (.github/instructions/)',
    description: 'Coding standards, IDO rules, and dev tooling advertisement/guidelines',
  },
  prompts: {
    label: 'Prompt templates (.github/prompts/)',
    description: 'Commands/prompts for spec refinement, task template, API security audit prompts, RALPH loop, summarize and compose socials.',
  },
  hooks: {
    label: 'Git hooks (.github/hooks/)',
    description: 'Session auto-commit hooks for PostToolUse and Stop events',
  },
  ido: {
    label: 'Issue-Driven Orchestration (IDO)',
    description: 'GitHub issue templates and PR template for IDO-enabled repositories',
  },
  tools: {
    label: 'Local dev tools (package.json)',
    description: 'Project-local @playwright/cli and @mermaid-js/mermaid-cli devDependencies',
  },
  skills: {
    label: 'Shared skills (.agents/skills/)',
    description: 'Portable playwright-cli, mermaid-cli and checkpoint-commit skill modules',
  },
  copilot: {
    label: 'Copilot (github)',
    description: 'GH Copilot harness support',
  },
  claude: {
    label: 'Claude Code (anthropic)',
    description: 'Anthropic harness support',
  },
  codex: {
    label: 'Codex (openai)',
    description: 'OpenAI harness support',
  },
  cursor: {
    label: 'Cursor (anysphere)',
    description: 'Cursor code editor and harness support',
  },
  mcp: {
    label: 'MCP server config (mcp.local.json)',
    description: 'Local MCP server configuration template for Context7, markitdown, and Penpot',
  },
};

export const FEATURE_IDS = ['agents', 'instructions', 'prompts', 'hooks', 'ido', 'tools', 'skills', 'mcp'] as const;
export const HARNESS_IDS = ['copilot', 'claude', 'codex', 'cursor'] as const;
export type FeatureId = (typeof FEATURE_IDS)[number];
export type HarnessId = (typeof HARNESS_IDS)[number];
type SelectableOptionId = FeatureId | HarnessId | 'harnesses';

/**
 * Ask for the target project name.
 * If a positional argument was already provided, skip this prompt.
 *
 * @param positional - Value supplied on the command line, if any.
 * @returns The resolved project name.
 */
export async function askProjectName(positional: string | undefined): Promise<string> {
  if (positional) return positional;
  return input({
    message: 'Project name:',
    default: 'my-ai-ddlc-project',
    validate: (value: string) => {
      const trimmed = value.trim();
      if (!trimmed) return 'Project name cannot be empty.';
      if (!/^[a-z0-9_-]+$/i.test(trimmed)) {
        return 'Project name may only contain letters, digits, hyphens, and underscores.';
      }
      return true;
    },
  });
}

/**
 * Ask which opt-in features to include in the scaffolded workspace.
 *
 * @returns Array of selected feature IDs.
 */
export async function askFeatures(): Promise<string[]> {
  const choices = Object.entries(FEATURES).map(([value, meta]) => ({
    name: meta.label,
    value,
    checked: true,
  }));

  return checkbox({
    message: '🐊🤖 Select features to include (space to toggle, enter to confirm):',
    choices,
  });
}

/**
 * Resolve selected feature and harness IDs from Commander --no-* flags.
 *
 * @param opts - Commander option values.
 * @returns Selected feature and harness IDs.
 */
export function resolveSelectedFeatures(opts: Partial<Record<SelectableOptionId, boolean>>): string[] {
  const selectedFeatures = FEATURE_IDS.filter((featureId) => opts[featureId] !== false);
  const selectedHarnesses = opts.harnesses === false
    ? []
    : HARNESS_IDS.filter((harnessId) => opts[harnessId] !== false);

  return [...selectedFeatures, ...selectedHarnesses];
}

/**
 * Determine whether any --no-* selection flags were supplied.
 *
 * @param opts - Commander option values.
 * @returns Whether any feature or harness selection flag was explicitly disabled.
 */
export function hasSelectionFlagOverrides(opts: Partial<Record<SelectableOptionId, boolean>>): boolean {
  return (['harnesses', ...FEATURE_IDS, ...HARNESS_IDS] as const).some((optionId) => opts[optionId] === false);
}
