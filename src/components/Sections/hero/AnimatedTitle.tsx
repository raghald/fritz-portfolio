"use client";

import React, { useMemo } from "react";
import { motion, type Variants } from "framer-motion";
import type { IntroTimings } from "@/lib/introTimings";
import { ms } from "@/lib/introTimings";

type Props = {
  text: string;
  timings: IntroTimings;
  className?: string;
  /** domyślnie 2, bo H1 robimy osobno jako sr-only */
  ariaLevel?: 1 | 2 | 3 | 4 | 5 | 6;
};

export default function AnimatedTitle({
  text,
  timings,
  className,
  ariaLevel = 2,
}: Props) {
  const letters = useMemo(() => Array.from(text), [text]);

  const container: Variants = useMemo(
    () => ({
      hidden: {},
      show: {
        transition: {
          delay: ms(timings.titleStartMs),
          staggerChildren: ms(timings.letterStaggerMs),
        },
      },
    }),
    [timings]
  );

  const letter: Variants = useMemo(
    () => ({
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: { duration: 0 },
      },
    }),
    []
  );

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="show"
      variants={container}
      aria-label={text}
      role="heading"
      aria-level={ariaLevel}
    >
      {letters.map((ch, i) => (
        <motion.span
          key={i}
          variants={letter}
          style={{ display: "inline-block" }}
        >
          {ch === " " ? "\u00A0" : ch}
        </motion.span>
      ))}
    </motion.div>
  );
}
