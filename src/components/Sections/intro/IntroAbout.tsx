"use client";

import React from "react";
import { gsap } from "gsap";
import { FaInstagramSquare, FaLinkedin, FaRegCopy } from "react-icons/fa";
import { useTranslations } from "@/lib/useTranslations";

import styles from "./IntroSection.module.css";

type ContactItem = {
  icon: React.ReactNode;
  text: string;
  onClick: () => void;
  type: "copy" | "link";
  hoverColor: string;
  clickEffect?: boolean;
};

const IntroAbout: React.FC = () => {
  const t = useTranslations("about.intro");

  const contactItems: ContactItem[] = [
    {
      icon: <FaRegCopy size={28} />,
      text: "info@fritzglowacki.com",
      onClick: () => {
        navigator.clipboard
          .writeText("info@fritzglowacki.com")
          .catch((err) => console.error("Clipboard error:", err));
      },
      type: "copy",
      hoverColor: "#3b82f6",
      clickEffect: true,
    },
    {
      icon: <FaInstagramSquare size={28} />,
      text: "Instagram",
      onClick: () => {
        window.open("https://www.instagram.com/fritzglowacki/", "_blank");
      },
      type: "link",
      hoverColor: "#e1306c",
    },
    {
      icon: <FaLinkedin size={28} />,
      text: "LinkedIn",
      onClick: () => {
        window.open("https://www.linkedin.com/in/fryderyk-glowacki/", "_blank");
      },
      type: "link",
      hoverColor: "#0077b5",
    },
  ];

  const handleContactItemClick = (
    item: ContactItem,
    element?: HTMLElement | null
  ) => {
    item.onClick();

    if (item.clickEffect && element) {
      gsap.fromTo(
        element,
        { scale: 1 },
        {
          scale: 0.95,
          duration: 0.1,
          yoyo: true,
          repeat: 1,
          ease: "power2.out",
        }
      );
    }
  };

  return (
    <section
      className={`${styles.section} page-shell relative z-20 pb-[90px] bg-white`}
      role="region"
      aria-label={t("sectionAria")}
    >
      <div className="w-full">
        {/* Desktop Layout */}
        <div className={styles.containerDesktop}>
          <div className="hidden lg:block">
            <div className="flex lg:flex-row flex-col lg:gap-[100px] gap-12">
              <aside className="lg:sticky lg:top-24 lg:h-fit w-[462px] order-2 lg:order-1 hidden lg:block lg:self-start">
                <div className="space-y-8">
                  <h1 className={styles.title}>{t("heading")}</h1>

                  <p className="text-black text-base leading-[150%]">
                    {t("paragraph1")}
                  </p>

                  <p className="text-black text-[24px]">
                    {t("devLanguageHighlight")}
                  </p>

                  <div className="w-full h-[1px] bg-black" />

                  <p className="text-black text-base leading-[150%]">
                    {t("paragraph2")}
                  </p>
                </div>
              </aside>

              <div className="lg:w-[654px] order-1 lg:order-2 lg:ml-auto">
                <div className="space-y-[40px]">
                  <section className="w-full h-[573px] bg-white flex items-end justify-end p-8">
                    <div className="inline-flex flex-col justify-start items-end gap-5">
                      {contactItems.map((item, index) => (
                        <button
                          key={index}
                          onClick={(e) =>
                            handleContactItemClick(item, e.currentTarget)
                          }
                          className="transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 cursor-pointer"
                          title={
                            item.type === "copy"
                              ? t("copyToClipboardTitle")
                              : item.text
                          }
                        >
                          <div className="group relative inline-flex justify-start items-center overflow-hidden px-4 py-2">
                            <div className="absolute inset-0 -left-[1px] bg-black transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
                            <div className="h-8 flex justify-start items-center gap-3 group-hover:gap-4 transition-all duration-300">
                              <div className="relative z-10 justify-start text-black group-hover:text-white text-2xl transition-colors duration-300">
                                {item.text}
                              </div>
                              <div className="w-8 h-8 relative overflow-hidden flex items-center justify-center">
                                <div className="relative z-10 w-7 h-7 text-black group-hover:text-white transition-colors duration-300">
                                  {item.icon}
                                </div>
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </section>

                  {/* ❗️page-shell usunięty – padding jest już na sekcji */}
                  <section className="w-full lg:h-[654px] bg-gray-100 rounded-0 overflow-hidden">
                    <video
                      className="w-full h-full object-cover"
                      autoPlay
                      loop
                      muted
                      playsInline
                      disablePictureInPicture
                      controlsList="nodownload nofullscreen noremoteplayback"
                      style={{ pointerEvents: "none" }}
                    >
                      <source
                        src="/videos/About_me_Start_Video.mp4"
                        type="video/mp4"
                      />
                    </video>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className={styles.containerMobile}>
          <div className="block lg:hidden">
            <div className="space-y-8">
              <h1 className={styles.title}>{t("heading")}</h1>

              <p className="text-black text-base leading-[150%]">
                {t("paragraph1")}
              </p>

              <p className="text-black text-[20px]">
                {t("devLanguageHighlight")}
              </p>

              <div className="w-full h-[1px] bg-black" />

              <p className="text-black text-base leading-[150%]">
                {t("paragraph2")}
              </p>

              <div className="mt-8 inline-flex flex-col justify-start items-start gap-5">
                {contactItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={(e) =>
                      handleContactItemClick(item, e.currentTarget)
                    }
                    className="transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 cursor-pointer"
                    title={
                      item.type === "copy"
                        ? t("copyToClipboardTitle")
                        : item.text
                    }
                  >
                    <div className="group relative inline-flex justify-start items-center overflow-hidden px-4 py-2">
                      <div className="absolute inset-0 -left-[1px] bg-black transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
                      <div className="h-8 flex justify-start items-center gap-3 group-hover:gap-4 transition-all duration-300">
                        <div className="relative z-10 justify-start text-black group-hover:text-white text-2xl transition-colors duration-300">
                          {item.text}
                        </div>
                        <div className="w-8 h-8 relative overflow-hidden flex items-center justify-center">
                          <div className="relative z-10 w-7 h-7 text-black group-hover:text-white transition-colors duration-300">
                            {item.icon}
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex justify-center mt-8">
                <video
                  className="w-[378px] h-[378px] object-cover rounded-0"
                  autoPlay
                  loop
                  muted
                  playsInline
                  disablePictureInPicture
                  controlsList="nodownload nofullscreen noremoteplayback"
                  style={{ pointerEvents: "none" }}
                >
                  <source
                    src="/videos/About_me_Start_Video.mp4"
                    type="video/mp4"
                  />
                </video>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntroAbout;
