"use client";

import React, { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { useTranslations } from "@/lib/useTranslations";
import { useRouter } from "next/navigation";
import AnimatedButton from "@/components/AnimatedButton";

const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const t = useTranslations("cookieBanner");
  const locale = useLocale();
  const router = useRouter();

  useEffect(() => {
    const hasConsented = localStorage.getItem("cookieConsent");
    if (!hasConsented) {
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    const allConsent = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
    };
    localStorage.setItem("cookieConsent", "accepted");
    localStorage.setItem("cookiePreferences", JSON.stringify(allConsent));
    setIsVisible(false);
  };

  const handleDetailedSettings = () => {
    // wersja z uwzględnieniem locale
    router.push(`/${locale}/cookie-policy`);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`
        fixed z-50 bg-white border-0 shadow-lg
        
        /* Mobile: Bottom centered with margin */
        bottom-3 left-3 right-3
        w-auto max-w-[calc(100vw-24px)]
        min-h-[300px] p-3
        
        /* Small tablets */
        sm:bottom-6 sm:left-6 sm:right-6
        sm:max-w-[calc(100vw-48px)]
        sm:min-h-[280px] sm:p-8
        
        /* Medium tablets: Bottom centered */
        md:bottom-8 md:left-9 md:right-9
        md:max-w-[calc(100vw-72px)]
        md:min-h-[200px] md:p-10
        
        /* Large tablets/small desktop: Bottom left positioned */
        lg:bottom-[52px] lg:left-[52px] lg:right-auto
        lg:w-[750px] lg:max-w-none
        lg:min-h-[180px] lg:p-[40px_40px]
        
        /* Desktop: Slightly wider for comfortable button layout */
        xl:w-[780px]
        
        /* Large desktop: Maximum width */
        2xl:w-[800px]
      `}
      role="dialog"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-description"
    >
      <div className="flex flex-col h-full justify-between">
        {/* Header and Description */}
        <div>
          <h2
            id="cookie-banner-title"
            className="text-black font-bold text-[24px] leading-[150%] mb-1"
            style={{ fontWeight: 700 }}
          >
            {t("title")}
          </h2>
          <p
            id="cookie-banner-description"
            className="text-black font-medium text-[16px] leading-[150%] mt-1"
            style={{
              fontWeight: 500,
              letterSpacing: "0.16px",
            }}
          >
            {t("description.beforeLink")}{" "}
            <a
              href={`/${locale}/cookie-policy`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-black hover:text-gray-700 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
            >
              {t("description.linkText")}
            </a>
            {t("description.afterLink")}
          </p>
        </div>

        {/* Buttons */}
        <div
          className={`
            flex mt-10 gap-5
            flex-col
            sm:flex-row sm:justify-start
            lg:justify-start
          `}
        >
          <AnimatedButton
            onClick={handleAcceptAll}
            ariaLabel={t("buttons.acceptAll.aria")}
            variant="cookieAccept"
            className="w-full h-[53px] px-6 sm:w-[271px] lg:w-[250px] rounded-none"
          >
            {t("buttons.acceptAll.label")}
          </AnimatedButton>

          <AnimatedButton
            onClick={handleDetailedSettings}
            ariaLabel={t("buttons.detailed.aria")}
            variant="cookieDetailed"
            className="w-full h-[53px] px-6 sm:w-[283px] lg:w-[260px] rounded-none"
          >
            {t("buttons.detailed.label")}
          </AnimatedButton>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
