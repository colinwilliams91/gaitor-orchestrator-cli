/**
 * Unit tests for scaffold.ts.
 *
 * Each test scaffolds into a fresh OS temp directory and cleans up afterwards,
 * so tests are fully isolated and leave no residue.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, existsSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { scaffold } from '../scaffold.js';

async function withTmpDir(fn: (dir: string) => Promise<void>): Promise<void> {
  const dir = mkdtempSync(join(tmpdir(), 'gaitor-scaffold-'));
  try {
    return await fn(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

test('scaffold creates the target directory', async () => {
  await withTmpDir(async (dir) => {
    const targetDir = join(dir, 'my-project');
    await scaffold({ projectName: 'my-project', targetDir, features: [] });
    assert.ok(existsSync(targetDir), 'Target directory should be created');
  });
});

test('scaffold copies base CONTEXT.md, README.md, and SPEC.md', async () => {
  await withTmpDir(async (dir) => {
    const targetDir = join(dir, 'my-project');
    await scaffold({ projectName: 'my-project', targetDir, features: [] });
    assert.ok(existsSync(join(targetDir, 'CONTEXT.md')));
    assert.ok(existsSync(join(targetDir, 'README.md')));
    assert.ok(existsSync(join(targetDir, 'SPEC.md')));
  });
});

test('scaffold does not copy harness adapter files without harness features', async () => {
  await withTmpDir(async (dir) => {
    const targetDir = join(dir, 'my-project');
    await scaffold({ projectName: 'my-project', targetDir, features: [] });
    assert.equal(existsSync(join(targetDir, 'AGENTS.md')), false);
    assert.equal(existsSync(join(targetDir, 'CLAUDE.md')), false);
    assert.equal(existsSync(join(targetDir, '.cursorrules')), false);
    assert.equal(existsSync(join(targetDir, '.github', 'copilot-instructions.md')), false);
  });
});

test('scaffold translates _gitignore to .gitignore', async () => {
  await withTmpDir(async (dir) => {
    const targetDir = join(dir, 'my-project');
    await scaffold({ projectName: 'my-project', targetDir, features: [] });
    assert.ok(existsSync(join(targetDir, '.gitignore')), '.gitignore should exist (translated from _gitignore)');
    assert.ok(!existsSync(join(targetDir, '_gitignore')), '_gitignore should NOT exist in output');
  });
});

test('scaffold substitutes {{PROJECT_NAME}} in CONTEXT.md and README.md', async () => {
  await withTmpDir(async (dir) => {
    const projectName = 'subst-test';
    const targetDir = join(dir, projectName);
    await scaffold({ projectName, targetDir, features: [] });
    const contextContent = readFileSync(join(targetDir, 'CONTEXT.md'), 'utf8');
    const readmeContent = readFileSync(join(targetDir, 'README.md'), 'utf8');
    assert.ok(contextContent.includes(projectName), 'CONTEXT.md should contain the project name');
    assert.ok(!contextContent.includes('{{PROJECT_NAME}}'), 'CONTEXT.md should not contain the raw placeholder');
    assert.ok(readmeContent.includes(projectName), 'README.md should contain the project name');
    assert.match(readmeContent, /alt="Gaitor Orchestrator"/);
  });
});

test('scaffold with agents feature creates .github/agents/', async () => {
  await withTmpDir(async (dir) => {
    const targetDir = join(dir, 'my-project');
    await scaffold({ projectName: 'my-project', targetDir, features: ['agents'] });
    assert.ok(existsSync(join(targetDir, '.github', 'agents')));
  });
});

test('scaffold with instructions feature creates .github/instructions/', async () => {
  await withTmpDir(async (dir) => {
    const targetDir = join(dir, 'my-project');
    await scaffold({ projectName: 'my-project', targetDir, features: ['instructions'] });
    assert.ok(existsSync(join(targetDir, '.github', 'instructions', 'coding-standards.instructions.md')));
  });
});

test('scaffold with hooks feature creates hook json and script files', async () => {
  await withTmpDir(async (dir) => {
    const targetDir = join(dir, 'my-project');
    await scaffold({ projectName: 'my-project', targetDir, features: ['hooks'] });
    assert.ok(existsSync(join(targetDir, '.github', 'hooks', 'session-auto-commit.json')));
    assert.ok(existsSync(join(targetDir, '.github', 'hooks', 'ido-context-sync.json')));
  });
});

test('scaffold with tools feature creates package.json and skills-lock.json', async () => {
  await withTmpDir(async (dir) => {
    const targetDir = join(dir, 'my-project');
    await scaffold({ projectName: 'my-project', targetDir, features: ['tools'] });
    assert.ok(existsSync(join(targetDir, 'package.json')));
    assert.ok(existsSync(join(targetDir, 'skills-lock.json')));
  });
});

test('scaffold with skills feature creates .agents/skills/', async () => {
  await withTmpDir(async (dir) => {
    const targetDir = join(dir, 'my-project');
    await scaffold({ projectName: 'my-project', targetDir, features: ['skills'] });
    assert.ok(existsSync(join(targetDir, '.agents', 'skills', 'playwright-cli')));
  });
});

test('scaffold with mcp feature creates mcp.local.json', async () => {
  await withTmpDir(async (dir) => {
    const targetDir = join(dir, 'my-project');
    await scaffold({ projectName: 'my-project', targetDir, features: ['mcp'] });
    assert.ok(existsSync(join(targetDir, 'mcp.local.json')));
  });
});

test('scaffold with copilot harness creates AGENTS.md and copilot instructions', async () => {
  await withTmpDir(async (dir) => {
    const targetDir = join(dir, 'my-project');
    await scaffold({ projectName: 'my-project', targetDir, features: ['copilot'] });
    assert.ok(existsSync(join(targetDir, 'AGENTS.md')));
    assert.ok(existsSync(join(targetDir, '.github', 'copilot-instructions.md')));
  });
});

test('scaffold with claude harness creates AGENTS.md and CLAUDE.md', async () => {
  await withTmpDir(async (dir) => {
    const targetDir = join(dir, 'my-project');
    await scaffold({ projectName: 'my-project', targetDir, features: ['claude'] });
    assert.ok(existsSync(join(targetDir, 'AGENTS.md')));
    assert.ok(existsSync(join(targetDir, 'CLAUDE.md')));
  });
});

test('scaffold with cursor harness creates AGENTS.md and .cursorrules', async () => {
  await withTmpDir(async (dir) => {
    const targetDir = join(dir, 'my-project');
    await scaffold({ projectName: 'my-project', targetDir, features: ['cursor'] });
    assert.ok(existsSync(join(targetDir, 'AGENTS.md')));
    assert.ok(existsSync(join(targetDir, '.cursorrules')));
  });
});

test('scaffold with all features creates all expected artefacts', async () => {
  await withTmpDir(async (dir) => {
    const projectName = 'full-project';
    const targetDir = join(dir, projectName);
    const allFeatures = ['agents', 'instructions', 'prompts', 'hooks', 'ido', 'tools', 'skills', 'mcp', 'copilot', 'claude', 'codex', 'cursor'];
    await scaffold({ projectName, targetDir, features: allFeatures });

    const expected = [
      'README.md',
      'CONTEXT.md',
      'AGENTS.md',
      'CLAUDE.md',
      '.cursorrules',
      '.github/copilot-instructions.md',
      '.github/agents/orchestrator.agent.md',
      '.github/instructions/coding-standards.instructions.md',
      '.github/prompts/ralph-loop.prompt.md',
      '.github/hooks/session-auto-commit.json',
      '.github/ISSUE_TEMPLATE',
      '.github/pull_request_template.md',
      'package.json',
      'skills-lock.json',
      '.agents/skills/playwright-cli',
      'mcp.local.json',
    ];

    for (const rel of expected) {
      assert.ok(existsSync(join(targetDir, rel)), `${rel} should exist`);
    }
  });
});

test('scaffold ignores unknown feature IDs without throwing', async () => {
  await withTmpDir(async (dir) => {
    const targetDir = join(dir, 'my-project');
    await assert.doesNotReject(
      scaffold({ projectName: 'my-project', targetDir, features: ['nonexistent-feature'] }),
    );
  });
});
