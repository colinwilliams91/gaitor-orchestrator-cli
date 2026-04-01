#!/bin/bash

set -euo pipefail

if [[ "${SKIP_AUTO_COMMIT:-}" == "true" ]]; then
  exit 0
fi

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  exit 0
fi

if git diff --cached --quiet --ignore-submodules --; then
  exit 0
fi

git commit --no-verify -m "chore(autosave): save staged changes" >/dev/null 2>&1 || true

exit 0
