"use client";

import type React from "react";
import Link from "next/link";
import { useState } from "react";
import { useLocale } from "next-intl";
import { useTranslations } from "@/lib/useTranslations";
import { motion, type HTMLMotionProps, type Transition } from "framer-motion";

import { useStickyNav } from "@/hooks/useStickyNav";
import MobileMenu from "./MobileMenu";
import AnimatedButton from "@/components/AnimatedButton";
import { useContactPopup } from "@/hooks/ContactPopupContext";
import LanguageToggle from "./LanguageToggle";

import { intro, ms } from "@/lib/introTimings";

import styles from "./Navbar.module.css";

export type NavbarVariant = "sticky" | "static";

type NavbarProps = {
  variant?: NavbarVariant;
  introDelayMs?: number;
  disableIntro?: boolean;
};

export default function Navbar({
  variant = "sticky",
  introDelayMs,
  disableIntro,
}: NavbarProps) {
  const isSticky = variant === "sticky";

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isStuck = useStickyNav(50, isSticky);
  const { openPopup } = useContactPopup();

  const t = useTranslations("navbar");
  const locale = useLocale() as "en" | "pl";

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const desktopWrapperStyle: React.CSSProperties | undefined = isSticky
    ? {
        marginTop: isStuck ? 0 : 50,
        maxWidth: isStuck ? "100%" : "1108px",
        boxShadow: isStuck ? "none" : "0 18px 60px rgba(0, 0, 0, 0.18)",
        borderTopWidth: isStuck ? 0 : 1,
        borderRightWidth: isStuck ? 0 : 1,
        borderLeftWidth: isStuck ? 0 : 1,
        borderBottomWidth: 1,
      }
    : undefined;

  const navMotionProps: Partial<HTMLMotionProps<"nav">> = {};
  const playIntro = isSticky && !disableIntro;
  if (playIntro) {
    const delayMs =
      introDelayMs ?? intro.titleStartMs + (intro.navbarExtraDelayMs ?? 0);
    const transition: Transition = {
      delay: ms(delayMs),
      duration: 0.35,
      ease: [0.16, 1, 0.3, 1],
    };
    navMotionProps.initial = { opacity: 0, y: -10, filter: "blur(2px)" };
    navMotionProps.animate = { opacity: 1, y: 0, filter: "blur(0px)" };
    navMotionProps.transition = transition;
  }

  const desktopClassName = isSticky ? styles.desktop : styles.staticDesktop;
  const desktopInnerClassName = isSticky ? styles.desktopInner : styles.staticInner;

  return (
    <>
      {/* MOBILE NAV */}
      <motion.nav
        className={styles.mobile}
        role="navigation"
        aria-label={t("ariaMainNav")}
        style={{ pointerEvents: "auto" }}
        {...navMotionProps}
      >
        <div className={styles.mobileBar}>
          <Link
            href={`/${locale}`}
            className={styles.brandMobile}
            aria-label={t("brandAria")}
          >
            {t("brand")}
          </Link>

          <div className={styles.mobileActions}>
            <LanguageToggle variant="mobile" />

            <button
              type="button"
              onClick={toggleMobileMenu}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
              aria-label={t("toggleMenuAria")}
              className={`${styles.burger} focus-ring`}
              style={{ pointerEvents: "auto" }}
            >
              <span className={styles.burgerLine} />
              <span
                className={`${styles.burgerLine2} ${
                  isMobileMenuOpen ? "opacity-100" : "-rotate-90 absolute"
                }`}
              />
            </button>
          </div>
        </div>

        <MobileMenu isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />
      </motion.nav>

      {/* DESKTOP NAV */}
      <motion.nav
        className={desktopClassName}
        role="navigation"
        aria-label={t("ariaMainNav")}
        style={{ pointerEvents: "auto" }}
        {...navMotionProps}
      >
        <div className={desktopInnerClassName} style={desktopWrapperStyle}>
          <div className={styles.links}>
            <Link href={`/${locale}/works`} className={styles.link}>
              {t("linkWorks")}
            </Link>
            <Link href={`/${locale}/about`} className={styles.link}>
              {t("linkAbout")}
            </Link>
            <Link href={`/${locale}/gallery`} className={styles.link}>
              {t("linkGallery")}
            </Link>
          </div>

          <div className={styles.brandCenter}>
            <Link
              href={`/${locale}`}
              className={styles.brandDesktop}
              aria-label={t("brandAria")}
            >
              {t("brand")}
            </Link>
          </div>

          <div className={styles.right}>
            <LanguageToggle variant="desktop" />

            <AnimatedButton
              onClick={openPopup}
              ariaLabel={t("contactCtaAria")}
              variant="cookieAccept"
              className="w-auto h-auto py-2 px-5 text-sm leading-5"
            >
              {t("contactCta")}
            </AnimatedButton>
          </div>
        </div>
      </motion.nav>
    </>
  );
}
