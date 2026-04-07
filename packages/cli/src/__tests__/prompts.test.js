/**
 * Unit tests for prompts.js.
 *
 * The interactive prompts (input / checkbox) need a TTY to run, so we only
 * test the pure-logic exports: FEATURES shape and the non-interactive
 * fast-path of askProjectName.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { FEATURES, askProjectName } from '../prompts.js';

// ---------------------------------------------------------------------------
// FEATURES registry
// ---------------------------------------------------------------------------

const EXPECTED_FEATURE_IDS = ['agents', 'instructions', 'prompts', 'hooks', 'ido', 'tools', 'skills', 'mcp'];

test('FEATURES exports all expected feature IDs', () => {
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

// ---------------------------------------------------------------------------
// askProjectName — non-interactive fast-path
// ---------------------------------------------------------------------------

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
