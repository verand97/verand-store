# Verand Store - Development Environment Launcher
# Runs both Laravel API Backend and Next.js Frontend concurrently

$ErrorActionPreference = "Stop"

Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "       VERAND STORE — DEV ENVIRONMENT            " -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

# 1. Check prerequisites
Write-Host "`n[1/4] Memeriksa dependensi..." -ForegroundColor Yellow
if (-not (Get-Command php -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: PHP tidak ditemukan dalam PATH. Silakan instal PHP 8.2+ terlebih dahulu." -ForegroundColor Red
    exit 1
}
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: Node/npm tidak ditemukan dalam PATH. Silakan instal Node.js 20+ terlebih dahulu." -ForegroundColor Red
    exit 1
}
Write-Host "✓ PHP dan Node.js tersedia." -ForegroundColor Green

# 2. Check environment files
Write-Host "`n[2/4] Memeriksa file konfigurasi environment (.env)..." -ForegroundColor Yellow
if (-not (Test-Path "backend\.env")) {
    if (Test-Path "backend\.env.example") {
        Copy-Item "backend\.env.example" "backend\.env"
        Write-Host "✓ backend/.env dibuat dari backend/.env.example" -ForegroundColor Green
    }
} else {
    Write-Host "✓ backend/.env ditemukan." -ForegroundColor Green
}

if (-not (Test-Path "frontend\.env.local")) {
    if (Test-Path "frontend\.env.example") {
        Copy-Item "frontend\.env.example" "frontend\.env.local"
        Write-Host "✓ frontend/.env.local dibuat dari frontend/.env.example" -ForegroundColor Green
    }
} else {
    Write-Host "✓ frontend/.env.local ditemukan." -ForegroundColor Green
}

# 3. Check vendor & node_modules
Write-Host "`n[3/4] Memeriksa dependensi paket..." -ForegroundColor Yellow
if (-not (Test-Path "backend\vendor")) {
    Write-Host "Menjalankan composer install di folder backend..." -ForegroundColor Gray
    Push-Location "backend"
    composer install
    Pop-Location
}
if (-not (Test-Path "frontend\node_modules")) {
    Write-Host "Menjalankan npm install di folder frontend..." -ForegroundColor Gray
    Push-Location "frontend"
    npm install
    Pop-Location
}
Write-Host "✓ Semua dependensi backend dan frontend siap." -ForegroundColor Green

# 4. Start services
Write-Host "`n[4/4] Menjalankan server pengembangan..." -ForegroundColor Yellow
Write-Host "  - Backend API : http://127.0.0.1:8000" -ForegroundColor Cyan
Write-Host "  - Frontend Web: http://localhost:3000" -ForegroundColor Cyan
Write-Host "`nTekan Ctrl+C untuk menghentikan server.`n" -ForegroundColor DarkGray

# Start backend in background job
$backendJob = Start-Job -ScriptBlock {
    Set-Location $args[0]
    php artisan serve --host=127.0.0.1 --port=8000
} -ArgumentList (Join-Path (Get-Location) "backend")

# Trap exit to cleanup background jobs
try {
    # Run frontend in current terminal
    Push-Location "frontend"
    npm run dev
} finally {
    Write-Host "`nMenghentikan backend server..." -ForegroundColor Yellow
    Stop-Job $backendJob -ErrorAction SilentlyContinue
    Remove-Job $backendJob -ErrorAction SilentlyContinue
    Pop-Location
    Write-Host "✓ Layanan dihentikan." -ForegroundColor Green
}
