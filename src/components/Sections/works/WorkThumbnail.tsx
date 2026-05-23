"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLocale } from "next-intl";
import { useTranslations } from "@/lib/useTranslations";
import { localePath } from "@/i18n/routing";
import type { WorkItem } from "@/data/worksData";

type WorkThumbnailMode = "single" | "column";

type WorkThumbnailProps = {
  work: WorkItem & {
    coverSrc: string;     // .webp
    videoSrc?: string;    // .mp4 albo .webm (opcjonalne)
  };
  mode?: WorkThumbnailMode;
};

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(!!mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  return reduced;
}

function getVideoMime(src: string) {
  const s = src.toLowerCase();
  if (s.endsWith(".webm")) return "video/webm";
  if (s.endsWith(".mp4")) return "video/mp4";
  return "video/mp4";
}

export default function WorkThumbnail({ work, mode = "single" }: WorkThumbnailProps) {
  const t = useTranslations("Works");
  const locale = useLocale();
  const isHorizontal = work.layout === "horizontal";

  const href = localePath(locale, work.href);

  const title = t(`items.${work.id}.title`);
  const meta = t(`items.${work.id}.meta`);
  const description = t(`items.${work.id}.description`);

  const prefersReducedMotion = usePrefersReducedMotion();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isHover, setIsHover] = useState(false);
  const [isFocus, setIsFocus] = useState(false);

  const hasVideo = !!work.videoSrc;

  const shouldPlay = useMemo(() => {
    if (!hasVideo) return false;
    if (prefersReducedMotion) return false;
    return isHover || isFocus;
  }, [hasVideo, prefersReducedMotion, isHover, isFocus]);

  const play = useCallback(async () => {
    const v = videoRef.current;
    if (!v) return;
    try {
      if (v.currentTime !== 0) v.currentTime = 0;
      await v.play();
    } catch {}
  }, []);

  const stopAndReset = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    try {
      v.currentTime = 0;
    } catch {}
  }, []);

  useEffect(() => {
    if (!hasVideo) return;
    if (shouldPlay) play();
    else stopAndReset();
  }, [hasVideo, shouldPlay, play, stopAndReset]);

  const Media = (
    <Link
      href={href}
      className="block w-full h-full cursor-pointer outline-none"
      aria-label={title}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onFocus={() => setIsFocus(true)}
      onBlur={() => setIsFocus(false)}
    >
      <div className="relative w-full h-full overflow-hidden">
        {/* COVER */}
        <Image
          src={work.coverSrc}
          alt={title}
          fill
          sizes="(max-width: 768px) 338px, (max-width: 1024px) 371px, 540px"
          className={[
            "object-cover",
            shouldPlay ? "opacity-0" : "opacity-100",
          ].join(" ")}
          priority={false}
        />

        {/* VIDEO (opcjonalnie) */}
        {hasVideo ? (
          <video
            ref={videoRef}
            className={[
              "absolute inset-0 w-full h-full object-cover",
              shouldPlay ? "opacity-100" : "opacity-0",
            ].join(" ")}
            muted
            playsInline
            loop
            preload="none"
            poster={work.coverSrc}
            disablePictureInPicture
            controlsList="nodownload nofullscreen noremoteplayback"
            style={{ pointerEvents: "none" }}
          >
            <source src={work.videoSrc} type={getVideoMime(work.videoSrc!)} />
            {t("videoFallback")}
          </video>
        ) : null}
      </div>
    </Link>
  );

  const Content = (
    <div
      className={[
        "flex gap-7",
        "flex-col",
        isHorizontal && mode === "single" ? "md:flex-row" : "md:flex-col",
      ].join(" ")}
    >
      {/* MEDIA */}
      <div
        className={[
          "flex-shrink-0",
          "w-full max-w-[338px] aspect-square",
          "md:max-w-[371px]",
          "lg:max-w-[540px]",
          mode === "single" && !isHorizontal ? "mx-auto md:mx-0" : "",
        ].join(" ")}
      >
        {Media}
      </div>

      {/* TEKST */}
      <div
        className={[
          "flex flex-col",
          isHorizontal && mode === "single" ? "md:justify-center" : "md:justify-start",
          "w-full max-w-[338px] md:max-w-none md:w-auto",
          mode === "single" && !isHorizontal ? "mx-auto md:mx-0" : "",
        ].join(" ")}
      >
        <Link href={href} className="cursor-pointer group block">
          <h4 className="text-black font-semibold text-[28px] lg:text-[32px] leading-[100%] text-left">
            {title}
          </h4>

          <div className="mt-3">
            <p className="text-black text-xs leading-[150%] text-left pointer-events-none">
              {meta}
            </p>
          </div>

          <div className="mt-3">
            <p className="text-black text-base leading-[150%] tracking-[0.16px] text-left w-full max-w-[338px] md:max-w-none md:w-auto md:h-auto">
              {description}
            </p>
          </div>
        </Link>
      </div>
    </div>
  );

  if (mode === "single") {
    return (
      <article aria-label={title}>
        <div className="px-8 md:px-8 lg:px-[52px]">
          <div className="w-full md:w-[770px] lg:w-[1108px] mx-auto lg:mx-0">
            {Content}
          </div>
        </div>
      </article>
    );
  }

  return <article aria-label={title}>{Content}</article>;
}
