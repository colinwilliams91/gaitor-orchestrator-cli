/**
 * Integration tests for the gaitor CLI binary.
 * Exercises the binary via spawnSync so that Commander, arg parsing, and
 * top-level behaviour are all covered end-to-end.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, rmSync, existsSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import packageJson from '../../package.json' with { type: 'json' };

const __dirname = dirname(fileURLToPath(import.meta.url));
const cliPath = resolve(__dirname, '../../bin/create-gaitor.js');

// ---------------------------------------------------------------------------
// Help / version output
// ---------------------------------------------------------------------------

test('prints help output', () => {
  const result = spawnSync(process.execPath, [cliPath, '--help'], {
    encoding: 'utf8',
  });

  assert.equal(result.status, 0);
  assert.match(result.stdout, /Usage: gaitor/);
});

test('prints the package version', () => {
  const result = spawnSync(process.execPath, [cliPath, '--version'], {
    encoding: 'utf8',
  });

  assert.equal(result.status, 0);
  assert.equal(result.stdout.trim(), packageJson.version);
});

test('--help includes --no-mcp option', () => {
  const result = spawnSync(process.execPath, [cliPath, '--help'], {
    encoding: 'utf8',
  });

  assert.equal(result.status, 0);
  assert.match(result.stdout, /--no-mcp/);
});

test('--help includes all --no-* feature flags', () => {
  const result = spawnSync(process.execPath, [cliPath, '--help'], {
    encoding: 'utf8',
  });

  assert.equal(result.status, 0);
  for (const flag of ['--no-agents', '--no-instructions', '--no-prompts', '--no-hooks', '--no-ido', '--no-tools', '--no-skills', '--no-mcp']) {
    assert.match(result.stdout, new RegExp(flag.replace('-', '\\-')), `Expected ${flag} in --help output`);
  }
});

test('--help includes --yes flag', () => {
  const result = spawnSync(process.execPath, [cliPath, '--help'], {
    encoding: 'utf8',
  });

  assert.equal(result.status, 0);
  assert.match(result.stdout, /--yes/);
});

test('--help includes the create alias workflow', () => {
  const result = spawnSync(process.execPath, [cliPath, '--help'], {
    encoding: 'utf8',
  });

  assert.equal(result.status, 0);
  assert.match(result.stdout, /gaitor create \[project-name\]/);
  assert.match(result.stdout, /gaitor-create \[project-name\]/);
  assert.doesNotMatch(result.stdout, /create-gaitor \[project-name\]/);
});

test('package manifest exposes only the supported create alias bins', () => {
  assert.equal(packageJson.bin['gaitor'], 'bin/create-gaitor.js');
  assert.equal(packageJson.bin['gaitor-create'], 'bin/create-gaitor.js');
  assert.equal(packageJson.bin['gaitor-orchestrator-cli'], 'bin/create-gaitor.js');
  assert.equal('create-gaitor' in packageJson.bin, false);
});

// ---------------------------------------------------------------------------
// Scaffolding via --yes flag (non-interactive)
// ---------------------------------------------------------------------------

test('--yes scaffolds a project in a temp directory', () => {
  const tmpDir = mkdtempSync(join(tmpdir(), 'gaitor-test-'));
  const projectName = 'test-project';
  const projectDir = join(tmpDir, projectName);

  try {
    const result = spawnSync(process.execPath, [cliPath, '--yes', projectName], {
      encoding: 'utf8',
      cwd: tmpDir,
    });

    assert.equal(result.status, 0, `CLI exited with ${result.status}\nstdout: ${result.stdout}\nstderr: ${result.stderr}`);
    assert.ok(existsSync(projectDir), 'Project directory should be created');
    assert.ok(existsSync(join(projectDir, 'CONTEXT.md')), 'CONTEXT.md should exist');
    assert.ok(existsSync(join(projectDir, 'AGENTS.md')), 'AGENTS.md should exist');
  } finally {
    rmSync(tmpDir, { recursive: true, force: true });
  }
});

test('create subcommand scaffolds a project in a temp directory', () => {
  const tmpDir = mkdtempSync(join(tmpdir(), 'gaitor-test-'));
  const projectName = 'create-subcommand-project';
  const projectDir = join(tmpDir, projectName);

  try {
    const result = spawnSync(process.execPath, [cliPath, 'create', '--yes', projectName], {
      encoding: 'utf8',
      cwd: tmpDir,
    });

    assert.equal(result.status, 0, `CLI exited with ${result.status}\nstdout: ${result.stdout}\nstderr: ${result.stderr}`);
    assert.ok(existsSync(projectDir), 'Project directory should be created');
    assert.ok(existsSync(join(projectDir, 'CONTEXT.md')), 'CONTEXT.md should exist');
  } finally {
    rmSync(tmpDir, { recursive: true, force: true });
  }
});

test('--yes applies {{PROJECT_NAME}} substitution', () => {
  const tmpDir = mkdtempSync(join(tmpdir(), 'gaitor-test-'));
  const projectName = 'my-subst-project';

  try {
    const result = spawnSync(process.execPath, [cliPath, '--yes', projectName], {
      encoding: 'utf8',
      cwd: tmpDir,
    });

    assert.equal(result.status, 0);

    const contextMd = readFileSync(join(tmpDir, projectName, 'CONTEXT.md'), 'utf8');
    assert.ok(
      contextMd.includes(projectName),
      'CONTEXT.md should contain the project name after substitution',
    );
    assert.ok(
      !contextMd.includes('{{PROJECT_NAME}}'),
      'CONTEXT.md should not contain the raw placeholder',
    );
  } finally {
    rmSync(tmpDir, { recursive: true, force: true });
  }
});

test('exits with non-zero status when target directory already exists', () => {
  const tmpDir = mkdtempSync(join(tmpdir(), 'gaitor-test-'));
  const projectName = 'existing-project';
  const projectDir = join(tmpDir, projectName);

  // Pre-create the directory so the CLI sees a conflict
  mkdirSync(projectDir, { recursive: true });

  try {
    const result = spawnSync(process.execPath, [cliPath, '--yes', projectName], {
      encoding: 'utf8',
      cwd: tmpDir,
    });

    assert.notEqual(result.status, 0, 'CLI should exit with non-zero status for existing directory');
    assert.match(result.stderr, /already exists/);
  } finally {
    rmSync(tmpDir, { recursive: true, force: true });
  }
});
