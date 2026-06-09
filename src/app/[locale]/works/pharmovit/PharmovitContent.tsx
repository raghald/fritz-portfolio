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
          imageAlt:
            "Pharmovit supplement e-commerce store — original product page audited before redesign, on desktop",
        },
        {
          type: "goalGrid",
          images: {
            leftTop: {
              src: "/images/Case_Studies/Pharmovit/Pharmovit_Desktop_2.webp",
              alt: "Pharmovit supplement e-commerce store — product category page on desktop",
            },
            leftBottom: {
              src: "/images/Case_Studies/Pharmovit/Pharmovit_Desktop_4.webp",
              alt: "Pharmovit supplement e-commerce store — product detail page on desktop",
            },
            right: {
              src: "/images/Case_Studies/Pharmovit/Pharmovit_Desktop_1.webp",
              alt: "Pharmovit supplement e-commerce store — homepage hero section on desktop",
            },
          },
        },
        { type: "range" },
        {
          type: "halfImageLeft",
          imageSrc:
            "/images/Case_Studies/Pharmovit/Pharmovit_Mobile_All.webp",
          alt: "Pharmovit supplement e-commerce store — responsive mobile design across multiple screens",
          shadow: true,
        },
        { type: "result" },
        { type: "contact" },
        { type: "more", workIds: ["pasibus-job-board", "talentdays-blog"] },
      ]}
    />
  );
}
