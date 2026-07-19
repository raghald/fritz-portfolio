"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "@/lib/useTranslations";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface GoalSectionProps {
  i18nKey: string; // np. "Works.talentdays"
  leftTopImageSrc: string;
  leftTopImageAlt?: string;
  leftBottomImageSrc: string;
  leftBottomImageAlt?: string;
  rightImageSrc: string;
  rightImageAlt?: string;
}

const GoalSection: React.FC<GoalSectionProps> = ({
  i18nKey,
  leftTopImageSrc,
  leftTopImageAlt = "Goal image - left top",
  leftBottomImageSrc,
  leftBottomImageAlt = "Goal image - left bottom",
  rightImageSrc,
  rightImageAlt = "Goal image - right",
}) => {
  const t = useTranslations(`${i18nKey}.goal`);

  const textRef = useScrollReveal<HTMLDivElement>({
    start: "top 90%",
    end: "top 60%",
  });
  const leftTopRef = useScrollReveal<HTMLDivElement>({
    start: "top 90%",
    end: "top 70%",
  });
  const rightRef = useScrollReveal<HTMLDivElement>({
    start: "top 80%",
    end: "top 60%",
  });
  const leftBottomRef = useScrollReveal<HTMLDivElement>({
    start: "top 70%",
    end: "top 50%",
  });

  return (
    <section className="w-full bg-white">
      <div className="w-full max-w-[1440px] mx-auto px-8 md:px-8 lg:px-[52px]">
        <div className="py-[60px] lg:py-[100px]">
          {/* TEXT */}
          <div ref={textRef} className="max-w-[540px]">
            <h2 className="font-semibold text-[32px] lg:text-[40px] leading-[110%] text-black">
              {t("heading")}
            </h2>

            <p className="mt-5 text-black text-base leading-[150%]">
              {t("description")}
            </p>
          </div>

          {/* IMAGES GRID */}
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {/* LEFT */}
            <div className="grid grid-rows-2 gap-4 lg:gap-6">
              <div ref={leftTopRef} className="w-full shadow-lg overflow-hidden">
                <Image
                  src={leftTopImageSrc}
                  alt={leftTopImageAlt}
                  width={0}
                  height={0}
                  sizes="(min-width: 1024px) 25vw, 100vw"
                  className="w-full h-full object-cover block"
                  style={{ width: "100%", height: "auto" }}
                />
              </div>

              <div ref={leftBottomRef} className="w-full shadow-lg overflow-hidden">
                <Image
                  src={leftBottomImageSrc}
                  alt={leftBottomImageAlt}
                  width={0}
                  height={0}
                  sizes="(min-width: 1024px) 25vw, 100vw"
                  className="w-full h-full object-cover block"
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
            </div>

            {/* RIGHT */}
            <div ref={rightRef} className="w-full shadow-lg overflow-hidden">
              <Image
                src={rightImageSrc}
                alt={rightImageAlt}
                width={0}
                height={0}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="w-full h-full object-cover object-top block"
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GoalSection;
