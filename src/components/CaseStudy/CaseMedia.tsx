"use client";

import React from "react";
import Image from "next/image";
import { getVideoPosterPath } from "@/lib/videoPoster";

const VIDEO_RE = /\.(mp4|webm)$/i;

export const isVideoSrc = (src: string) => VIDEO_RE.test(src);

type CaseMediaProps = {
  src: string;
  alt: string;
  sizes: string;
  /** Klasy dla <video>/<Image> (np. object-cover, h-full). */
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Media w sekcjach case study: obraz albo zapętlone, wyciszone wideo
 * (gdy `src` kończy się na .mp4/.webm). Wideo dostaje poster `<nazwa>-poster.jpg`.
 */
export default function CaseMedia({ src, alt, sizes, className = "", style }: CaseMediaProps) {
  if (isVideoSrc(src)) {
    return (
      <video
        className={className}
        style={style}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster={getVideoPosterPath(src)}
        disablePictureInPicture
        controlsList="nodownload nofullscreen noremoteplayback"
        aria-label={alt}
      >
        <source src={src} type={src.toLowerCase().endsWith(".webm") ? "video/webm" : "video/mp4"} />
      </video>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={0}
      height={0}
      sizes={sizes}
      className={className}
      style={style}
    />
  );
}
