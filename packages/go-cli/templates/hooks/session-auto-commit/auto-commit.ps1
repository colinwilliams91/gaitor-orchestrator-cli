$ErrorActionPreference = 'Stop'

try {
  if ($env:SKIP_AUTO_COMMIT -eq 'true') {
    exit 0
  }

  # Read workspace cwd from the hook payload to set the correct working directory for git.
  # VS Code passes {"cwd": "<workspace path>", ...} on stdin for every hook event.
  $rawInput = [Console]::In.ReadToEnd()
  if (-not [string]::IsNullOrWhiteSpace($rawInput)) {
    try {
      $hookPayload = $rawInput | ConvertFrom-Json -AsHashtable -Depth 4
      if ($hookPayload.ContainsKey('cwd') -and -not [string]::IsNullOrWhiteSpace($hookPayload['cwd'])) {
        $hookCwd = $hookPayload['cwd']
        if (Test-Path $hookCwd -PathType Container) {
          Set-Location -Path $hookCwd
        }
      }
    }
    catch { }
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