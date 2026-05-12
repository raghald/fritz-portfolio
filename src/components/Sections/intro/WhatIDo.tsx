"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "@/lib/useTranslations";

import styles from "./WhatIDo.module.css";

type ServiceCard = {
  id: string;
  iconSrc: string;
};

const WhatIDo: React.FC = () => {
  const t = useTranslations("about.whatIDo");

  const services: ServiceCard[] = [
    { id: "researchDiscovery", iconSrc: "/images/loupe.svg" },
    { id: "wireframingUx", iconSrc: "/images/flags.svg" },
    { id: "uiDesignPrototyping", iconSrc: "/images/pencil.svg" },
    { id: "testingIteration", iconSrc: "/images/emojis.svg" },
  ];

  return (
    <section
      className={`${styles.section} page-shell`}
      role="region"
      aria-label={t("sectionAria")}
    >
      <h2 className={styles.heading}>{t("heading")}</h2>

      <div className={styles.layout}>
        <p className={styles.lead}>{t("lead")}</p>

        <div className={styles.grid}>
          {services.map((service) => {
            const title = t(`items.${service.id}.title`);
            const description = t(`items.${service.id}.description`);

            return (
              <div key={service.id} className={styles.card}>
                <div className={styles.icon}>
                  <Image
                    src={service.iconSrc}
                    alt={title}
                    width={40}
                    height={40}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className={styles.text}>
                  <h3 className={styles.cardTitle}>{title}</h3>
                  <p className={styles.cardDesc}>{description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhatIDo;
