"use client";

import { useLocale } from "next-intl";
import { useTranslations } from "@/lib/useTranslations";
import { usePathname, useRouter } from "next/navigation";

import styles from "./LanguageToggle.module.css";

type LanguageToggleProps = {
  variant?: "desktop" | "mobile";
};

export default function LanguageToggle({ variant = "desktop" }: LanguageToggleProps) {
  const locale = useLocale() as "en" | "pl";
  const t = useTranslations("navbar");

  const router = useRouter();
  const pathname = usePathname();

  // Świadomie NIE używamy useSearchParams() — ten hook w Next 15 z
  // output: "export" wymusza CSR bailout całego ancestor Suspense boundary,
  // co prowadzi do pustego statycznego HTML i visible flicker przy animacji
  // wejścia navbara. Query string i tak jest potrzebny tylko w momencie
  // kliknięcia — czytamy go wtedy bezpośrednio z window.location.

  const isEn = locale === "en";
  const otherLocale: "en" | "pl" = isEn ? "pl" : "en";

  const ariaLabel = isEn ? t("switchToPl") : t("switchToEn");

  const sizeClass = variant === "desktop" ? styles.desktop : styles.mobile;

  const handleClick = () => {
    if (!pathname) return;

    // EN bez prefiksu, PL pod /pl/. Najpierw zdejmujemy ewentualny prefix,
    // potem dokładamy nowy (tylko dla PL).
    const stripped = pathname.replace(/^\/pl(?=\/|$)/, "") || "/";
    const newPathname =
      otherLocale === "pl"
        ? stripped === "/"
          ? "/pl"
          : `/pl${stripped}`
        : stripped;

    // Czytamy query/hash bezpośrednio z URL (handler odpala się tylko na kliencie,
    // więc window istnieje). Defensive check na wszelki wypadek.
    const search =
      typeof window !== "undefined" ? window.location.search : "";
    const hash =
      typeof window !== "undefined" ? window.location.hash : "";
    const href = `${newPathname}${search}${hash}`;

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
