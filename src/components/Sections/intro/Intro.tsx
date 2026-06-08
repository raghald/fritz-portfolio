"use client";

import React from "react";
import Image from "next/image";
import { FaRegCopy, FaInstagramSquare, FaLinkedin } from "react-icons/fa";
import { useTranslations } from "@/lib/useTranslations";
import { useScrollReveal } from "@/hooks/useScrollReveal";

import ContactAction from "@/components/ContactAction";

import styles from "./Intro.module.css";

type IntroProps = {
  imageSrc?: string;
  email?: string;
  instagramHref?: string;
  linkedinHref?: string;
  className?: string;

  /** wariant kontaktów: czarne napisy (jasne tło) lub białe (ciemne tło) */
  contactsVariant?: "black" | "white";
};

const Intro: React.FC<IntroProps> = ({
  imageSrc = "/images/photo.webp",
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
      role="region"
      aria-label={tIntro("ariaLabel")}
    >
      <div className={styles.inner}>
        <div className={styles.grid}>
          {/* Image Column */}
          <div ref={imageRef} className={styles.image}>
            <Image
              src={imageSrc}
              alt={tIntro("portraitAlt")}
              width={492}
              height={576}
              className="w-full h-full object-cover"
              priority
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
