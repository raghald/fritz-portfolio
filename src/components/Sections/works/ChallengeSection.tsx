"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "@/lib/useTranslations";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface ChallengeSectionProps {
  imageSrc: string;
  imageAlt?: string;

  /**
   * Namespace tłumaczeń, np. "Works.talentdays", "Works.tutlo"
   * Optional + fallback, żeby nie rozwalić starych wywołań
   */
  i18nKey?: string;
}

const ChallengeSection: React.FC<ChallengeSectionProps> = ({
  imageSrc,
  imageAlt = "Challenge image",
  i18nKey = "Works.talentdays", // fallback bezpieczeństwa
}) => {
  const t = useTranslations(`${i18nKey}.challenge`);

  const imageRef = useScrollReveal<HTMLDivElement>({
    start: "top 90%",
    end: "top 60%",
  });
  const textRef = useScrollReveal<HTMLDivElement>({
    start: "top 90%",
    end: "top 50%",
  });

  return (
    <section className="w-full bg-white">
      <div className="w-full max-w-[1440px] mx-auto px-8 md:px-8 lg:px-[52px]">
        <div className="py-[60px] lg:py-[100px]">
          <div className="flex flex-col lg:flex-row gap-[40px] lg:gap-[60px] items-start">
            {/* TEXT */}
            <div ref={textRef} className="order-1 lg:order-2 flex-1 lg:max-w-[540px]">
              <h2 className="font-semibold text-[32px] lg:text-[40px] leading-[110%] text-black">
                {t("heading")}
              </h2>

              <p className="mt-5 text-black text-base leading-[150%]">
                {t("description")}
              </p>
            </div>

            {/* IMAGE */}
            <div ref={imageRef} className="order-2 lg:order-1 flex-1 shadow-lg">
              <div className="w-full overflow-hidden">
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  width={0}
                  height={0}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="w-full h-auto object-cover block"
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChallengeSection;
