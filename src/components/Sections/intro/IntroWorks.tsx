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
        <h1 className={styles.title}>{t("title")}</h1>

        <p className={styles.subtitle}>{t("subtitle")}</p>

        <div className={`${styles.divider} ${styles.dividerMobile}`} />

        <div className={styles.space} />
      </div>

      {/* DESKTOP */}
      <div className={styles.containerDesktop}>
        <div className={styles.max}>
          <h1 className={styles.title}>{t("title")}</h1>

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
