"use client";

import React from "react";
import Image from "next/image";
import {
  MediaPlayer,
  MediaProvider,
  type MediaPlayerInstance,
  useMediaRemote,
} from "@vidstack/react";
import { useInView } from "react-intersection-observer";
import { useTranslations } from "@/lib/useTranslations";
import { getVideoPosterPath } from "@/lib/videoPoster";
import RevealOnScroll from "@/components/RevealOnScroll";

// Gallery video data
type GalleryVideo = {
  id: string;
  videoSrc: string;
};

const galleryVideos: GalleryVideo[] = Array.from({ length: 21 }, (_, i) => ({
  id: `video-${i + 1}`,
  videoSrc: `/videos/gallery/vid${i + 1}.mp4`,
}));

function VideoCard({ video }: { video: GalleryVideo }) {
  const playerRef = React.useRef<MediaPlayerInstance>(null);
  const remote = useMediaRemote(playerRef);

  const t = useTranslations("gallery.video");

  // UI state (start muted to satisfy autoplay policies)
  const [paused, setPaused] = React.useState(true);
  const [muted, setMuted] = React.useState(true);

  // Progress (updated only when controls overlay is visible; throttled)
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const rafIdRef = React.useRef<number | null>(null);
  const lastPushRef = React.useRef<number>(0);

  const [controlsVisible, setControlsVisible] = React.useState(false);

  // Touch / no-hover: overlay i progress updates są zawsze aktywne
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(hover: none)");
    const sync = () => {
      if (mq.matches) setControlsVisible(true);
    };
    sync();
    mq.addEventListener?.("change", sync);
    return () => mq.removeEventListener?.("change", sync);
  }, []);

  // In-view detection
  const { ref: inViewRef, inView } = useInView({
    threshold: 0.2,
    triggerOnce: false,
    rootMargin: "250px 0px",
  });

  // Lazy-mount player when near viewport (keeps DOM lighter)
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    if (inView) setMounted(true);
  }, [inView]);

  // Helper: try to start playback when player is actually ready
  const playAttemptsRef = React.useRef(0);
  const playTimeoutRef = React.useRef<number | null>(null);

  const clearPlayRetry = React.useCallback(() => {
    playAttemptsRef.current = 0;
    if (playTimeoutRef.current != null) {
      window.clearTimeout(playTimeoutRef.current);
      playTimeoutRef.current = null;
    }
  }, []);

  const tryPlayWithRetry = React.useCallback(() => {
    const player = playerRef.current;
    if (!player) return;

    // Ensure muted before any autoplay attempt
    // (passing muted prop helps too, but we force it here)
    try {
      remote.mute();
    } catch {
      // ignore
    }

    const attempt = async () => {
      const p = playerRef.current;
      if (!p) return;

      // If user scrolled away, stop retrying
      if (!inView) return;

      try {
        const maybePromise = p.play?.();
        if (maybePromise && typeof maybePromise.then === "function") {
          await maybePromise;
        }
        // success -> reset attempts
        clearPlayRetry();
      } catch {
        // Retry a few times while the player warms up / metadata loads
        playAttemptsRef.current += 1;
        if (playAttemptsRef.current >= 8) return;

        playTimeoutRef.current = window.setTimeout(attempt, 200);
      }
    };

    attempt();
  }, [clearPlayRetry, inView, remote]);

  // Core rule:
  // - if inView -> play (muted)
  // - if out of view -> pause
  React.useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    if (mounted && inView) {
      tryPlayWithRetry();
    } else {
      clearPlayRetry();
      try {
        player.pause?.();
      } catch {
        // fallback
        try {
          remote.pause();
        } catch {
          // ignore
        }
      }
    }
  }, [mounted, inView, tryPlayWithRetry, clearPlayRetry, remote]);

  // Sync paused/muted with player events
  React.useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    const handlePlay = () => setPaused(false);
    const handlePause = () => setPaused(true);
    const handleVolumeChange = () => setMuted(player.muted);

    player.addEventListener("play", handlePlay);
    player.addEventListener("pause", handlePause);
    player.addEventListener("volume-change", handleVolumeChange);

    // Initial sync
    setPaused(player.paused);
    setMuted(player.muted);

    return () => {
      player.removeEventListener("play", handlePlay);
      player.removeEventListener("pause", handlePause);
      player.removeEventListener("volume-change", handleVolumeChange);
    };
  }, [mounted]);

  // Progress updates only when overlay visible, throttled (~5fps)
  React.useEffect(() => {
    const player = playerRef.current;
    if (!player) return;
    if (!controlsVisible) return;

    const push = () => {
      const now = performance.now();
      if (now - lastPushRef.current < 200) return;
      lastPushRef.current = now;

      const d = Number.isFinite(player.duration) ? player.duration : 0;
      const ct = Number.isFinite(player.currentTime) ? player.currentTime : 0;

      setDuration(d);
      setCurrentTime(ct);
    };

    const handleTimeUpdate = () => {
      if (rafIdRef.current != null) return;
      rafIdRef.current = window.requestAnimationFrame(() => {
        rafIdRef.current = null;
        push();
      });
    };

    push();
    player.addEventListener("time-update", handleTimeUpdate);

    return () => {
      player.removeEventListener("time-update", handleTimeUpdate);
      if (rafIdRef.current != null) {
        window.cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [controlsVisible]);

  const togglePlay = () => {
    const player = playerRef.current;
    if (!player) return;

    if (paused) {
      // user gesture -> unblocks play reliably on Safari/iOS
      try {
        player.play?.();
      } catch {
        remote.play();
      }
    } else {
      try {
        player.pause?.();
      } catch {
        remote.pause();
      }
    }
  };

  const toggleMute = () => {
    // user gesture -> safe to unmute
    if (muted) remote.unmute();
    else remote.mute();
  };

  const safeDuration = duration > 0 ? duration : 0;
  const safeCurrentTime = currentTime >= 0 ? currentTime : 0;
  const progress = safeDuration > 0 ? (safeCurrentTime / safeDuration) * 100 : 0;

  const posterSrc = getVideoPosterPath(video.videoSrc);

  return (
    <div
      ref={inViewRef}
      className="relative overflow-hidden w-full h-full bg-black rounded-0 group"
      onMouseEnter={() => setControlsVisible(true)}
      onMouseLeave={() => setControlsVisible(false)}
      onFocus={() => setControlsVisible(true)}
      onBlur={() => setControlsVisible(false)}
    >
      {!mounted ? (
        <div className="absolute inset-0">
          <Image
            src={posterSrc}
            alt={t("posterAlt")}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
            priority={false}
          />
        </div>
      ) : (
        <MediaPlayer
          ref={playerRef}
          src={video.videoSrc}
          poster={posterSrc}
          // MUST start muted for autoplay across browsers
          muted={true}
          loop
          playsInline
          controls={false}
          // keep light; we will start play only inView
          preload="metadata"
          // extra: once metadata is there, give another nudge (helps Safari)
          onLoadedMetadata={() => {
            if (inView) tryPlayWithRetry();
          }}
          className="relative block h-full w-full bg-black
                   [--video-object-fit:cover] [--video-object-position:center]"
        >
          <MediaProvider
            className="absolute inset-0
                     [&_.vds-video]:w-full [&_.vds-video]:h-full [&_.vds-video]:object-cover
                     [&>video]:w-full [&>video]:h-full [&>video]:object-cover"
          />
        </MediaPlayer>
      )}

      {/* Overlay controls */}
      <div className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100 [@media(hover:none)]:opacity-100">
        <div className="pointer-events-auto absolute left-4 right-4 top-4 flex items-start justify-between">
          <div className="w-10 h-10 grid place-items-center rounded-full hover:bg-white/20 transition-colors cursor-pointer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white" aria-hidden="true">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43V7.56a8.16 8.16 0 0 0 4.77 1.53v-3.4a4.85 4.85 0 0 1-1.04 0z" />
            </svg>
          </div>

          <button
            onClick={toggleMute}
            className="w-10 h-10 grid place-items-center rounded-full hover:bg-white/20 transition-colors cursor-pointer"
            aria-label={muted ? t("unmute") : t("mute")}
          >
            {muted ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                <path d="M4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
              </svg>
            )}
          </button>
        </div>

        <div className="pointer-events-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <button
            onClick={togglePlay}
            className="w-16 h-16 grid place-items-center rounded-full hover:bg-white/20 transition-colors cursor-pointer"
            aria-label={paused ? t("play") : t("pause")}
          >
            {paused ? (
              <svg width="32" height="32" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            ) : (
              <svg width="32" height="32" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            )}
          </button>
        </div>

        <div className="pointer-events-auto absolute bottom-4 left-4 right-4">
          <div className="relative h-1.5 bg-white/30 rounded-full">
            <div className="h-full bg-white rounded-full" style={{ width: safeDuration > 0 ? `${progress}%` : "0%" }} />

            <input
              type="range"
              min={0}
              max={safeDuration}
              value={Math.min(safeCurrentTime, safeDuration)}
              onChange={(e) => remote.seek(parseFloat(e.target.value))}
              className="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
              aria-label={t("seek")}
            />

            <div
              className="absolute top-1/2 h-4 w-4 -translate-y-1/2 -translate-x-1/2 rounded-full bg-white"
              style={{ left: safeDuration > 0 ? `${progress}%` : "0%" }}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const GalleryGrid: React.FC = () => {
  const t = useTranslations("gallery.grid");

  return (
    <section className="w-full max-w-[1440px] mx-auto pb-[60px] lg:pb-[90px]" aria-label={t("sectionAria")}>
      {/* Mobile / tablet / small laptop */}
      <div className="xl:hidden px-3 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 md:gap-6 lg:gap-7">
          {galleryVideos.map((video) => (
            <RevealOnScroll key={video.id} className="w-full aspect-[9/16]">
              <VideoCard video={video} />
            </RevealOnScroll>
          ))}
        </div>
      </div>

      {/* Desktop masonry (>= 1280px) */}
      <div className="hidden xl:block relative h-[6900px]">
        <RevealOnScroll className="w-80 h-[552px] left-[52px] top-0 absolute">
          <VideoCard video={galleryVideos[0]} />
        </RevealOnScroll>
        <RevealOnScroll className="w-80 h-[552px] left-[52px] top-[1587px] absolute">
          <VideoCard video={galleryVideos[1]} />
        </RevealOnScroll>
        <RevealOnScroll className="w-80 h-[552px] left-[52px] top-[3174px] absolute">
          <VideoCard video={galleryVideos[2]} />
        </RevealOnScroll>

        <RevealOnScroll className="w-80 h-[552px] left-[166px] top-[807px] absolute">
          <VideoCard video={galleryVideos[3]} />
        </RevealOnScroll>
        <RevealOnScroll className="w-80 h-[552px] left-[166px] top-[2394px] absolute">
          <VideoCard video={galleryVideos[4]} />
        </RevealOnScroll>
        <RevealOnScroll className="w-80 h-[552px] left-[166px] top-[3981px] absolute">
          <VideoCard video={galleryVideos[5]} />
        </RevealOnScroll>

        <RevealOnScroll className="w-80 h-[552px] left-[563px] top-[322px] absolute">
          <VideoCard video={galleryVideos[6]} />
        </RevealOnScroll>
        <RevealOnScroll className="w-80 h-[552px] left-[563px] top-[1909px] absolute">
          <VideoCard video={galleryVideos[7]} />
        </RevealOnScroll>
        <RevealOnScroll className="w-80 h-[552px] left-[563px] top-[3496px] absolute">
          <VideoCard video={galleryVideos[8]} />
        </RevealOnScroll>

        <RevealOnScroll className="w-80 h-[552px] left-[1075px] top-[199px] absolute">
          <VideoCard video={galleryVideos[9]} />
        </RevealOnScroll>
        <RevealOnScroll className="w-80 h-[552px] left-[1075px] top-[1786px] absolute">
          <VideoCard video={galleryVideos[10]} />
        </RevealOnScroll>
        <RevealOnScroll className="w-80 h-[552px] left-[1075px] top-[3373px] absolute">
          <VideoCard video={galleryVideos[11]} />
        </RevealOnScroll>

        <RevealOnScroll className="w-80 h-[552px] left-[962px] top-[1035px] absolute">
          <VideoCard video={galleryVideos[12]} />
        </RevealOnScroll>
        <RevealOnScroll className="w-80 h-[552px] left-[962px] top-[2622px] absolute">
          <VideoCard video={galleryVideos[13]} />
        </RevealOnScroll>
        <RevealOnScroll className="w-80 h-[552px] left-[962px] top-[4209px] absolute">
          <VideoCard video={galleryVideos[14]} />
        </RevealOnScroll>

        <RevealOnScroll className="w-80 h-[552px] left-[52px] top-[4761px] absolute">
          <VideoCard video={galleryVideos[15]} />
        </RevealOnScroll>
        <RevealOnScroll className="w-80 h-[552px] left-[166px] top-[5568px] absolute">
          <VideoCard video={galleryVideos[16]} />
        </RevealOnScroll>
        <RevealOnScroll className="w-80 h-[552px] left-[563px] top-[5083px] absolute">
          <VideoCard video={galleryVideos[17]} />
        </RevealOnScroll>
        <RevealOnScroll className="w-80 h-[552px] left-[1075px] top-[4960px] absolute">
          <VideoCard video={galleryVideos[18]} />
        </RevealOnScroll>
        <RevealOnScroll className="w-80 h-[552px] left-[962px] top-[5796px] absolute">
          <VideoCard video={galleryVideos[19]} />
        </RevealOnScroll>
        <RevealOnScroll className="w-80 h-[552px] left-[52px] top-[6348px] absolute">
          <VideoCard video={galleryVideos[20]} />
        </RevealOnScroll>
      </div>
    </section>
  );
};

export default GalleryGrid;
