"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { TypeAnimation } from "react-type-animation";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import { useTranslations } from "@/lib/useTranslations";
import { localePath } from "@/i18n/routing";

import { WORKS } from "@/data/worksData";
import type { WorkItem } from "@/data/worksData";
import AnimatedButton from "@/components/AnimatedButton";
import { useScrollReveal } from "@/hooks/useScrollReveal";

import styles from "./ProjectsShowcase.module.css";

type ShowcaseProjectId = WorkItem["id"];

type Project = {
  id: ShowcaseProjectId;
  title: string;
  kicker?: string;
  desc: string;
  videoSrc?: string;
  coverSrc?: string;
  link?: string;
};

type Props = {
  className?: string;
};

const SHOWCASE_IDS: ShowcaseProjectId[] = [
  "talentdays-blog",
  "pharmovit-store",
  "pasibus-job-board",
];

// --- reduced motion helper (żeby nie odpalać video, jeśli user ma reduce)
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

export default function ProjectsShowcaseSticky({ className = "" }: Props) {
  const [activeProject, setActiveProject] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [shouldStartTyping, setShouldStartTyping] = useState(false);
  // Które video mają już gotową klatkę — dopiero wtedy odsłaniamy je nad coverem (bez białego błysku).
  const [readyVideos, setReadyVideos] = useState<Set<number>>(new Set());

  const markVideoReady = useCallback((index: number) => {
    setReadyVideos((prev) => {
      if (prev.has(index)) return prev;
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  }, []);

  const headerRevealRef = useScrollReveal<HTMLHeadingElement>({
    start: "top 90%",
    end: "top 60%",
  });
  const layoutRevealRef = useScrollReveal<HTMLDivElement>({
    start: "top 90%",
    end: "top 50%",
  });
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const headerRef = useRef<HTMLDivElement | null>(null);

  // NOWE: refs do video, żeby pause/reset dla nieaktywnych
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const tProjects = useTranslations("projects");
  const tWorksItems = useTranslations("Works.items");
  const tWorkTypes = useTranslations("Works.types");
  const tWorks = useTranslations("Works");
  const locale = useLocale();

  const prefersReducedMotion = usePrefersReducedMotion();

  // ✅ FIX: WorkType[] -> string dla kicker
  const formatWorkTypes = useCallback(
    (types: WorkItem["type"]) => {
      // jeśli masz już type: WorkType[] w WorkItem, to i tak będzie tablica,
      // ale to zabezpiecza na wypadek mieszanych danych podczas migracji
      const arr = Array.isArray(types) ? types : [types];
      return arr.map((t) => tWorkTypes(t)).join(" / ");
    },
    [tWorkTypes]
  );

  const projects: Project[] = useMemo(() => {
    return SHOWCASE_IDS.map((id) => {
      const work = WORKS.find((w) => w.id === id);

      if (!work) {
        console.warn(
          `WORKS entry with id "${id}" not found for ProjectsShowcase.`
        );
        return { id, title: id, desc: "" };
      }

      return {
        id,
        title: tWorksItems(`${id}.title`),
        kicker: formatWorkTypes(work.type),
        desc: tWorksItems(`${id}.description`),
        videoSrc: work.videoSrc,
        coverSrc: work.coverSrc, // ✅ FIX: bez any
        link: work.href,
      };
    });
  }, [tWorksItems, formatWorkTypes]);

  // To zostaje 1:1 jak było (zmiana aktywnego projektu wg widoczności elementu)
  const findMostVisibleElement = useCallback(() => {
    const viewportCenter = window.innerHeight / 2;

    let closestIndex = 0;
    let minDistance = Infinity;

    itemRefs.current.forEach((ref, index) => {
      if (!ref) return;

      const rect = ref.getBoundingClientRect();
      const elementCenter = rect.top + rect.height / 2;
      const distance = Math.abs(elementCenter - viewportCenter);

      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    if (closestIndex !== activeProject) {
      setIsTransitioning(true);

      window.setTimeout(() => {
        setActiveProject(closestIndex);
        window.setTimeout(() => setIsTransitioning(false), 60);
      }, 200);
    }
  }, [activeProject]);

  useEffect(() => {
    const handleScroll = () => requestAnimationFrame(findMostVisibleElement);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [findMostVisibleElement]);

  // Typing header jak było
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !shouldStartTyping) {
          setShouldStartTyping(true);
        }
      },
      { threshold: 0.3, rootMargin: "-50px 0px -50px 0px" }
    );

    const node = headerRef.current;
    if (node) observer.observe(node);

    return () => {
      if (node) observer.unobserve(node);
    };
  }, [shouldStartTyping]);

  // NOWE: video only for active, reszta reset do cover
  useEffect(() => {
    if (prefersReducedMotion) return;

    videoRefs.current.forEach((v, idx) => {
      if (!v) return;

      if (idx === activeProject) {
        // play aktywnego
        try {
          if (v.currentTime !== 0) v.currentTime = 0;
          v.play().catch(() => {});
        } catch {}
      } else {
        // zatrzymaj i zresetuj nieaktywnych
        try {
          v.pause();
          v.currentTime = 0;
        } catch {}
      }
    });
  }, [activeProject, prefersReducedMotion]);

  const currentProject = projects[activeProject];

  return (
    <section
      className={`section section-pad-30-90 ${className}`.trim()}
      aria-label={tProjects("ariaLabel")}
    >
      <div className="page-shell">
        {/* Header */}
        <div ref={headerRef} className={styles.header}>
          <h3 ref={headerRevealRef} className={styles.headerTitle}>
            {shouldStartTyping ? (
              <TypeAnimation
                sequence={[tProjects("headerTyping")]}
                wrapper="span"
                speed={50}
                repeat={0}
                cursor={false}
              />
            ) : (
              <span style={{ opacity: 0 }}>{tProjects("headerTyping")}</span>
            )}
          </h3>
        </div>

        {/* Layout */}
        <div ref={layoutRevealRef} className={styles.layout}>
          {/* LEFT (sticky) — desktop only */}
          <aside className={styles.aside} aria-hidden="true">
            <div className={styles.sticky}>
              <div
                className={`${styles.fade} ${
                  isTransitioning ? "opacity-0" : "opacity-100"
                }`}
              >
                {currentProject?.link ? (
                  <Link
                    href={localePath(locale, currentProject.link)}
                    className={styles.asideLink}
                  >
                    {currentProject.kicker && (
                      <p className={styles.kicker}>{currentProject.kicker}</p>
                    )}
                    <h3 className={styles.title}>{currentProject.title}</h3>
                    <p className={styles.desc}>{currentProject.desc}</p>
                  </Link>
                ) : (
                  <>
                    {currentProject?.kicker && (
                      <p className={styles.kicker}>{currentProject.kicker}</p>
                    )}
                    <h3 className={styles.title}>{currentProject?.title}</h3>
                    <p className={styles.desc}>{currentProject?.desc}</p>
                  </>
                )}
              </div>
            </div>
          </aside>

          {/* RIGHT (media list) — mobile i desktop */}
          <div className={styles.mediaCol}>
            <div className={styles.mediaList}>
              {projects.map((project, index) => {
                const isActive = index === activeProject;
                // Video odsłaniamy nad coverem tylko gdy aktywne i ma gotową klatkę.
                const showVideo =
                  !prefersReducedMotion &&
                  isActive &&
                  readyVideos.has(index);

                const MediaInner = (
                  <>
                    {/* COVER — zawsze pod spodem, nigdy nie chowany (żeby nie było białej luki) */}
                    {project.coverSrc ? (
                      <Image
                        src={project.coverSrc}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        className={`${styles.img} ${styles.coverLayer} opacity-100`}
                        draggable={false}
                      />
                    ) : null}

                    {/* VIDEO tylko jeśli jest — pokazuj tylko aktywny */}
                    {!prefersReducedMotion && project.videoSrc ? (
                      <video
                        ref={(el) => {
                          videoRefs.current[index] = el;
                        }}
                        className={`${styles.video} ${styles.videoLayer} ${
                          showVideo ? "opacity-100" : "opacity-0"
                        }`}
                        muted
                        playsInline
                        loop
                        preload={index === 0 ? "auto" : "metadata"}
                        poster={project.coverSrc}
                        onLoadedData={() => markVideoReady(index)}
                        onPlaying={() => markVideoReady(index)}
                        disablePictureInPicture
                        controlsList="nodownload nofullscreen noremoteplayback"
                        style={{ pointerEvents: "none" }}
                      >
                        <source
                          src={project.videoSrc}
                          type={getVideoMime(project.videoSrc)}
                        />
                        {tWorks("videoFallback")}
                      </video>
                    ) : null}
                  </>
                );

                return (
                  <section
                    key={project.id}
                    ref={(el) => {
                      itemRefs.current[index] = el;
                    }}
                    className={styles.mediaItem}
                  >
                    {project.link ? (
                      <Link
                        href={localePath(locale, project.link)}
                        className={styles.mediaLink}
                      >
                        {MediaInner}
                      </Link>
                    ) : (
                      MediaInner
                    )}
                  </section>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <AnimatedButton
            href={localePath(locale, "/works")}
            ariaLabel={tProjects("showMore")}
            variant="cookieAccept"
            className="w-[125px] h-[53px] px-0"
          >
            {tProjects("showMore")}
          </AnimatedButton>
        </div>
      </div>
    </section>
  );
}
