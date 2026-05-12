"use client";

import React from "react";
import { useTranslations } from "@/lib/useTranslations";

import styles from "./Skills.module.css";

type SkillItem = {
  id: string;
};

const Skills: React.FC = () => {
  const t = useTranslations("about.skills");

  const skillItems: SkillItem[] = [
    { id: "figma" },
    { id: "creativeThinking" },
    { id: "adobePsAi" },
    { id: "htmlCssJs" },
    { id: "aiTools" },
    { id: "afterEffects" },
    { id: "communicationTeamwork" },
    { id: "framer" },
  ];

  return (
    <section
      className={`${styles.section} page-shell`}
      role="region"
      aria-label={t("sectionAria")}
    >
      <div className="w-full">
        <h2 className={styles.heading}>{t("heading")}</h2>

        <div className={styles.gridWrap}>
          <div className={styles.grid}>
            {skillItems.map((skill) => {
              const title = t(`items.${skill.id}.title`);
              const description = t(`items.${skill.id}.description`);

              return (
                <div key={skill.id} className={styles.card}>
                  <h3 className={styles.cardTitle}>{title}</h3>
                  <p className={styles.cardDesc}>{description}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.divider} />
      </div>
    </section>
  );
};

export default Skills;
