"use client";

import { useMemo, useState } from "react";

import { useTranslations } from "@/lib/useTranslations";
import IntroWorks from "@/components/Sections/intro/IntroWorks";

import WorkThumbnail from "@/components/Sections/works/WorkThumbnail";
import WorkFilterBar from "@/components/Sections/works/WorkFilterBar";
import RevealOnScroll from "@/components/RevealOnScroll";
import { WORKS, type WorkItem, type WorkType } from "@/data/worksData";

const SectionSpacer = () => <div className="h-[60px] lg:h-[100px]" />;

export default function WorksPageClient() {
  const t = useTranslations("Works");
  const [activeType, setActiveType] = useState<WorkType | "All">("All");

const filteredWorks = useMemo<WorkItem[]>(() => {
  if (activeType === "All") return WORKS;
  return WORKS.filter((work) => work.type.includes(activeType));
}, [activeType]);

  const nthConsulting = WORKS.find((w) => w.id === "nth-consulting-group");
  const talentDays = WORKS.find((w) => w.id === "talentdays-blog");
  const pharmovit = WORKS.find((w) => w.id === "pharmovit-store");
  const pasibus = WORKS.find((w) => w.id === "pasibus-job-board");
  const tutloRecommendation = WORKS.find((w) => w.id === "tutlo-recommendation");
  const kobuStudio = WORKS.find((w) => w.id === "kobu-studio");
  const absolventAgency = WORKS.find((w) => w.id === "absolvent-agency");

  const isAll = activeType === "All";

  return (
    <main id="main-content" tabIndex={-1} className="main-content relative z-20 bg-white max-w-[1440px] mx-auto">
        {/* H1 renderuje IntroWorks jako widoczny <h1> (hybrydowy). */}

        <IntroWorks />

        <RevealOnScroll start="top 80%" end="top 50%">
          <WorkFilterBar activeType={activeType} onChange={setActiveType} />
        </RevealOnScroll>

        {/* Dostępny komunikat o liczbie wyników — ogłaszany przy zmianie filtra. */}
        <p className="sr-only" role="status" aria-live="polite">
          {t("filterAnnouncement", { count: filteredWorks.length })}
        </p>

        <SectionSpacer />

        {isAll ? (
          <>
            {/* 1 — single: Nth Consulting Group (2026) */}
            {nthConsulting && (
              <RevealOnScroll start="top 80%" end="top 50%">
                <WorkThumbnail work={nthConsulting} mode="single" />
              </RevealOnScroll>
            )}

            <SectionSpacer />

            {/* 2 — row: Kobu Studio (2026) + Pasibus (2025) */}
            {(kobuStudio || pasibus) && (
              <div>
                <div className="px-8 md:px-8 lg:px-[52px]">
                  <div className="w-full md:w-[770px] lg:w-[1108px] lg:ml-auto">
                    <div className="flex flex-col md:flex-row gap-[60px] md:gap-7">
                      {kobuStudio && (
                        <RevealOnScroll
                          className="flex flex-col"
                          start="top 90%"
                          end="top 70%"
                        >
                          <WorkThumbnail work={kobuStudio} mode="column" />
                        </RevealOnScroll>
                      )}

                      {pasibus && (
                        <RevealOnScroll
                          className="flex flex-col"
                          start="top 80%"
                          end="top 60%"
                        >
                          <WorkThumbnail work={pasibus} mode="column" />
                        </RevealOnScroll>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <SectionSpacer />

            {/* 3 — single: Tutlo (2025) */}
            {tutloRecommendation && (
              <RevealOnScroll start="top 80%" end="top 50%">
                <WorkThumbnail work={tutloRecommendation} mode="single" />
              </RevealOnScroll>
            )}

            <SectionSpacer />

            {/* 4 — row: Absolvent (2025) + Talent Days (2024) */}
            {(absolventAgency || talentDays) && (
              <div>
                <div className="px-8 md:px-8 lg:px-[52px]">
                  <div className="w-full md:w-[770px] lg:w-[1108px] mx-auto md:mx-auto lg:mx-0">
                    <div className="flex flex-col md:flex-row gap-[60px] md:gap-7">
                      {absolventAgency && (
                        <RevealOnScroll
                          className="flex flex-col gap-7"
                          start="top 90%"
                          end="top 70%"
                        >
                          <WorkThumbnail work={absolventAgency} mode="column" />
                        </RevealOnScroll>
                      )}

                      {talentDays && (
                        <RevealOnScroll
                          className="flex flex-col gap-7"
                          start="top 80%"
                          end="top 60%"
                        >
                          <WorkThumbnail work={talentDays} mode="column" />
                        </RevealOnScroll>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <SectionSpacer />

            {/* 5 — single: Pharmovit (2022) */}
            {pharmovit && (
              <RevealOnScroll start="top 80%" end="top 50%">
                <WorkThumbnail work={pharmovit} mode="single" />
              </RevealOnScroll>
            )}
          </>
        ) : (
          <div className="flex flex-col gap-[60px] md:gap-[60px]">
            {filteredWorks.map((work) => (
              <RevealOnScroll key={work.id} start="top 80%" end="top 50%">
                <WorkThumbnail
                  work={{ ...work, layout: "horizontal" }}
                  mode="single"
                />
              </RevealOnScroll>
            ))}
          </div>
        )}


        <SectionSpacer />
    </main>
  );
}
