// src/components/hero/OrnamentsShuffle.tsx
"use client";

import * as React from "react";

type SvgComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

type Props = {
  /** łatwy kill switch w kodzie */
  enabled?: boolean;
  /** tempo w ms */
  intervalMs?: number;
  /** klasy przekazywane do SVG (np. rozmiar/kolor) */
  className?: string;
  /** opcjonalnie: startowy układ (domyślnie 0,1,2) */
  initialOrder?: number[];
  /** komponenty ikon (3 szt.) */
  icons: [SvgComponent, SvgComponent, SvgComponent];
};

/** proste porównanie tablic */
function sameOrder(a: number[], b: number[]) {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

/** Fisher–Yates shuffle */
function shuffle(arr: number[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function OrnamentsShuffle({
  enabled = true,
  intervalMs = 1800,
  className = "h-7 w-7 text-white/90",
  initialOrder,
  icons,
}: Props) {
  // Kill switch z env (opcjonalnie)
  const envEnabled =
    typeof process !== "undefined"
      ? process.env.NEXT_PUBLIC_ORNAMENTS_SHUFFLE !== "0"
      : true;

  const isEnabled = enabled && envEnabled;

  const [order, setOrder] = React.useState<number[]>(
    initialOrder?.length === 3 ? initialOrder : [0, 1, 2]
  );

  React.useEffect(() => {
    if (!isEnabled) return;

    // sanity guard
    const ms = Math.max(250, intervalMs);

    const id = window.setInterval(() => {
      setOrder((prev) => {
        let next = shuffle(prev);

        // unikaj powtórki tego samego układu
        if (sameOrder(next, prev)) {
          next = shuffle(prev);
        }

        return next;
      });
    }, ms);

    return () => window.clearInterval(id);
  }, [isEnabled, intervalMs]);

  const [A, B, C] = icons;
  const map = [A, B, C];

  const O1 = map[order[0]];
  const O2 = map[order[1]];
  const O3 = map[order[2]];

  return (
    <>
      <O1 className={className} />
      <O2 className={className} />
      <O3 className={className} />
    </>
  );
}
