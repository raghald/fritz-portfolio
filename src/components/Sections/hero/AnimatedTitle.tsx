"use client";

import React, { useMemo } from "react";
import type { IntroTimings } from "@/lib/introTimings";

import styles from "./AnimatedTitle.module.css";

type Props = {
  text: string;
  timings: IntroTimings;
  className?: string;
  /** domyślnie 2, bo H1 robimy osobno jako sr-only */
  ariaLevel?: 1 | 2 | 3 | 4 | 5 | 6;
};

/**
 * Per-letter pop-in animation, driven entirely by CSS.
 * — `--title-start-ms` and `--letter-stagger-ms` come from props
 * — each letter span gets `--idx` for delay calculation
 * — respects `prefers-reduced-motion` via [AnimatedTitle.module.css]
 */
export default function AnimatedTitle({
  text,
  timings,
  className,
  ariaLevel = 2,
}: Props) {
  const letters = useMemo(() => Array.from(text), [text]);

  const rootStyle: React.CSSProperties = {
    ["--title-start-ms" as string]: `${timings.titleStartMs}ms`,
    ["--letter-stagger-ms" as string]: `${timings.letterStaggerMs}ms`,
  };

  return (
    <div
      className={className}
      style={rootStyle}
      aria-label={text}
      role="heading"
      aria-level={ariaLevel}
    >
      {letters.map((ch, i) => {
        const letterStyle: React.CSSProperties = {
          ["--idx" as string]: i,
        };
        return (
          <span key={i} className={styles.letter} style={letterStyle}>
            {ch === " " ? " " : ch}
          </span>
        );
      })}
    </div>
  );
}
