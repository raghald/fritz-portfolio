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
          imageAlt:
            "Pasibus burger chain job board — initial low-fidelity layout concept on desktop",
        },
        {
          type: "goalGrid",
          images: {
            leftTop: {
              src: "/images/Case_Studies/Pasibus/Pasibus_Desktop_1.webp",
              alt: "Pasibus burger chain job board — landing hero with employer branding on desktop",
            },
            leftBottom: {
              src: "/images/Case_Studies/Pasibus/Pasibus_Desktop_2.webp",
              alt: "Pasibus burger chain job board — job listings and offer cards on desktop",
            },
            right: {
              src: "/images/Case_Studies/Pasibus/Pasibus_Desktop_5.webp",
              alt: "Pasibus burger chain job board — application flow detail on desktop",
            },
          },
        },
        { type: "range" },
        {
          type: "halfImageLeft",
          imageSrc:
            "/images/Case_Studies/Pasibus/Pasibus_Desktop_3.webp",
          alt: "Pasibus burger chain job board — alternate desktop layout view",
          shadow: true,
        },
        { type: "result" },
        { type: "contact" },
        { type: "more", workIds: ["pharmovit-store", "talentdays-blog"] },
      ]}
    />
  );
}
