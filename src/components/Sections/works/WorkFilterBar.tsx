// components/works/WorkFilterBar.tsx
"use client";

import React from "react";
import { useTranslations } from "@/lib/useTranslations";
import { WORK_FILTERS, type WorkFilter } from "@/data/worksData";

type WorkFilterBarProps = {
  activeType: WorkFilter;
  onChange: (type: WorkFilter) => void;
  showPersonal: boolean;
  onShowPersonalChange: (show: boolean) => void;
};

const WorkFilterBar: React.FC<WorkFilterBarProps> = ({
  activeType,
  onChange,
  showPersonal,
  onShowPersonalChange,
}) => {
  const t = useTranslations("Works.filters");

  return (
    <div className="w-full px-8 lg:px-[52px]">
      <div className="w-full max-w-[338px] md:max-w-none md:w-[770px] lg:w-[1108px] mx-auto lg:mx-0 flex flex-col gap-5">
        <div
          role="group"
          aria-label={t("groupAria")}
          className="flex flex-wrap gap-3"
        >
          {WORK_FILTERS.map((type) => {
            const isActive = activeType === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => onChange(type)}
                aria-pressed={isActive}
                className={[
                  "px-4 py-2.5 min-h-[40px] text-xs md:text-sm font-medium border",
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

        {/* Projekty własne (side projects) są domyślnie widoczne — można je ukryć. */}
        <label className="inline-flex w-fit items-center gap-2.5 min-h-[40px] cursor-pointer select-none text-black text-xs md:text-sm font-medium">
          <input
            type="checkbox"
            checked={showPersonal}
            onChange={(e) => onShowPersonalChange(e.target.checked)}
            className="w-4 h-4 accent-black cursor-pointer focus-ring"
          />
          {t("showPersonal")}
        </label>
      </div>
    </div>
  );
};

export default WorkFilterBar;
