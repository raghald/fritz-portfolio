"use client";

import React from "react";
import CaseStudyRenderer from "@/components/CaseStudy/CaseStudyRenderer";
import type { WorkItem } from "@/data/worksData";

const TUTLO_ID: WorkItem["id"] = "tutlo-recommendation";

export default function TutloContent() {
  return (
    <CaseStudyRenderer
      workId={TUTLO_ID}
      i18nKey="Works.tutlo"
      sections={[
        {
          type: "challenge",
          imageSrc: "/images/Case_Studies/Tutlo_Reco/Tutlo_Reco_Desktop_1.webp",
        },
        {
          type: "goalGrid",
          images: {
            leftTop: {
              src: "/images/Case_Studies/Tutlo_Reco/Tutlo_Reco_Desktop_3.webp",
              alt: "Tutlo – goal visual 1",
            },
            leftBottom: {
              src: "/images/Case_Studies/Tutlo_Reco/Tutlo_Reco_Desktop_2.webp",
              alt: "Tutlo – goal visual 2",
            },
            right: {
              src: "/images/Case_Studies/Tutlo_Reco/Tutlo_Reco_Desktop_4.webp",
              alt: "Tutlo – goal visual 3",
            },
          },
        },
        { type: "range" },
                {
          type: "halfImageLeft",
          imageSrc:
            "/images/Case_Studies/Tutlo_Reco/Tutlo_Reco_Mobile_All.webp",
          alt: "Tutlo – mobile overview",
          shadow: true,
        },
        { type: "result" },
        { type: "contact" },
        { type: "more", workIds: ["pharmovit-store", "pasibus-job-board"] },
      ]}
    />
  );
}
