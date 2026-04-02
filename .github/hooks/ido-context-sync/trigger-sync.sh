#!/bin/bash

set -euo pipefail

if [[ "${SKIP_CONTEXT_SYNC_HOOK:-}" == "true" ]]; then
  exit 0
fi

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  exit 0
fi

repo_root=$(git rev-parse --show-toplevel)
sync_script="$repo_root/.github/scripts/sync-context.sh"

if [[ ! -f "$sync_script" ]]; then
  exit 0
fi

bash "$sync_script"
