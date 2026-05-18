Set-Location -LiteralPath "$PSScriptRoot\frontend"

$envFile = Join-Path $PSScriptRoot ".env"
$https = $false
if (Test-Path $envFile) {
  $line = Get-Content $envFile | Where-Object { $_ -match '^\s*DEV_HTTPS\s*=\s*true' } | Select-Object -First 1
  if ($line) { $https = $true }
}

Write-Host ""
if ($https) {
  Write-Host "  Frontend:  https://localhost:5174" -ForegroundColor Green
  Write-Host "  (http://localhost:5174 is blank - use https)" -ForegroundColor Yellow
} else {
  Write-Host "  Frontend:  http://localhost:5174" -ForegroundColor Green
}
Write-Host ""

npm run dev -- --host 0.0.0.0 --port 5174
