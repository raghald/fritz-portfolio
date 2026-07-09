// hooks/useScrollReveal.ts
import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

type Options = {
  y?: number;
  start?: string;
  end?: string;
};

// "top 20%" → 0.2. Inne wartości traktujemy jako default 0.2.
function parseTriggerRatio(value: string, fallback: number): number {
  const match = /(\d+(?:\.\d+)?)\s*%$/.exec(value.trim());
  return match ? Number(match[1]) / 100 : fallback;
}

export function useScrollReveal<T extends HTMLElement = HTMLElement>(
  options: Options = {}
) {
  const ref = useRef<T | null>(null);
  const { y = 50, start = "top 80%", end = "top 20%" } = options;

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(el, { clearProps: "transform,opacity" });
      return;
    }

    // Sekcje, których top jest już za progiem `end` (czyli element jest
    // wysoko w viewport / nad nim — animacja i tak skończyłaby się od razu),
    // renderujemy w stanie końcowym i nie ustawiamy ScrollTriggera.
    // Sekcje tylko częściowo widoczne (np. przy dolnej krawędzi viewport)
    // dalej animują się przy scrollu — zgodnie z dotychczasowym efektem.
    const rect = el.getBoundingClientRect();
    const endRatio = parseTriggerRatio(end, 0.2);
    if (rect.top < window.innerHeight * endRatio) {
      gsap.set(el, { y: 0, opacity: 1 });
      return;
    }

    const tween = gsap.fromTo(
      el,
      { y, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start,
          end,
          scrub: true,
        },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [y, start, end]);

  return ref;
}
