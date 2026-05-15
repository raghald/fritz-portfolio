"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import styles from "./AnimatedButton.module.css";

type BaseProps = {
  children: ReactNode;
  ariaLabel?: string;
  variant?: "white" | "outline" | "cookieAccept" | "cookieDetailed";
  size?: "M" | "S";
  className?: string;
};

type LinkButtonProps = BaseProps & {
  href: string;
  onClick?: never;
  type?: never;
  disabled?: never;
};

type RegularButtonProps = BaseProps & {
  href?: undefined;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
};

export type AnimatedButtonProps = LinkButtonProps | RegularButtonProps;

const variantClass: Record<NonNullable<BaseProps["variant"]>, string> = {
  white: styles.variantWhite,
  outline: styles.variantOutline,
  cookieAccept: styles.variantCookieAccept,
  cookieDetailed: styles.variantCookieDetailed,
};

const sizeClass: Record<NonNullable<BaseProps["size"]>, string> = {
  M: styles.sizeM,
  S: styles.sizeS,
};

export default function AnimatedButton(props: AnimatedButtonProps) {
  const {
    children,
    ariaLabel,
    variant = "white",
    size = "M",
    className = "",
  } = props;

  const content = (
    <>
      {/* Base layer */}
      <div className={`${styles.layer} ${styles.base}`} />

      {/* Hover layer 1 (neutral sweep) */}
      <div className={`${styles.layer} ${styles.sweep1}`} />

      {/* Hover layer 2 (final sweep) */}
      <div className={`${styles.layer} ${styles.sweep2}`} />

      {/* Text */}
      <span className={styles.label}>{children}</span>
    </>
  );

  const isLink = "href" in props && typeof props.href === "string";
  const classes = `${styles.btn} ${sizeClass[size]} ${variantClass[variant]} ${className}`.trim();

  if (isLink) {
    const { href } = props as LinkButtonProps;

    return (
      <Link
        href={href}
        aria-label={ariaLabel}
        className={classes}
        style={{ pointerEvents: "auto" }}
      >
        {content}
      </Link>
    );
  }

  const { onClick, type = "button", disabled } = props as RegularButtonProps;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={classes}
      style={{ pointerEvents: "auto" }}
    >
      {content}
    </button>
  );
}
