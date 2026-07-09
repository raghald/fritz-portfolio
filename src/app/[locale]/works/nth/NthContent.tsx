"use client";

import React from "react";
import CaseStudyRenderer from "@/components/CaseStudy/CaseStudyRenderer";
import type { WorkItem } from "@/data/worksData";

const NTH_ID: WorkItem["id"] = "nth-consulting-group";

export default function NthConsultingContent() {
  return (
    <CaseStudyRenderer
      workId={NTH_ID}
      i18nKey="Works.NthConsulting"
      sections={[
        {
          type: "challenge",
          imageSrc: "/images/Case_Studies/Nth/Nth_Desktop_1.webp",
          imageAlt:
            "Nth Consulting Group corporate website — homepage hero shown on desktop",
        },
        {
          type: "goalGrid",
          images: {
            leftTop: {
              src: "/images/Case_Studies/Nth/Nth_Desktop_2.webp",
              alt: "Nth Consulting Group website — services overview on desktop",
            },
            leftBottom: {
              src: "/images/Case_Studies/Nth/Nth_Desktop_4.webp",
              alt: "Nth Consulting Group website — flagship projects section on desktop",
            },
            right: {
              src: "/images/Case_Studies/Nth/Nth_Desktop_3.webp",
              alt: "Nth Consulting Group website — leadership and about section on desktop",
            },
          },
        },
        { type: "range" },
        {
          type: "halfImageLeft",
          imageSrc: "/images/Case_Studies/Nth/Nth_Mobile_All.webp",
          alt: "Nth Consulting Group corporate website — responsive mobile design across multiple screens",
          shadow: true,
        },
        { type: "result" },
        { type: "contact" },
        { type: "more", workIds: ["kobu-studio", "absolvent-agency"] },
      ]}
    />
  );
}
