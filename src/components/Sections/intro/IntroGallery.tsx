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
        {/* Wizualny nagłówek — semantyczne H1 jest w app/[locale]/gallery/page.tsx (server, sr-only). */}
        <p className={`${styles.title} ${styles.alignRight} w-full`}>{t("title")}</p>
        <p className={`${styles.subtitle} ${styles.alignRight} w-full`}>
          {t("description")}
        </p>
      </div>
    </section>
  );
};

export default IntroGallery;
