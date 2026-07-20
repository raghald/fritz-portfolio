"use client";

import React, { useMemo } from "react";
import type { IntroTimings } from "@/lib/introTimings";

import styles from "./AnimatedTitle.module.css";

type Props = {
  text: string;
  timings: IntroTimings;
  className?: string;
  /**
   * Dostępna nazwa nagłówka (sr-only). Komponent renderuje prawdziwy <h1>,
   * którego nazwą dostępną jest ten tekst; animowane litery są dekoracyjne
   * (aria-hidden). Podejście hybrydowe: wizualnie animowany tytuł, a przy tym
   * jeden semantyczny, bogaty w słowa kluczowe H1.
   */
  srText: string;
};

/**
 * Per-letter pop-in animation, driven entirely by CSS.
 * — `--title-start-ms` and `--letter-stagger-ms` come from props
 * — each letter span gets `--idx` for delay calculation
 * — respects `prefers-reduced-motion` via [AnimatedTitle.module.css]
 *
 * Renderuje się jako <h1>: widoczne litery są `aria-hidden`, a nazwą dostępną
 * nagłówka jest `srText`.
 */
export default function AnimatedTitle({
  text,
  timings,
  className,
  srText,
}: Props) {
  const letters = useMemo(() => Array.from(text), [text]);

  const rootStyle: React.CSSProperties = {
    ["--title-start-ms" as string]: `${timings.titleStartMs}ms`,
    ["--letter-stagger-ms" as string]: `${timings.letterStaggerMs}ms`,
  };

  return (
    <h1 className={className} style={rootStyle}>
      <span className="sr-only">{srText}</span>
      {letters.map((ch, i) => {
        const letterStyle: React.CSSProperties = {
          ["--idx" as string]: i,
        };
        return (
          <span
            key={i}
            className={styles.letter}
            style={letterStyle}
            aria-hidden="true"
          >
            {ch === " " ? " " : ch}
          </span>
        );
      })}
    </h1>
  );
}
