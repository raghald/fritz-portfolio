"use client";

import React from "react";
import CaseStudyRenderer from "@/components/CaseStudy/CaseStudyRenderer";
import type { WorkItem } from "@/data/worksData";

const PHARMOVIT_ID: WorkItem["id"] = "pharmovit-store";

export default function PharmovitContent() {
  return (
    <CaseStudyRenderer
      workId={PHARMOVIT_ID}
      i18nKey="Works.pharmovit"
      sections={[
        {
          type: "challenge",
          imageSrc: "/images/Case_Studies/Pharmovit/Pharmovit_Desktop_3.webp",
        },
        {
          type: "goalGrid",
          images: {
            leftTop: {
              src: "/images/Case_Studies/Pharmovit/Pharmovit_Desktop_2.webp",
              alt: "Pharmovit – goal visual 1",
            },
            leftBottom: {
              src: "/images/Case_Studies/Pharmovit/Pharmovit_Desktop_4.webp",
              alt: "Pharmovit – goal visual 2",
            },
            right: {
              src: "/images/Case_Studies/Pharmovit/Pharmovit_Desktop_1.webp",
              alt: "Pharmovit – goal visual 3",
            },
          },
        },
        { type: "range" },
        {
          type: "halfImageLeft",
          imageSrc:
            "/images/Case_Studies/Pharmovit/Pharmovit_Mobile_All.webp",
          alt: "Talent Days – mobile overview",
          shadow: true,
        },
        { type: "result" },
        { type: "contact" },
        { type: "more", workIds: ["pasibus-job-board", "talentdays-blog"] },
      ]}
    />
  );
}
