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
        },
        {
          type: "goalGrid",
          images: {
            leftTop: {
              src: "/images/Case_Studies/Talent_Days/Talent_Days_Desktop_4.webp",
              alt: "Talent Days – goal visual 1",
            },
            leftBottom: {
              src: "/images/Case_Studies/Talent_Days/Talent_Days_Desktop_3.webp",
              alt: "Talent Days – goal visual 2",
            },
            right: {
              src: "/images/Case_Studies/Talent_Days/Talent_Days_Desktop_8.webp",
              alt: "Talent Days – goal visual 3",
            },
          },
        },
        { type: "range" },
        {
          type: "halfImageLeft",
          imageSrc:
            "/images/Case_Studies/Talent_Days/Talent_Days_Mobile_All.webp",
          alt: "Talent Days – mobile overview",
          shadow: true,
        },
        { type: "result" },
        { type: "contact" },
        { type: "more", workIds: ["pasibus-job-board", "pharmovit-store"] },
      ]}
    />
  );
}
