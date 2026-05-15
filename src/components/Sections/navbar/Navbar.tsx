"use client";

import type React from "react";
import Link from "next/link";
import { useState } from "react";
import { useLocale } from "next-intl";
import { useTranslations } from "@/lib/useTranslations";
import { localePath } from "@/i18n/routing";

import { useStickyNav } from "@/hooks/useStickyNav";
import MobileMenu from "./MobileMenu";
import AnimatedButton from "@/components/AnimatedButton";
import { useContactPopup } from "@/hooks/ContactPopupContext";
import LanguageToggle from "./LanguageToggle";

import { intro } from "@/lib/introTimings";

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

  // Intro animation tylko dla sticky (home page) — sterujemy klasą + CSS var
  const playIntro = isSticky && !disableIntro;
  const delayMs =
    introDelayMs ?? intro.titleStartMs + (intro.navbarExtraDelayMs ?? 0);
  const introClass = playIntro ? styles.intro : "";
  const introStyle: React.CSSProperties | undefined = playIntro
    ? ({ ["--navbar-delay-ms" as string]: `${delayMs}ms` } as React.CSSProperties)
    : undefined;

  const desktopClassName = isSticky ? styles.desktop : styles.staticDesktop;
  const desktopInnerClassName = isSticky ? styles.desktopInner : styles.staticInner;

  return (
    <>
      {/* MOBILE NAV */}
      <nav
        className={`${styles.mobile} ${introClass}`.trim()}
        role="navigation"
        aria-label={t("ariaMainNav")}
        style={{ pointerEvents: "auto", ...introStyle }}
      >
        <div className={styles.mobileBar}>
          <Link
            href={localePath(locale)}
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
      </nav>

      {/* DESKTOP NAV */}
      <nav
        className={`${desktopClassName} ${introClass}`.trim()}
        role="navigation"
        aria-label={t("ariaMainNav")}
        style={{ pointerEvents: "auto", ...introStyle }}
      >
        <div className={desktopInnerClassName} style={desktopWrapperStyle}>
          <div className={styles.links}>
            <Link href={localePath(locale, "/works")} className={styles.link}>
              {t("linkWorks")}
            </Link>
            <Link href={localePath(locale, "/about")} className={styles.link}>
              {t("linkAbout")}
            </Link>
            <Link href={localePath(locale, "/gallery")} className={styles.link}>
              {t("linkGallery")}
            </Link>
          </div>

          <div className={styles.brandCenter}>
            <Link
              href={localePath(locale)}
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
              size="S"
            >
              {t("contactCta")}
            </AnimatedButton>
          </div>
        </div>
      </nav>
    </>
  );
}
