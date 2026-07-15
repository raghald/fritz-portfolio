"use client";

import { useEffect, useRef, ReactNode } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

interface SmoothScrollProps {
  children: ReactNode;
}

/**
 * Cache layout values (offsetTop/offsetHeight) per element. Read once on mount
 * and on resize; never inside the scroll callback (which would force reflow).
 */
type Layout = {
  hero: HTMLElement | null;
  projectsShowcase: HTMLElement | null;
  lastSection: HTMLElement | null;
  // Computed thresholds in scroll space:
  projectsBottom: number; // scroll position where projects section ends
  footerRevealStart: number; // scroll position where last-section bottom reaches viewport bottom
};

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const layoutRef = useRef<Layout>({
    hero: null,
    projectsShowcase: null,
    lastSection: null,
    projectsBottom: Number.POSITIVE_INFINITY,
    footerRevealStart: Number.POSITIVE_INFINITY,
  });
  // Exposed to the pathname effect so a route change can re-read the DOM of the
  // freshly mounted page and reset the hero. Populated inside the mount effect.
  const refreshLayoutRef = useRef<() => void>(() => {});
  const resetHeroRef = useRef<() => void>(() => {});
  // Last applied hero state, kept in refs so resetHero() can clear them from
  // outside the scroll closure (a stale `true` would suppress the next write).
  const lastHiddenRef = useRef(false);
  const lastLoweredRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
      autoResize: true,
    });

    lenisRef.current = lenis;

    const raf = (time: number) => {
      lenis.raf(time);
      rafIdRef.current = requestAnimationFrame(raf);
    };
    rafIdRef.current = requestAnimationFrame(raf);

    /** Refresh layout cache: read DOM positions once, store in layoutRef. */
    const refreshLayout = () => {
      const hero = document.querySelector<HTMLElement>("[data-hero]");
      const projectsShowcase = document.querySelector<HTMLElement>(
        "[role='region'][aria-label='Projects Showcase']"
      );
      const lastSection = document.querySelector<HTMLElement>(".last-section");
      const windowHeight = window.innerHeight;

      layoutRef.current.hero = hero;
      layoutRef.current.projectsShowcase = projectsShowcase;
      layoutRef.current.lastSection = lastSection;

      layoutRef.current.projectsBottom = projectsShowcase
        ? projectsShowcase.offsetTop + projectsShowcase.offsetHeight
        : Number.POSITIVE_INFINITY;

      layoutRef.current.footerRevealStart = lastSection
        ? lastSection.offsetTop + lastSection.offsetHeight - windowHeight
        : Number.POSITIVE_INFINITY;
    };
    refreshLayoutRef.current = refreshLayout;

    /** Reset the hero to its default visible state and clear tracked flags.
     *  Called after a route change so styles from the previous page don't
     *  linger on the (possibly new) hero element. */
    const resetHero = () => {
      const hero = layoutRef.current.hero;
      if (hero) {
        hero.style.opacity = "1";
        hero.style.pointerEvents = "auto";
        hero.style.zIndex = "10";
      }
      lastHiddenRef.current = false;
      lastLoweredRef.current = false;
    };
    resetHeroRef.current = resetHero;

    // Initial layout read after a tick so the page tree is mounted.
    const initialTimer = window.setTimeout(refreshLayout, 0);
    window.addEventListener("resize", refreshLayout, { passive: true });
    window.addEventListener("orientationchange", refreshLayout, { passive: true });

    lenis.on("scroll", ({ scroll }: { scroll: number }) => {
      const { hero, projectsBottom, footerRevealStart } = layoutRef.current;
      if (!hero) return;

      const shouldHide = scroll > projectsBottom;
      if (shouldHide !== lastHiddenRef.current) {
        hero.style.opacity = shouldHide ? "0" : "1";
        hero.style.pointerEvents = shouldHide ? "none" : "auto";
        lastHiddenRef.current = shouldHide;
      }

      const shouldLower = scroll >= footerRevealStart;
      if (shouldLower !== lastLoweredRef.current) {
        hero.style.zIndex = shouldLower ? "1" : "10";
        lastLoweredRef.current = shouldLower;
      }
    });

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      window.clearTimeout(initialTimer);
      window.removeEventListener("resize", refreshLayout);
      window.removeEventListener("orientationchange", refreshLayout);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Po każdej zmianie podstrony: scroll do góry, a następnie (w kolejnej klatce,
  // gdy nowe drzewo strony jest już zamontowane) przelicz layout i zresetuj
  // hero. Bez tego layoutRef trzymałby referencje do elementów starej strony —
  // layout z [locale]/layout.tsx żyje między route'ami przy client-side nav.
  useEffect(() => {
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }

    const rafId = requestAnimationFrame(() => {
      refreshLayoutRef.current();
      resetHeroRef.current();
    });
    return () => cancelAnimationFrame(rafId);
  }, [pathname]);

  return <>{children}</>;
}
