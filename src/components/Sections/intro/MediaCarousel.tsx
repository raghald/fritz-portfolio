"use client";

import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { useTranslations } from "@/lib/useTranslations";
import { getVideoPosterPath } from "@/lib/videoPoster";

type MediaItem = {
  id: number;
  type: "video";
  videoSrc: string;
};

interface MediaCarouselProps {
  className?: string;
}

const MediaCarousel: React.FC<MediaCarouselProps> = ({ className = "" }) => {
  const t = useTranslations("about.mediaCarousel");

  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isInView, setIsInView] = useState(false);

  // Create array of 4 video items - alternating wide and narrow
  const mediaItems: MediaItem[] = [
    { id: 3, type: "video", videoSrc: "/videos/About_Me_3.mp4" }, // Wide
    { id: 1, type: "video", videoSrc: "/videos/About_Me_1.mp4" }, // Narrow
    { id: 2, type: "video", videoSrc: "/videos/About_Me_2.mp4" }, // Wide
    { id: 4, type: "video", videoSrc: "/videos/About_Me_4.mp4" }, // Narrow
  ];

  // Calculate total width dynamically based on actual video widths
  const getCarouselWidth = () => {
    if (!trackRef.current) return 0;
    const firstSet = trackRef.current.children[0];
    if (!firstSet) return 0;

    // Calculate width of first 4 items (one complete set)
    let totalWidth = 0;
    for (
      let i = 0;
      i < Math.min(4, trackRef.current.children.length / 2);
      i++
    ) {
      const item = trackRef.current.children[i] as HTMLElement;
      totalWidth += item.offsetWidth;
    }
    // Add gaps: 28px * 3 (between 4 items)
    totalWidth += 28 * 3;

    return totalWidth || 2000; // Fallback if calculation fails
  };

  useEffect(() => {
    if (!trackRef.current) return;

    const track = trackRef.current;

    // Wait for videos to load and get their dimensions
    const videos = track.querySelectorAll("video");
    let loadedCount = 0;

    const onVideoLoaded = () => {
      loadedCount++;
      if (loadedCount === videos.length) {
        startAnimationWithWidth();
      }
    };

    // Slower speeds - moderate pace
    const getDuration = () => {
      if (typeof window === "undefined") return 40;
      if (window.innerWidth < 768) return 30; // Mobile - slower
      if (window.innerWidth < 1024) return 35; // Tablet - slower
      return 40; // Desktop - slower (adjusted for 4 items)
    };

    // Create infinite loop animation
    const startAnimationWithWidth = () => {
      const carouselWidth = getCarouselWidth();
      if (carouselWidth === 0) return;

      gsap.set(track, { x: 0 });

      animationRef.current = gsap.to(track, {
        x: -carouselWidth,
        duration: getDuration(),
        ease: "none", // Linear movement for constant speed
        repeat: -1, // Infinite loop
        modifiers: {
          x: (x) => {
            // Seamless loop: reset to 0 when reaching -carouselWidth
            const xNum = parseFloat(x);
            return `${xNum % carouselWidth}px`;
          },
        },
      });
    };

    // Listen for video metadata loaded
    videos.forEach((video) => {
      if (video.readyState >= 2) {
        onVideoLoaded();
      } else {
        video.addEventListener("loadedmetadata", onVideoLoaded);
      }
    });

    // Fallback: start animation after timeout if videos don't load
    const fallbackTimeout = setTimeout(() => {
      if (loadedCount < videos.length) {
        startAnimationWithWidth();
      }
    }, 1000);

    // Handle window resize
    const handleResize = () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
      startAnimationWithWidth();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(fallbackTimeout);
      videos.forEach((video) => {
        video.removeEventListener("loadedmetadata", onVideoLoaded);
      });
      if (animationRef.current) {
        animationRef.current.kill();
      }
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // IntersectionObserver: pause off-screen videos to save CPU/network
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || typeof IntersectionObserver === "undefined") {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { rootMargin: "200px" }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!trackRef.current) return;
    const videos = trackRef.current.querySelectorAll("video");
    videos.forEach((video) => {
      if (isInView) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [isInView]);

  // Handle hover with smooth deceleration like a train slowing down
  useEffect(() => {
    if (!animationRef.current) return;

    if (isHovering) {
      // Slow down smoothly like a train braking - takes 2 seconds to stop
      gsap.to(animationRef.current, {
        timeScale: 0, // Gradually reduce speed to 0
        duration: 2, // 2 seconds to come to a complete stop
        ease: "power2.out", // Smooth deceleration curve
      });
    } else {
      // Resume speed smoothly - takes 1.5 seconds to get back to full speed
      gsap.to(animationRef.current, {
        timeScale: 1, // Back to normal speed
        duration: 1.5, // 1.5 seconds to resume
        ease: "power2.inOut", // Smooth acceleration curve
      });
    }
  }, [isHovering]);

  return (
    <section
      ref={sectionRef}
      className={`relative z-20 w-full bg-white ${className}`}
      role="region"
      aria-label={t("sectionAria")}
    >
      {/* Centered H2 Heading - Responsive */}
      <h2
        className="text-black font-semibold  leading-[100%] text-center
                   text-[44px] md:text-[48px] lg:text-[52px]
                   max-w-[1440px] mx-auto px-3 sm:px-[52px]"
      >
        {t("heading")}
      </h2>

      {/* Carousel Container - 8px gap below heading */}
      <div
        className="mt-8 overflow-hidden"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div
          ref={trackRef}
          className="flex items-center"
          style={{ gap: "28px" }}
        >
          {/* Duplicate items twice for seamless infinite loop */}
          {[...mediaItems, ...mediaItems].map((item, index) => {
            // Set max-width for About_Me_1 and About_Me_4 to match actual video content width
            const maxWidth = item.id === 1 || item.id === 4 ? "282px" : "none";

            return (
              <div key={`media-${item.id}-${index}`} className="flex-shrink-0">
                {/* All videos same height (500px), width auto for aspect ratio */}
                <video
                  className="h-[500px] w-auto object-contain block"
                  style={{ maxWidth }}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  poster={getVideoPosterPath(item.videoSrc)}
                  disablePictureInPicture
                  controlsList="nodownload nofullscreen noremoteplayback"
                >
                  <source src={item.videoSrc} type="video/mp4" />
                  {t("videoFallback")}
                </video>
              </div>
            );
          })}
        </div>
      </div>

      {/* Responsive bottom spacing */}
      <div className="pb-[72px] md:pb-[52px] lg:pb-[100px]" />
    </section>
  );
};

export default MediaCarousel;
