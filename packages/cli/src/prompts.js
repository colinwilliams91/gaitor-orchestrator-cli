/**
 * Interactive prompts for gaitor-orchestrator-cli.
 * Gathers project configuration from the user via the terminal.
 */

import { input, checkbox } from '@inquirer/prompts';

/** All available opt-in feature IDs and their display labels. */
export const FEATURES = {
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
};

/**
 * Ask for the target project name.
 * If a positional argument was already provided, skip this prompt.
 *
 * @param {string|undefined} positional - Value supplied on the command line, if any.
 * @returns {Promise<string>} The resolved project name.
 */
export async function askProjectName(positional) {
  if (positional) return positional;
  return input({
    message: 'Project name:',
    default: 'my-ai-ddlc-project',
    validate: (value) => {
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
 * @returns {Promise<string[]>} Array of selected feature IDs.
 */
export async function askFeatures() {
  const choices = Object.entries(FEATURES).map(([value, meta]) => ({
    name: meta.label,
    value,
    checked: true,
  }));

  return checkbox({
    message: '🐊🤖 Select features to include (space to toggle, enter to confirm):',
    choices,
    instructions: '\n  <space> toggle  <a> toggle all  <i> invert  <enter> confirm',
  });
}
