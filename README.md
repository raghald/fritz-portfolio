This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## 🚀 Deployment

### Deploy on SEOHost (Node.js Hosting)

Aplikacja została przygotowana do wdrożenia na hostingu SEOHost z obsługą Node.js.

**Quick Start:**

```powershell
# 1. Zbuduj i spakuj aplikację
.\deploy-seohost.ps1

# 2. Postępuj zgodnie z instrukcjami na ekranie
```

**📚 Pełna dokumentacja deploymentu:**

| Dokument                                               | Opis                                           |
| ------------------------------------------------------ | ---------------------------------------------- |
| **[📘 Deployment Guide](SEOHOST-DEPLOYMENT-GUIDE.md)** | Szczegółowy przewodnik wdrożenia krok po kroku |
| **[⚡ Quick Start](SEOHOST-QUICK-START.md)**           | Szybkie wdrożenie w 5 krokach                  |
| **[✅ Checklist](SEOHOST-DEPLOYMENT-CHECKLIST.md)**    | Kompletna lista kontrolna przed i po deployu   |
| **[� Troubleshooting](SEOHOST-TROUBLESHOOTING.md)**    | Rozwiązywanie najczęstszych problemów          |
| **[🖥️ SSH Commands](SEOHOST-SSH-COMMANDS.md)**         | Przydatne komendy do zarządzania serwerem      |

**Zawartość pakietu deployment:**

- ✅ Next.js standalone build
- ✅ Pliki statyczne (obrazy, fonty)
- ✅ Filmy wideo (~190MB)
- ✅ Custom Node.js server (`server.js`)
- ✅ Apache proxy configuration (`.htaccess`)

---

### Deploy on Vercel

Alternatywnie możesz wdrożyć aplikację na [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

⚠️ **Uwaga:** Vercel ma limit 100MB dla plików. Jeśli masz duże pliki wideo (~190MB), użyj SEOHost lub CDN (np. Cloudinary).

---

## 📦 Skrypty

```bash
npm run dev              # Uruchom serwer deweloperski
npm run build            # Zbuduj aplikację produkcyjną
npm run start            # Uruchom serwer produkcyjny lokalnie
npm run lint             # Sprawdź kod (ESLint)
```

**Deployment:**

```powershell
.\deploy-seohost.ps1     # Przygotuj pakiet do wdrożenia na SEOHost
```
