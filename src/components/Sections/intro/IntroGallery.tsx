"use client";

import React from "react";
import { useTranslations } from "@/lib/useTranslations";

import styles from "./IntroSection.module.css";

const IntroGallery: React.FC = () => {
  const t = useTranslations("gallery.intro");

  return (
    <section
      className={`${styles.section} page-shell pb-[60px] lg:pb-[100px]`}
      aria-label={t("aria")}
    >
      <div className={styles.galleryWrap}>
        {/* Widoczny H1 (hybrydowy): widoczny tekst + sr-only suffix ze słowami kluczowymi SEO. */}
        <h1 className={`${styles.title} ${styles.alignRight} w-full`}>
          {t("title")}
          <span className="sr-only"> {t("srHeadingSuffix")}</span>
        </h1>
        <p className={`${styles.subtitle} ${styles.alignRight} w-full`}>
          {t("description")}
        </p>
      </div>
    </section>
  );
};

export default IntroGallery;
