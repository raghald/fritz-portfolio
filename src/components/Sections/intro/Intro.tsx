"use client";

import React, { useState, useCallback, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaRegCopy, FaInstagramSquare, FaLinkedin } from "react-icons/fa";
import { useTranslations } from "@/lib/useTranslations";

import styles from "./Intro.module.css";
import caStyles from "@/components/ContactAction.module.css";

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

type IconType = React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;

type ContactActionProps = {
  /** Tekst Frame 1 (default) */
  label: string;

  /** Tekst Frame 2 (hover) — tylko tekst, bez ikony */
  hoverLabel: string;

  /** jeśli jest => link */
  href?: string;

  /** jeśli brak href => copy */
  onCopy?: () => void;

  /** Ikona dla Frame 1 */
  icon: IconType;

  variant?: "black" | "white";

  /**
   * Co kopiować (np. email). Jeśli nie podasz, skopiuje `label`.
   * Polecam podawać, gdy label jest tłumaczeniem, a kopiujesz stałą wartość.
   */
  copyValue?: string;
};

const ContactAction: React.FC<ContactActionProps> = ({
  label,
  hoverLabel,
  href,
  onCopy,
  icon: Icon,
  variant = "black",
  copyValue,
}) => {
  const [copied, setCopied] = useState(false);
  const tContact = useTranslations("contact");

  const isLink = typeof href === "string" && href.length > 0 && href !== "#";
  const variantClass = variant === "white" ? caStyles.variantWhite : caStyles.variantBlack;

  const aria = useMemo(() => {
    if (isLink) return tContact("visit", { label });
    return tContact("copyToClipboard");
  }, [isLink, label, tContact]);

  const handleCopy = async () => {
    if (isLink) return;
    try {
      const textToCopy = copyValue ?? label;
      await navigator.clipboard.writeText(textToCopy);
      onCopy?.();
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const inner = (
    <span className={`${caStyles.ca} ${variantClass}`.trim()}>
      <span className={caStyles.bg} />

      <span className={caStyles.content}>
        {/* FRAME 1 (default) – trzyma layout */}
        <span className={`${caStyles.frame} ${caStyles.frameDefault}`}>
          <span className={`${caStyles.text} group-hover:text-white`}>{label}</span>
          <span className={caStyles.icon}>
            <Icon className={`${caStyles.iconSvg} group-hover:text-white`} aria-hidden />
          </span>
        </span>

        {/* FRAME 2 (hover) – overlay, wyśrodkowany, BEZ IKONY */}
        <span className={`${caStyles.frame} ${caStyles.frameHover}`} aria-hidden>
          <span className={`${caStyles.hoverText} group-hover:text-white`}>{hoverLabel}</span>
        </span>

        {!isLink && copied && (
          <span className={caStyles.tooltip} aria-live="polite" role="status">
            {tContact("copied")}
          </span>
        )}
      </span>
    </span>
  );

  if (isLink) {
    return (
      <a
        href={href}
        className={`${caStyles.focus} group`}
        aria-label={aria}
        target="_blank"
        rel="noopener noreferrer"
      >
        {inner}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`${caStyles.focus} group`}
      title={tContact("copyToClipboard")}
      aria-pressed={copied}
      aria-label={aria}
    >
      {inner}
    </button>
  );
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
  const tContact = useTranslations("contact");

  const handleEmailCopy = useCallback(() => {
    // opcjonalnie: toast / event track
  }, []);

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
              {/* EMAIL: Frame 1 = email + ikona, Frame 2 = tekst i18n */}
              <ContactAction
                label={email}
                hoverLabel={tContact("actions.email.hover")}
                onCopy={handleEmailCopy}
                icon={FaRegCopy}
                variant={contactsVariant}
                copyValue={email}
              />

              {/* INSTAGRAM */}
              <ContactAction
                label={tContact("actions.instagram.label")}
                hoverLabel={tContact("actions.instagram.hover")}
                href={instagramHref}
                icon={FaInstagramSquare}
                variant={contactsVariant}
              />

              {/* LINKEDIN */}
              <ContactAction
                label={tContact("actions.linkedin.label")}
                hoverLabel={tContact("actions.linkedin.hover")}
                href={linkedinHref}
                icon={FaLinkedin}
                variant={contactsVariant}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Intro;
