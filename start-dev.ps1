# =========================================================
# Verand Store — start all dev services
# Run:  powershell -ExecutionPolicy Bypass -File start-dev.ps1
# =========================================================
$ErrorActionPreference = "SilentlyContinue"
$root = $PSScriptRoot

$mysqld   = "C:\laragon\bin\mysql\mysql-8.0.30-winx64\bin\mysqld.exe"
$mysqlDir = "C:\laragon\data\mysql-8"

function Test-Port($port) {
  return (Test-NetConnection 127.0.0.1 -Port $port -InformationLevel Quiet -WarningAction SilentlyContinue)
}

Write-Host "Verand Store - starting services..." -ForegroundColor Cyan

# 1) MySQL
if (Test-Port 3306) {
  Write-Host "[OK]   MySQL already running on 3306" -ForegroundColor Green
} else {
  Write-Host "[..]   Starting MySQL..." -ForegroundColor Yellow
  Start-Process -FilePath $mysqld -ArgumentList "--datadir=`"$mysqlDir`"", "--port=3306" -WindowStyle Hidden
  $tries = 0
  while (-not (Test-Port 3306) -and $tries -lt 20) { Start-Sleep -Seconds 1; $tries++ }
  if (Test-Port 3306) { Write-Host "[OK]   MySQL up" -ForegroundColor Green }
  else { Write-Host "[ERR]  MySQL failed to start" -ForegroundColor Red }
}

# 2) Backend API (Laravel)
if (Test-Port 8000) {
  Write-Host "[OK]   API already running on 8000" -ForegroundColor Green
} else {
  Write-Host "[..]   Starting Laravel API..." -ForegroundColor Yellow
  Start-Process -FilePath "php" -ArgumentList "artisan", "serve", "--host=127.0.0.1", "--port=8000" `
    -WorkingDirectory "$root\backend" -WindowStyle Hidden
  $tries = 0
  while (-not (Test-Port 8000) -and $tries -lt 20) { Start-Sleep -Seconds 1; $tries++ }
  if (Test-Port 8000) { Write-Host "[OK]   API up at http://127.0.0.1:8000" -ForegroundColor Green }
  else { Write-Host "[ERR]  API failed to start" -ForegroundColor Red }
}

# 3) Frontend (Next.js)
if (Test-Port 3000) {
  Write-Host "[OK]   Frontend already running on 3000" -ForegroundColor Green
} else {
  Write-Host "[..]   Starting Next.js (new window)..." -ForegroundColor Yellow
  Start-Process -FilePath "cmd.exe" -ArgumentList "/c", "npm run dev" -WorkingDirectory "$root\frontend"
  Write-Host "[OK]   Frontend starting at http://localhost:3000 (allow ~10-40s)" -ForegroundColor Green
}

Write-Host "`nDone. Open http://localhost:3000" -ForegroundColor Cyan
