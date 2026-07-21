"use client";

import { useEffect, useState } from "react";

/**
 * Detekcja "stuck" state dla sticky navbara.
 *
 * Implementacja: IntersectionObserver na niewidocznym sentinel divie wstrzykniętym
 * na pozycji `threshold`px od góry body. Gdy sentinel opuści viewport (przewinięto
 * w dół) → isStuck=true. Gdy wróci → isStuck=false.
 *
 * Dlaczego nie window.scroll event: smooth scroll z Lenis interpoluje pozycję,
 * a finalne scroll-eventy potrafią lagować lub być pomijane (zwłaszcza przy
 * powrocie do top), przez co `setIsStuck(scrollY > 50)` zostaje "zamrożony"
 * w starym stanie. IO jest niezależne od emisji scroll events i opiera się
 * tylko na faktycznej geometrii layoutu.
 *
 * @param threshold px od góry strony, po przekroczeniu którego navbar staje się "stuck"
 * @param enabled jeśli false, observer się nie podłącza i isStuck pozostaje false
 */
export function useStickyNav(
  threshold: number = 50,
  enabled: boolean = true
): boolean {
  const [isStuck, setIsStuck] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setIsStuck(false);
      return;
    }

    if (typeof window === "undefined") return;

    // Sentinel: niewidoczny 1px element pozycjonowany absolutnie na top:threshold.
    // Gdy zniknie z viewportu (scroll w dół) → stuck.
    const sentinel = document.createElement("div");
    sentinel.setAttribute("data-sticky-sentinel", "");
    sentinel.setAttribute("aria-hidden", "true");
    sentinel.style.cssText = [
      "position:absolute",
      `top:${threshold}px`,
      "left:0",
      "width:1px",
      "height:1px",
      "pointer-events:none",
      "opacity:0",
    ].join(";");
    document.body.appendChild(sentinel);

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        // entry.isIntersecting = sentinel widoczny w viewport.
        // Widoczny → nie jesteśmy stuck. Niewidoczny → stuck.
        const next = !entry.isIntersecting;
        setIsStuck(next);
      },
      {
        // root: null = viewport
        // rootMargin: domyślny — strzela na granicy viewport
        threshold: 0,
      }
    );

    observer.observe(sentinel);

    // Świadomie BEZ sync `setIsStuck(initialScrollY > threshold)`:
    // 1) IO i tak strzela pierwszym callbackiem zaraz po observe() z aktualną
    //    geometrią — nie ma "pierwszego frame'a bez stanu".
    // 2) Sync setState w useEffect uruchamiał extra render PRZED tym jak IO
    //    zdążył podać prawdziwą wartość — przy class-toggle to widać jako
    //    flash "stuck" przy wejściu na stronę (przy inline-style React batchował
    //    inaczej i flash był zamaskowany).
    // 3) Jeśli user wbija /home ze scrolla > threshold (rzadki refresh),
    //    IO i tak nadgoni w pierwszym frame.

    return () => {
      observer.disconnect();
      sentinel.remove();
    };
  }, [threshold, enabled]);

  return isStuck;
}
