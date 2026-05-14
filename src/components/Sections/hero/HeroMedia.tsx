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

/**
 * Crossfade carousel — wszystkie elementy są wmontowane raz, widoczność
 * sterowana klasą .photoActive (opacity 0/1 + transition). Brak unmount/remount
 * eliminuje flicker i ponowne dekodowanie obrazków.
 */
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

  useEffect(() => {
    setIndex((prev) =>
      Math.min(Math.max(prev, 0), Math.max(media.length - 1, 0))
    );
  }, [media.length]);

  // Carousel timer
  const timerRef = useRef<number | null>(null);
  useEffect(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = null;

    if (paused || media.length <= 1) return;

    const current = media[index];
    const duration = current.durationMs ?? defaultDurationMs;

    timerRef.current = window.setTimeout(() => {
      setIndex((prev) => (prev + 1) % media.length);
    }, Math.max(100, duration));

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = null;
    };
  }, [index, paused, media, defaultDurationMs]);

  // Video play/pause coordination — tylko aktywne wideo gra
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === index && !paused) {
        // play() returns a Promise we can safely ignore (autoplay errors are fine)
        video.play().catch(() => {});
      } else {
        video.pause();
        try {
          video.currentTime = 0;
        } catch {}
      }
    });
  }, [index, paused]);

  if (!media.length) return null;

  return (
    <div
      className={className}
      aria-hidden="true"
      style={{ position: "relative", width: "100%", height: "100%" }}
    >
      {media.map((item, i) => {
        const isActive = i === index;
        const classes = `${styles.photo} ${isActive ? styles.photoActive : ""}`.trim();

        if (item.type === "image") {
          return (
            // hero-photo polega na naturalnych wymiarach obrazka (width/height auto + max-inline-size),
            // więc next/image z width/height wymuszałby nieprawidłowy aspect-ratio
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={item.src}
              src={item.src}
              alt={item.alt ?? ""}
              draggable={false}
              loading={i === 0 ? "eager" : "lazy"}
              decoding={i === 0 ? "sync" : "async"}
              fetchPriority={i === 0 ? "high" : "auto"}
              className={classes}
            />
          );
        }

        return (
          <video
            key={item.src}
            ref={(el) => {
              videoRefs.current[i] = el;
            }}
            src={item.src}
            muted={item.muted ?? true}
            playsInline={item.playsInline ?? true}
            loop={item.loop ?? false}
            preload={i === 0 ? "auto" : "metadata"}
            className={classes}
          />
        );
      })}
    </div>
  );
}
