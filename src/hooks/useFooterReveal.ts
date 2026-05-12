// hooks/useFooterReveal.ts
import { useEffect } from "react";

export const useFooterReveal = () => {
  useEffect(() => {
    const lastSection = document.querySelector<HTMLElement>(".last-section");
    if (!lastSection) return;

    const setSpacing = () => {
      const spacing = window.innerWidth >= 1024 ? 100 : 60; // px
      lastSection.style.marginBottom = `${spacing}px`;
    };

    setSpacing();
    window.addEventListener("resize", setSpacing);

    return () => {
      window.removeEventListener("resize", setSpacing);
      lastSection.style.marginBottom = "";
    };
  }, []);
};
