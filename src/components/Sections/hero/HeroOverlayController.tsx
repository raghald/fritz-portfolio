"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function HeroOverlayController() {
  const pathname = usePathname();

  useEffect(() => {
    const hero = document.querySelector("[data-hero]") as HTMLElement | null;
    const trigger = document.querySelector(
      "[data-hero-hide-trigger]"
    ) as HTMLElement | null;

    // Jeśli nie jesteśmy na stronie z hero, wyjdź
    if (!hero || !trigger) return;

    // reset na wejściu
    hero.classList.remove("is-hidden");

    // chowaj hero, gdy trigger dojedzie do góry (pod navbar możesz zmienić rootMargin)
    const io = new IntersectionObserver(
      ([entry]) => {
        // entry.isIntersecting === true => trigger jest w viewport (czyli treść weszła)
        hero.classList.toggle("is-hidden", entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0,
        // jeśli chcesz “pod navbar” (72px): rootMargin: "-72px 0px 0px 0px"
        rootMargin: "0px 0px 0px 0px",
      }
    );

    io.observe(trigger);

    return () => io.disconnect();
  }, [pathname]);

  return null;
}
