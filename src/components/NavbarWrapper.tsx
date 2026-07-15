"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import Navbar from "./Sections/navbar/Navbar";
import { routing } from "@/i18n/routing";

// Stripujemy WSZYSTKIE locale (nie tylko /pl), bo przy `output: "export"` SSR
// renderuje stronę pod kanonicznym route'em `[locale]` — na build-time
// `usePathname()` zwraca `/en` lub `/en/` dla EN home (przed promocją plików
// przez scripts/postbuild-i18n.mjs). Bez stripowania `/en` SSR HTML wychodzi
// z variant="static" zamiast "sticky" → hydration mismatch + flash białego
// staticDesktopu na home. Regex generowana z `routing.locales` trzyma się
// w sync z configiem.
const localePrefixRe = new RegExp(`^/(${routing.locales.join("|")})(?=/|$)`);

export default function NavbarWrapper() {
  const pathname = usePathname();

  const cleanedPath = pathname.replace(localePrefixRe, "") || "/";
  const isHome = cleanedPath === "/";
  const variant = isHome ? "sticky" : "static";

  // TODO: usunąć po zdiagnozowaniu navbar bug — aktywne tylko przy ?debugNav=1.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.location.search.includes("debugNav=1")) return;
    console.log("[NavbarWrapper] pathname change", {
      raw: pathname,
      cleanedPath,
      isHome,
      variant,
      windowPathname: window.location.pathname,
      windowHref: window.location.href,
    });
  }, [pathname, cleanedPath, isHome, variant]);

  // key={variant} wymusza unmount + remount Navbar przy zmianie variant — czyste
  // resetowanie wszystkich inline style i stanu wewnętrznego. Bez tego React
  // próbuje reconcile w miejscu, co może zostawić stale inline style na
  // wewnętrznych elementach (zwłaszcza inner div z `desktopWrapperStyle`).
  return <Navbar key={variant} variant={variant} />;
}
