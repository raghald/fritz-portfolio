"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useLocale } from "next-intl";
import { useTranslations } from "@/lib/useTranslations";
import { localePath } from "@/i18n/routing";

import AnimatedButton from "@/components/AnimatedButton";
import { useContactPopup } from "@/hooks/ContactPopupContext";

import styles from "./MobileMenu.module.css";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null);
  const { openPopup } = useContactPopup();

  const t = useTranslations("navbar");
  const locale = useLocale() as "en" | "pl";

  // ESC + fokus na pierwszym linku po otwarciu
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) onClose();
    };

    document.addEventListener("keydown", handleKeyDown);

    if (isOpen) {
      const timer = window.setTimeout(() => firstLinkRef.current?.focus(), 0);
      return () => {
        window.clearTimeout(timer);
        document.removeEventListener("keydown", handleKeyDown);
      };
    }

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // ✅ iOS-safe scroll lock (bez overflow:hidden)
  useEffect(() => {
    if (!isOpen) return;

    const scrollY = window.scrollY;

    const html = document.documentElement;
    const body = document.body;

    html.style.overflow = "hidden";

    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";

    return () => {
      const y = Math.abs(parseInt(body.style.top || "0", 10)) || scrollY;

      html.style.overflow = "";

      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.width = "";

      window.scrollTo(0, y);
    };
  }, [isOpen]);

  return (
    <div className={`${styles.wrap} ${isOpen ? styles.open : styles.closed}`}>
      {/* Opcjonalny backdrop — klik zamyka (nie wpływa na layout) */}
      <button
        type="button"
        className={styles.backdrop}
        aria-label={locale === "pl" ? "Zamknij menu" : "Close menu"}
        onClick={onClose}
        tabIndex={isOpen ? 0 : -1}
      />

      <nav
        id="mobile-navigation"
        role="navigation"
        aria-label={t("ariaMainNav")}
        className={styles.nav}
      >
        <ul className={styles.list}>
          <li>
            <Link
              ref={firstLinkRef}
              href={localePath(locale, "/works")}
              className={`${styles.link} focus-ring`}
              onClick={onClose}
            >
              {t("linkWorks")}
            </Link>
          </li>
          <li>
            <Link
              href={localePath(locale, "/about")}
              className={`${styles.link} focus-ring`}
              onClick={onClose}
            >
              {t("linkAbout")}
            </Link>
          </li>
          <li>
            <Link
              href={localePath(locale, "/gallery")}
              className={`${styles.link} focus-ring`}
              onClick={onClose}
            >
              {t("linkGallery")}
            </Link>
          </li>

          <li className="pt-2">
            <AnimatedButton
              onClick={() => {
                openPopup();
                onClose();
              }}
              ariaLabel={t("contactCtaAria")}
              variant="cookieAccept"
              className="w-full py-2 px-5 text-sm"
            >
              {t("contactCta")}
            </AnimatedButton>
          </li>
        </ul>
      </nav>
    </div>
  );
}
