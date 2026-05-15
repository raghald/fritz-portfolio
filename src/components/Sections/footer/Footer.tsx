"use client";

import React from "react";
import { useLocale } from "next-intl";
import { useTranslations } from "@/lib/useTranslations";
import { localePath } from "@/i18n/routing";

import AnimatedButton from "@/components/AnimatedButton";
import { useContactPopup } from "@/hooks/ContactPopupContext";

import ContactAction from "@/components/ContactAction";
import { FaInstagramSquare, FaLinkedin } from "react-icons/fa";

import styles from "./Footer.module.css";

type FooterProps = {
  className?: string;
};

const Footer: React.FC<FooterProps> = ({ className = "" }) => {
  const { openPopup } = useContactPopup();
  const tFooter = useTranslations("footer");
  const locale = useLocale();

  return (
    <footer
      className={`${styles.footer} ${className}`.trim()}
      role="contentinfo"
      aria-label={tFooter("ariaLabel")}
    >
      <div className={styles.shell}>
        {/* Social */}
        <div className={styles.social}>
          <ContactAction
            variant="white"
            href="https://www.instagram.com/fritzglowacki/"
            labelKey="actions.instagram.label"
            hoverKey="actions.instagram.hover"
            icon={FaInstagramSquare}
          />
          <ContactAction
            variant="white"
            href="https://www.linkedin.com/in/fryderyk-glowacki/"
            labelKey="actions.linkedin.label"
            hoverKey="actions.linkedin.hover"
            icon={FaLinkedin}
          />
        </div>

        {/* Main */}
        <div className={styles.main}>
          <h2 className={styles.headline}>
            {tFooter("headlineLine1")}
            <br />
            {tFooter("headlineLine2")}
          </h2>

          <div className={styles.cta}>
            <AnimatedButton
              onClick={openPopup}
              ariaLabel={tFooter("btnAria")}
              variant="white"
              className={styles.ctaBtn}
            >
              {tFooter("btnLabel")}
            </AnimatedButton>
          </div>
        </div>

        {/* Bottom */}
        <div className={styles.bottom}>
          <div className={styles.contact}>
            <a
              href="tel:+48506989423"
              className={styles.link}
              aria-label={tFooter("phoneAria")}
            >
              +48 506 989 423
            </a>

            <a
              href="mailto:info@fritzglowacki.com"
              className={styles.link}
              aria-label={tFooter("emailAria")}
            >
              info@fritzglowacki.com
            </a>
          </div>

          <a
            href={localePath(locale, "/cookies")}
            className={styles.cookies}
            aria-label={tFooter("cookiesAria")}
            rel="noopener noreferrer"
          >
            {tFooter("cookiesLabel")}
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
