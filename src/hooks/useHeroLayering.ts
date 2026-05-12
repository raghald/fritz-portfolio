"use client";

import { useEffect } from "react";

export const useHeroLayering = () => {
  useEffect(() => {
    const handleScroll = () => {
      const hero = document.querySelector("[data-hero]") as HTMLElement;
      const lastSection = document.querySelector(
        ".last-section"
      ) as HTMLElement;

      if (!hero || !lastSection) return;

      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;

      // Calculate when we're near the bottom (within footer reveal area)
      const lastSectionTop = lastSection.offsetTop;
      const footerRevealStart =
        lastSectionTop + lastSection.offsetHeight - windowHeight;

      // If we're scrolling past the last section, lower Hero z-index so Footer can show
      if (scrollPosition >= footerRevealStart) {
        hero.style.zIndex = "1"; // Lower than Footer (z-5)
      } else {
        hero.style.zIndex = "10"; // Normal z-index, higher than Footer
      }
    };

    // Listen to scroll events
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Initial check
    handleScroll();

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
};
