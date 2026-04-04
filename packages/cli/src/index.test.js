import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import packageJson from '../package.json' with { type: 'json' };
import { hasSelectionFlagOverrides, resolveSelectedFeatures } from './prompts.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const cliPath = resolve(__dirname, '../bin/create-gaitor.js');

test('prints help output', () => {
  const result = spawnSync(process.execPath, [cliPath, '--help'], {
    encoding: 'utf8',
  });

  assert.equal(result.status, 0);
  assert.match(result.stdout, /Usage: gaitor/);
  assert.match(result.stdout, /--no-harnesses/);
  assert.match(result.stdout, /--no-copilot/);
  assert.match(result.stdout, /--no-claude/);
  assert.match(result.stdout, /--no-codex/);
  assert.match(result.stdout, /--no-cursor/);
});

test('prints the package version', () => {
  const result = spawnSync(process.execPath, [cliPath, '--version'], {
    encoding: 'utf8',
  });

  assert.equal(result.status, 0);
  assert.equal(result.stdout.trim(), packageJson.version);
});

test('resolveSelectedFeatures keeps all harnesses enabled by default', () => {
  const selected = resolveSelectedFeatures({
    agents: true,
    instructions: true,
    prompts: true,
    hooks: true,
    ido: true,
    tools: true,
    skills: true,
    harnesses: true,
    copilot: true,
    claude: true,
    codex: true,
    cursor: true,
  });

  assert.deepEqual(selected, [
    'agents',
    'instructions',
    'prompts',
    'hooks',
    'ido',
    'tools',
    'skills',
    'copilot',
    'claude',
    'codex',
    'cursor',
  ]);
});

test('resolveSelectedFeatures honors no-harnesses override', () => {
  const selected = resolveSelectedFeatures({
    agents: true,
    instructions: true,
    prompts: true,
    hooks: true,
    ido: true,
    tools: true,
    skills: true,
    harnesses: false,
    copilot: true,
    claude: true,
    codex: true,
    cursor: true,
  });

  assert.deepEqual(selected, [
    'agents',
    'instructions',
    'prompts',
    'hooks',
    'ido',
    'tools',
    'skills',
  ]);
  assert.equal(hasSelectionFlagOverrides({ harnesses: false }), true);
});

test('resolveSelectedFeatures honors individual harness exclusions', () => {
  const selected = resolveSelectedFeatures({
    agents: true,
    instructions: true,
    prompts: true,
    hooks: true,
    ido: true,
    tools: true,
    skills: true,
    harnesses: true,
    copilot: false,
    claude: true,
    codex: true,
    cursor: false,
  });

  assert.deepEqual(selected, [
    'agents',
    'instructions',
    'prompts',
    'hooks',
    'ido',
    'tools',
    'skills',
    'claude',
    'codex',
  ]);
  assert.equal(hasSelectionFlagOverrides({ copilot: false }), true);
});

test('scaffolds README image and all harness files by default with --yes', () => {
  const tempRoot = mkdtempSync(join(tmpdir(), 'gaitor-cli-'));

  try {
    const result = spawnSync(process.execPath, [cliPath, 'all-harnesses', '--yes'], {
      cwd: tempRoot,
      encoding: 'utf8',
    });

    assert.equal(result.status, 0, result.stderr);

    const projectDir = join(tempRoot, 'all-harnesses');
    const readme = readFileSync(join(projectDir, 'README.md'), 'utf8');

    assert.match(readme, /alt="Gaitor Orchestrator"/);
    assert.equal(existsSync(join(projectDir, 'AGENTS.md')), true);
    assert.equal(existsSync(join(projectDir, 'CLAUDE.md')), true);
    assert.equal(existsSync(join(projectDir, '.cursorrules')), true);
    assert.equal(existsSync(join(projectDir, '.github', 'copilot-instructions.md')), true);
    assert.equal(existsSync(join(projectDir, 'CONTEXT.md')), true);
  } finally {
    rmSync(tempRoot, { recursive: true, force: true });
  }
});

test('scaffolds only CONTEXT.md from harness matrix with --no-harnesses', () => {
  const tempRoot = mkdtempSync(join(tmpdir(), 'gaitor-cli-'));

  try {
    const result = spawnSync(process.execPath, [cliPath, 'no-harnesses', '--yes', '--no-harnesses'], {
      cwd: tempRoot,
      encoding: 'utf8',
    });

    assert.equal(result.status, 0, result.stderr);

    const projectDir = join(tempRoot, 'no-harnesses');
    assert.equal(existsSync(join(projectDir, 'CONTEXT.md')), true);
    assert.equal(existsSync(join(projectDir, 'AGENTS.md')), false);
    assert.equal(existsSync(join(projectDir, 'CLAUDE.md')), false);
    assert.equal(existsSync(join(projectDir, '.cursorrules')), false);
    assert.equal(existsSync(join(projectDir, '.github', 'copilot-instructions.md')), false);
  } finally {
    rmSync(tempRoot, { recursive: true, force: true });
  }
});

test('scaffolds harness files from the support matrix for specific exclusions', () => {
  const tempRoot = mkdtempSync(join(tmpdir(), 'gaitor-cli-'));

  try {
    const result = spawnSync(process.execPath, [cliPath, 'claude-codex-only', '--yes', '--no-copilot', '--no-cursor'], {
      cwd: tempRoot,
      encoding: 'utf8',
    });

    assert.equal(result.status, 0, result.stderr);

    const projectDir = join(tempRoot, 'claude-codex-only');
    assert.equal(existsSync(join(projectDir, 'CONTEXT.md')), true);
    assert.equal(existsSync(join(projectDir, 'AGENTS.md')), true);
    assert.equal(existsSync(join(projectDir, 'CLAUDE.md')), true);
    assert.equal(existsSync(join(projectDir, '.cursorrules')), false);
    assert.equal(existsSync(join(projectDir, '.github', 'copilot-instructions.md')), false);
  } finally {
    rmSync(tempRoot, { recursive: true, force: true });
  }
});
