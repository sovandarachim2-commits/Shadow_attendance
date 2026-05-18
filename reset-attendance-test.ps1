# Reset attendance records for check-in/check-out testing.
# Default: clears only today's attendance records.
# Usage:
#   .\reset-attendance-test.ps1
#   .\reset-attendance-test.ps1 -All

param(
    [switch] $All
)

$ErrorActionPreference = "Stop"

$mysql = "C:\xampp\mysql\bin\mysql.exe"
$php = "C:\xampp\php\php.exe"
$backend = Join-Path $PSScriptRoot "backend"
$envFile = Join-Path $PSScriptRoot ".env"

function Read-EnvValue {
    param(
        [string] $Path,
        [string] $Key
    )

    $line = Get-Content -LiteralPath $Path |
        Where-Object { $_ -match "^\s*$([regex]::Escape($Key))=" } |
        Select-Object -First 1

    if (-not $line) {
        return $null
    }

    return (($line -split '=', 2)[1]).Trim().Trim('"')
}

if (-not (Test-Path $mysql)) {
    Write-Host "MySQL client not found: $mysql" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $envFile)) {
    Write-Host ".env not found: $envFile" -ForegroundColor Red
    exit 1
}

$database = Read-EnvValue -Path $envFile -Key "DB_DATABASE"
$username = Read-EnvValue -Path $envFile -Key "DB_USERNAME"
$password = Read-EnvValue -Path $envFile -Key "DB_PASSWORD"

if (-not $database) { $database = "attendance_sales_app" }
if (-not $username) { $username = "root" }
if ($null -eq $password) { $password = "" }

$dateCondition = if ($All) { "1=1" } else { "attendance_date = CURDATE()" }
$label = if ($All) { "ALL attendance records" } else { "TODAY's attendance records" }

Write-Host ""
Write-Host "Resetting $label for check-in/check-out testing..." -ForegroundColor Cyan
Write-Host "Database: $database" -ForegroundColor DarkGray
Write-Host ""

$sql = @"
SET FOREIGN_KEY_CHECKS = 0;
DELETE FROM attendance_logs
WHERE attendance_id IN (SELECT id FROM attendance WHERE $dateCondition);
DELETE FROM gps_locations
WHERE attendance_id IN (SELECT id FROM attendance WHERE $dateCondition);
DELETE FROM attendance
WHERE $dateCondition;
SET FOREIGN_KEY_CHECKS = 1;
"@

$mysqlArgs = @("-u$username", $database, "-e", $sql)
if ($password -ne "") {
    $mysqlArgs = @("-u$username", "-p$password", $database, "-e", $sql)
}

& $mysql @mysqlArgs

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "Reset failed. Make sure MySQL is running in XAMPP." -ForegroundColor Red
    exit 1
}

if (Test-Path (Join-Path $backend "artisan")) {
    Push-Location $backend
    try {
        & $php artisan optimize:clear | Out-Null
    } finally {
        Pop-Location
    }
}

Write-Host ""
Write-Host "Done. You can check in again for testing." -ForegroundColor Green
Write-Host ""
