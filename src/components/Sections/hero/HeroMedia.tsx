"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

import styles from "./Hero.module.css";

export type HeroMediaItem =
  | {
      type: "image";
      src: string;
      alt?: string;
      durationMs?: number;
    }
  | {
      type: "video";
      src: string;
      durationMs?: number;
      muted?: boolean;
      loop?: boolean;
      playsInline?: boolean;
    };

type HeroMediaProps = {
  items: HeroMediaItem[];
  defaultDurationMs?: number;
  startIndex?: number;
  paused?: boolean;
  className?: string;
};

export default function HeroMedia({
  items,
  defaultDurationMs = 2600,
  startIndex = 0,
  paused = false,
  className,
}: HeroMediaProps) {
  const media = useMemo(() => items.filter(Boolean), [items]);

  const [index, setIndex] = useState(() =>
    Math.min(Math.max(startIndex, 0), Math.max(media.length - 1, 0))
  );

  // Gdy lista się zmieni (np. hot reload), pilnuj indeksu
  useEffect(() => {
    setIndex((prev) =>
      Math.min(Math.max(prev, 0), Math.max(media.length - 1, 0))
    );
  }, [media.length]);

  const timerRef = useRef<number | null>(null);

  const clearTimer = () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = null;
  };

  useEffect(() => {
    clearTimer();
    if (paused || media.length <= 1) return;

    const current = media[index];
    const duration = current.durationMs ?? defaultDurationMs;

    timerRef.current = window.setTimeout(() => {
      setIndex((prev) => (prev + 1) % media.length);
    }, Math.max(100, duration));

    return clearTimer;
  }, [index, paused, media, defaultDurationMs]);

  if (!media.length) return null;

  const current = media[index];

  return (
    <div
      className={className}
      aria-hidden="true"
      style={{ position: "relative", width: "100%", height: "100%" }}
    >
      {current.type === "image" ? (
        // hero-photo polega na naturalnych wymiarach obrazka (width/height auto + max-inline-size),
        // więc next/image z width/height wymuszałby nieprawidłowy aspect-ratio
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={`${current.src}-${index}`}
          src={current.src}
          alt={current.alt ?? ""}
          draggable={false}
          className={styles.photo}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%) translateZ(0)",
            objectFit: "contain",
            objectPosition: "center",
            pointerEvents: "none",
            willChange: "transform",
          }}
        />
      ) : (
        <video
          key={`${current.src}-${index}`}
          src={current.src}
          muted={current.muted ?? true}
          autoPlay
          playsInline={current.playsInline ?? true}
          loop={current.loop ?? false}
          className={styles.photo}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%) translateZ(0)",
            objectFit: "contain",
            objectPosition: "center",
            pointerEvents: "none",
            willChange: "transform",
          }}
        />
      )}
    </div>
  );
}
