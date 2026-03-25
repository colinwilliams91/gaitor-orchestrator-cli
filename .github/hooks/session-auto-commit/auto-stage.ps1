$ErrorActionPreference = 'Stop'

try {
  & git rev-parse --is-inside-work-tree 2>$null | Out-Null
  if ($LASTEXITCODE -ne 0) {
    exit 0
  }

  $repoRoot = (& git rev-parse --show-toplevel 2>$null).Trim()
  if ([string]::IsNullOrWhiteSpace($repoRoot)) {
    exit 0
  }

  $candidatePaths = New-Object 'System.Collections.Generic.HashSet[string]' ([System.StringComparer]::OrdinalIgnoreCase)

  function Test-PathKey {
    param([string]$Key)

    if ([string]::IsNullOrWhiteSpace($Key)) {
      return $false
    }

    $lowerKey = $Key.ToLowerInvariant()
    if ($lowerKey.Contains('file')) {
      return $true
    }

    if ($lowerKey -in @('path', 'paths', 'old_path', 'new_path')) {
      return $true
    }

    return $lowerKey.EndsWith('path') -and -not $lowerKey.Contains('dir') -and -not $lowerKey.Contains('transcript')
  }

  function Add-CandidatePath {
    param([string]$Value)

    if ([string]::IsNullOrWhiteSpace($Value)) {
      return
    }

    $resolved = $Value
    if (-not [System.IO.Path]::IsPathRooted($resolved)) {
      $resolved = Join-Path -Path $repoRoot -ChildPath $resolved
    }

    try {
      $absolutePath = [System.IO.Path]::GetFullPath($resolved)
      $rootPath = [System.IO.Path]::GetFullPath($repoRoot)
    }
    catch {
      return
    }

    if (-not $absolutePath.StartsWith($rootPath, [System.StringComparison]::OrdinalIgnoreCase)) {
      return
    }

    $relativePath = [System.IO.Path]::GetRelativePath($rootPath, $absolutePath)
    if ([string]::IsNullOrWhiteSpace($relativePath) -or $relativePath -eq '.') {
      return
    }

    [void]$candidatePaths.Add($relativePath)
  }

  function Get-CandidatePaths {
    param(
      [Parameter(ValueFromPipeline = $true)]
      $Value,
      [string]$Key = ''
    )

    if ($null -eq $Value) {
      return
    }

    if ($Value -is [System.Collections.IDictionary]) {
      foreach ($childKey in $Value.Keys) {
        Get-CandidatePaths -Value $Value[$childKey] -Key ([string]$childKey)
      }
      return
    }

    if ($Value -is [System.Collections.IEnumerable] -and -not ($Value -is [string])) {
      foreach ($childValue in $Value) {
        Get-CandidatePaths -Value $childValue -Key $Key
      }
      return
    }

    if (($Value -is [string]) -and (Test-PathKey -Key $Key)) {
      Add-CandidatePath -Value $Value
    }
  }

  if ($env:TOOL_INPUT_FILE_PATH) {
    Add-CandidatePath -Value $env:TOOL_INPUT_FILE_PATH
  }

  $rawInput = [Console]::In.ReadToEnd()
  if (-not [string]::IsNullOrWhiteSpace($rawInput)) {
    try {
      $payload = $rawInput | ConvertFrom-Json -AsHashtable -Depth 32
      if ($payload.ContainsKey('tool_input')) {
        Get-CandidatePaths -Value $payload.tool_input
      }
    }
    catch {
    }
  }

  foreach ($path in $candidatePaths) {
    & git -C $repoRoot add -A -- $path 2>$null | Out-Null
  }
}
catch {
}

exit 0