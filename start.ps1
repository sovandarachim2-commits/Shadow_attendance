# Shadow Attendance - one command startup
# Usage from PowerShell:
#   .\start.ps1

$ErrorActionPreference = "Stop"

$root = $PSScriptRoot
$php = "C:\xampp\php\php.exe"
$backend = Join-Path $root "backend"
$frontend = Join-Path $root "frontend"
$frontendUrl = "https://localhost:5174"
$apiUrl = "http://127.0.0.1:8000"

function Get-LanIp {
    $cfg = Get-NetIPConfiguration -ErrorAction SilentlyContinue |
        Where-Object {
            $_.NetAdapter.Status -eq 'Up' -and
            $_.IPv4DefaultGateway -and
            $_.IPv4Address.IPAddress -match '^(192\.168\.|10\.|172\.(1[6-9]|2\d|3[0-1])\.)'
        } |
        Select-Object -First 1

    if ($cfg) {
        return $cfg.IPv4Address.IPAddress
    }

    return $null
}

function Stop-PortProcess {
    param([int] $Port)

    $processIds = (netstat -ano 2>$null |
        Select-String ":$Port\s" |
        Where-Object { $_ -match 'LISTENING' } |
        ForEach-Object { ($_ -split '\s+')[-1] }) |
        Select-Object -Unique

    foreach ($processId in $processIds) {
        if ($processId -match '^\d+$') {
            Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
        }
    }
}

Write-Host ""
Write-Host "Shadow Attendance server starter" -ForegroundColor Cyan
Write-Host "Project: $root" -ForegroundColor DarkGray
Write-Host ""

if (-not (Test-Path $php)) {
    Write-Host "PHP not found: $php" -ForegroundColor Red
    Write-Host "Check your XAMPP PHP path." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

if (-not (Test-Path (Join-Path $backend "artisan"))) {
    Write-Host "Laravel backend not found: $backend" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

if (-not (Test-Path (Join-Path $frontend "package.json"))) {
    Write-Host "Frontend package.json not found: $frontend" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

$lanIp = Get-LanIp

Write-Host "[1/5] Checking phone HTTPS certificate..." -ForegroundColor Green
$certFile = Join-Path $frontend "cert.pem"
$keyFile = Join-Path $frontend "key.pem"
if (-not (Test-Path $certFile) -or -not (Test-Path $keyFile)) {
    Write-Host "      Missing cert.pem/key.pem. Run scripts\setup-dev-https.ps1 if phone access needs HTTPS." -ForegroundColor Yellow
} elseif ($lanIp) {
    $certText = Get-Content -LiteralPath $certFile -Raw
    if ($certText -notmatch [regex]::Escape($lanIp)) {
        Write-Host "      Certificate may not include current LAN IP $lanIp." -ForegroundColor Yellow
        Write-Host "      Run scripts\setup-dev-https.ps1 if phone browser shows certificate error." -ForegroundColor Yellow
    }
}

Write-Host "[2/5] Clearing old servers on ports 8000 and 5174..." -ForegroundColor Green
Stop-PortProcess -Port 8000
Stop-PortProcess -Port 5174

Write-Host "[3/5] Clearing Laravel cached config..." -ForegroundColor Green
Push-Location $backend
try {
    & $php artisan optimize:clear | Out-Null
} finally {
    Pop-Location
}

Write-Host "[4/5] Starting Laravel API..." -ForegroundColor Green
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "Set-Location -LiteralPath '$backend'; & '$php' artisan serve --host=127.0.0.1 --port=8000"
) -WindowStyle Minimized

Write-Host "[5/5] Starting Vite frontend..." -ForegroundColor Green
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "Set-Location -LiteralPath '$frontend'; npm run dev -- --host 0.0.0.0 --port 5174"
) -WindowStyle Minimized

Write-Host ""
Write-Host "Waiting for frontend port 5174..." -ForegroundColor Yellow
$ready = $false
for ($i = 0; $i -lt 25; $i++) {
    Start-Sleep -Seconds 1
    $listening = netstat -ano 2>$null | Select-String ":5174\s" | Select-String "LISTENING"
    if ($listening) {
        $ready = $true
        break
    }
}

Write-Host ""
Write-Host "Server links" -ForegroundColor Cyan
Write-Host "Computer frontend : $frontendUrl"
Write-Host "Laravel API       : $apiUrl"
if ($lanIp) {
    Write-Host "Phone frontend    : https://${lanIp}:5174"
    Write-Host "Phone note        : same Wi-Fi, allow firewall, accept/trust local certificate if needed"
} else {
    Write-Host "Phone frontend    : No LAN IP found"
}

if ($ready) {
    Start-Process $frontendUrl
    Write-Host ""
    Write-Host "Opened browser. Server windows are minimized." -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "Frontend did not answer yet. Check the Vite window for errors." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "To stop servers: close the two server windows, or press Ctrl+C inside them."
Write-Host ""
Read-Host "Press Enter to close this launcher"
