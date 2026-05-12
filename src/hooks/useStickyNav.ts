"use client";

import { useEffect, useState } from "react";

export function useStickyNav(threshold: number = 50, enabled: boolean = true): boolean {
  const [isStuck, setIsStuck] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    let ticking = false;

    const updateStickyState = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      setIsStuck(scrollY > threshold);
      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateStickyState);
        ticking = true;
      }
    };

    const onScroll = () => {
      requestTick();
    };

    updateStickyState();

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [threshold, enabled]);

  return isStuck;
}
