"use client";

import React, { useMemo, useState } from "react";
import { useTranslations } from "@/lib/useTranslations";

import styles from "./ContactAction.module.css";

type IconType = React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;

// Typ wartości dokładnie taki, jakiego oczekuje Twoje `t(key, values)`
type TFunction = ReturnType<typeof useTranslations>;
type TranslationValues = Parameters<TFunction>[1];

type Props = {
  /** i18n keys w namespace "contact" (np. "actions.instagram.label") */
  labelKey: string;
  hoverKey: string;

  labelFallback?: string;
  hoverFallback?: string;

  labelValues?: TranslationValues;
  hoverValues?: TranslationValues;

  /** Ikona tylko dla Frame 1 (jak w Intro) */
  icon: IconType;

  /** link lub copy */
  href?: string;
  copyText?: string;

  variant?: "black" | "white";
  className?: string;
};

export default function ContactAction({
  labelKey,
  hoverKey,
  labelFallback = "",
  hoverFallback = "",
  labelValues,
  hoverValues,
  icon: Icon,
  href,
  copyText,
  variant = "black",
  className = "",
}: Props) {
  const t = useTranslations("contact");
  const [copied, setCopied] = useState(false);

  const isLink = typeof href === "string" && href.length > 0 && href !== "#";
  const variantClass = variant === "white" ? styles.variantWhite : styles.variantBlack;

  const label = useMemo(() => {
    try {
      return t(labelKey, labelValues);
    } catch {
      return labelFallback;
    }
  }, [t, labelKey, labelValues, labelFallback]);

  const hoverLabel = useMemo(() => {
    try {
      return t(hoverKey, hoverValues);
    } catch {
      return hoverFallback;
    }
  }, [t, hoverKey, hoverValues, hoverFallback]);

  const aria = useMemo(() => {
    if (isLink) return t("visit", { label });
    return t("copyToClipboard");
  }, [isLink, t, label]);

  const handleCopy = async () => {
    if (isLink) return;
    try {
      const text = copyText ?? labelFallback ?? label ?? "";
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const inner = (
    <span className={`${styles.ca} ${variantClass} ${className}`.trim()}>
      <span className={styles.bg} />

      <span className={styles.content}>
        {/* FRAME 1 — trzyma layout */}
        <span className={`${styles.frame} ${styles.frameDefault}`} aria-hidden={false}>
          <span className={styles.text}>{label}</span>
          <span className={styles.icon}>
            <Icon className={styles.iconSvg} aria-hidden />
          </span>
        </span>

        {/* FRAME 2 — overlay, tylko tekst (jak w Intro) */}
        <span className={`${styles.frame} ${styles.frameHover}`} aria-hidden>
          <span className={styles.hoverText}>{hoverLabel}</span>
        </span>

        {!isLink && copied && (
          <span className={styles.tooltip} aria-live="polite" role="status">
            {t("copied")}
          </span>
        )}
      </span>
    </span>
  );

  if (isLink) {
    return (
      <a
        href={href}
        className={`${styles.focus} group`}
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
      className={`${styles.focus} group`}
      aria-label={aria}
      aria-pressed={copied}
      title={t("copyToClipboard")}
    >
      {inner}
    </button>
  );
}
