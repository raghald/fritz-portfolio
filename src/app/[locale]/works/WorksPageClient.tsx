"use client";

import { Fragment, useMemo, useState } from "react";

import { useTranslations } from "@/lib/useTranslations";
import IntroWorks from "@/components/Sections/intro/IntroWorks";

import WorkThumbnail from "@/components/Sections/works/WorkThumbnail";
import WorkFilterBar from "@/components/Sections/works/WorkFilterBar";
import RevealOnScroll from "@/components/RevealOnScroll";
import {
  WORKS_CHRONOLOGICAL,
  isPersonalWork,
  type WorkFilter,
  type WorkItem,
} from "@/data/worksData";

const SectionSpacer = () => <div className="h-[60px] lg:h-[100px]" />;

/**
 * Rytm widoku „Wszystkie”: pojedyncza karta (poziomo), potem para kart w kolumnach,
 * i tak na przemian. Kolejność kart = chronologia (najnowsze pierwsze).
 */
type Block = { kind: "single"; work: WorkItem } | { kind: "row"; works: WorkItem[] };

function toBlocks(works: WorkItem[]): Block[] {
  const blocks: Block[] = [];
  let i = 0;
  while (i < works.length) {
    const isSingle = blocks.length % 2 === 0 || i === works.length - 1;
    if (isSingle) {
      blocks.push({ kind: "single", work: works[i] });
      i += 1;
    } else {
      blocks.push({ kind: "row", works: works.slice(i, i + 2) });
      i += 2;
    }
  }
  return blocks;
}

export default function WorksPageClient() {
  const t = useTranslations("Works");
  const [activeType, setActiveType] = useState<WorkFilter>("All");
  const [showPersonal, setShowPersonal] = useState(true);

  const filteredWorks = useMemo<WorkItem[]>(
    () =>
      WORKS_CHRONOLOGICAL.filter(
        (work) =>
          (showPersonal || !isPersonalWork(work)) &&
          (activeType === "All" || work.type.includes(activeType))
      ),
    [activeType, showPersonal]
  );

  const blocks = useMemo(() => toBlocks(filteredWorks), [filteredWorks]);
  const isAll = activeType === "All";

  return (
    <main id="main-content" tabIndex={-1} className="main-content relative z-20 bg-white max-w-[1440px] mx-auto">
        {/* H1 renderuje IntroWorks jako widoczny <h1> (hybrydowy). */}

        <IntroWorks />

        <RevealOnScroll start="top 80%" end="top 50%">
          <WorkFilterBar
            activeType={activeType}
            onChange={setActiveType}
            showPersonal={showPersonal}
            onShowPersonalChange={setShowPersonal}
          />
        </RevealOnScroll>

        {/* Dostępny komunikat o liczbie wyników — ogłaszany przy zmianie filtra. */}
        <p className="sr-only" role="status" aria-live="polite">
          {t("filterAnnouncement", { count: filteredWorks.length })}
        </p>

        <SectionSpacer />

        {isAll ? (
          blocks.map((block, idx) => (
            <Fragment key={block.kind === "single" ? block.work.id : block.works[0].id}>
              {idx > 0 && <SectionSpacer />}

              {block.kind === "single" ? (
                <RevealOnScroll start="top 80%" end="top 50%">
                  <WorkThumbnail
                    work={{ ...block.work, layout: "horizontal" }}
                    mode="single"
                  />
                </RevealOnScroll>
              ) : (
                <div className="px-8 md:px-8 lg:px-[52px]">
                  {/* Pary na przemian dosunięte do prawej i do lewej (desktop). */}
                  <div
                    className={[
                      "w-full md:w-[770px] lg:w-[1108px]",
                      Math.floor(idx / 2) % 2 === 0 ? "lg:ml-auto" : "mx-auto lg:mx-0",
                    ].join(" ")}
                  >
                    <div className="flex flex-col md:flex-row gap-[60px] md:gap-7">
                      {block.works.map((work, i) => (
                        <RevealOnScroll
                          key={work.id}
                          className="flex flex-col"
                          start={i === 0 ? "top 90%" : "top 80%"}
                          end={i === 0 ? "top 70%" : "top 60%"}
                        >
                          <WorkThumbnail work={work} mode="column" />
                        </RevealOnScroll>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </Fragment>
          ))
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
