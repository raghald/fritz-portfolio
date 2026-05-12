"use client";

import React from "react";
import CaseStudyRenderer from "@/components/CaseStudy/CaseStudyRenderer";
import type { WorkItem } from "@/data/worksData";

const PASIBUS_ID: WorkItem["id"] = "pasibus-job-board";

export default function PasibusContent() {
  return (
    <CaseStudyRenderer
      workId={PASIBUS_ID}
      i18nKey="Works.pasibus"
      sections={[
        {
          type: "challenge",
          imageSrc: "/images/Case_Studies/Pasibus/Pasibus_Desktop_4.webp",
        },
        {
          type: "goalGrid",
          images: {
            leftTop: {
              src: "/images/Case_Studies/Pasibus/Pasibus_Desktop_1.webp",
              alt: "Pasibus – goal visual 1",
            },
            leftBottom: {
              src: "/images/Case_Studies/Pasibus/Pasibus_Desktop_2.webp",
              alt: "Pasibus – goal visual 2",
            },
            right: {
              src: "/images/Case_Studies/Pasibus/Pasibus_Desktop_5.webp",
              alt: "Pasibus – goal visual 3",
            },
          },
        },
        { type: "range" },
        {
          type: "halfImageLeft",
          imageSrc:
            "/images/Case_Studies/Pasibus/Pasibus_Desktop_3.webp",
          alt: "Pasibus – mobile overview",
          shadow: true,
        },
        { type: "result" },
        { type: "contact" },
        { type: "more", workIds: ["pharmovit-store", "talentdays-blog"] },
      ]}
    />
  );
}
