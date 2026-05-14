"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaRegCopy, FaInstagramSquare, FaLinkedin } from "react-icons/fa";
import { useTranslations } from "@/lib/useTranslations";

import ContactAction from "@/components/ContactAction";

import styles from "./Intro.module.css";

// Register ScrollTrigger plugin (client-only)
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

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
  const introRef = useRef<HTMLElement | null>(null);
  const imageRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  const tIntro = useTranslations("intro");

  useEffect(() => {
    const intro = introRef.current;
    const imageContent = imageRef.current;
    const textContent = textRef.current;

    if (!intro || !imageContent || !textContent || !ScrollTrigger) return;

    gsap.set([imageContent, textContent], { y: 50, opacity: 0 });

    scrollTriggerRef.current = ScrollTrigger.create({
      trigger: intro,
      start: "top 80%",
      end: "top 20%",
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;

        if (progress <= 0.5) {
          gsap.to(imageContent, {
            y: 0,
            opacity: 1,
            duration: 0.4,
            ease: "power2.out",
          });
        }

        if (progress >= 0.3) {
          gsap.to(textContent, {
            y: 0,
            opacity: 1,
            duration: 0.5,
            ease: "power2.out",
          });
        }
      },
    });

    return () => {
      scrollTriggerRef.current?.kill();
      scrollTriggerRef.current = null;
    };
  }, []);

  return (
    <section
      ref={introRef}
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
