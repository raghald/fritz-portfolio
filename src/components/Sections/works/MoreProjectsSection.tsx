"use client";

import React from "react";
import { useTranslations } from "@/lib/useTranslations";

import { WORKS, type WorkItem } from "@/data/worksData";
import WorkThumbnail from "@/components/Sections/works/WorkThumbnail";

type MoreSectionsProps = {
  /** Lista ID projektów z WORKS do wyświetlenia (zwykle 2 sztuki). */
  workIds?: WorkItem["id"][];
};

const DEFAULT_WORK_IDS: WorkItem["id"][] = [
  "pasibus-job-board",
  "pharmovit-store",
];

const MoreSections: React.FC<MoreSectionsProps> = ({ workIds }) => {
  const t = useTranslations("Works");

  const idsToUse = workIds && workIds.length > 0 ? workIds : DEFAULT_WORK_IDS;

  const worksToRender: WorkItem[] = idsToUse
    .map((id) => WORKS.find((w) => w.id === id))
    .filter((w): w is WorkItem => Boolean(w));

  if (worksToRender.length === 0) return null;

  return (
    <section
      className="w-full bg-white"
      aria-labelledby="more-sections-heading"
    >
      {/* 🔥 MAX WIDTH + WYŚRODKOWANA SEKCJA */}
      <div className="max-w-[1920px] mx-auto">
        {/* Padding zgodny z systemem */}
        <div className="px-8 md:px-8 lg:px-[52px]">
          {/* 🔥 Wewnętrzny kontener wyśrodkowany na wszystkich breakpointach */}
          <div className="w-full md:w-[770px] lg:w-[1108px] mx-auto">
            {/* Nagłówek */}
            <h2
              id="more-sections-heading"
              className="text-black font-semibold text-[30px] sm:text-[44px] lg:text-[52px] leading-[100%] text-left"
            >
              {t("moreSections.heading")}
            </h2>

            <div className="h-[32px]" />

            {/* Layout 2 kolumny (tablet/desktop), 1 kolumna mobile */}
            <div className="flex flex-col md:flex-row gap-7">
              {worksToRender.map((work) => (
                <div key={work.id} className="flex-1">
                  <WorkThumbnail work={work} mode="column" />
                </div>
              ))}
            </div>

            {/* Spacing pod sekcją */}
            <div className="h-[72px] md:h-[32px] lg:h-[100px]" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MoreSections;
