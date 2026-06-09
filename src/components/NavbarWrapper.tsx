"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import Navbar from "./Sections/navbar/Navbar";

export default function NavbarWrapper() {
  const pathname = usePathname();

  // EN bez prefiksu, PL pod /pl/. Home = "/" lub "/pl" / "/pl/".
  const cleanedPath = pathname.replace(/^\/pl(?=\/|$)/, "") || "/";
  const isHome = cleanedPath === "/";
  const variant = isHome ? "sticky" : "static";

  // TODO: usunąć po zdiagnozowaniu navbar bug — aktywne tylko przy ?debugNav=1.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.location.search.includes("debugNav=1")) return;
    // eslint-disable-next-line no-console
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
