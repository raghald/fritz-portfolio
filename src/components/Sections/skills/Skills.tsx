"use client";

import React from "react";
import { useTranslations } from "@/lib/useTranslations";
import { useScrollReveal } from "@/hooks/useScrollReveal";

import styles from "./Skills.module.css";

type SkillItem = {
  id: string;
};

function SkillCard({ skill, index }: { skill: SkillItem; index: number }) {
  const t = useTranslations("about.skills");
  const ref = useScrollReveal<HTMLDivElement>({
    start: `top ${90 - index * 4}%`,
    end: `top ${80 - index * 4}%`,
  });
  return (
    <div ref={ref} className={styles.card}>
      <h3 className={styles.cardTitle}>{t(`items.${skill.id}.title`)}</h3>
      <p className={styles.cardDesc}>{t(`items.${skill.id}.description`)}</p>
    </div>
  );
}

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

  const headingRef = useScrollReveal<HTMLHeadingElement>({
    start: "top 90%",
    end: "top 60%",
  });

  return (
    <section
      className={`${styles.section} page-shell`}
      role="region"
      aria-label={t("sectionAria")}
    >
      <div className="w-full">
        <h2 ref={headingRef} className={styles.heading}>{t("heading")}</h2>

        <div className={styles.gridWrap}>
          <div className={styles.grid}>
            {skillItems.map((skill, idx) => (
              <SkillCard key={skill.id} skill={skill} index={idx} />
            ))}
          </div>
        </div>

        <div className={styles.divider} />
      </div>
    </section>
  );
};

export default Skills;
