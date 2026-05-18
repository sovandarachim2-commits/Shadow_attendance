# Package Laravel backend for Hostinger upload (no vendor, no secrets).
# Usage:
#   .\deploy-hostinger.ps1
#   .\deploy-hostinger.ps1 -OpenFolder

param(
    [switch]$OpenFolder
)

$ErrorActionPreference = "Stop"

$root = $PSScriptRoot
$backend = Join-Path $root "backend"
$deployDir = Join-Path $root "deploy"
$stamp = Get-Date -Format "yyyyMMdd-HHmm"
$zipName = "backend-hostinger-$stamp.zip"
$zipPath = Join-Path $deployDir $zipName
$staging = Join-Path $env:TEMP "shadow-attendance-backend-$stamp"

if (-not (Test-Path $backend)) {
    Write-Host "backend folder not found: $backend" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Shadow Attendance - Hostinger deploy package" -ForegroundColor Cyan
Write-Host ""

if (Test-Path $staging) {
    Remove-Item -LiteralPath $staging -Recurse -Force
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

if (Test-Path $zipPath) {
    Remove-Item -LiteralPath $zipPath -Force
}

Write-Host "Creating zip..." -ForegroundColor Gray
Compress-Archive -Path (Join-Path $staging "*") -DestinationPath $zipPath -CompressionLevel Optimal

Remove-Item -LiteralPath $staging -Recurse -Force

$sizeMb = [math]::Round((Get-Item $zipPath).Length / 1MB, 2)

$stepsPath = Join-Path $deployDir "HOSTINGER-STEPS.txt"
@'
Hostinger backend deploy (after uploading the zip)
==================================================

1. Upload & extract
   - hPanel -> File Manager -> your API folder (e.g. domains/api.yourdomain.com)
   - Upload backend-hostinger-*.zip and extract so "backend" files match your layout
   - Document root must point to: backend/public

2. .env on server (do NOT upload .env from your PC zip - create/edit on server)
   APP_ENV=production
   APP_DEBUG=false
   APP_URL=https://api.YOUR-DOMAIN.com
   APP_KEY=... (same as local or run: php artisan key:generate)

   DB_HOST=...
   DB_DATABASE=...
   DB_USERNAME=...
   DB_PASSWORD=...

   ATTENDANCE_IMAGE_DISK=public

   Place .env one folder ABOVE backend/ (project root), OR inside backend/ if you adjust bootstrap.

3. SSH or Hostinger Terminal (inside backend folder):
   composer install --no-dev --optimize-autoloader
   php artisan storage:link
   php artisan migrate --force
   php artisan config:cache
   php artisan route:cache

4. Permissions (if 500 errors):
   chmod -R 775 storage bootstrap/cache

5. Vercel frontend env:
   VITE_API_URL=https://api.YOUR-DOMAIN.com/api
   Then redeploy Vercel.

Updates later
-------------
- Change code locally -> git push (Vercel auto-updates frontend)
- Run .\deploy-hostinger.ps1 again -> upload new zip -> SSH:
    composer install --no-dev
    php artisan migrate --force
    php artisan config:cache
    php artisan route:cache
'@ | Set-Content -LiteralPath $stepsPath -Encoding UTF8

Write-Host ""
Write-Host "Done." -ForegroundColor Green
Write-Host "  Zip:   $zipPath ($sizeMb MB)" -ForegroundColor White
Write-Host "  Steps: $stepsPath" -ForegroundColor White
Write-Host ""
$envTemplate = Join-Path $deployDir ".env.hostinger"
if (Test-Path $envTemplate) {
    Write-Host "  Env:   $envTemplate  (copy to server as .env)" -ForegroundColor White
}

Write-Host ""
Write-Host "Upload the zip to Hostinger, extract, then follow HOSTINGER-STEPS.txt" -ForegroundColor Yellow
Write-Host "Double-click 'Upload to Hostinger.bat' anytime to rebuild the package." -ForegroundColor Yellow
Write-Host ""

if ($OpenFolder) {
    Start-Process explorer.exe $deployDir
}
