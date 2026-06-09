"use client";

import React from "react";
import CaseStudyRenderer from "@/components/CaseStudy/CaseStudyRenderer";
import type { WorkItem } from "@/data/worksData";

const ABSOLVENT_ID: WorkItem["id"] = "absolvent-agency";

export default function AbsolventContent() {
  return (
    <CaseStudyRenderer
      workId={ABSOLVENT_ID}
      i18nKey="Works.absolvent"
      sections={[
        {
          type: "challenge",
          imageSrc:
            "/images/Case_Studies/Absolvent/Absolvetn_Desktop_1.webp",
          imageAlt:
            "Absolvent Consulting website — original design audited before the redesign, shown on desktop",
        },
        {
          type: "goalGrid",
          images: {
            leftTop: {
              src: "/images/Case_Studies/Absolvent/Absolvetn_Desktop_2.webp",
              alt: "Absolvent Consulting employer branding agency website — homepage hero section on desktop",
            },
            leftBottom: {
              src: "/images/Case_Studies/Absolvent/Absolvetn_Desktop_7.webp",
              alt: "Absolvent Consulting employer branding agency website — services overview on desktop",
            },
            right: {
              src: "/images/Case_Studies/Absolvent/Absolvetn_Desktop_8.webp",
              alt: "Absolvent Consulting employer branding agency website — case studies layout on desktop",
            },
          },
        },
        { type: "range" },
        {
          type: "halfImageLeft",
          imageSrc:
            "/images/Case_Studies/Absolvent/Absolvetn_Mobile_All.webp",
          alt: "Absolvent Consulting employer branding agency website — responsive mobile design across multiple screens",
          shadow: true,
        },
        { type: "result" },
        { type: "contact" },
        { type: "more", workIds: ["pasibus-job-board", "talentdays-blog"] },
      ]}
    />
  );
}
