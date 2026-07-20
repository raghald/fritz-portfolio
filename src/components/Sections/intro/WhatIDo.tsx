"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "@/lib/useTranslations";
import { useScrollReveal } from "@/hooks/useScrollReveal";

import styles from "./WhatIDo.module.css";

type ServiceCard = {
  id: string;
  iconSrc: string;
};

function ServiceCardReveal({
  service,
  index,
}: {
  service: ServiceCard;
  index: number;
}) {
  const t = useTranslations("about.whatIDo");
  const ref = useScrollReveal<HTMLDivElement>({
    start: `top ${90 - index * 7}%`,
    end: `top ${75 - index * 7}%`,
  });
  const title = t(`items.${service.id}.title`);
  const description = t(`items.${service.id}.description`);

  return (
    <div ref={ref} className={styles.card}>
      <div className={styles.icon}>
        {/* Ikona dekoracyjna — znaczenie niesie sąsiedni <h3>{title}. Pusty alt,
            żeby czytnik nie odczytywał tytułu dwukrotnie. */}
        <Image
          src={service.iconSrc}
          alt=""
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
}

const WhatIDo: React.FC = () => {
  const t = useTranslations("about.whatIDo");

  const services: ServiceCard[] = [
    { id: "researchDiscovery", iconSrc: "/images/loupe.svg" },
    { id: "wireframingUx", iconSrc: "/images/flags.svg" },
    { id: "uiDesignPrototyping", iconSrc: "/images/pencil.svg" },
    { id: "testingIteration", iconSrc: "/images/emojis.svg" },
  ];

  const headingRef = useScrollReveal<HTMLHeadingElement>({
    start: "top 90%",
    end: "top 60%",
  });
  const leadRef = useScrollReveal<HTMLParagraphElement>({
    start: "top 80%",
    end: "top 50%",
  });

  return (
    <section
      className={`${styles.section} page-shell`}
      aria-label={t("sectionAria")}
    >
      <h2 ref={headingRef} className={styles.heading}>{t("heading")}</h2>

      <div className={styles.layout}>
        <p ref={leadRef} className={styles.lead}>{t("lead")}</p>

        <div className={styles.grid}>
          {services.map((service, idx) => (
            <ServiceCardReveal key={service.id} service={service} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatIDo;
