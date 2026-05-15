// src/i18n/routing.ts
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "pl"],
  defaultLocale: "en",
  // EN kanoniczna bez prefiksu, PL pod /pl/. Middleware (src/middleware.ts)
  // egzekwuje to w `next dev`; w produkcji static export + Apache .htaccess
  // robią to samo statycznie (zob. scripts/postbuild-i18n.mjs).
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];

// EN bez prefiksu (kanoniczna wersja), PL pod /pl/.
// Zwraca path z wiodącym slashem.
export function localePath(locale: string, path: string = ""): string {
  const cleaned = path.startsWith("/") ? path : path ? `/${path}` : "";
  return locale === "pl" ? `/pl${cleaned}` : cleaned || "/";
}

// Pełny URL absolutny (do canonical / openGraph / sitemap).
export function localeUrl(
  baseUrl: string,
  locale: string,
  path: string = ""
): string {
  const cleaned = path.startsWith("/") ? path : path ? `/${path}` : "";
  const ensureTrailing =
    cleaned && !cleaned.endsWith("/") ? `${cleaned}/` : cleaned;
  const localized =
    locale === "pl" ? `/pl${ensureTrailing}` : ensureTrailing || "/";
  return `${baseUrl}${localized}`;
}
