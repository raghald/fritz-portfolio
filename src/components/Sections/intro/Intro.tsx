"use client";

import React from "react";
import { FaRegCopy, FaInstagramSquare, FaLinkedin } from "react-icons/fa";
import { useTranslations } from "@/lib/useTranslations";
import { useScrollReveal } from "@/hooks/useScrollReveal";

import ContactAction from "@/components/ContactAction";

import styles from "./Intro.module.css";

type IntroProps = {
  /**
   * Bazowy slug do wariantów; faktyczny <img src> użyje większego wariantu,
   * srcset poda mniejszy dla mobile. Pliki wygenerowane przez
   * scripts/optimize-photos.mjs (photo-492w.webp, photo-984w.webp).
   */
  imageBaseSrc?: string;
  email?: string;
  instagramHref?: string;
  linkedinHref?: string;
  className?: string;

  /** wariant kontaktów: czarne napisy (jasne tło) lub białe (ciemne tło) */
  contactsVariant?: "black" | "white";
};

const Intro: React.FC<IntroProps> = ({
  imageBaseSrc = "/images/photo",
  email = "info@fritzglowacki.com",
  instagramHref = "https://www.instagram.com/fritzglowacki/",
  linkedinHref = "https://www.linkedin.com/in/fryderyk-glowacki/",
  className = "",
  contactsVariant = "black",
}) => {
  const imageRef = useScrollReveal<HTMLDivElement>({
    start: "top 90%",
    end: "top 60%",
  });
  const textRef = useScrollReveal<HTMLDivElement>({
    start: "top 90%",
    end: "top 50%",
  });

  const tIntro = useTranslations("intro");

  return (
    <section
      className={`${styles.intro} page-shell ${className}`.trim()}
      aria-label={tIntro("ariaLabel")}
    >
      <div className={styles.inner}>
        <div className={styles.grid}>
          {/* Image Column */}
          <div ref={imageRef} className={styles.image}>
            {/* Statyczne warianty webp wygenerowane przez scripts/optimize-photos.mjs.
                next/image z `unoptimized: true` (output: "export") nie generuje
                srcset, więc używamy <img> z ręcznym srcSet/sizes. width/height
                rezerwują miejsce w layoucie (zero CLS). */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${imageBaseSrc}-984w.webp`}
              srcSet={`${imageBaseSrc}-492w.webp 492w, ${imageBaseSrc}-984w.webp 984w`}
              sizes="(max-width: 768px) 100vw, 492px"
              alt={tIntro("portraitAlt")}
              width={492}
              height={576}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Text Column */}
          <div ref={textRef} className={styles.text}>
            <h2 className={styles.heading}>{tIntro("heading")}</h2>

            <div className={styles.contacts}>
              <ContactAction
                variant={contactsVariant}
                labelKey="actions.email.label"
                hoverKey="actions.email.hover"
                labelFallback={email}
                copyText={email}
                icon={FaRegCopy}
              />

              <ContactAction
                variant={contactsVariant}
                href={instagramHref}
                labelKey="actions.instagram.label"
                hoverKey="actions.instagram.hover"
                icon={FaInstagramSquare}
              />

              <ContactAction
                variant={contactsVariant}
                href={linkedinHref}
                labelKey="actions.linkedin.label"
                hoverKey="actions.linkedin.hover"
                icon={FaLinkedin}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Intro;
