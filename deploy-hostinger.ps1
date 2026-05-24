# Package Laravel backend for Hostinger upload (no vendor, no secrets).
# Usage:
#   .\deploy-hostinger.ps1
#   .\deploy-hostinger.ps1 -OpenFolder

param(
    [switch]$OpenFolder
)

$ErrorActionPreference = "Stop"

# Linux/Hostinger needs forward slashes in zip paths (Windows backslashes become literal filenames).
function New-LinuxZipFromDirectory {
    param(
        [Parameter(Mandatory)][string]$SourceDirectory,
        [Parameter(Mandatory)][string]$DestinationPath
    )

    Add-Type -AssemblyName System.IO.Compression
    Add-Type -AssemblyName System.IO.Compression.FileSystem

    $sourceFull = [System.IO.Path]::GetFullPath($SourceDirectory)
    if (-not $sourceFull.EndsWith('\')) {
        $sourceFull += '\'
    }
    if (Test-Path $DestinationPath) {
        Remove-Item -LiteralPath $DestinationPath -Force
    }

    $zip = [System.IO.Compression.ZipFile]::Open(
        $DestinationPath,
        [System.IO.Compression.ZipArchiveMode]::Create
    )

    try {
        foreach ($file in Get-ChildItem -LiteralPath $sourceFull -Recurse -File) {
            $fileFull = [System.IO.Path]::GetFullPath($file.FullName)
            $relative = $fileFull.Substring($sourceFull.Length)
            $entryName = ($relative -replace '\\', '/')
            [void][System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile(
                $zip,
                $file.FullName,
                $entryName,
                [System.IO.Compression.CompressionLevel]::Optimal
            )
        }
    } finally {
        $zip.Dispose()
    }
}

$root = $PSScriptRoot
$backend = Join-Path $root "backend"
$deployDir = Join-Path $root "deploy"
$stamp = Get-Date -Format "yyyyMMdd-HHmm"
$zipName = "backend-hostinger-$stamp.zip"
$zipPath = Join-Path $deployDir $zipName
$wrapRoot = Join-Path $env:TEMP ("attendance-hostinger-pack-" + $stamp)
$staging = Join-Path $wrapRoot "backend"

if (-not (Test-Path $backend)) {
    Write-Host "backend folder not found: $backend" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Shadow Attendance - Hostinger deploy package" -ForegroundColor Cyan
Write-Host ""

if (Test-Path $wrapRoot) {
    Remove-Item -LiteralPath $wrapRoot -Recurse -Force
}

New-Item -ItemType Directory -Path $staging -Force | Out-Null
New-Item -ItemType Directory -Path $deployDir -Force | Out-Null

Write-Host "Copying backend (excluding vendor, cache, logs, .env)..." -ForegroundColor Gray

$robocopyArgs = @(
    $backend,
    $staging,
    "/E",
    "/NFL", "/NDL", "/NJH", "/NJS", "/NC", "/NS",
    "/XD", "vendor", "node_modules", ".git",
    "/XF", ".env", ".env.*", "*.log"
)

& robocopy @robocopyArgs | Out-Null
# Robocopy: 0-7 = success
if ($LASTEXITCODE -gt 7) {
    Write-Host "File copy failed (robocopy exit $LASTEXITCODE)." -ForegroundColor Red
    exit 1
}

# Clear generated cache on the package (keep .gitignore placeholders)
$cachePhp = Join-Path $staging "bootstrap\cache\*.php"
Get-ChildItem -Path (Join-Path $staging "bootstrap\cache") -Filter "*.php" -ErrorAction SilentlyContinue |
    Remove-Item -Force -ErrorAction SilentlyContinue

$sessionFiles = Join-Path $staging "storage\framework\sessions"
Get-ChildItem -Path $sessionFiles -File -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -ne ".gitignore" } |
    Remove-Item -Force -ErrorAction SilentlyContinue

$logFiles = Join-Path $staging "storage\logs"
Get-ChildItem -Path $logFiles -Filter "*.log" -ErrorAction SilentlyContinue |
    Remove-Item -Force -ErrorAction SilentlyContinue

# Include all deploy/ helpers next to backend/ inside the zip
$deployInZip = Join-Path $wrapRoot "deploy"
New-Item -ItemType Directory -Path $deployInZip -Force | Out-Null
$deployFiles = @(
    ".env.hostinger",
    "HOSTINGER-STEPS.txt",
    "hostinger-ssh.sh",
    "public_html.index.php",
    "public_html.htaccess"
)
foreach ($name in $deployFiles) {
    $src = Join-Path $deployDir $name
    if (Test-Path $src) {
        Copy-Item -LiteralPath $src -Destination (Join-Path $deployInZip $name) -Force
    }
}
$stepsPath = Join-Path $deployDir "HOSTINGER-STEPS.txt"
$envTemplate = Join-Path $deployDir ".env.hostinger"

if (Test-Path $zipPath) {
    Remove-Item -LiteralPath $zipPath -Force
}

Write-Host "Creating zip (Linux paths: backend/ + deploy/)..." -ForegroundColor Gray
New-LinuxZipFromDirectory -SourceDirectory $wrapRoot -DestinationPath $zipPath

Remove-Item -LiteralPath $wrapRoot -Recurse -Force

# Verify zip uses forward slashes only (required for Hostinger/Linux)
Add-Type -AssemblyName System.IO.Compression.FileSystem
$verify = [System.IO.Compression.ZipFile]::OpenRead($zipPath)
$topFolders = $verify.Entries |
    Where-Object { $_.FullName -match '/' } |
    ForEach-Object { ($_.FullName -split '/')[0] } |
    Sort-Object -Unique
$backslashEntries = @($verify.Entries | Where-Object { $_.FullName.IndexOf([char]92) -ge 0 })
$verify.Dispose()
Write-Host "Zip root folders: $($topFolders -join ', ')" -ForegroundColor DarkGray
if ($backslashEntries.Count -gt 0) {
    Write-Host "WARNING: zip still has backslash paths - Hostinger extract will break." -ForegroundColor Red
    exit 1
}
Write-Host "Zip paths OK for Linux (forward slashes only)." -ForegroundColor DarkGray

$sizeMb = [math]::Round((Get-Item $zipPath).Length / 1MB, 2)

Write-Host ""
Write-Host "Done." -ForegroundColor Green
Write-Host ('  Zip:   ' + $zipPath + ' (' + $sizeMb + ' MB)') -ForegroundColor White
Write-Host "  Steps: $stepsPath" -ForegroundColor White
Write-Host ""
if (Test-Path $envTemplate) {
    Write-Host "  Env:   also inside zip at deploy/.env.hostinger" -ForegroundColor White
}

Write-Host ""
Write-Host "Upload the zip to Hostinger, extract, then follow HOSTINGER-STEPS.txt" -ForegroundColor Yellow
Write-Host "Double-click 'Upload to Hostinger.bat' anytime to rebuild the package." -ForegroundColor Yellow
Write-Host ""

if ($OpenFolder) {
    Start-Process explorer.exe $deployDir
}
