"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";

import IntroWorks from "@/components/Sections/intro/IntroWorks";

import WorkThumbnail from "@/components/Sections/works/WorkThumbnail";
import WorkFilterBar from "@/components/Sections/works/WorkFilterBar";
import { WORKS, type WorkItem, type WorkType } from "@/data/worksData";

const SectionSpacer = () => <div className="h-[60px] lg:h-[100px]" />;

export default function WorksPageClient() {
  const locale = useLocale() as "en" | "pl";
  const isPl = locale === "pl";

  const [activeType, setActiveType] = useState<WorkType | "All">("All");

const filteredWorks = useMemo<WorkItem[]>(() => {
  if (activeType === "All") return WORKS;
  return WORKS.filter((work) => work.type.includes(activeType));
}, [activeType]);

  const talentDays = WORKS.find((w) => w.id === "talentdays-blog");
  const pharmovit = WORKS.find((w) => w.id === "pharmovit-store");
  const pasibus = WORKS.find((w) => w.id === "pasibus-job-board");
  const tutloRecommendation = WORKS.find((w) => w.id === "tutlo-recommendation");
  const kobuStudio = WORKS.find((w) => w.id === "kobu-studio");
  const absolventAgency = WORKS.find((w) => w.id === "absolvent-agency");

  const isAll = activeType === "All";

  // ✅ SEO (krótko, bez ściany tekstu)
  const seoH1 = isPl
    ? "Case study — zobacz moje realizacje — Fritz Głowacki"
    : "Case studies — selected works — Fritz Glowacki";

  const seoLead = isPl
    ? "Wybrane projekty z obszaru web designu, UI/UX, brandingu i motion — od architektury informacji po dopracowany interfejs."
    : "Selected projects across web design, UI/UX, branding and motion — from information architecture to polished interfaces.";

  return (
    <main className="main-content relative z-20 bg-white max-w-[1440px] mx-auto">
        {/* ✅ Niewidoczne SEO H1 + lead */}
        <header className="sr-only">
          <h1>{seoH1}</h1>
          <p>{seoLead}</p>
        </header>

        <section aria-label={isPl ? "Wprowadzenie do projektów" : "Works intro"}>
          <IntroWorks />
        </section>

        <section aria-label={isPl ? "Filtry projektów" : "Works filters"}>
          <WorkFilterBar activeType={activeType} onChange={setActiveType} />
        </section>

        <SectionSpacer />

        {isAll ? (
          <>
            {talentDays && (
              <section aria-label="Talent Days project">
                <WorkThumbnail work={talentDays} mode="single" />
              </section>
            )}

            <SectionSpacer />

            {(pharmovit || pasibus) && (
              <section aria-label="Selected projects row">
                <div className="px-8 md:px-8 lg:px-[52px]">
                  <div className="w-full md:w-[770px] lg:w-[1108px] lg:ml-auto">
                    <div className="flex flex-col md:flex-row gap-[60px] md:gap-7">
                      {pharmovit && (
                        <div className="flex flex-col">
                          <WorkThumbnail work={pharmovit} mode="column" />
                        </div>
                      )}

                      {pasibus && (
                        <div className="flex flex-col">
                          <WorkThumbnail work={pasibus} mode="column" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            )}

            <SectionSpacer />

            {kobuStudio && (
              <section aria-label="Tutlo recommendation system project">
                <WorkThumbnail work={kobuStudio} mode="single" />
              </section>
            )}

            <SectionSpacer />

            {(tutloRecommendation || absolventAgency) && (
              <section aria-label="Selected projects row 2">
                <div className="px-8 md:px-8 lg:px-[52px]">
                  <div className="w-full md:w-[770px] lg:w-[1108px] mx-auto md:mx-auto lg:mx-0">
                    <div className="flex flex-col md:flex-row gap-[60px] md:gap-7">
                      {tutloRecommendation && (
                        <div className="flex flex-col gap-7">
                          <WorkThumbnail work={tutloRecommendation} mode="column" />
                        </div>
                      )}

                      {absolventAgency && (
                        <div className="flex flex-col gap-7">
                          <WorkThumbnail work={absolventAgency} mode="column" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            )}
          </>
        ) : (
          <section aria-label={isPl ? "Lista przefiltrowanych projektów" : "Filtered projects list"}>
            <div className="flex flex-col gap-[60px] md:gap-[60px]">
              {filteredWorks.map((work) => (
                <WorkThumbnail
                  key={work.id}
                  work={{ ...work, layout: "horizontal" }}
                  mode="single"
                />
              ))}
            </div>
          </section>
        )}


        <SectionSpacer />
    </main>
  );
}
