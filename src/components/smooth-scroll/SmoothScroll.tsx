"use client";

import { useEffect, useRef, ReactNode } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

interface SmoothScrollProps {
  children: ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);
  const rafIdRef = useRef<number | null>(null);

  // init Lenis (raz)
  useEffect(() => {
    if (typeof window === "undefined") return;

    // ✅ wyłącz przywracanie scrolla przez przeglądarkę/Next (back/forward itd.)
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

    // logika hero / footer reveal – tylko na podstawie scrolla
    lenis.on("scroll", ({ scroll }) => {
      const hero = document.querySelector("[data-hero]") as HTMLElement | null;
      const projectsShowcase = document.querySelector(
        "[role='region'][aria-label='Projects Showcase']"
      ) as HTMLElement | null;
      const lastSection = document.querySelector(".last-section") as HTMLElement | null;

      if (hero && projectsShowcase) {
        const windowHeight = window.innerHeight;
        const projectsShowcaseBottom =
          projectsShowcase.offsetTop + projectsShowcase.offsetHeight;

        if (scroll > projectsShowcaseBottom) {
          hero.style.opacity = "0";
          hero.style.pointerEvents = "none";
        } else {
          hero.style.opacity = "1";
          hero.style.pointerEvents = "auto";
        }

        if (lastSection) {
          const lastSectionTop = lastSection.offsetTop;
          const footerRevealStart =
            lastSectionTop + lastSection.offsetHeight - windowHeight;

          hero.style.zIndex = scroll >= footerRevealStart ? "1" : "10";
        }
      }
    });

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // ✅ scroll do góry po każdej zmianie podstrony
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      return;
    }

    // immediate = bez animacji (żeby było “od góry” natychmiast)
    lenis.scrollTo(0, { immediate: true });
  }, [pathname]);

  return <>{children}</>;
}
