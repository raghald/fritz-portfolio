"use client";

import { useLocale } from "next-intl";
import { useTranslations } from "@/lib/useTranslations";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import styles from "./LanguageToggle.module.css";

type LanguageToggleProps = {
  variant?: "desktop" | "mobile";
};

export default function LanguageToggle({ variant = "desktop" }: LanguageToggleProps) {
  const locale = useLocale() as "en" | "pl";
  const t = useTranslations("navbar");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isEn = locale === "en";
  const otherLocale: "en" | "pl" = isEn ? "pl" : "en";

  const ariaLabel = isEn ? t("switchToPl") : t("switchToEn");

  const sizeClass = variant === "desktop" ? styles.desktop : styles.mobile;

  const handleClick = () => {
    if (!pathname) return;

    // podmieniamy pierwszy segment /en /pl
    const segments = pathname.split("/");
    if (segments.length > 1) segments[1] = otherLocale;
    const newPathname = segments.join("/") || "/";

    const query = searchParams?.toString();
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    const href = query ? `${newPathname}?${query}${hash}` : `${newPathname}${hash}`;

    router.replace(href, { scroll: true });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={ariaLabel}
      role="switch"
      aria-checked={isEn}
      className={`${styles.toggle} ${sizeClass} focus-ring`}
      style={{ pointerEvents: "auto" }}
    >
      {/* PL */}
      <span
        className={`${styles.label} ${
          !isEn ? styles.labelActive : styles.labelInactive
        }`}
      >
        PL
      </span>

      {/* EN */}
      <span className={`${styles.label} ${styles.labelInactive}`}>EN</span>

      {/* Knob */}
      <span
        className={`${styles.knob} ${
          isEn ? styles.knobRight : styles.knobLeft
        }`}
      />
    </button>
  );
}
