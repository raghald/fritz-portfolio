"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "@/lib/useTranslations";
import { getVideoPosterPath } from "@/lib/videoPoster";

import ChallengeSection from "@/components/Sections/works/ChallengeSection";
import GoalSection from "@/components/Sections/works/GoalSection";
import RangeSection from "@/components/Sections/works/RangeSection";
import ResultSection from "@/components/Sections/works/ResultSection";
import CaseStudyContactSection from "@/components/Sections/works/CaseStudyContactSection";
import MoreSections from "@/components/Sections/works/MoreProjectsSection";
import AnimatedButton from "@/components/AnimatedButton";
import RevealOnScroll from "@/components/RevealOnScroll";

import { WORKS } from "@/data/worksData";
import type { WorkItem } from "@/data/worksData";

type TableRow = {
  label: string;
  value?: string;
  isLink?: boolean;
};

type GoalGridImages = {
  leftTop: { src: string; alt?: string };
  leftBottom: { src: string; alt?: string };
  right: { src: string; alt?: string };
};

type Section =
  | { type: "challenge"; imageSrc: string; imageAlt?: string }
  | { type: "goalGrid"; images: GoalGridImages }
  | { type: "range" }
  | {
      type: "halfImageLeft";
      imageSrc: string;
      alt: string;
      shadow?: boolean;
    }
  | { type: "result" }
  | { type: "contact" }
  | { type: "more"; workIds: WorkItem["id"][] };

type CaseStudyRendererProps = {
  workId: WorkItem["id"];
  i18nKey: string;
  sections: Section[];
};

const CaseStudyRenderer: React.FC<CaseStudyRendererProps> = ({
  workId,
  i18nKey,
  sections,
}) => {
  const t = useTranslations(i18nKey);
  const tTypes = useTranslations("Works.types");

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const work = WORKS.find((w) => w.id === workId);

  if (!work) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-black">
          Case study &quot;{workId}&quot; nie jest skonfigurowane w WORKS.
        </p>
      </div>
    );
  }

  const tableData: TableRow[] = [
  { label: t("table.client.label"), value: work.client ?? "" },
  {
    label: t("table.type.label"),
    value: work.type.map((type) => tTypes(type)).join(" / "),
  },
  { label: t("table.year.label"), value: work.year },
  { label: t("table.tools.label"), value: work.tools ?? "" },
  work.liveUrl && {
    label: t("table.live.label"),
    value: work.liveUrl,
    isLink: true,
  },
].filter(Boolean) as TableRow[];

  const stepIds = work.case?.steps ?? ["audit", "ux-ui", "finalization"];
  const rangeData = stepIds.map((stepId) => ({
    title: t(`range.${stepId}.title`),
    description: t(`range.${stepId}.description`),
  }));

  const heroVideoSrc = work.case?.heroVideo ?? "/videos/Video_1_TD.mp4";
  const rangeVideo1Src = work.case?.rangeVideo1 ?? "/videos/Video_2_TD.mp4";
  const rangeVideo2Src = work.case?.rangeVideo2 ?? "/videos/Video_3_TD.mp4";

  const resultText = t("result");

  return (
    <>
      {/* INTRO */}
      <section className="w-full bg-white">
        <div className="w-full max-w-[1440px] mx-auto px-8 md:px-8 lg:px-[52px]">
          <div className="pt-[132px] md:pt-[92px] lg:pt-[172px] pb-[60px] lg:pb-[100px]">
            <div className="flex flex-col lg:flex-row gap-[60px] lg:gap-[256px] justify-between">
              <div className="flex-1 lg:max-w-[540px]">
                <h1 className="font-semibold text-[34px] sm:text-[44px] md:text-[56px] lg:text-[68px] leading-[100%] text-black">
                  {t("heading")}
                </h1>
                <p className="mt-5 text-black text-base leading-[150%]">
                  {t("intro")}
                </p>
              </div>

              <div className="flex-1 lg:max-w-[540px] flex flex-col justify-center">
                <div className="w-full max-w-[540px]">
                  {tableData.map((row, idx) => (
                    <React.Fragment key={row.label}>
                      <div className="flex py-1.5 items-center">
                        <div className="w-1/2 font-bold text-[16px] text-black">
                          {row.label}
                        </div>

                        <div className="w-1/2 font-medium text-[16px] text-black flex justify-start">
                          {row.isLink && row.value ? (
                            <AnimatedButton
                              href={
                                row.value.startsWith("http")
                                  ? row.value
                                  : `https://${row.value}`
                              }
                              ariaLabel={row.value}
                              variant="cookieAccept"
                              className="w-fit"
                            >
                              {t("table.live.button")}
                            </AnimatedButton>
                          ) : (
                            row.value
                          )}
                        </div>
                      </div>

                      {idx < tableData.length - 1 && (
                        <>
                          <div className="h-[24px]" />
                          <div className="border-b border-black" />
                          <div className="h-[24px]" />
                        </>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HERO VIDEO */}
      <section className="w-full bg-white">
        <div className="w-full max-w-[1440px] mx-auto px-8 md:px-8 lg:px-[52px]">
          <div className="aspect-video">
            <video
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              poster={getVideoPosterPath(heroVideoSrc)}
              disablePictureInPicture
              controlsList="nodownload nofullscreen noremoteplayback"
              aria-label={t("video.ariaLabel")}
            >
              <source src={heroVideoSrc} type="video/mp4" />
              {t("video.fallback")}
            </video>
          </div>
        </div>
      </section>

      {/* DYNAMIC SECTIONS */}
      {sections.map((section, idx) => {
        const content = (() => {
          switch (section.type) {
            case "challenge":
              return (
                <ChallengeSection
                  i18nKey={i18nKey}
                  imageSrc={section.imageSrc}
                  imageAlt={section.imageAlt}
                />
              );

            case "goalGrid":
              return (
                <GoalSection
                  i18nKey={i18nKey}
                  leftTopImageSrc={section.images.leftTop.src}
                  leftTopImageAlt={section.images.leftTop.alt}
                  leftBottomImageSrc={section.images.leftBottom.src}
                  leftBottomImageAlt={section.images.leftBottom.alt}
                  rightImageSrc={section.images.right.src}
                  rightImageAlt={section.images.right.alt}
                />
              );

            case "range":
              return (
                <RangeSection
                  video1Src={rangeVideo1Src}
                  video2Src={rangeVideo2Src}
                  rangeData={rangeData}
                />
              );

            case "halfImageLeft":
              return (
                <section className="w-full bg-white">
                  <div className="w-full max-w-[1440px] mx-auto px-8 md:px-8 lg:px-[52px]">
                    <div className="py-[60px] lg:py-[100px]">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                        <div
                          className={`w-full overflow-hidden ${
                            section.shadow ? "shadow-lg" : ""
                          }`}
                        >
                          <Image
                            src={section.imageSrc}
                            alt={section.alt}
                            width={0}
                            height={0}
                            sizes="(min-width: 1024px) 50vw, 100vw"
                            className="w-full h-auto object-cover block"
                            style={{ width: "100%", height: "auto" }}
                          />
                        </div>
                        <div />
                      </div>
                    </div>
                  </div>
                </section>
              );

            case "result":
              return <ResultSection resultText={resultText} />;

            case "contact":
              return <CaseStudyContactSection />;

            case "more":
              return <MoreSections workIds={section.workIds} />;

            default:
              return null;
          }
        })();

        if (!content) return null;

        // halfImageLeft jest renderowane jako inline <section> bez własnego reveala
        // — zawijamy je w RevealOnScroll. Pozostałe komponenty zarządzają swoim revealem same.
        if (section.type === "halfImageLeft") {
          return (
            <RevealOnScroll
              key={`s-${idx}`}
              start="top 80%"
              end="top 50%"
            >
              {content}
            </RevealOnScroll>
          );
        }

        return <React.Fragment key={`s-${idx}`}>{content}</React.Fragment>;
      })}
    </>
  );
};

export default CaseStudyRenderer;
