"use client";

import React from "react";
import { useTranslations } from "@/lib/useTranslations";

import styles from "./IntroSection.module.css";

const IntroWorks: React.FC = () => {
  const t = useTranslations("worksIntro");

  return (
    <section
      className={`${styles.section} page-shell`}
      aria-label={t("ariaLabel")}
    >
      {/* MOBILE & TABLET */}
      <div className={styles.containerMobile}>
        {/* Widoczny H1 (hybrydowy): widoczny tekst + sr-only suffix ze słowami kluczowymi SEO. */}
        <h1 className={styles.title}>
          {t("title")}
          <span className="sr-only"> {t("srHeadingSuffix")}</span>
        </h1>

        <p className={styles.subtitle}>{t("subtitle")}</p>

        <div className={`${styles.divider} ${styles.dividerMobile}`} />

        <div className={styles.space} />
      </div>

      {/* DESKTOP */}
      <div className={styles.containerDesktop}>
        <div className={styles.max}>
          {/* Widoczny H1 (hybrydowy): widoczny tekst + sr-only suffix ze słowami kluczowymi SEO. */}
        <h1 className={styles.title}>
          {t("title")}
          <span className="sr-only"> {t("srHeadingSuffix")}</span>
        </h1>

          <p className={`${styles.subtitle} max-w-[720px]`}>
            {t("subtitle")}
          </p>

          <div className={`${styles.divider} ${styles.dividerDesktop}`} />

          <div className={styles.space} />
        </div>
      </div>
    </section>
  );
};

export default IntroWorks;
