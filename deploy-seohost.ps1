# ============================================================================
# 🚀 Deploy Script for SEOHost - PowerShell Version
# ============================================================================
# Przygotowuje aplikację Next.js do wdrożenia na hosting SEOHost
# Autor: Fritz Portfolio Deployment Team
# Data: Październik 2025
# ============================================================================

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "  🚀 SEOHost Deployment Script" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

# Sprawdź czy jesteś w odpowiednim katalogu
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Błąd: Nie znaleziono package.json!" -ForegroundColor Red
    Write-Host "   Uruchom ten skrypt w głównym katalogu projektu." -ForegroundColor Yellow
    exit 1
}

# Sprawdź czy Next.js jest zainstalowany
if (-not (Test-Path "next.config.ts")) {
    Write-Host "❌ Błąd: To nie wygląda na projekt Next.js!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Weryfikacja środowiska zakończona" -ForegroundColor Green
Write-Host ""

# 1. Build aplikacji
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "📦 KROK 1: Budowanie aplikacji" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

Write-Host "   Uruchamiam: npm run build..." -ForegroundColor Yellow
$buildStartTime = Get-Date

npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ Build failed!" -ForegroundColor Red
    Write-Host "   Sprawdź błędy powyżej i spróbuj ponownie." -ForegroundColor Yellow
    exit 1
}

$buildEndTime = Get-Date
$buildDuration = ($buildEndTime - $buildStartTime).TotalSeconds

Write-Host ""
Write-Host "✅ Build zakończony pomyślnie! (czas: $([math]::Round($buildDuration, 1))s)" -ForegroundColor Green
Write-Host ""

# 2. Przygotowanie folderu deploy
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "📂 KROK 2: Przygotowanie plików deployment" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

# Usuń stary folder jeśli istnieje
if (Test-Path "seohost-deploy") {
    Write-Host "   🗑️  Usuwam stary folder deployment..." -ForegroundColor Gray
    Remove-Item -Path "seohost-deploy" -Recurse -Force
}

# Utwórz nowy folder
Write-Host "   📁 Tworzę nowy folder: seohost-deploy/" -ForegroundColor Gray
New-Item -ItemType Directory -Path "seohost-deploy" -Force | Out-Null
Write-Host ""

# 3. Kopiuj standalone build
Write-Host "   ⚙️  Kopiuję standalone build..." -ForegroundColor Yellow

if (Test-Path ".next/standalone") {
    Copy-Item -Path ".next/standalone/*" -Destination "seohost-deploy/" -Recurse -Force
    Write-Host "      ✓ .next/standalone/ → seohost-deploy/" -ForegroundColor Gray
} else {
    Write-Host "      ❌ Błąd: Brak folderu .next/standalone/" -ForegroundColor Red
    Write-Host "      Sprawdź czy masz 'output: standalone' w next.config.ts" -ForegroundColor Yellow
    exit 1
}

# 4. Kopiuj static files
Write-Host "   [*] Kopiuje static files..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path "seohost-deploy/.next" -Force | Out-Null

if (Test-Path ".next/static") {
    Copy-Item -Path ".next/static" -Destination "seohost-deploy/.next/" -Recurse -Force
    $staticSize = (Get-ChildItem -Path ".next/static" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
    $staticSizeMB = [math]::Round($staticSize, 2)
    Write-Host "      [OK] .next/static/ ($staticSizeMB MB)" -ForegroundColor Gray
} else {
    Write-Host "      [!] Ostrzezenie: Brak folderu .next/static/" -ForegroundColor Yellow
}

# 5. Kopiuj public (obrazki, fonty, filmy)
Write-Host "   [*] Kopiuje public files (obrazy, fonty, wideo)..." -ForegroundColor Yellow

if (Test-Path "public") {
    Copy-Item -Path "public" -Destination "seohost-deploy/" -Recurse -Force
    
    # Policz rozmiar public (szczególnie wideo)
    $publicSize = (Get-ChildItem -Path "public" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
    Write-Host "      ✓ public/ ($([math]::Round($publicSize, 2)) MB)" -ForegroundColor Gray
    
    # Sprawdź folder wideo
    if (Test-Path "public/videos") {
        $videoSize = (Get-ChildItem -Path "public/videos" -Recurse -Filter "*.mp4" | Measure-Object -Property Length -Sum).Sum / 1MB
        $videoCount = (Get-ChildItem -Path "public/videos" -Filter "*.mp4").Count
        Write-Host "      ℹ️  Filmy: $videoCount plików, $([math]::Round($videoSize, 2)) MB" -ForegroundColor Cyan
    }
} else {
    Write-Host "      ⚠️  Ostrzeżenie: Brak folderu public/" -ForegroundColor Yellow
}

# 6. Kopiuj konfigurację
Write-Host "   ⚙️  Kopiuję pliki konfiguracyjne..." -ForegroundColor Yellow
Copy-Item -Path "package.json" -Destination "seohost-deploy/"
Write-Host "      ✓ package.json" -ForegroundColor Gray

if (Test-Path "package-lock.json") {
    Copy-Item -Path "package-lock.json" -Destination "seohost-deploy/"
    Write-Host "      ✓ package-lock.json" -ForegroundColor Gray
}

# 7. Kopiuj server.js
Write-Host "   🚀 Kopiuję server.js..." -ForegroundColor Yellow
if (Test-Path "server.js") {
    Copy-Item -Path "server.js" -Destination "seohost-deploy/"
    Write-Host "      ✓ server.js" -ForegroundColor Gray
} else {
    Write-Host "      ❌ BŁĄD: server.js nie znaleziony!" -ForegroundColor Red
    Write-Host "      Ten plik jest wymagany do uruchomienia na SEOHost!" -ForegroundColor Yellow
    exit 1
}

# 8. Kopiuj .env.production jako .env
Write-Host "   🔐 Kopiuję zmienne środowiskowe..." -ForegroundColor Yellow
if (Test-Path ".env.production") {
    Copy-Item -Path ".env.production" -Destination "seohost-deploy/.env"
    Write-Host "      ✓ .env.production → .env" -ForegroundColor Gray
} elseif (Test-Path ".env.local") {
    Copy-Item -Path ".env.local" -Destination "seohost-deploy/.env"
    Write-Host "      ✓ .env.local → .env" -ForegroundColor Gray
} else {
    Write-Host "      ⚠️  Ostrzeżenie: Brak pliku .env" -ForegroundColor Yellow
    Write-Host "      Aplikacja będzie używać domyślnych wartości" -ForegroundColor Gray
}

# 9. Utwórz .htaccess dla proxy Node.js
Write-Host "   🔧 Tworzę .htaccess (Apache proxy)..." -ForegroundColor Yellow
$htaccessContent = @"
# Apache Proxy Configuration for Node.js
# Przekierowanie wszystkich requestów do aplikacji Node.js

RewriteEngine On

# Nie przekierowuj plików statycznych (jeśli istnieją)
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d

# Proxy do lokalnego serwera Node.js (port 3000)
RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]

# Kompresja
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css text/javascript application/javascript application/json
</IfModule>

# Cache headers dla plików statycznych
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
Write-Host "      ✓ .htaccess" -ForegroundColor Gray

Write-Host ""
Write-Host "✅ Wszystkie pliki przygotowane pomyślnie!" -ForegroundColor Green
Write-Host ""

# 10. Utwórz archiwum ZIP
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "📦 KROK 3: Tworzenie archiwum ZIP" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

# Usuń stary ZIP jeśli istnieje
if (Test-Path "seohost-deploy.zip") {
    Write-Host "   🗑️  Usuwam stare archiwum..." -ForegroundColor Gray
    Remove-Item -Path "seohost-deploy.zip" -Force
}

Write-Host "   📦 Kompresuję pliki..." -ForegroundColor Yellow
$zipStartTime = Get-Date

# Kompresuj do ZIP
Compress-Archive -Path "seohost-deploy\*" -DestinationPath "seohost-deploy.zip" -CompressionLevel Optimal

$zipEndTime = Get-Date
$zipDuration = ($zipEndTime - $zipStartTime).TotalSeconds

if (Test-Path "seohost-deploy.zip") {
    $zipSize = (Get-Item "seohost-deploy.zip").Length / 1MB
    Write-Host ""
    Write-Host "   ✅ Archiwum utworzone: seohost-deploy.zip" -ForegroundColor Green
    Write-Host "      📊 Rozmiar: $([math]::Round($zipSize, 2)) MB" -ForegroundColor Gray
    Write-Host "      ⏱️  Czas: $([math]::Round($zipDuration, 1))s" -ForegroundColor Gray
} else {
    Write-Host ""
    Write-Host "   ❌ Nie udało się utworzyć archiwum ZIP!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host "  ✅ DEPLOYMENT GOTOWY!" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host ""

# Podsumowanie
Write-Host "📊 Podsumowanie:" -ForegroundColor Cyan
Write-Host ""
$deploySize = (Get-Item "seohost-deploy.zip").Length / 1MB
Write-Host "   📦 Pakiet deployment:    seohost-deploy.zip ($([math]::Round($deploySize, 2)) MB)" -ForegroundColor White
Write-Host "   📁 Folder tymczasowy:    seohost-deploy/" -ForegroundColor White
Write-Host "   📄 Przewodnik:           SEOHOST-DEPLOYMENT-GUIDE.md" -ForegroundColor White
Write-Host ""

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "📤 NASTĘPNE KROKI - SETUP W PANELU DIRECTADMIN:" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

Write-Host "1️⃣  ZALOGUJ SIĘ DO PANELU DIRECTADMIN (SEOHost)" -ForegroundColor Yellow
Write-Host "   └─ Adres: https://panel.seohost.pl" -ForegroundColor Gray
Write-Host "   └─ Lub: panel.twojadomena.pl:2222" -ForegroundColor Gray
Write-Host ""

Write-Host "2️⃣  PRZEJDŹ DO SEKCJI NODE.JS" -ForegroundColor Yellow
Write-Host "   └─ W menu DirectAdmin znajdź: 'Node.js' lub 'Node.js App'" -ForegroundColor Gray
Write-Host "   └─ Kliknij 'Setup' lub 'Create Application'" -ForegroundColor Gray
Write-Host ""

Write-Host "3️⃣  WYPEŁNIJ FORMULARZ (zgodnie z tym co widzisz w panelu):" -ForegroundColor Yellow
Write-Host ""
Write-Host "   ┌─────────────────────────────────────────────────────────┐" -ForegroundColor Gray
Write-Host "   │ Node.js version:                                        │" -ForegroundColor Gray
Write-Host "   │ " -NoNewline -ForegroundColor Gray
Write-Host "└─→ Wybierz: 20.x lub nowszy" -ForegroundColor Green
Write-Host "   │                                                         │" -ForegroundColor Gray
Write-Host "   │ Application mode:                                       │" -ForegroundColor Gray
Write-Host "   │ " -NoNewline -ForegroundColor Gray
Write-Host "└─→ Wybierz: production" -ForegroundColor Green
Write-Host "   │    (Adds value for NODE_ENV variable)                   │" -ForegroundColor Gray
Write-Host "   │                                                         │" -ForegroundColor Gray
Write-Host "   │ Application root:                                       │" -ForegroundColor Gray
Write-Host "   │ " -NoNewline -ForegroundColor Gray
Write-Host "└─→ Wpisz: public_nodejs" -ForegroundColor Green
Write-Host "   │    (Physical address on server - MANDATORY)             │" -ForegroundColor Gray
Write-Host "   │                                                         │" -ForegroundColor Gray
Write-Host "   │ Application URL:                                        │" -ForegroundColor Gray
Write-Host "   │ " -NoNewline -ForegroundColor Gray
Write-Host "└─→ Wpisz: / lub https://twojadomena.pl" -ForegroundColor Green
Write-Host "   │    (HTTP/HTTPS link to your application)                │" -ForegroundColor Gray
Write-Host "   │                                                         │" -ForegroundColor Gray
Write-Host "   │ Application startup file:                               │" -ForegroundColor Gray
Write-Host "   │ " -NoNewline -ForegroundColor Gray
Write-Host "└─→ Wpisz: server.js" -ForegroundColor Green
Write-Host "   │                                                         │" -ForegroundColor Gray
Write-Host "   │ Environment variables: (opcjonalnie)                    │" -ForegroundColor Gray
Write-Host "   │ " -NoNewline -ForegroundColor Gray
Write-Host "└─→ Kliknij 'Add variable' jeśli potrzebujesz" -ForegroundColor Gray
Write-Host "   │    Przykład: PORT = 3000                                │" -ForegroundColor Gray
Write-Host "   └─────────────────────────────────────────────────────────┘" -ForegroundColor Gray
Write-Host ""
Write-Host "   📌 ZAPISZ KONFIGURACJĘ (przycisk Save/Create)" -ForegroundColor Cyan
Write-Host ""

Write-Host "4️⃣  UPLOAD PLIKÓW przez FTP/SFTP:" -ForegroundColor Yellow
Write-Host "   • Połącz się z serwerem:" -ForegroundColor White
Write-Host "     - Host: ftp.twojadomena.pl" -ForegroundColor Gray
Write-Host "     - User: twój_login_ftp" -ForegroundColor Gray
Write-Host "     - Port: 21 (FTP) lub 22 (SFTP)" -ForegroundColor Gray
Write-Host ""
Write-Host "   • Przejdź do katalogu:" -ForegroundColor White
Write-Host "     ~/domains/twojadomena.pl/public_nodejs/" -ForegroundColor Cyan
Write-Host ""
Write-Host "   • Upload WSZYSTKIE pliki z folderu:" -ForegroundColor White
Write-Host "     seohost-deploy/" -ForegroundColor Cyan
Write-Host "     (zachowaj strukturę katalogów!)" -ForegroundColor Gray
Write-Host ""

Write-Host "5️⃣  SSH - Zainstaluj zależności:" -ForegroundColor Yellow
Write-Host "   " -NoNewline
Write-Host "ssh twoj_user@twojadomena.pl" -ForegroundColor Cyan
Write-Host "   " -NoNewline
Write-Host "cd ~/domains/twojadomena.pl/public_nodejs/" -ForegroundColor Cyan
Write-Host "   " -NoNewline
Write-Host "npm install --production" -ForegroundColor Cyan
Write-Host ""
Write-Host "   ⏱️  To może zająć 2-5 minut..." -ForegroundColor Gray
Write-Host ""

Write-Host "6️⃣  URUCHOM APLIKACJĘ w panelu DirectAdmin:" -ForegroundColor Yellow
Write-Host "   • Wróć do sekcji 'Node.js' w panelu" -ForegroundColor White
Write-Host "   • Znajdź swoją aplikację na liście" -ForegroundColor White
Write-Host "   • Kliknij przycisk 'Start' lub 'Enable'" -ForegroundColor White
Write-Host "   • Sprawdź status: " -NoNewline -ForegroundColor White
Write-Host "powinien być 'Running' ✅" -ForegroundColor Green
Write-Host ""

Write-Host "7️⃣  TESTUJ APLIKACJĘ:" -ForegroundColor Yellow
Write-Host "   • Otwórz w przeglądarce: " -NoNewline -ForegroundColor White
Write-Host "https://twojadomena.pl" -ForegroundColor Cyan
Write-Host "   • Sprawdź czy wszystko działa (strona, obrazy, filmy)" -ForegroundColor White
Write-Host ""

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "📚 DOKUMENTACJA:" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "   📖 Szczegółowy przewodnik: " -NoNewline -ForegroundColor White
Write-Host "SEOHOST-DEPLOYMENT-GUIDE.md" -ForegroundColor Cyan
Write-Host "   (wszystkie kroki, troubleshooting, monitoring)" -ForegroundColor Gray
Write-Host ""

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "⚠️  WAŻNE INFORMACJE:" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

# Sprawdź rozmiar filmów
if (Test-Path "public/videos") {
    $videoSize = (Get-ChildItem -Path "public/videos" -Recurse -Filter "*.mp4" | Measure-Object -Property Length -Sum).Sum / 1MB
    $videoCount = (Get-ChildItem -Path "public/videos" -Filter "*.mp4").Count
    
    Write-Host "   🎥 Filmy w aplikacji:" -ForegroundColor Yellow
    Write-Host "      • Liczba plików: $videoCount filmów MP4" -ForegroundColor White
    Write-Host "      • Łączny rozmiar: $([math]::Round($videoSize, 2)) MB" -ForegroundColor White
    Write-Host ""
    
    if ($videoSize -gt 200) {
        Write-Host "      ⚠️  UWAGA: Duże pliki wideo!" -ForegroundColor Red
        Write-Host "      Rozważ użycie CDN (np. Cloudinary) jeśli będą problemy." -ForegroundColor Yellow
    } else {
        Write-Host "      ✅ SEOHost powinien obsłużyć te pliki bez problemu." -ForegroundColor Green
    }
    Write-Host ""
}

Write-Host "   📧 Support SEOHost: " -NoNewline -ForegroundColor White
Write-Host "support@seohost.pl" -ForegroundColor Cyan
Write-Host "   🌐 Pomoc SEOHost:   " -NoNewline -ForegroundColor White
Write-Host "https://pomoc.seohost.pl" -ForegroundColor Cyan
Write-Host ""

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host "  🎉 Powodzenia z wdrożeniem!" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host ""
