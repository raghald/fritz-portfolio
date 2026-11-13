"use client";

import React from "react";
import CaseStudyRenderer from "@/components/CaseStudy/CaseStudyRenderer";
import type { WorkItem } from "@/data/worksData";
import { useTranslations } from "@/lib/useTranslations";

const STANCZYK_ID: WorkItem["id"] = "stanczyk-app";

export default function StanczykContent() {
  const t = useTranslations("Works.Stanczyk.images");

  return (
    <CaseStudyRenderer
      workId={STANCZYK_ID}
      i18nKey="Works.Stanczyk"
      sections={[
        {
          type: "challenge",
          imageSrc: "/videos/Stanczyk_Challenge.mp4",
          imageAlt: t("editor"),
        },
        {
          type: "goalGrid",
          images: {
            leftTop: {
              src: "/videos/Stanczyk_Goal_1.mp4",
              alt: t("lines"),
            },
            leftBottom: {
              src: "/videos/Stanczyk_Goal_2.mp4",
              alt: t("cubes"),
            },
            right: {
              src: "/videos/Stanczyk_Goal_3.mp4",
              alt: t("shape"),
            },
          },
        },
        { type: "range" },
        { type: "result" },
        { type: "contact" },
        { type: "more", workIds: ["kobu-studio", "nth-consulting-group"] },
      ]}
    />
  );
}
