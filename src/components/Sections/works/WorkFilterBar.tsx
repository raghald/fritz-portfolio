// components/works/WorkFilterBar.tsx
"use client";

import React from "react";
import { useTranslations } from "@/lib/useTranslations";
import { WORK_TYPES, WorkType } from "@/data/worksData";

type WorkFilterBarProps = {
  activeType: WorkType | "All";
  onChange: (type: WorkType | "All") => void;
};

const WorkFilterBar: React.FC<WorkFilterBarProps> = ({
  activeType,
  onChange,
}) => {
  const t = useTranslations("Works.filters");

  return (
    <div className="w-full px-8 lg:px-[52px]">
      <div className="w-[338px] md:w-[770px] lg:w-[1108px] mx-auto lg:mx-0 flex flex-wrap gap-3">
        {WORK_TYPES.map((type) => {
          const isActive = activeType === type;
          return (
            <button
              key={type}
              type="button"
              onClick={() => onChange(type)}
              className={[
                "px-4 py-2 text-xs md:text-sm font-medium border",
                "transition-colors duration-200",
                isActive
                  ? "bg-black text-white border-black"
                  : "bg-white text-black border-black/20 hover:border-black/60",
              ].join(" ")}
            >
              {/* etykieta z tłumaczeń */}
              {t(type)}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default WorkFilterBar;
