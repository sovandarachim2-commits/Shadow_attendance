@echo off
setlocal

cd /d "%~dp0"

echo Reset Attendance Test
echo.
echo This clears TODAY's check-in/check-out attendance records only.
echo It keeps users, roles, employees, branches, settings, and IP restrictions.
echo.

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0reset-attendance-test.ps1"

echo.
pause

endlocal
