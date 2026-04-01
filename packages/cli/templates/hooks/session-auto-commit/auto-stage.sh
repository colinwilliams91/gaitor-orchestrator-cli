#!/bin/bash

set -euo pipefail

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  exit 0
fi

repo_root=$(git rev-parse --show-toplevel)
python_cmd=""
stdin_payload=""
declare -a candidate_paths=()

normalize_candidate_path() {
  local raw_path="$1"

  if [[ -z "$raw_path" ]]; then
    return
  fi

  if [[ "$raw_path" == "$repo_root"/* ]]; then
    printf '%s\n' "${raw_path#"$repo_root"/}"
    return
  fi

  if [[ "$raw_path" == "$repo_root" ]]; then
    return
  fi

  printf '%s\n' "$raw_path"
}

if command -v python3 >/dev/null 2>&1; then
  python_cmd="python3"
elif command -v python >/dev/null 2>&1; then
  python_cmd="python"
fi

if [[ -n "${TOOL_INPUT_FILE_PATH:-}" ]]; then
  normalized_path=$(normalize_candidate_path "$TOOL_INPUT_FILE_PATH")
  [[ -n "$normalized_path" ]] && candidate_paths+=("$normalized_path")
fi

if [ ! -t 0 ]; then
  stdin_payload=$(cat || true)
fi

if [[ -n "$stdin_payload" && -n "$python_cmd" ]]; then
  while IFS= read -r path; do
    [[ -n "$path" ]] && candidate_paths+=("$path")
  done < <(printf '%s' "$stdin_payload" | "$python_cmd" -c 'import json, os, sys
root = os.path.abspath(sys.argv[1])
seen = set()

def key_looks_like_path(key):
    low = (key or "").lower()
    if not low:
        return False
    if "file" in low:
        return True
    return low in {"path", "paths", "old_path", "new_path"} or (low.endswith("path") and "dir" not in low and "transcript" not in low)

def emit_path(value):
    text = value.strip()
    if not text:
        return
    normalized = text.replace("\\", os.sep)
    absolute = normalized if os.path.isabs(normalized) else os.path.abspath(os.path.join(root, normalized))
    try:
        common = os.path.commonpath([root, absolute])
    except ValueError:
        return
    if common != root:
        return
    relative = os.path.relpath(absolute, root)
    if relative in {".", ""} or relative in seen:
        return
    seen.add(relative)
    print(relative)

def visit(value, key=None):
    if isinstance(value, dict):
        for child_key, child_value in value.items():
            visit(child_value, child_key)
    elif isinstance(value, list):
        for child_value in value:
            visit(child_value, key)
    elif isinstance(value, str) and key_looks_like_path(key):
        emit_path(value)

try:
    payload = json.loads(sys.stdin.read() or "{}")
except Exception:
    raise SystemExit(0)

visit(payload.get("tool_input") or {})
' "$repo_root")
fi

for path in "${candidate_paths[@]}"; do
  git -C "$repo_root" add -A -- "$path" >/dev/null 2>&1 || true
done

exit 0