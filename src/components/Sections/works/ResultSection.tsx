"use client";

import React from "react";
import { useTranslations } from "@/lib/useTranslations";

interface ResultSectionProps {
  resultText: string;
}

const ResultSection: React.FC<ResultSectionProps> = ({ resultText }) => {
  const tCommon = useTranslations("Common.sections");
  const heading = tCommon("resultHeading");

  return (
    <section className="relative z-20 w-full bg-white">
      {/* Spacing above section */}
      <div className="h-[60px] lg:h-[100px]" />

      {/* Max width container – spójne z innymi sekcjami */}
      <div className="w-full max-w-[1440px] mx-auto px-3 md:px-8 lg:px-[52px]">
        {/* Heading – right aligned, half width */}
        <div className="w-full lg:w-1/2 lg:ml-auto">
          <h2 className="text-black font-semibold text-[32px] lg:text-[40px] leading-[110%] text-right">
            {heading}
          </h2>
        </div>

        {/* 32px gap */}
        <div className="h-[32px]" />

        {/* Result Text – right aligned, half width */}
        <div className="w-full lg:w-1/2 lg:ml-auto">
          {/* Desktop */}
          <div className="hidden lg:block">
            <div className="text-black text-[36px] leading-[48px] text-right">
              {resultText}
            </div>
          </div>

          {/* Tablet */}
          <div className="hidden md:block lg:hidden">
            <div className="text-black text-[30px] leading-relaxed text-right">
              {resultText}
            </div>
          </div>

          {/* Mobile */}
          <div className="block md:hidden">
            <div className="text-black text-[30px] leading-relaxed text-right">
              {resultText}
            </div>
          </div>
        </div>

        {/* Spacing below */}
        <div className="h-[60px] lg:h-[100px]" />

        {/* Border separator */}
        <div className="w-full border-t border-black" />

        {/* Bottom spacing */}
        <div className="h-[60px] lg:h-[100px]" />
      </div>
    </section>
  );
};

export default ResultSection;
