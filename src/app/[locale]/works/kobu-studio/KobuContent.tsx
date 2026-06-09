"use client";

import React from "react";
import CaseStudyRenderer from "@/components/CaseStudy/CaseStudyRenderer";
import type { WorkItem } from "@/data/worksData";

const KOBU_ID: WorkItem["id"] = "kobu-studio";

export default function KobuStudioContent() {
  return (
    <CaseStudyRenderer
      workId={KOBU_ID}
      i18nKey="Works.KobuStudio"
      sections={[
        {
          type: "challenge",
          imageSrc: "/images/Case_Studies/Kobu/Kobu_Desktop_1.webp",
          imageAlt:
            "Kobu Studio architectural office website — initial design exploration shown on desktop",
        },
        {
          type: "goalGrid",
          images: {
            leftTop: {
              src: "/images/Case_Studies/Kobu/Kobu_Desktop_2.webp",
              alt: "Kobu Studio architectural office website — portfolio gallery on desktop",
            },
            leftBottom: {
              src: "/images/Case_Studies/Kobu/Kobu_Desktop_4.webp",
              alt: "Kobu Studio architectural office website — project detail view on desktop",
            },
            right: {
              src: "/images/Case_Studies/Kobu/Kobu_Desktop_3.webp",
              alt: "Kobu Studio architectural office website — studio philosophy section on desktop",
            },
          },
        },
        { type: "range" },
        {
          type: "halfImageLeft",
          imageSrc: "/images/Case_Studies/Kobu/Kobu_Mobile_All.webp",
          alt: "Kobu Studio architectural office website — responsive mobile design across multiple screens",
          shadow: true,
        },
        { type: "result" },
        { type: "contact" },
        { type: "more", workIds: ["pasibus-job-board", "talentdays-blog"] },
      ]}
    />
  );
}
