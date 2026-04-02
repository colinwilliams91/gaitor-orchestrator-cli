if ($env:SKIP_CONTEXT_SYNC_HOOK -eq 'true') {
    exit 0
}

git rev-parse --is-inside-work-tree 2>$null | Out-Null
if ($LASTEXITCODE -ne 0) {
    exit 0
}

$repoRoot = (git rev-parse --show-toplevel 2>$null).Trim()
if (-not $repoRoot) {
    exit 0
}

$syncScript = Join-Path $repoRoot '.github\scripts\sync-context.sh'
if (-not (Test-Path $syncScript)) {
    exit 0
}

$shell = Get-Command bash -ErrorAction SilentlyContinue
if (-not $shell) {
    $shell = Get-Command sh -ErrorAction SilentlyContinue
}

if (-not $shell) {
    Write-Host 'SKIP: bash/sh is required to run .github/scripts/sync-context.sh'
    exit 0
}

& $shell.Source $syncScript
