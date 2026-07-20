"use client";

import React from "react";
import { FaInstagramSquare, FaLinkedin, FaRegCopy } from "react-icons/fa";
import { useTranslations } from "@/lib/useTranslations";

import ContactAction from "@/components/ContactAction";

import styles from "./IntroSection.module.css";

const EMAIL_ADDRESS = "info@fritzglowacki.com";
const INSTAGRAM_URL = "https://www.instagram.com/fritzglowacki/";
const LINKEDIN_URL = "https://www.linkedin.com/in/fryderyk-glowacki/";

/** Wspólny zestaw kontaktów (email/Instagram/LinkedIn) — używany w obu layoutach. */
function ContactsList() {
  return (
    <>
      <ContactAction
        variant="black"
        labelKey="actions.email.label"
        hoverKey="actions.email.hover"
        labelFallback={EMAIL_ADDRESS}
        copyText={EMAIL_ADDRESS}
        icon={FaRegCopy}
      />

      <ContactAction
        variant="black"
        href={INSTAGRAM_URL}
        labelKey="actions.instagram.label"
        hoverKey="actions.instagram.hover"
        icon={FaInstagramSquare}
      />

      <ContactAction
        variant="black"
        href={LINKEDIN_URL}
        labelKey="actions.linkedin.label"
        hoverKey="actions.linkedin.hover"
        icon={FaLinkedin}
      />
    </>
  );
}

const IntroAbout: React.FC = () => {
  const t = useTranslations("about.intro");

  return (
    <section
      className={`${styles.section} page-shell relative z-20 pb-[60px] lg:pb-[100px] bg-white`}
      aria-label={t("sectionAria")}
    >
      <div className="w-full">
        {/* Desktop Layout */}
        <div className={styles.containerDesktop}>
          <div className="hidden lg:block">
            <div className="flex lg:flex-row flex-col lg:gap-[100px] gap-12">
              <aside className="lg:sticky lg:top-24 lg:h-fit w-[462px] order-2 lg:order-1 hidden lg:block lg:self-start">
                <div className="space-y-8">
                  {/* Widoczny H1 (hybrydowy): widoczny tekst + sr-only suffix ze słowami kluczowymi SEO. */}
                  <h1 className={styles.title}>
                    {t("heading")}
                    <span className="sr-only"> {t("srHeadingSuffix")}</span>
                  </h1>

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
                      <ContactsList />
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
                      preload="metadata"
                      poster="/videos/About_me_Start_Video-poster.jpg"
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
              {/* Widoczny H1 (hybrydowy): widoczny tekst + sr-only suffix ze słowami kluczowymi SEO. */}
              <h1 className={styles.title}>
                    {t("heading")}
                    <span className="sr-only"> {t("srHeadingSuffix")}</span>
                  </h1>

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
                <ContactsList />
              </div>

              <div className="flex justify-center mt-8">
                <video
                  className="w-[min(80vw,378px)] aspect-square object-cover rounded-0"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  poster="/videos/About_me_Start_Video-poster.jpg"
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
