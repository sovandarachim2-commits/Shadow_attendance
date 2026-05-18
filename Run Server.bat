@echo off
setlocal

cd /d "%~dp0"

echo Starting Shadow Attendance...
echo.

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0start.ps1"

endlocal
