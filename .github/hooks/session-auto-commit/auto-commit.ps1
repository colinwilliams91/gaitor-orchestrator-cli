$ErrorActionPreference = 'Stop'

try {
  if ($env:SKIP_AUTO_COMMIT -eq 'true') {
    exit 0
  }

  & git rev-parse --is-inside-work-tree 2>$null | Out-Null
  if ($LASTEXITCODE -ne 0) {
    exit 0
  }

  & git diff --cached --quiet --ignore-submodules -- 2>$null
  if ($LASTEXITCODE -eq 0) {
    exit 0
  }

  & git commit --no-verify -m 'chore(autosave): save staged changes' 2>$null | Out-Null
}
catch {
}

exit 0