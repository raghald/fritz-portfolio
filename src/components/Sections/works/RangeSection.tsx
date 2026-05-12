"use client";

import React from "react";
import { useTranslations } from "@/lib/useTranslations";

interface RangeItem {
  title: string;
  description: string;
}

interface RangeSectionProps {
  video1Src: string;
  video2Src: string;
  rangeData: RangeItem[];
}

const RangeSection: React.FC<RangeSectionProps> = ({
  video1Src,
  video2Src,
  rangeData,
}) => {
  const tCommon = useTranslations("Common.sections");
  const heading = tCommon("rangeHeading");

  return (
    <section className="w-full bg-white">
      <div className="w-full max-w-[1440px] mx-auto px-8 md:px-8 lg:px-[52px]">
        <div className="py-[60px] lg:py-[100px]">
          {/* Heading */}
          <h2 className="text-black font-semibold text-[32px] lg:text-[40px] leading-[110%] text-left">
            {heading}
          </h2>

          <div className="h-[60px]" />

          {/* Desktop */}
          <div className="hidden lg:flex gap-10 lg:gap-16 items-start">
            {/* Left: sticky table */}
            <aside className="flex-1 lg:sticky lg:top-24 lg:h-fit">
              <div className="w-full inline-flex flex-col justify-center items-start gap-6">
                {rangeData.map((item, idx) => (
                  <React.Fragment key={`${item.title}-${idx}`}>
                    <div className="self-stretch">
                      <div className="flex flex-row gap-4">
                        <div className="flex-1 text-black text-base font-semibold leading-normal text-left">
                          {item.title}
                        </div>
                        <div className="flex-1 text-black text-base leading-normal text-left">
                          {item.description}
                        </div>
                      </div>
                    </div>

                    {idx < rangeData.length - 1 && (
                      <div className="self-stretch h-0 border-b border-black" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </aside>

            {/* Right: videos (max width like your form approach) */}
            <div className="w-full max-w-[540px] ml-auto flex flex-col gap-5">
              <div className="w-full aspect-square">
                <video
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                  disablePictureInPicture
                  controlsList="nodownload nofullscreen noremoteplayback"
                >
                  <source src={video1Src} type="video/mp4" />
                </video>
              </div>

              <div className="w-full aspect-square">
                <video
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                  disablePictureInPicture
                  controlsList="nodownload nofullscreen noremoteplayback"
                >
                  <source src={video2Src} type="video/mp4" />
                </video>
              </div>
            </div>
          </div>

          {/* Tablet */}
          <div className="hidden md:block lg:hidden">
            <div className="w-full inline-flex flex-col justify-center items-start gap-6">
              {rangeData.map((item, idx) => (
                <React.Fragment key={`${item.title}-${idx}`}>
                  <div className="self-stretch">
                    <div className="flex flex-row gap-4">
                      <div className="flex-1 text-black text-base font-semibold leading-normal text-left">
                        {item.title}
                      </div>
                      <div className="flex-1 text-black text-base leading-normal text-left">
                        {item.description}
                      </div>
                    </div>
                  </div>

                  {idx < rangeData.length - 1 && (
                    <div className="self-stretch h-0 border-b border-black" />
                  )}
                </React.Fragment>
              ))}
            </div>

            <div className="h-[60px]" />

            <div className="grid grid-cols-2 gap-5">
              <div className="w-full aspect-square">
                <video
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                  disablePictureInPicture
                  controlsList="nodownload nofullscreen noremoteplayback"
                >
                  <source src={video1Src} type="video/mp4" />
                </video>
              </div>

              <div className="w-full aspect-square">
                <video
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                  disablePictureInPicture
                  controlsList="nodownload nofullscreen noremoteplayback"
                >
                  <source src={video2Src} type="video/mp4" />
                </video>
              </div>
            </div>
          </div>

          {/* Mobile */}
          <div className="block md:hidden">
            <div className="w-full inline-flex flex-col justify-center items-start gap-6">
              {rangeData.map((item, idx) => (
                <React.Fragment key={`${item.title}-${idx}`}>
                  <div className="self-stretch">
                    <div className="flex flex-row gap-4">
                      <div className="flex-1 text-black text-base font-semibold leading-normal text-left">
                        {item.title}
                      </div>
                      <div className="flex-1 text-black text-base leading-normal text-left">
                        {item.description}
                      </div>
                    </div>
                  </div>

                  {idx < rangeData.length - 1 && (
                    <div className="self-stretch h-0 border-b border-black" />
                  )}
                </React.Fragment>
              ))}
            </div>

            <div className="h-[60px]" />

            <div className="flex flex-col gap-5">
              <div className="w-full aspect-square">
                <video
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                  disablePictureInPicture
                  controlsList="nodownload nofullscreen noremoteplayback"
                >
                  <source src={video1Src} type="video/mp4" />
                </video>
              </div>

              <div className="w-full aspect-square">
                <video
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                  disablePictureInPicture
                  controlsList="nodownload nofullscreen noremoteplayback"
                >
                  <source src={video2Src} type="video/mp4" />
                </video>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RangeSection;
