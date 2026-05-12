"use client";

import * as React from "react";
import Link from "next/link";
import {
  MediaPlayer,
  MediaProvider,
  type MediaPlayerInstance,
  useMediaRemote,
  useMediaStore,
} from "@vidstack/react";
import { useInView } from "react-intersection-observer";
import { TypeAnimation } from "react-type-animation";
import { useLocale } from "next-intl";
import { useTranslations } from "@/lib/useTranslations";

import { getVideoPosterPath } from "@/lib/videoPoster";

import styles from "./TikTokShowcase.module.css";

// ===== Dane (podmień ścieżki i URL-e) =====
type TikTokVideo = {
  id: string;
  title: string;
  videoSrc: string;
  tiktokUrl: string;
};

const tikTokVideos: TikTokVideo[] = [
  {
    id: "video1",
    title: "TikTok Video 1",
    videoSrc: "/videos/vid1.mp4",
    tiktokUrl: "https://www.tiktok.com/@yourhandle/video/1234567890",
  },
  {
    id: "video2",
    title: "TikTok Video 2",
    videoSrc: "/videos/vid2.mp4",
    tiktokUrl: "https://www.tiktok.com/@yourhandle/video/1234567891",
  },
  {
    id: "video3",
    title: "TikTok Video 3",
    videoSrc: "/videos/vid3.mp4",
    tiktokUrl: "https://www.tiktok.com/@yourhandle/video/1234567892",
  },
  {
    id: "video4",
    title: "TikTok Video 4",
    videoSrc: "/videos/vid4.mp4",
    tiktokUrl: "https://www.tiktok.com/@yourhandle/video/1234567893",
  },
];

// ===== Pojedyncza karta z playerem =====
function TikTokCard({
  video,
  className = "",
}: {
  video: TikTokVideo;
  className?: string;
}) {
  const playerRef = React.useRef<MediaPlayerInstance>(null);
  const remote = useMediaRemote(playerRef);
  const $ = useMediaStore(playerRef);
  const t = useTranslations("tiktok");

  const { ref: inViewRef, inView } = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });

  React.useEffect(() => {
    if (!playerRef.current) return;
    if (inView) remote.play();
    else remote.pause();
  }, [inView, remote]);

  const togglePlay = () => {
    if ($.paused) remote.play();
    else remote.pause();
  };

  const toggleMute = () => {
    if ($.muted) remote.unmute();
    else remote.mute();
  };

  const onSeek = (value: number) => {
    remote.seek(value);
  };

  return (
    <div
      ref={inViewRef}
      className={`${styles.card} group ${className}`}
      aria-label={video.title}
    >
      <MediaPlayer
        ref={playerRef}
        src={video.videoSrc}
        poster={getVideoPosterPath(video.videoSrc)}
        muted
        loop
        autoplay
        playsInline
        controls={false}
        preload="metadata"
        className={styles.player}
      >
        <MediaProvider className={styles.provider} />
      </MediaPlayer>

      {/* Overlay z kontrolkami */}
      <div className={`${styles.overlay} group-hover:opacity-100 group-focus-within:opacity-100`}>
        {/* Top bar: TikTok + mute */}
        <div className={styles.topbar}>
          <a
            href={video.tiktokUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={t("openSource")}
            className={styles.iconBtn}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="white"
              aria-hidden="true"
            >
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43V7.56a8.16 8.16 0 0 0 4.77 1.53v-3.4a4.85 4.85 0 0 1-1.04 0z" />
            </svg>
          </a>

          <button
            onClick={toggleMute}
            className={styles.iconBtn}
            aria-label={$.muted ? t("unmute") : t("mute")}
            type="button"
          >
            {$.muted ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="white"
                aria-hidden="true"
              >
                <path d="M4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="white"
                aria-hidden="true"
              >
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
              </svg>
            )}
          </button>
        </div>

        {/* Center: Play/Pause */}
        <div className={styles.center}>
          <button
            onClick={togglePlay}
            className={styles.playBtn}
            aria-label={$.paused ? t("play") : t("pause")}
            type="button"
          >
            {$.paused ? (
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="white"
                aria-hidden="true"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            ) : (
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="white"
                aria-hidden="true"
              >
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            )}
          </button>
        </div>

        {/* Bottom: Progress */}
        <div className={styles.progressWrap}>
          <div className={styles.progress}>
            <div
              className={styles.progressBar}
              style={{
                width:
                  $.duration > 0
                    ? `${($.currentTime / $.duration) * 100}%`
                    : "0%",
              }}
            />
            <input
              type="range"
              min={0}
              max={Number.isFinite($.duration) ? $.duration : 0}
              value={Number.isFinite($.currentTime) ? $.currentTime : 0}
              onChange={(e) => onSeek(parseFloat(e.target.value))}
              className={styles.progressInput}
              aria-label={t("seek")}
            />
            <div
              className={styles.progressThumb}
              style={{
                left:
                  $.duration > 0
                    ? `${($.currentTime / $.duration) * 100}%`
                    : "0%",
              }}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TikTokShowcase({ className = "" }: { className?: string }) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [shouldStartTyping, setShouldStartTyping] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);

  const tabletCarouselRef = React.useRef<HTMLDivElement | null>(null);
  const mobileCarouselRef = React.useRef<HTMLDivElement | null>(null);
  const headerRef = React.useRef<HTMLDivElement>(null);
  const previousScrollLeftRef = React.useRef(0);

  const t = useTranslations("tiktok");
  const locale = useLocale();

  React.useEffect(() => setIsMounted(true), []);

  const handleTabletScroll = React.useCallback(() => {
    if (!isMounted) return;
    const el = tabletCarouselRef.current;
    if (!el) return;

    const currentScrollLeft = el.scrollLeft;
    const scrollThreshold = 50;

    if (
      Math.abs(currentScrollLeft - previousScrollLeftRef.current) >
      scrollThreshold
    ) {
      if (currentScrollLeft > previousScrollLeftRef.current) setActiveIndex(1);
      else if (currentScrollLeft < previousScrollLeftRef.current)
        setActiveIndex(0);

      previousScrollLeftRef.current = currentScrollLeft;
    }
  }, [isMounted]);

  const handleMobileScroll = React.useCallback(() => {
    if (!isMounted) return;
    const el = mobileCarouselRef.current;
    if (!el) return;

    const currentScrollLeft = el.scrollLeft;
    const idx = Math.round(currentScrollLeft / el.clientWidth);
    const clamped = Math.min(Math.max(idx, 0), tikTokVideos.length - 1);
    setActiveIndex(clamped);
  }, [isMounted]);

  const scrollToVideo = (index: number) => {
    if (!isMounted) return;

    const isTablet = window.matchMedia(
      "(min-width: 768px) and (max-width: 1023px)"
    ).matches;

    if (isTablet) {
      const el = tabletCarouselRef.current;
      if (!el) return;
      const containerWidth = el.clientWidth;
      const targetScrollLeft = index === 0 ? 0 : containerWidth;

      el.scrollTo({ left: targetScrollLeft, behavior: "smooth" });
      setActiveIndex(index);
      previousScrollLeftRef.current = targetScrollLeft;
    } else {
      const el = mobileCarouselRef.current;
      if (!el) return;
      el.scrollTo({ left: index * el.clientWidth, behavior: "smooth" });
    }
  };

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !shouldStartTyping) setShouldStartTyping(true);
      },
      { threshold: 0.3, rootMargin: "-50px 0px -50px 0px" }
    );

    const currentHeaderRef = headerRef.current;
    if (currentHeaderRef) observer.observe(currentHeaderRef);

    return () => {
      if (currentHeaderRef) observer.unobserve(currentHeaderRef);
    };
  }, [shouldStartTyping]);

  return (
    <section
      className={`${styles.section} page-shell ${className}`}
      data-section="tiktok"
      role="region"
      aria-label={t("ariaLabel")}
    >
      {/* Header */}
      <div ref={headerRef} className={styles.header}>
        <h2 className={styles.headerTitle}>
          {shouldStartTyping ? (
            <TypeAnimation
              sequence={[t("headerTyping")]}
              wrapper="span"
              speed={50}
              style={{ display: "inline-block" }}
              repeat={0}
              cursor={false}
            />
          ) : (
            <span style={{ opacity: 0 }}>{t("headerTyping")}</span>
          )}
        </h2>
      </div>

      {/* Desktop Grid */}
      <div className={styles.gridDesktop}>
        {tikTokVideos.map((video) => (
          <TikTokCard
            key={video.id}
            video={video}
            className={styles.cardDesktop}
          />
        ))}
      </div>

      {/* Tablet Carousel */}
      <div
        ref={tabletCarouselRef}
        onScroll={handleTabletScroll}
        className={styles.carouselTablet}
      >
        {tikTokVideos.map((video) => (
          <TikTokCard
            key={video.id}
            video={video}
            className={styles.cardTablet}
          />
        ))}
      </div>

      {/* Mobile Carousel */}
      <div
        ref={mobileCarouselRef}
        onScroll={handleMobileScroll}
        className={styles.carouselMobile}
      >
        {tikTokVideos.map((video) => (
          <TikTokCard
            key={video.id}
            video={video}
            className={styles.cardMobile}
          />
        ))}
      </div>

      {/* Dots */}
      <div className={styles.dots}>
        {isMounted &&
          (() => {
            const isTablet = window.matchMedia(
              "(min-width: 768px) and (max-width: 1023px)"
            ).matches;
            const dotCount = isTablet ? 2 : tikTokVideos.length;

            return Array.from({ length: dotCount }, (_, i) => (
              <button
                key={i}
                onClick={() => scrollToVideo(i)}
                aria-label={
                  isTablet
                    ? t("dotPage", { index: i + 1 })
                    : t("dotVideo", { index: i + 1 })
                }
                className={`${styles.dot} ${i === activeIndex ? styles.isActive : ""}`}
                type="button"
              />
            ));
          })()}

        {!isMounted &&
          tikTokVideos.map((_, i) => (
            <button
              key={i}
              aria-label={t("dotVideo", { index: i + 1 })}
              className={`${styles.dot} ${i === activeIndex ? styles.isActive : ""}`}
              type="button"
            />
          ))}
      </div>

      {/* CTA — identyczne jak ProjectsShowcase */}
     {/* CTA — takie samo jak w ProjectsShowcaseSticky */}
<div className={styles.footer}>
  <Link href={`/${locale}/gallery`}>
    <button
      aria-label={t("ctaAria")}
      className="ps-cta group"
      type="button"
    >
      <div className="ps-ctaLayer ps-ctaLayer-1" />
      <div className="ps-ctaLayer ps-ctaLayer-2 group-hover:w-full" />
      <div className="ps-ctaLayer ps-ctaLayer-3 group-hover:w-full" />
      <span className="ps-ctaLabel group-hover:text-black">
        {t("ctaLabel")}
      </span>
    </button>
  </Link>
</div>

    </section>
  );
}
