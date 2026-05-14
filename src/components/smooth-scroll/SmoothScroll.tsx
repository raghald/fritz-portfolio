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

    // Initial layout read after a tick so the page tree is mounted.
    const initialTimer = window.setTimeout(refreshLayout, 0);
    window.addEventListener("resize", refreshLayout, { passive: true });
    window.addEventListener("orientationchange", refreshLayout, { passive: true });

    // Track last state to skip redundant style writes.
    let lastHidden = false;
    let lastLowered = false;

    lenis.on("scroll", ({ scroll }: { scroll: number }) => {
      const { hero, projectsBottom, footerRevealStart } = layoutRef.current;
      if (!hero) return;

      const shouldHide = scroll > projectsBottom;
      if (shouldHide !== lastHidden) {
        hero.style.opacity = shouldHide ? "0" : "1";
        hero.style.pointerEvents = shouldHide ? "none" : "auto";
        lastHidden = shouldHide;
      }

      const shouldLower = scroll >= footerRevealStart;
      if (shouldLower !== lastLowered) {
        hero.style.zIndex = shouldLower ? "1" : "10";
        lastLowered = shouldLower;
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

  // scroll do góry po każdej zmianie podstrony
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      return;
    }
    lenis.scrollTo(0, { immediate: true });
  }, [pathname]);

  return <>{children}</>;
}
