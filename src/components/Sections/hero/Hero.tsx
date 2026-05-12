"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import { useTranslations } from "@/lib/useTranslations";
import AnimatedButton from "../../AnimatedButton";
import { useContactPopup } from "@/hooks/ContactPopupContext";
import HeroMedia, { type HeroMediaItem } from "./HeroMedia";
import AnimatedTitle from "@/components/Sections/hero/AnimatedTitle";
import { intro, ms, resolveHeroTimeline } from "@/lib/introTimings";

import styles from "./Hero.module.css";

type HeroProps = {
  rightOrnaments?: React.ReactNode;
};

type TagId = "web" | "ui" | "ux" | "brand" | "motion";

type Tag = {
  id: TagId;
  label: string;
};

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

const DEFAULT_TAG_ORDER: TagId[] = ["ui", "web", "ux", "brand", "motion"];
const ALL_TAG_IDS: TagId[] = ["web", "ui", "ux", "brand", "motion"];

export default function Hero({ rightOrnaments }: HeroProps) {
  const { openPopup } = useContactPopup();
  const t = useTranslations("hero");
  const locale = useLocale() as "en" | "pl";
  const isPl = locale === "pl";

  const seoH1 = isPl
    ? "Projektuję rozwiązania w oparciu o dobre standardy UI/UX i przyjazne dla SEO"
    : "I design solutions built on strong UI/UX standards and SEO-friendly practices";

  const heroAltBase = isPl
    ? "Fryderyk Głowacki (Fritz) — grafik, Web / UI/UX / branding / motion"
    : "Fryderyk Głowacki (Fritz) — Web / UI/UX / brand / motion designer";

  const heroMedia = useMemo<HeroMediaItem[]>(
    () => [
      {
        type: "image",
        src: "/images/Hero/48C7C530-329B-4F4E-B84A-D53ED3B58B25.webp",
        alt: `${heroAltBase} — portrait 1`,
        durationMs: 900,
      },
      {
        type: "image",
        src: "/images/Hero/9603.webp",
        alt: `${heroAltBase} — portrait 2`,
        durationMs: 900,
      },
      {
        type: "image",
        src: "/images/Hero/6672.webp",
        alt: `${heroAltBase} — portrait 3`,
        durationMs: 900,
      },
    ],
    [heroAltBase]
  );

  const titleText = t("titleWord");
  const sideCopyLine1 = t("sideCopyLine1");
  const sideCopyLine2 = t("sideCopyLine2");

  const tagsDict = useMemo(
    () =>
      ({
        web: t("tags.web"),
        ui: t("tags.ui"),
        ux: t("tags.ux"),
        brand: t("tags.brand"),
        motion: t("tags.motion"),
      } satisfies Record<TagId, string>),
    [t]
  );

  const tagOrder = useMemo<TagId[]>(() => {
    const raw = t("tagOrder");

    try {
      const parsed = JSON.parse(raw);

      if (Array.isArray(parsed)) {
        const allowed = new Set<TagId>(ALL_TAG_IDS);

        const cleaned = parsed.filter(
          (x): x is TagId =>
            typeof x === "string" && allowed.has(x as TagId)
        );

        if (cleaned.length) return cleaned;
      }
    } catch {
      // ignore
    }

    return DEFAULT_TAG_ORDER;
  }, [t]);

  const orderedTags = useMemo<Tag[]>(() => {
    const map = new Map<TagId, Tag>(
      ALL_TAG_IDS.map((id) => [id, { id, label: tagsDict[id] }])
    );

    const resolved = tagOrder
      .map((id) => map.get(id))
      .filter(Boolean) as Tag[];

    return resolved.length
      ? resolved
      : DEFAULT_TAG_ORDER.map((id) => map.get(id)!).filter(Boolean);
  }, [tagOrder, tagsDict]);

  const timeline = useMemo(
    () =>
      resolveHeroTimeline({
        titleText,
        tagCount: orderedTags.length,
        timings: intro,
      }),
    [titleText, orderedTags.length]
  );

  const softFromLeft = { opacity: 0, x: -10, y: 0, scale: 0.99 };
  const softFromRight = { opacity: 0, x: 10, y: 0, scale: 0.99 };
  const softFromBottom = { opacity: 0, y: 10, scale: 0.99 };
  const softTo = { opacity: 1, x: 0, y: 0, scale: 1 };

  return (
    <section
      data-hero
      role="banner"
      aria-label={t("ariaLabel")}
      className={styles.section}
    >
      <h1 className="sr-only">{seoH1}</h1>

      <div className={styles.shell}>
        <motion.div
          className={styles.sideCopy}
          initial={softFromLeft}
          animate={softTo}
          transition={{
            delay: ms(timeline.sideCopy.startMs),
            duration: ms(timeline.sideCopy.enterMs),
            ease: EASE_OUT,
          }}
          style={{ willChange: "transform, opacity", transform: "translateZ(0)" }}
        >
          {sideCopyLine1}
          <br />
          {sideCopyLine2}
        </motion.div>

        <motion.div
          className={styles.ornaments}
          initial={softFromRight}
          animate={softTo}
          transition={{
            delay: ms(timeline.ornaments.startMs),
            duration: ms(timeline.ornaments.enterMs),
            ease: EASE_OUT,
          }}
          style={{ willChange: "transform, opacity", transform: "translateZ(0)" }}
        >
          {rightOrnaments}
        </motion.div>

        <div className={styles.center}>
          <div className={styles.photoWrap}>
            <HeroMedia
              items={heroMedia}
              defaultDurationMs={2600}
              className="w-full h-full"
            />
          </div>

          <div className={styles.stack}>
            <div className={styles.titleBlock}>
              <AnimatedTitle
                text={titleText}
                timings={intro}
                className={styles.title}
                ariaLevel={2}
              />

              <motion.div
                className={styles.tags}
                initial="hidden"
                animate="show"
                variants={{
                  hidden: {},
                  show: {
                    transition: {
                      delay: ms(timeline.tags.startMs),
                      staggerChildren: ms(timeline.tags.staggerMs),
                    },
                  },
                }}
              >
                {orderedTags.map((tag) => (
                  <motion.span
                    key={tag.id}
                    variants={{
                      hidden: { opacity: 0, y: 8, scale: 0.99 },
                      show: {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        transition: {
                          duration: ms(timeline.tags.enterMs),
                          ease: EASE_OUT,
                        },
                      },
                    }}
                    style={{
                      display: "inline-block",
                      willChange: "transform, opacity",
                      transform: "translateZ(0)",
                    }}
                  >
                    {tag.label}
                  </motion.span>
                ))}
              </motion.div>
            </div>

            <motion.div
              className={styles.cta}
              initial={softFromBottom}
              animate={softTo}
              transition={{
                delay: ms(timeline.cta.startMs),
                duration: ms(timeline.cta.enterMs),
                ease: EASE_OUT,
              }}
              style={{
                willChange: "transform, opacity",
                transform: "translateZ(0)",
              }}
            >
              <AnimatedButton
                onClick={openPopup}
                ariaLabel={t("btnSecondaryAria")}
                variant="white"
                className="sm:w-full lg:w-auto"
              >
                {t("btnSecondary")}
              </AnimatedButton>

              <AnimatedButton
                href={`/${locale}/works`}
                ariaLabel={t("btnPrimaryAria")}
                variant="outline"
                className="sm:w-full lg:w-auto"
              >
                {t("btnPrimary")}
              </AnimatedButton>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
