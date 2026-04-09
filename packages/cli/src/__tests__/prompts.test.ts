/**
 * Unit tests for prompts.ts.
 *
 * The interactive prompts (input / checkbox) need a TTY to run, so we only
 * test the pure-logic exports: FEATURES shape and the non-interactive
 * fast-path of askProjectName.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  FEATURES,
  FEATURE_IDS,
  HARNESS_IDS,
  askProjectName,
  hasSelectionFlagOverrides,
  resolveSelectedFeatures,
} from '../prompts.js';

const EXPECTED_FEATURE_IDS = [...FEATURE_IDS, ...HARNESS_IDS];

test('FEATURES exports all expected feature and harness IDs', () => {
  for (const id of EXPECTED_FEATURE_IDS) {
    assert.ok(id in FEATURES, `FEATURES should contain key "${id}"`);
  }
});

test('FEATURES has no unexpected extra keys', () => {
  const actualKeys = Object.keys(FEATURES);
  assert.equal(actualKeys.length, EXPECTED_FEATURE_IDS.length, 'FEATURES should have exactly the expected number of entries');
});

test('every feature has a non-empty label string', () => {
  for (const [id, meta] of Object.entries(FEATURES)) {
    assert.ok(typeof meta.label === 'string' && meta.label.trim().length > 0, `FEATURES["${id}"].label should be a non-empty string`);
  }
});

test('every feature has a non-empty description string', () => {
  for (const [id, meta] of Object.entries(FEATURES)) {
    assert.ok(typeof meta.description === 'string' && meta.description.trim().length > 0, `FEATURES["${id}"].description should be a non-empty string`);
  }
});

test('resolveSelectedFeatures keeps all features and harnesses enabled by default', () => {
  const selected = resolveSelectedFeatures({
    agents: true,
    instructions: true,
    prompts: true,
    hooks: true,
    ido: true,
    tools: true,
    skills: true,
    mcp: true,
    harnesses: true,
    copilot: true,
    claude: true,
    codex: true,
    cursor: true,
  });

  assert.deepEqual(selected, EXPECTED_FEATURE_IDS);
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
    mcp: true,
    harnesses: false,
    copilot: true,
    claude: true,
    codex: true,
    cursor: true,
  });

  assert.deepEqual(selected, FEATURE_IDS);
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
    mcp: true,
    harnesses: true,
    copilot: false,
    claude: true,
    codex: true,
    cursor: false,
  });

  assert.deepEqual(selected, [...FEATURE_IDS, 'claude', 'codex']);
  assert.equal(hasSelectionFlagOverrides({ copilot: false }), true);
});

test('askProjectName returns the positional arg without prompting', async () => {
  const result = await askProjectName('my-project');
  assert.equal(result, 'my-project');
});

test('askProjectName returns a positional arg with uppercase letters', async () => {
  const result = await askProjectName('My-Project');
  assert.equal(result, 'My-Project');
});

test('askProjectName returns a positional arg with underscores', async () => {
  const result = await askProjectName('my_project_123');
  assert.equal(result, 'my_project_123');
});
