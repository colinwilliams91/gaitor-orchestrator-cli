/**
 * gaitor-orchestrator-cli — main entry point.
 *
 * Usage:
 *   npx gaitor-orchestrator-cli [project-name]
 *   npx create-gaitor [project-name]
 */

import { resolve } from 'node:path';
import { existsSync } from 'node:fs';
import { Command } from 'commander';
import { askProjectName, askFeatures, FEATURES } from './prompts.js';
import { scaffold } from './scaffold.js';

const program = new Command();

program
  .name('gaitor')
  .description('Scaffold a new AI-Driven Development Lifecycle (AI-DDLC) workspace in seconds.')
  .version('0.1.0')
  .argument('[project-name]', 'Name of the project directory to create')
  .option('-y, --yes', 'Skip interactive prompts and accept all defaults', false)
  .option('--no-agents', 'Exclude agent persona files')
  .option('--no-instructions', 'Exclude instruction files')
  .option('--no-prompts', 'Exclude prompt template files')
  .option('--no-hooks', 'Exclude git hook files')
  .option('--no-ido', 'Exclude Issue-Driven Orchestration files')
  .option('--no-tools', 'Exclude local dev-tools package.json')
  .option('--no-skills', 'Exclude shared skill modules')
  .action(async (projectNameArg, opts) => {
    console.log(`      ::::::::      :::     ::::::::::: ::::::::::: ::::::::  :::::::::
    :+:    :+:   :+: :+:       :+:         :+:    :+:    :+: :+:    :+:
   +:+         +:+   +:+      +:+         +:+    +:+    +:+ +:+    +:+
  :#:        +#++:++#++:     +#+         +#+    +#+    +:+ +#++:++#:
 +#+  +:#+# +#+     +#+     +#+         +#+    +#+    +#+ +#+    +#+
#+#    #+# #+#     #+#     #+#         #+#    #+#    #+# #+#    #+#
########  ###     ### ###########     ###     ########  ###    ###      `);
    console.log('\n🐊🤖  gaitor-orchestrator-cli\n');

    // Resolve project name
    const projectName = await askProjectName(projectNameArg);

    // Resolve target directory
    const targetDir = resolve(process.cwd(), projectName);

    if (existsSync(targetDir)) {
      console.error(`\n❌💀  Directory "${projectName}" already exists. Choose a different name or remove it first.\n`);
      process.exit(1);
    }

    // Resolve feature selection
    let features;
    if (opts.yes) {
      features = Object.keys(FEATURES);
    } else {
      // Pre-filter based on --no-* flags
      const flagDefaults = {
        agents: opts.agents,
        instructions: opts.instructions,
        prompts: opts.prompts,
        hooks: opts.hooks,
        ido: opts.ido,
        tools: opts.tools,
        skills: opts.skills,
      };
      const anyFlagSet = Object.values(flagDefaults).some((v) => v === false);
      if (anyFlagSet) {
        // Non-interactive mode: use flags to determine features
        features = Object.entries(flagDefaults)
          .filter(([, enabled]) => enabled !== false)
          .map(([id]) => id);
      } else {
        // Fully interactive: ask the user
        features = await askFeatures();
      }
    }

    // Scaffold the project
    console.log(`\n🐊📂  Creating "${projectName}"…\n`);
    try {
      await scaffold({ projectName, targetDir, features });
    } catch (err) {
      console.error(`\n❌💀  Scaffolding failed: ${err.message}\n`);
      process.exit(1);
    }

    // Success message
    console.log(`🐊🤖  Done! Your workspace is ready at ./${projectName}\n`);
    console.log('Next steps:\n');
    console.log(`  cd ${projectName}`);
    if (features.includes('tools')) {
      console.log('  npm install  # install local dev-tools');
    }
    console.log('  # Open in your editor and read CONTEXT.md to get started\n');
    console.log('🐊🤖  Gaitor done! 🤠🥀\n');
  });

program.parse(process.argv);
