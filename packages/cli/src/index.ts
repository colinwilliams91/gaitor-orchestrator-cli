/**
 * gaitor-orchestrator-cli — main entry point.
 *
 * Usage:
 *   npx gaitor-orchestrator-cli [project-name]
 *   npx gaitor-orchestrator-cli [project-name] --yes
 */

import { resolve } from 'node:path';
import { existsSync } from 'node:fs';
import { Command } from 'commander';
import packageJson from '../package.json' with { type: 'json' };
import { askProjectName, askFeatures, FEATURES } from './prompts.js';
import { scaffold } from './scaffold.js';

/** Options populated by Commander from CLI flags. */
interface CliOptions {
  yes: boolean;
  agents: boolean;
  instructions: boolean;
  prompts: boolean;
  hooks: boolean;
  ido: boolean;
  tools: boolean;
  skills: boolean;
  mcp: boolean;
}

const program = new Command();

function addCreateOptions(command: Command): Command {
  return command
    .option('-y, --yes', 'Skip interactive prompts and accept all defaults', false)
    .option('--no-agents', 'Exclude agent persona files')
    .option('--no-instructions', 'Exclude instruction files')
    .option('--no-prompts', 'Exclude prompt template files')
    .option('--no-hooks', 'Exclude git hook files')
    .option('--no-ido', 'Exclude Issue-Driven Orchestration files')
    .option('--no-tools', 'Exclude local dev-tools package.json')
    .option('--no-skills', 'Exclude shared skill modules')
    .option('--no-mcp', 'Exclude MCP server config file (mcp.local.json)');
}

async function runCreate(projectNameArg: string | undefined, opts: CliOptions): Promise<void> {
  console.log(`
      ::::::::      :::     ::::::::::: ::::::::::: ::::::::  :::::::::
    :+:    :+:   :+: :+:       :+:         :+:    :+:    :+: :+:    :+:
   +:+         +:+   +:+      +:+         +:+    +:+    +:+ +:+    +:+
  :#:        +#++:++#++:     +#+         +#+    +#+    +:+ +#++:++#:
 +#+  +:#+# +#+     +#+     +#+         +#+    +#+    +#+ +#+    +#+
#+#    #+# #+#     #+#     #+#         #+#    #+#    #+# #+#    #+#
########  ###     ### ###########     ###     ########  ###    ###
`);
  console.log('\n🐊🤖  gaitor-orchestrator-cli\n');

  const projectName = await askProjectName(projectNameArg);
  const targetDir = resolve(process.cwd(), projectName);

  if (existsSync(targetDir)) {
    console.error(`\n❌💀  Directory "${projectName}" already exists. Choose a different name or remove it first.\n`);
    process.exit(1);
  }

  let features: string[];
  if (opts.yes) {
    features = Object.keys(FEATURES);
  } else {
    const flagDefaults: Record<string, boolean> = {
      agents: opts.agents,
      instructions: opts.instructions,
      prompts: opts.prompts,
      hooks: opts.hooks,
      ido: opts.ido,
      tools: opts.tools,
      skills: opts.skills,
      mcp: opts.mcp,
    };
    const anyFlagSet = Object.values(flagDefaults).some((value) => value === false);
    if (anyFlagSet) {
      features = Object.entries(flagDefaults)
        .filter(([, enabled]) => enabled !== false)
        .map(([id]) => id);
    } else {
      features = await askFeatures();
    }
  }

  console.log(`\n🐊📂  Creating "${projectName}"…\n`);
  try {
    await scaffold({ projectName, targetDir, features });
  } catch (err) {
    console.error(`\n❌💀  Scaffolding failed: ${(err as Error).message}\n`);
    process.exit(1);
  }

  console.log(`🐊🤖  Done! Your workspace is ready at ./${projectName}\n`);
  console.log('Next steps:\n');
  console.log(`  cd ${projectName}`);
  if (features.includes('tools')) {
    console.log('  npm install  # install local dev-tools');
  }
  console.log('  # Open in your editor and read CONTEXT.md to get started\n');
  console.log('🐊🤖  Gaitor done! 🤠🥀\n');
}

addCreateOptions(program)
  .name('gaitor')
  .description('Scaffold a new AI-Driven Development Lifecycle (AI-DDLC) workspace in seconds.')
  .version(packageJson.version)
  .argument('[project-name]', 'Name of the project directory to create')
  .addHelpText('after', '\nAliases:\n  gaitor create [project-name]\n  gaitor-create [project-name]\n')
  .action(async function (this: Command, projectNameArg: string | undefined) {
    await runCreate(projectNameArg, this.opts<CliOptions>());
  });

const argv = [...process.argv];
if (argv[2] === 'create') {
  argv.splice(2, 1);
}

program.parse(argv);
