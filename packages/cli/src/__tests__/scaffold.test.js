/**
 * Unit tests for scaffold.js.
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

/** Create a unique temp directory, run fn(dir), then remove the temp dir. */
async function withTmpDir(fn) {
  const dir = mkdtempSync(join(tmpdir(), 'gaitor-scaffold-'));
  try {
    return await fn(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

// ---------------------------------------------------------------------------
// Base files (always included)
// ---------------------------------------------------------------------------

test('scaffold creates the target directory', async () => {
  await withTmpDir(async (dir) => {
    const targetDir = join(dir, 'my-project');
    await scaffold({ projectName: 'my-project', targetDir, features: [] });
    assert.ok(existsSync(targetDir), 'Target directory should be created');
  });
});

test('scaffold copies base CONTEXT.md', async () => {
  await withTmpDir(async (dir) => {
    const targetDir = join(dir, 'my-project');
    await scaffold({ projectName: 'my-project', targetDir, features: [] });
    assert.ok(existsSync(join(targetDir, 'CONTEXT.md')));
  });
});

test('scaffold copies base AGENTS.md', async () => {
  await withTmpDir(async (dir) => {
    const targetDir = join(dir, 'my-project');
    await scaffold({ projectName: 'my-project', targetDir, features: [] });
    assert.ok(existsSync(join(targetDir, 'AGENTS.md')));
  });
});

test('scaffold copies base SPEC.md', async () => {
  await withTmpDir(async (dir) => {
    const targetDir = join(dir, 'my-project');
    await scaffold({ projectName: 'my-project', targetDir, features: [] });
    assert.ok(existsSync(join(targetDir, 'SPEC.md')));
  });
});

test('scaffold copies base CLAUDE.md', async () => {
  await withTmpDir(async (dir) => {
    const targetDir = join(dir, 'my-project');
    await scaffold({ projectName: 'my-project', targetDir, features: [] });
    assert.ok(existsSync(join(targetDir, 'CLAUDE.md')));
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

test('scaffold translates _github directory to .github', async () => {
  await withTmpDir(async (dir) => {
    const targetDir = join(dir, 'my-project');
    await scaffold({ projectName: 'my-project', targetDir, features: [] });
    assert.ok(existsSync(join(targetDir, '.github')), '.github directory should exist (translated from _github)');
  });
});

// ---------------------------------------------------------------------------
// {{PROJECT_NAME}} substitution
// ---------------------------------------------------------------------------

test('scaffold substitutes {{PROJECT_NAME}} in CONTEXT.md', async () => {
  await withTmpDir(async (dir) => {
    const projectName = 'subst-test';
    const targetDir = join(dir, projectName);
    await scaffold({ projectName, targetDir, features: [] });
    const content = readFileSync(join(targetDir, 'CONTEXT.md'), 'utf8');
    assert.ok(content.includes(projectName), 'CONTEXT.md should contain the project name');
    assert.ok(!content.includes('{{PROJECT_NAME}}'), 'CONTEXT.md should not contain the raw placeholder');
  });
});

test('scaffold substitutes {{PROJECT_NAME}} in SPEC.md', async () => {
  await withTmpDir(async (dir) => {
    const projectName = 'spec-subst';
    const targetDir = join(dir, projectName);
    await scaffold({ projectName, targetDir, features: [] });
    const content = readFileSync(join(targetDir, 'SPEC.md'), 'utf8');
    assert.ok(!content.includes('{{PROJECT_NAME}}'), 'SPEC.md should not contain the raw placeholder');
  });
});

// ---------------------------------------------------------------------------
// Feature: agents
// ---------------------------------------------------------------------------

test('scaffold with agents feature creates .github/agents/', async () => {
  await withTmpDir(async (dir) => {
    const targetDir = join(dir, 'my-project');
    await scaffold({ projectName: 'my-project', targetDir, features: ['agents'] });
    assert.ok(existsSync(join(targetDir, '.github', 'agents')));
  });
});

test('scaffold with agents feature copies agent files', async () => {
  await withTmpDir(async (dir) => {
    const targetDir = join(dir, 'my-project');
    await scaffold({ projectName: 'my-project', targetDir, features: ['agents'] });
    for (const file of ['orchestrator.agent.md', 'implementer.agent.md', 'reviewer.agent.md', 'documenter.agent.md', 'ralph.agent.md']) {
      assert.ok(existsSync(join(targetDir, '.github', 'agents', file)), `${file} should exist`);
    }
  });
});

test('scaffold without agents feature does not create .github/agents/', async () => {
  await withTmpDir(async (dir) => {
    const targetDir = join(dir, 'my-project');
    await scaffold({ projectName: 'my-project', targetDir, features: [] });
    assert.ok(!existsSync(join(targetDir, '.github', 'agents')));
  });
});

// ---------------------------------------------------------------------------
// Feature: instructions
// ---------------------------------------------------------------------------

test('scaffold with instructions feature creates .github/instructions/', async () => {
  await withTmpDir(async (dir) => {
    const targetDir = join(dir, 'my-project');
    await scaffold({ projectName: 'my-project', targetDir, features: ['instructions'] });
    assert.ok(existsSync(join(targetDir, '.github', 'instructions')));
    assert.ok(existsSync(join(targetDir, '.github', 'instructions', 'coding-standards.instructions.md')));
  });
});

test('scaffold without instructions feature does not create .github/instructions/', async () => {
  await withTmpDir(async (dir) => {
    const targetDir = join(dir, 'my-project');
    await scaffold({ projectName: 'my-project', targetDir, features: [] });
    assert.ok(!existsSync(join(targetDir, '.github', 'instructions')));
  });
});

// ---------------------------------------------------------------------------
// Feature: prompts
// ---------------------------------------------------------------------------

test('scaffold with prompts feature creates .github/prompts/', async () => {
  await withTmpDir(async (dir) => {
    const targetDir = join(dir, 'my-project');
    await scaffold({ projectName: 'my-project', targetDir, features: ['prompts'] });
    assert.ok(existsSync(join(targetDir, '.github', 'prompts')));
    assert.ok(existsSync(join(targetDir, '.github', 'prompts', 'ralph-loop.prompt.md')));
  });
});

// ---------------------------------------------------------------------------
// Feature: hooks
// ---------------------------------------------------------------------------

test('scaffold with hooks feature creates hook json and script files', async () => {
  await withTmpDir(async (dir) => {
    const targetDir = join(dir, 'my-project');
    await scaffold({ projectName: 'my-project', targetDir, features: ['hooks'] });
    assert.ok(existsSync(join(targetDir, '.github', 'hooks', 'session-auto-commit.json')));
    assert.ok(existsSync(join(targetDir, '.github', 'hooks', 'ido-context-sync.json')));
    assert.ok(existsSync(join(targetDir, '.github', 'hooks', 'session-auto-commit')));
    assert.ok(existsSync(join(targetDir, '.github', 'hooks', 'ido-context-sync')));
  });
});

test('scaffold without hooks feature does not create hook files', async () => {
  await withTmpDir(async (dir) => {
    const targetDir = join(dir, 'my-project');
    await scaffold({ projectName: 'my-project', targetDir, features: [] });
    assert.ok(!existsSync(join(targetDir, '.github', 'hooks', 'session-auto-commit.json')));
  });
});

// ---------------------------------------------------------------------------
// Feature: ido
// ---------------------------------------------------------------------------

test('scaffold with ido feature creates ISSUE_TEMPLATE and PR template', async () => {
  await withTmpDir(async (dir) => {
    const targetDir = join(dir, 'my-project');
    await scaffold({ projectName: 'my-project', targetDir, features: ['ido'] });
    assert.ok(existsSync(join(targetDir, '.github', 'ISSUE_TEMPLATE')));
    assert.ok(existsSync(join(targetDir, '.github', 'pull_request_template.md')));
  });
});

// ---------------------------------------------------------------------------
// Feature: tools
// ---------------------------------------------------------------------------

test('scaffold with tools feature creates package.json and skills-lock.json', async () => {
  await withTmpDir(async (dir) => {
    const targetDir = join(dir, 'my-project');
    await scaffold({ projectName: 'my-project', targetDir, features: ['tools'] });
    assert.ok(existsSync(join(targetDir, 'package.json')));
    assert.ok(existsSync(join(targetDir, 'skills-lock.json')));
  });
});

test('scaffold tools feature applies {{PROJECT_NAME}} substitution in package.json', async () => {
  await withTmpDir(async (dir) => {
    const projectName = 'tools-subst-test';
    const targetDir = join(dir, projectName);
    await scaffold({ projectName, targetDir, features: ['tools'] });
    const content = readFileSync(join(targetDir, 'package.json'), 'utf8');
    assert.ok(content.includes(projectName), 'package.json should contain the project name');
    assert.ok(!content.includes('{{PROJECT_NAME}}'), 'package.json should not contain the raw placeholder');
  });
});

// ---------------------------------------------------------------------------
// Feature: skills
// ---------------------------------------------------------------------------

test('scaffold with skills feature creates .agents/skills/', async () => {
  await withTmpDir(async (dir) => {
    const targetDir = join(dir, 'my-project');
    await scaffold({ projectName: 'my-project', targetDir, features: ['skills'] });
    assert.ok(existsSync(join(targetDir, '.agents', 'skills')));
    assert.ok(existsSync(join(targetDir, '.agents', 'skills', 'playwright-cli')));
    assert.ok(existsSync(join(targetDir, '.agents', 'skills', 'mermaid-cli')));
    assert.ok(existsSync(join(targetDir, '.agents', 'skills', 'checkpoint-commit')));
  });
});

// ---------------------------------------------------------------------------
// Feature: mcp
// ---------------------------------------------------------------------------

test('scaffold with mcp feature creates mcp.local.json', async () => {
  await withTmpDir(async (dir) => {
    const targetDir = join(dir, 'my-project');
    await scaffold({ projectName: 'my-project', targetDir, features: ['mcp'] });
    assert.ok(existsSync(join(targetDir, 'mcp.local.json')));
  });
});

test('scaffold without mcp feature does not create mcp.local.json', async () => {
  await withTmpDir(async (dir) => {
    const targetDir = join(dir, 'my-project');
    await scaffold({ projectName: 'my-project', targetDir, features: [] });
    assert.ok(!existsSync(join(targetDir, 'mcp.local.json')));
  });
});

// ---------------------------------------------------------------------------
// All features together
// ---------------------------------------------------------------------------

test('scaffold with all features creates all expected artefacts', async () => {
  await withTmpDir(async (dir) => {
    const projectName = 'full-project';
    const targetDir = join(dir, projectName);
    const allFeatures = ['agents', 'instructions', 'prompts', 'hooks', 'ido', 'tools', 'skills', 'mcp'];
    await scaffold({ projectName, targetDir, features: allFeatures });

    const expected = [
      'CONTEXT.md',
      'AGENTS.md',
      'SPEC.md',
      '.gitignore',
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

// ---------------------------------------------------------------------------
// Unknown feature IDs are silently ignored
// ---------------------------------------------------------------------------

test('scaffold ignores unknown feature IDs without throwing', async () => {
  await withTmpDir(async (dir) => {
    const targetDir = join(dir, 'my-project');
    await assert.doesNotReject(
      scaffold({ projectName: 'my-project', targetDir, features: ['nonexistent-feature'] }),
    );
  });
});
