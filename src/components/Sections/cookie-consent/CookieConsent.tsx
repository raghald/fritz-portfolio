"use client";

import React from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";

import AnimatedButton from "@/components/AnimatedButton";
import { useConsent } from "@/hooks/useConsent";
import { localePath } from "@/i18n/routing";
import { useTranslations } from "@/lib/useTranslations";

const CookieConsent: React.FC = () => {
  const t = useTranslations("cookieBanner");
  const locale = useLocale();
  const router = useRouter();
  const { ready, decided, acceptAll, rejectAll } = useConsent();

  // Hide until we know the user's stored decision — avoids a flash for
  // users who already consented and prevents SSR/CSR mismatch.
  if (!ready || decided) return null;

  const handleDetailedSettings = () => {
    router.push(localePath(locale, "/cookies"));
  };

  return (
    <div
      className={`
        fixed z-50 bg-white border-0 shadow-lg

        /* Mobile: Bottom centered with margin */
        bottom-3 left-3 right-3
        w-auto max-w-[calc(100dvw-24px)]
        min-h-[300px] p-3

        /* Small tablets */
        sm:bottom-6 sm:left-6 sm:right-6
        sm:max-w-[calc(100dvw-48px)]
        sm:min-h-[280px] sm:p-8

        /* Medium tablets: Bottom centered */
        md:bottom-8 md:left-9 md:right-9
        md:max-w-[calc(100dvw-72px)]
        md:min-h-[200px] md:p-10

        /* Large tablets/small desktop: Bottom left positioned */
        lg:bottom-[52px] lg:left-[52px] lg:right-auto
        lg:w-[820px] lg:max-w-none
        lg:min-h-[200px] lg:p-[40px_40px]

        /* Desktop */
        xl:w-[860px]

        /* Large desktop */
        2xl:w-[880px]
      `}
      role="dialog"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-description"
    >
      <div className="flex flex-col h-full justify-between">
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
              href={localePath(locale, "/cookies")}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-black hover:text-gray-700 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
            >
              {t("description.linkText")}
            </a>
            {t("description.afterLink")}
          </p>
        </div>

        <div
          className={`
            flex mt-10 gap-3
            flex-col
            sm:flex-row sm:flex-wrap sm:justify-start
            lg:justify-start
          `}
        >
          <AnimatedButton
            onClick={acceptAll}
            ariaLabel={t("buttons.acceptAll.aria")}
            variant="cookieAccept"
            className="w-full h-[53px] px-6 sm:w-[230px] lg:w-[215px] rounded-none"
          >
            {t("buttons.acceptAll.label")}
          </AnimatedButton>

          <AnimatedButton
            onClick={rejectAll}
            ariaLabel={t("buttons.rejectAll.aria")}
            variant="cookieAccept"
            className="w-full h-[53px] px-6 sm:w-[230px] lg:w-[215px] rounded-none"
          >
            {t("buttons.rejectAll.label")}
          </AnimatedButton>

          <AnimatedButton
            onClick={handleDetailedSettings}
            ariaLabel={t("buttons.detailed.aria")}
            variant="cookieDetailed"
            className="w-full h-[53px] px-6 sm:w-[250px] lg:w-[230px] rounded-none"
          >
            {t("buttons.detailed.label")}
          </AnimatedButton>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
