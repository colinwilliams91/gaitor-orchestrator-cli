/**
 * Scaffolding logic for gaitor-orchestrator-cli.
 *
 * Copies template files from the embedded `templates/` directory into the
 * user's target project directory, applying feature selection and
 * {{PROJECT_NAME}} substitution where needed.
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync, statSync, cpSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = resolve(__dirname, '../templates');
const README_IMAGE = `<p align="center">
  <img src="https://res.cloudinary.com/dbdyc4klu/image/upload/c_scale,w_400/v1775255978/gaitor-orchestrator-00_r6llds_c_pad_w_500_h_500_ar_1_1_1_jpd0up.webp" alt="Gaitor Orchestrator"/>
</p>`;

/**
 * Map from feature ID to the template sub-directory(ies) to include.
 * Each entry describes:
 *   - src: path relative to TEMPLATES_DIR
 *   - dest: path relative to the project root (target directory)
 */
const FEATURE_MAP = {
  agents: [
    { src: 'agents', dest: '.github/agents' },
  ],
  instructions: [
    { src: 'instructions', dest: '.github/instructions' },
  ],
  prompts: [
    { src: 'prompts', dest: '.github/prompts' },
  ],
  hooks: [
    { src: 'hooks/session-auto-commit.json', dest: '.github/hooks/session-auto-commit.json' },
    { src: 'hooks/session-auto-commit', dest: '.github/hooks/session-auto-commit' },
    { src: 'hooks/ido-context-sync.json', dest: '.github/hooks/ido-context-sync.json' },
    { src: 'hooks/ido-context-sync', dest: '.github/hooks/ido-context-sync' },
  ],
  ido: [
    { src: 'ido/ISSUE_TEMPLATE', dest: '.github/ISSUE_TEMPLATE' },
    { src: 'ido/pull_request_template.md', dest: '.github/pull_request_template.md' },
  ],
  tools: [
    { src: 'tools/package.json', dest: 'package.json' },
    { src: 'tools/skills-lock.json', dest: 'skills-lock.json' },
  ],
  skills: [
    { src: 'skills', dest: '.agents/skills' },
  ],
};

const BASE_TEMPLATE_ENTRIES = [
  { src: 'base/CONTEXT.md', dest: 'CONTEXT.md' },
  { src: 'base/SPEC.md', dest: 'SPEC.md' },
  { src: 'base/_gitignore', dest: '.gitignore' },
  { src: 'base/README.md', dest: 'README.md' },
];

const HARNESS_FILE_MAP = {
  copilot: [
    { src: 'base/AGENTS.md', dest: 'AGENTS.md' },
    { src: 'base/_github/copilot-instructions.md', dest: '.github/copilot-instructions.md' },
  ],
  claude: [
    { src: 'base/AGENTS.md', dest: 'AGENTS.md' },
    { src: 'base/CLAUDE.md', dest: 'CLAUDE.md' },
  ],
  codex: [
    { src: 'base/AGENTS.md', dest: 'AGENTS.md' },
  ],
  cursor: [
    { src: 'base/AGENTS.md', dest: 'AGENTS.md' },
    { src: 'base/.cursorrules', dest: '.cursorrules' },
  ],
};

/**
 * Apply `{{PROJECT_NAME}}` substitution in a string.
 *
 * @param {string} content
 * @param {string} projectName
 * @returns {string}
 */
function applySubstitutions(content, projectName) {
  return content.replaceAll('{{PROJECT_NAME}}', projectName);
}

/**
 * Copy a single file from `src` to `dest`, applying substitutions.
 * Creates parent directories as needed.
 *
 * @param {string} src  - Absolute source path.
 * @param {string} dest - Absolute destination path.
 * @param {string} projectName
 */
function copyFile(src, dest, projectName) {
  const destDir = dirname(dest);
  mkdirSync(destDir, { recursive: true });

  const raw = readFileSync(src);
  // Only apply substitutions to text files (skip binary files)
  if (isTextFile(src)) {
    const content = applySubstitutions(raw.toString('utf8'), projectName);
    writeFileSync(dest, content, 'utf8');
  } else {
    writeFileSync(dest, raw);
  }
}

/**
 * Heuristic to detect whether a file is text-based.
 *
 * @param {string} filePath
 * @returns {boolean}
 */
function isTextFile(filePath) {
  const BINARY_EXTS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf', '.eot', '.zip', '.tar', '.gz']);
  const ext = filePath.slice(filePath.lastIndexOf('.')).toLowerCase();
  return !BINARY_EXTS.has(ext);
}

/**
 * Recursively copy a directory from `src` to `dest`, applying substitutions
 * to all text files. Translates `_dot_` prefix back to `.`.
 *
 * @param {string} src        - Absolute source path.
 * @param {string} dest       - Absolute destination path.
 * @param {string} projectName
 */
function copyDirectory(src, dest, projectName) {
  mkdirSync(dest, { recursive: true });
  for (const entry of readdirSync(src)) {
    // Convert underscore-prefixed names back to dot-prefixed names (_gitignore → .gitignore)
    const destEntry = entry.startsWith('_') ? '.' + entry.slice(1) : entry;
    const srcPath = join(src, entry);
    const destPath = join(dest, destEntry);
    const stat = statSync(srcPath);
    if (stat.isDirectory()) {
      copyDirectory(srcPath, destPath, projectName);
    } else {
      copyFile(srcPath, destPath, projectName);
    }
  }
}

/**
 * Copy a source item (file or directory) from the templates tree to dest.
 *
 * @param {string} srcPath    - Relative path inside TEMPLATES_DIR.
 * @param {string} destRoot   - Absolute project root.
 * @param {string} relDest    - Destination path relative to project root.
 * @param {string} projectName
 */
function copyItem(srcPath, destRoot, relDest, projectName) {
  const absSrc = join(TEMPLATES_DIR, srcPath);
  const absDest = join(destRoot, relDest);

  if (!existsSync(absSrc)) return;

  const stat = statSync(absSrc);
  if (stat.isDirectory()) {
    copyDirectory(absSrc, absDest, projectName);
  } else {
    copyFile(absSrc, absDest, projectName);
  }
}

/**
 * Scaffold a new AI-DDLC project.
 *
 * @param {object} options
 * @param {string}   options.projectName  - Target project/directory name.
 * @param {string}   options.targetDir    - Absolute path to the target directory.
 * @param {string[]} options.features     - Array of selected feature IDs.
 */
export async function scaffold({ projectName, targetDir, features }) {
  const selectedFeatures = new Set(features);

  // 1. Create the target directory
  mkdirSync(targetDir, { recursive: true });

  // 2. Copy base files (always included)
  for (const { src, dest } of BASE_TEMPLATE_ENTRIES) {
    copyItem(src, targetDir, dest, projectName);
  }

  const harnessEntries = new Map();
  for (const harnessId of ['copilot', 'claude', 'codex', 'cursor']) {
    if (!selectedFeatures.has(harnessId)) continue;
    for (const entry of HARNESS_FILE_MAP[harnessId]) {
      harnessEntries.set(entry.dest, entry);
    }
  }

  for (const { src, dest } of harnessEntries.values()) {
    copyItem(src, targetDir, dest, projectName);
  }

  // 3. Copy opt-in feature files
  for (const featureId of selectedFeatures) {
    const entries = FEATURE_MAP[featureId];
    if (!entries) continue;
    for (const { src, dest } of entries) {
      copyItem(src, targetDir, dest, projectName);
    }
  }

  const readmePath = join(targetDir, 'README.md');
  if (existsSync(readmePath)) {
    const readmeContent = readFileSync(readmePath, 'utf8');
    if (!readmeContent.includes(README_IMAGE)) {
      writeFileSync(readmePath, `${README_IMAGE}\n\n${readmeContent}`, 'utf8');
    }
  }
}
