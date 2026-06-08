"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "gsap";

import { useTranslations } from "@/lib/useTranslations";

import styles from "./PageTransition.module.css";

/**
 * Customowe przejście między podstronami.
 *
 * Sekwencja (jednokierunkowy wipe):
 *  1. Klik w wewnętrzny link → plansza w kolorze --c-black wjeżdża z prawej
 *     (xPercent 100 → 0) NAD OBECNĄ stroną. Jeszcze nie nawigujemy.
 *  2. Dopiero gdy plansza w pełni zakryła ekran, wołamy router.push — podmiana
 *     strony dzieje się niewidocznie pod planszą (nie widać "przeskoku" treści).
 *  3. Czekamy aż nowa podstrona się zacommituje. W App Routerze (bez loading.tsx)
 *     usePathname zmienia się dopiero gdy strona jest gotowa — to nasz sygnał.
 *  4. Gdy strona docelowa jest gotowa — plansza zjeżdża w lewo (0 → -100),
 *     odsłaniając nową podstronę.
 *
 * Interceptor łapie wszystkie wewnętrzne <a> w fazie capture (przed Next/Link),
 * pomijając linki zewnętrzne, target=_blank, download, kotwice #, mailto/tel,
 * klik z modyfikatorem (cmd/ctrl/shift/alt) oraz [data-no-transition].
 */

const COVER_DURATION = 0.55;
const REVEAL_DURATION = 0.55;
const EASE = "power3.inOut";
// Gdyby nawigacja utknęła (błąd sieci), nie zostawiamy usera na czarnym ekranie.
const SAFETY_TIMEOUT_MS = 4000;

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("navbar");

  const overlayRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLSpanElement>(null);

  // Maszyna stanów oparta o refy — nie wymaga re-renderów.
  const isAnimatingRef = useRef(false);
  const coverDoneRef = useRef(false);
  const navDoneRef = useRef(false);
  const pendingHrefRef = useRef<string | null>(null);
  const safetyTimerRef = useRef<number | null>(null);

  const clearSafetyTimer = () => {
    if (safetyTimerRef.current !== null) {
      window.clearTimeout(safetyTimerRef.current);
      safetyTimerRef.current = null;
    }
  };

  const reveal = useCallback(() => {
    const overlay = overlayRef.current;
    const logo = logoRef.current;
    if (!overlay) return;

    clearSafetyTimer();

    const tl = gsap.timeline({
      onComplete: () => {
        // Reset do stanu spoczynkowego (poza ekranem, po prawej, ukryta).
        gsap.set(overlay, { xPercent: 100, autoAlpha: 0, pointerEvents: "none" });
        if (logo) gsap.set(logo, { autoAlpha: 0, y: 0 });
        isAnimatingRef.current = false;
        coverDoneRef.current = false;
        navDoneRef.current = false;
        pendingHrefRef.current = null;
      },
    });

    if (logo) tl.to(logo, { autoAlpha: 0, duration: 0.2, ease: "power2.out" }, 0);
    tl.to(overlay, { xPercent: -100, duration: REVEAL_DURATION, ease: EASE }, 0);
  }, []);

  const maybeReveal = useCallback(() => {
    if (!coverDoneRef.current || !navDoneRef.current) return;
    // Dwie klatki, żeby świeżo zacommitowana strona zdążyła się odmalować
    // pod planszą, zanim ją odsłonimy.
    requestAnimationFrame(() => requestAnimationFrame(reveal));
  }, [reveal]);

  const startTransition = useCallback(
    (href: string) => {
      const overlay = overlayRef.current;
      const logo = logoRef.current;
      if (!overlay || isAnimatingRef.current) return;

      isAnimatingRef.current = true;
      coverDoneRef.current = false;
      navDoneRef.current = false;

      gsap.killTweensOf(overlay);
      if (logo) gsap.killTweensOf(logo);

      gsap.set(overlay, { xPercent: 100, autoAlpha: 1, pointerEvents: "auto" });
      if (logo) gsap.set(logo, { autoAlpha: 0, y: 12 });

      const tl = gsap.timeline({
        onComplete: () => {
          coverDoneRef.current = true;

          // Plansza w pełni zakryła OBECNĄ stronę — dopiero teraz nawigujemy,
          // żeby podmiana DOM nastąpiła niewidocznie pod planszą.
          pendingHrefRef.current = href;
          router.push(href);

          // Od teraz liczymy timeout na załadowanie strony docelowej.
          clearSafetyTimer();
          safetyTimerRef.current = window.setTimeout(() => {
            navDoneRef.current = true;
            maybeReveal();
          }, SAFETY_TIMEOUT_MS);
        },
      });
      tl.to(overlay, { xPercent: 0, duration: COVER_DURATION, ease: EASE }, 0);
      if (logo) {
        tl.to(
          logo,
          { autoAlpha: 1, y: 0, duration: 0.3, ease: "power2.out" },
          COVER_DURATION * 0.35
        );
      }
    },
    [router, maybeReveal]
  );

  // Zmiana pathname = nowa podstrona się zacommitowała (jest gotowa).
  const isFirstRenderRef = useRef(true);
  useEffect(() => {
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return;
    }
    if (!isAnimatingRef.current) return;
    navDoneRef.current = true;
    maybeReveal();
  }, [pathname, maybeReveal]);

  // Fallback na ChunkLoadError. Gdy w trakcie przejścia nie uda się załadować
  // chunka strony docelowej (typowo: otwarta karta po deployu = stare chunki
  // usunięte), router.push rzuca błąd i pathname nigdy się nie zmieni — usera
  // zostawiłaby tylko safety-timeout. next/link robi w takiej sytuacji twardą
  // nawigację; replikujemy to. Plansza już zakrywa ekran, więc reload jest
  // niewidoczny, a świeże chunki wczytają się od zera.
  useEffect(() => {
    const isChunkLoadError = (err: unknown) => {
      const e = err as { name?: string; message?: string } | null;
      if (!e) return false;
      return (
        e.name === "ChunkLoadError" ||
        /Loading chunk [\w./%@-]+ failed/i.test(e.message ?? "")
      );
    };

    const onError = (event: ErrorEvent | PromiseRejectionEvent) => {
      const err = "reason" in event ? event.reason : event.error;
      if (!isAnimatingRef.current || !pendingHrefRef.current) return;
      if (!isChunkLoadError(err)) return;
      window.location.href = pendingHrefRef.current;
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onError);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onError);
    };
  }, []);

  // Globalny interceptor klików na wewnętrznych <a>.
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Projekt ma trailingSlash: true — kanoniczna forma ścieżek kończy się "/".
    // Normalizujemy, żeby guard "ta sama strona" działał (np. link /works gdy
    // jesteśmy już na /works/) i żeby uniknąć dodatkowego 308 po stronie klienta.
    const withTrailingSlash = (p: string) => (p.endsWith("/") ? p : `${p}/`);

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const anchor = (e.target as Element | null)?.closest?.("a");
      if (!anchor) return;

      const a = anchor as HTMLAnchorElement;
      if ((a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      if (a.dataset.noTransition !== undefined) return;

      const rawHref = a.getAttribute("href");
      if (
        !rawHref ||
        rawHref.startsWith("#") ||
        rawHref.startsWith("mailto:") ||
        rawHref.startsWith("tel:")
      ) {
        return;
      }

      let url: URL;
      try {
        url = new URL(a.href, window.location.href);
      } catch {
        return;
      }

      if (url.origin !== window.location.origin) return; // zewnętrzny
      if (
        withTrailingSlash(url.pathname) ===
        withTrailingSlash(window.location.pathname)
      ) {
        return; // ta sama strona / kotwica
      }

      // Przejmujemy nawigację.
      e.preventDefault();

      if (isAnimatingRef.current) return; // przejście już trwa — ignorujemy

      const dest = withTrailingSlash(url.pathname) + url.search + url.hash;
      if (prefersReduced) {
        router.push(dest);
        return;
      }
      startTransition(dest);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router, startTransition]);

  // Sprzątanie przy odmontowaniu.
  useEffect(() => {
    const overlay = overlayRef.current;
    const logo = logoRef.current;
    return () => {
      clearSafetyTimer();
      if (overlay) gsap.killTweensOf(overlay);
      if (logo) gsap.killTweensOf(logo);
    };
  }, []);

  return (
    <>
      {children}
      <div ref={overlayRef} className={styles.overlay} aria-hidden="true">
        <span ref={logoRef} className={styles.logo}>
          {t("brand")}
        </span>
      </div>
    </>
  );
}