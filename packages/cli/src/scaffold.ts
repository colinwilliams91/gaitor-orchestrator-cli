/**
 * Scaffolding logic for gaitor-orchestrator-cli.
 *
 * Copies template files from the embedded `templates/` directory into the
 * user's target project directory, applying feature selection and
 * {{PROJECT_NAME}} substitution where needed.
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = resolve(__dirname, '../templates');

/** A single source→destination mapping for a feature's template files. */
interface FeatureMapping {
  src: string;
  dest: string;
}

/**
 * Map from feature ID to the template sub-directory(ies) to include.
 * Each entry describes:
 *   - src: path relative to TEMPLATES_DIR
 *   - dest: path relative to the project root (target directory)
 */
const FEATURE_MAP: Record<string, FeatureMapping[]> = {
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
  mcp: [
    { src: 'mcp/mcp.local.json', dest: 'mcp.local.json' },
  ],
};

/**
 * Apply `{{PROJECT_NAME}}` substitution in a string.
 */
function applySubstitutions(content: string, projectName: string): string {
  return content.replaceAll('{{PROJECT_NAME}}', projectName);
}

/**
 * Copy a single file from `src` to `dest`, applying substitutions.
 * Creates parent directories as needed.
 *
 * @param src  - Absolute source path.
 * @param dest - Absolute destination path.
 * @param projectName
 */
function copyFile(src: string, dest: string, projectName: string): void {
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
 */
function isTextFile(filePath: string): boolean {
  const BINARY_EXTS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf', '.eot', '.zip', '.tar', '.gz']);
  const ext = filePath.slice(filePath.lastIndexOf('.')).toLowerCase();
  return !BINARY_EXTS.has(ext);
}

/**
 * Recursively copy a directory from `src` to `dest`, applying substitutions
 * to all text files. Translates `_` prefix back to `.`.
 *
 * @param src        - Absolute source path.
 * @param dest       - Absolute destination path.
 * @param projectName
 */
function copyDirectory(src: string, dest: string, projectName: string): void {
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
 * @param srcPath    - Relative path inside TEMPLATES_DIR.
 * @param destRoot   - Absolute project root.
 * @param relDest    - Destination path relative to project root.
 * @param projectName
 */
function copyItem(srcPath: string, destRoot: string, relDest: string, projectName: string): void {
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

/** Options for the {@link scaffold} function. */
export interface ScaffoldOptions {
  /** Target project/directory name. */
  projectName: string;
  /** Absolute path to the target directory. */
  targetDir: string;
  /** Array of selected feature IDs. */
  features: string[];
}

/**
 * Scaffold a new AI-DDLC project.
 */
export async function scaffold({ projectName, targetDir, features }: ScaffoldOptions): Promise<void> {
  // 1. Create the target directory
  mkdirSync(targetDir, { recursive: true });

  // 2. Copy base files (always included)
  copyDirectory(join(TEMPLATES_DIR, 'base'), targetDir, projectName);

  // 3. Copy opt-in feature files
  for (const featureId of features) {
    const entries = FEATURE_MAP[featureId];
    if (!entries) continue;
    for (const { src, dest } of entries) {
      copyItem(src, targetDir, dest, projectName);
    }
  }
}
