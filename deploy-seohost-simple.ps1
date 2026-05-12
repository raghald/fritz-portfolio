# ============================================================================
# Deploy Script for SEOHost - PowerShell Version (Simplified)
# ============================================================================
# Przygotowuje aplikacje Next.js do wdrozenia na hosting SEOHost
# ============================================================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  SEOHost Deployment Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Sprawdz czy jestes w odpowiednim katalogu
if (-not (Test-Path "package.json")) {
    Write-Host "[ERROR] Nie znaleziono package.json!" -ForegroundColor Red
    Write-Host "Uruchom ten skrypt w glownym katalogu projektu." -ForegroundColor Yellow
    exit 1
}

if (-not (Test-Path "next.config.ts")) {
    Write-Host "[ERROR] To nie wyglada na projekt Next.js!" -ForegroundColor Red
    exit 1
}

Write-Host "[OK] Weryfikacja srodowiska zakonczona" -ForegroundColor Green
Write-Host ""

# 1. Build aplikacji
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "KROK 1: Budowanie aplikacji" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Uruchamiam: npm run build..." -ForegroundColor Yellow
$buildStartTime = Get-Date

npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "[ERROR] Build failed!" -ForegroundColor Red
    Write-Host "Sprawdz bledy powyzej i sprobuj ponownie." -ForegroundColor Yellow
    exit 1
}

$buildEndTime = Get-Date
$buildDuration = ($buildEndTime - $buildStartTime).TotalSeconds

Write-Host ""
Write-Host "[OK] Build zakończony pomyslnie! (czas: $([math]::Round($buildDuration, 1))s)" -ForegroundColor Green
Write-Host ""

# 2. Przygotowanie folderu deploy
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "KROK 2: Przygotowanie plikow deployment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Usun stary folder jesli istnieje
if (Test-Path "seohost-deploy") {
    Write-Host "[*] Usuwam stary folder deployment..." -ForegroundColor Gray
    Remove-Item -Path "seohost-deploy" -Recurse -Force
}

# Utworz nowy folder
Write-Host "[*] Tworze nowy folder: seohost-deploy/" -ForegroundColor Gray
New-Item -ItemType Directory -Path "seohost-deploy" -Force | Out-Null
Write-Host ""

# 3. Kopiuj standalone build
Write-Host "[*] Kopiuje standalone build..." -ForegroundColor Yellow

if (Test-Path ".next/standalone") {
    Copy-Item -Path ".next/standalone/*" -Destination "seohost-deploy/" -Recurse -Force
    Write-Host "    [OK] .next/standalone/ -> seohost-deploy/" -ForegroundColor Gray
} else {
    Write-Host "    [ERROR] Brak folderu .next/standalone/" -ForegroundColor Red
    Write-Host "    Sprawdz czy masz 'output: standalone' w next.config.ts" -ForegroundColor Yellow
    exit 1
}

# 4. Kopiuj static files
Write-Host "[*] Kopiuje static files..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path "seohost-deploy/.next" -Force | Out-Null

if (Test-Path ".next/static") {
    Copy-Item -Path ".next/static" -Destination "seohost-deploy/.next/" -Recurse -Force
    $staticSize = (Get-ChildItem -Path ".next/static" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
    Write-Host "    [OK] .next/static/ ($([math]::Round($staticSize, 2)) MB)" -ForegroundColor Gray
} else {
    Write-Host "    [!] Ostrzezenie: Brak folderu .next/static/" -ForegroundColor Yellow
}

# 5. Kopiuj public (obrazki, fonty, filmy)
Write-Host "[*] Kopiuje public files (obrazy, fonty, wideo)..." -ForegroundColor Yellow

if (Test-Path "public") {
    Copy-Item -Path "public" -Destination "seohost-deploy/" -Recurse -Force
    
    # Policz rozmiar public (szczegolnie wideo)
    $publicSize = (Get-ChildItem -Path "public" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
    Write-Host "    [OK] public/ ($([math]::Round($publicSize, 2)) MB)" -ForegroundColor Gray
    
    # Sprawdz folder wideo
    if (Test-Path "public/videos") {
        $videoSize = (Get-ChildItem -Path "public/videos" -Recurse -Filter "*.mp4" | Measure-Object -Property Length -Sum).Sum / 1MB
        $videoCount = (Get-ChildItem -Path "public/videos" -Filter "*.mp4").Count
        Write-Host "    [INFO] Filmy: $videoCount plikow, $([math]::Round($videoSize, 2)) MB" -ForegroundColor Cyan
    }
} else {
    Write-Host "    [!] Ostrzezenie: Brak folderu public/" -ForegroundColor Yellow
}

# 6. Kopiuj pliki konfiguracyjne
Write-Host "[*] Kopiuje pliki konfiguracyjne..." -ForegroundColor Yellow
Copy-Item -Path "package.json" -Destination "seohost-deploy/"
Write-Host "    [OK] package.json" -ForegroundColor Gray

if (Test-Path "package-lock.json") {
    Copy-Item -Path "package-lock.json" -Destination "seohost-deploy/"
    Write-Host "    [OK] package-lock.json" -ForegroundColor Gray
}

# 7. Kopiuj server.js
Write-Host "[*] Kopiuje server.js..." -ForegroundColor Yellow
if (Test-Path "server.js") {
    Copy-Item -Path "server.js" -Destination "seohost-deploy/"
    Write-Host "    [OK] server.js" -ForegroundColor Gray
} else {
    Write-Host "    [ERROR] server.js nie znaleziony!" -ForegroundColor Red
    Write-Host "    Ten plik jest wymagany do uruchomienia na SEOHost!" -ForegroundColor Yellow
    exit 1
}

# 8. Kopiuj .env.production jako .env
Write-Host "[*] Kopiuje zmienne srodowiskowe..." -ForegroundColor Yellow
if (Test-Path ".env.production") {
    Copy-Item -Path ".env.production" -Destination "seohost-deploy/.env"
    Write-Host "    [OK] .env.production -> .env" -ForegroundColor Gray
} elseif (Test-Path ".env.local") {
    Copy-Item -Path ".env.local" -Destination "seohost-deploy/.env"
    Write-Host "    [OK] .env.local -> .env" -ForegroundColor Gray
} else {
    Write-Host "    [!] Ostrzezenie: Brak pliku .env" -ForegroundColor Yellow
    Write-Host "    Aplikacja bedzie uzywac domyslnych wartosci" -ForegroundColor Gray
}

# 9. Utworz .htaccess dla proxy Node.js
Write-Host "[*] Tworze .htaccess (Apache proxy)..." -ForegroundColor Yellow
$htaccessContent = @"
# Apache Proxy Configuration for Node.js
# Przekierowanie wszystkich requestow do aplikacji Node.js

RewriteEngine On

# Nie przekierowuj plikow statycznych (jesli istnieja)
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d

# Proxy do lokalnego serwera Node.js (port 3000)
RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]

# Kompresja
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css text/javascript application/javascript application/json
</IfModule>

# Cache headers dla plikow statycznych
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/avif "access plus 1 year"
  ExpiresByType video/mp4 "access plus 1 year"
  ExpiresByType font/woff2 "access plus 1 year"
</IfModule>
"@
Set-Content -Path "seohost-deploy/.htaccess" -Value $htaccessContent -Encoding UTF8
Write-Host "    [OK] .htaccess" -ForegroundColor Gray

Write-Host ""
Write-Host "[OK] Wszystkie pliki przygotowane pomyslnie!" -ForegroundColor Green
Write-Host ""

# 10. Utworz archiwum ZIP
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "KROK 3: Tworzenie archiwum ZIP" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Usun stary ZIP jesli istnieje
if (Test-Path "seohost-deploy.zip") {
    Write-Host "[*] Usuwam stare archiwum..." -ForegroundColor Gray
    Remove-Item -Path "seohost-deploy.zip" -Force
}

Write-Host "[*] Kompresuje pliki..." -ForegroundColor Yellow
$zipStartTime = Get-Date

# Kompresuj do ZIP
Compress-Archive -Path "seohost-deploy\*" -DestinationPath "seohost-deploy.zip" -CompressionLevel Optimal

$zipEndTime = Get-Date
$zipDuration = ($zipEndTime - $zipStartTime).TotalSeconds

if (Test-Path "seohost-deploy.zip") {
    $zipSize = (Get-Item "seohost-deploy.zip").Length / 1MB
    Write-Host ""
    Write-Host "[OK] Archiwum utworzone: seohost-deploy.zip" -ForegroundColor Green
    Write-Host "    Rozmiar: $([math]::Round($zipSize, 2)) MB" -ForegroundColor Gray
    Write-Host "    Czas: $([math]::Round($zipDuration, 1))s" -ForegroundColor Gray
} else {
    Write-Host ""
    Write-Host "[ERROR] Nie udalo sie utworzyc archiwum ZIP!" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Podsumowanie
Write-Host "========================================" -ForegroundColor Green
Write-Host "  DEPLOYMENT GOTOWY!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "Podsumowanie:" -ForegroundColor Cyan
Write-Host ""
$deploySize = (Get-Item "seohost-deploy.zip").Length / 1MB
Write-Host "  Pakiet deployment:    seohost-deploy.zip ($([math]::Round($deploySize, 2)) MB)" -ForegroundColor White
Write-Host "  Folder tymczasowy:    seohost-deploy/" -ForegroundColor White
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "NASTEPNE KROKI - PANEL DIRECTADMIN:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "1. ZALOGUJ SIE DO PANELU DIRECTADMIN (SEOHost)" -ForegroundColor Yellow
Write-Host "   Adres: https://panel.seohost.pl" -ForegroundColor Gray
Write-Host ""

Write-Host "2. PRZEJDZ DO SEKCJI NODE.JS" -ForegroundColor Yellow
Write-Host "   W menu znajdz: 'Node.js' lub 'Node.js App'" -ForegroundColor Gray
Write-Host "   Kliknij 'Setup' lub 'Create Application'" -ForegroundColor Gray
Write-Host ""

Write-Host "3. WYPELNIJ FORMULARZ:" -ForegroundColor Yellow
Write-Host ""
Write-Host "   Node.js version:          20.x lub nowszy" -ForegroundColor White
Write-Host "   Application mode:         production" -ForegroundColor White
Write-Host "   Application root:         public_nodejs" -ForegroundColor White
Write-Host "   Application URL:          /" -ForegroundColor White
Write-Host "   Application startup file: server.js" -ForegroundColor White
Write-Host ""
Write-Host "   Kliknij 'Save' lub 'Create'" -ForegroundColor Cyan
Write-Host ""

Write-Host "4. UPLOAD PLIKOW przez FTP/SFTP:" -ForegroundColor Yellow
Write-Host "   Host:    ftp.twojadomena.pl" -ForegroundColor White
Write-Host "   Katalog: ~/domains/twojadomena.pl/public_nodejs/" -ForegroundColor White
Write-Host "   Upload:  Wszystkie pliki z folderu 'seohost-deploy/'" -ForegroundColor White
Write-Host ""

Write-Host "5. SSH - Zainstaluj zaleznosci:" -ForegroundColor Yellow
Write-Host "   ssh twoj_user@twojadomena.pl" -ForegroundColor Cyan
Write-Host "   cd ~/domains/twojadomena.pl/public_nodejs/" -ForegroundColor Cyan
Write-Host "   npm install --production" -ForegroundColor Cyan
Write-Host ""

Write-Host "6. URUCHOM aplikacje w panelu DirectAdmin:" -ForegroundColor Yellow
Write-Host "   Wroc do sekcji 'Node.js'" -ForegroundColor White
Write-Host "   Kliknij 'Start' lub 'Enable'" -ForegroundColor White
Write-Host "   Sprawdz status: powinien byc 'Running'" -ForegroundColor White
Write-Host ""

Write-Host "7. TESTUJ: https://twojadomena.pl" -ForegroundColor Yellow
Write-Host ""

# Sprawdz rozmiar filmow
if (Test-Path "public/videos") {
    $videoSize = (Get-ChildItem -Path "public/videos" -Recurse -Filter "*.mp4" | Measure-Object -Property Length -Sum).Sum / 1MB
    $videoCount = (Get-ChildItem -Path "public/videos" -Filter "*.mp4").Count
    
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "WAZNE INFORMACJE:" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Filmy w aplikacji:" -ForegroundColor Yellow
    Write-Host "  Liczba plikow: $videoCount filmow MP4" -ForegroundColor White
    Write-Host "  Laczny rozmiar: $([math]::Round($videoSize, 2)) MB" -ForegroundColor White
    Write-Host ""
    
    if ($videoSize -gt 200) {
        Write-Host "  [!] UWAGA: Duze pliki wideo!" -ForegroundColor Red
        Write-Host "  Rozwaz uzycie CDN (np. Cloudinary) jesli beda problemy." -ForegroundColor Yellow
    } else {
        Write-Host "  [OK] SEOHost powinien obsl uzyc te pliki bez problemu." -ForegroundColor Green
    }
    Write-Host ""
}

Write-Host "Support SEOHost: support@seohost.pl" -ForegroundColor Cyan
Write-Host ""

Write-Host "========================================" -ForegroundColor Green
Write-Host "Powodzenia z wdrozeniem!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
