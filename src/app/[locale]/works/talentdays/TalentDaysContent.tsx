"use client";

import React from "react";
import CaseStudyRenderer from "@/components/CaseStudy/CaseStudyRenderer";
import type { WorkItem } from "@/data/worksData";

const TALENT_ID: WorkItem["id"] = "talentdays-blog";

export default function TalentDaysContent() {
  return (
    <CaseStudyRenderer
      workId={TALENT_ID}
      i18nKey="Works.talentdays"
      sections={[
        {
          type: "challenge",
          imageSrc:
            "/images/Case_Studies/Talent_Days/Talent_Days_Desktop_5.webp",
          imageAlt:
            "Talent Days student career blog — original article layout audited before the redesign, on desktop",
        },
        {
          type: "goalGrid",
          images: {
            leftTop: {
              src: "/images/Case_Studies/Talent_Days/Talent_Days_Desktop_4.webp",
              alt: "Talent Days student career blog — article listing layout on desktop",
            },
            leftBottom: {
              src: "/images/Case_Studies/Talent_Days/Talent_Days_Desktop_3.webp",
              alt: "Talent Days student career blog — featured posts section on desktop",
            },
            right: {
              src: "/images/Case_Studies/Talent_Days/Talent_Days_Desktop_8.webp",
              alt: "Talent Days student career blog — single article reading view on desktop",
            },
          },
        },
        { type: "range" },
        {
          type: "halfImageLeft",
          imageSrc:
            "/images/Case_Studies/Talent_Days/Talent_Days_Mobile_All.webp",
          alt: "Talent Days student career blog — responsive mobile design across multiple screens",
          shadow: true,
        },
        { type: "result" },
        { type: "contact" },
        { type: "more", workIds: ["pasibus-job-board", "pharmovit-store"] },
      ]}
    />
  );
}
