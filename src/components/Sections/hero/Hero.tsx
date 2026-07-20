"use client";

import React, { useMemo } from "react";
import { useLocale } from "next-intl";
import { useTranslations } from "@/lib/useTranslations";
import { localePath } from "@/i18n/routing";
import AnimatedButton from "../../AnimatedButton";
import { useContactPopup } from "@/hooks/ContactPopupContext";
import HeroMedia, { type HeroMediaItem } from "./HeroMedia";
import AnimatedTitle from "@/components/Sections/hero/AnimatedTitle";
import { intro, resolveHeroTimeline } from "@/lib/introTimings";

import styles from "./Hero.module.css";

type HeroProps = {
  rightOrnaments?: React.ReactNode;
};

type TagId = "web" | "ui" | "ux" | "product" | "motion";

type Tag = {
  id: TagId;
  label: string;
};

const DEFAULT_TAG_ORDER: TagId[] = ["ui", "web", "ux", "product", "motion"];
const ALL_TAG_IDS: TagId[] = ["web", "ui", "ux", "product", "motion"];

export default function Hero({ rightOrnaments }: HeroProps) {
  const { openPopup } = useContactPopup();
  const t = useTranslations("hero");
  const locale = useLocale() as "en" | "pl";

  // H1 strony renderuje AnimatedTitle jako prawdziwy <h1> (podejście hybrydowe):
  // widoczne, animowane litery są dekoracyjne (aria-hidden), a nazwą dostępną
  // nagłówka jest bogaty w słowa kluczowe `hero.srHeading`.
  // Portrety w carouselu są dekoratywne (aria-hidden w HeroMedia), więc nie podajemy
  // alt — HeroMedia jawnie ustawia alt="" zgodnie z WCAG dla decoration.

  const heroMedia = useMemo<HeroMediaItem[]>(
    () => [
      {
        type: "image",
        src: "/images/Hero/48C7C530-329B-4F4E-B84A-D53ED3B58B25.webp",
        durationMs: 900,
      },
      {
        type: "image",
        src: "/images/Hero/9603.webp",
        durationMs: 900,
      },
      {
        type: "image",
        src: "/images/Hero/6672.webp",
        durationMs: 900,
      },
    ],
    []
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
        product: t("tags.product"),
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

  // CSS variables zasilające animacje w Hero.module.css (z timeline w ms)
  const sectionStyle: React.CSSProperties = {
    ["--side-copy-start-ms" as string]: `${timeline.sideCopy.startMs}ms`,
    ["--side-copy-enter-ms" as string]: `${timeline.sideCopy.enterMs}ms`,
    ["--ornaments-start-ms" as string]: `${timeline.ornaments.startMs}ms`,
    ["--ornaments-enter-ms" as string]: `${timeline.ornaments.enterMs}ms`,
    ["--cta-start-ms" as string]: `${timeline.cta.startMs}ms`,
    ["--cta-enter-ms" as string]: `${timeline.cta.enterMs}ms`,
  };

  const tagsStyle: React.CSSProperties = {
    ["--tag-start-ms" as string]: `${timeline.tags.startMs}ms`,
    ["--tag-stagger-ms" as string]: `${timeline.tags.staggerMs}ms`,
    ["--tag-enter-ms" as string]: `${timeline.tags.enterMs}ms`,
  };

  return (
    <section
      data-hero
      role="banner"
      aria-label={t("ariaLabel")}
      className={styles.section}
      style={sectionStyle}
    >
      <div className={styles.shell}>
        <div className={styles.sideCopy}>
          {sideCopyLine1}
          <br />
          {sideCopyLine2}
        </div>

        <div className={styles.ornaments}>{rightOrnaments}</div>

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
                srText={t("srHeading")}
              />

              <div className={styles.tags} style={tagsStyle}>
                {orderedTags.map((tag, i) => {
                  const tagStyle: React.CSSProperties = {
                    ["--idx" as string]: i,
                  };
                  return (
                    <span key={tag.id} className={styles.tag} style={tagStyle}>
                      {tag.label}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className={styles.cta}>
              <AnimatedButton
                onClick={openPopup}
                ariaLabel={t("btnSecondaryAria")}
                variant="white"
                className="sm:w-full lg:w-auto"
              >
                {t("btnSecondary")}
              </AnimatedButton>

              <AnimatedButton
                href={localePath(locale, "/works")}
                ariaLabel={t("btnPrimaryAria")}
                variant="outline"
                className="sm:w-full lg:w-auto"
              >
                {t("btnPrimary")}
              </AnimatedButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
