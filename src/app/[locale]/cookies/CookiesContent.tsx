"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "@/lib/useTranslations";

import AnimatedButton from "@/components/AnimatedButton";

export default function CookiesContent() {
  const t = useTranslations("cookiePolicy");

  const [activeConsent, setActiveConsent] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
    functional: false,
  });

  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  useEffect(() => {
    const savedPreferences = localStorage.getItem("cookiePreferences");
    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences);
        setActiveConsent((prev) => ({
          ...prev,
          necessary: true,
          analytics: !!parsed.analytics,
          marketing: !!parsed.marketing,
          functional: !!parsed.functional,
        }));
      } catch (error) {
        console.error("Error loading cookie preferences:", error);
        setFeedbackMessage(t("feedback.loadError"));
      }
    }
  }, [t]);

  const handleAcceptAll = () => {
    const newConsent = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
    };
    setActiveConsent(newConsent);
    localStorage.setItem("cookieConsent", "accepted");
    localStorage.setItem("cookiePreferences", JSON.stringify(newConsent));
    setFeedbackMessage(t("feedback.acceptAll"));
  };

  const handleSavePreferences = () => {
    localStorage.setItem("cookieConsent", "custom");
    localStorage.setItem("cookiePreferences", JSON.stringify(activeConsent));
    setFeedbackMessage(t("feedback.saved"));
  };

  return (
    <div className="w-full px-8 lg:px-[52px] pb-[100px]">
      <div className="max-w-[1336px] mx-auto">
        {/* HEADER */}
        <h1 className="text-black font-semibold text-[44px] md:text-[56px] lg:text-[68px] leading-[100%] mb-5">
          {t("header.title")}
        </h1>

        <p className="text-black font-medium text-base leading-[150%] tracking-[0.16px] max-w-[770px] mb-[60px] lg:mb-[100px]">
          {t("header.intro")}
        </p>

        <div className="w-full border-t border-black mb-[60px] lg:mb-[100px]" />

        {/* SECTION 1 – What are cookies */}
        <section className="mb-[60px] lg:mb-[100px]">
          <h2 className="text-black font-semibold text-[32px] lg:text-[44px] leading-[100%] mb-8">
            {t("section1.title")}
          </h2>
          <p className="text-black font-medium text-base leading-[150%] tracking-[0.16px] max-w-[770px]">
            {t("section1.body")}
          </p>
        </section>

        {/* SECTION 2 – What cookies do we use */}
        <section className="mb-[60px] lg:mb-[100px]">
          <h2 className="text-black font-semibold text-[32px] lg:text-[44px] leading-[100%] mb-8">
            {t("section2.title")}
          </h2>

          <ul className="space-y-6 max-w-[770px]">
            <li>
              <p className="text-black font-semibold text-base mb-2">
                • {t("section2.items.necessary.title")}
              </p>
              <p className="text-black font-medium text-base ml-6 leading-[150%] tracking-[0.16px]">
                {t("section2.items.necessary.body")}
              </p>
            </li>

            <li>
              <p className="text-black font-semibold text-base mb-2">
                • {t("section2.items.analytics.title")}
              </p>
              <p className="text-black font-medium text-base ml-6 leading-[150%] tracking-[0.16px]">
                {t("section2.items.analytics.body")}
              </p>
            </li>

            <li>
              <p className="text-black font-semibold text-base mb-2">
                • {t("section2.items.marketing.title")}
              </p>
              <p className="text-black font-medium text-base ml-6 leading-[150%] tracking-[0.16px]">
                {t("section2.items.marketing.body")}
              </p>
            </li>

            <li>
              <p className="text-black font-semibold text-base mb-2">
                • {t("section2.items.functional.title")}
              </p>
              <p className="text-black font-medium text-base ml-6 leading-[150%] tracking-[0.16px]">
                {t("section2.items.functional.body")}
              </p>
            </li>
          </ul>
        </section>

        {/* SECTION 3 – Consent management */}
        <section className="mb-[60px] lg:mb-[100px]">
          <h2 className="text-black font-semibold text-[32px] lg:text-[44px] leading-[100%] mb-8">
            {t("section3.title")}
          </h2>

          <div className="bg-gray-50 border border-gray-200 p-8 max-w-[770px]">
            <div className="space-y-6">
              {/* NECESSARY */}
              <div className="flex items-start justify-between bg-white p-4 rounded">
                <div className="flex items-start flex-1">
                  <input
                    type="checkbox"
                    id="necessary"
                    checked={true}
                    disabled
                    className="w-5 h-5 mt-1 mr-4 accent-black opacity-50 cursor-not-allowed"
                  />
                  <div>
                    <label
                      htmlFor="necessary"
                      className="text-black font-semibold text-base block mb-1"
                    >
                      {t("section3.categories.necessary.label")}
                    </label>
                    <p className="text-gray-600 text-sm">
                      {t("section3.categories.necessary.helper")}
                    </p>
                  </div>
                </div>
              </div>

              {/* ANALYTICS */}
              <div className="flex items-start justify-between bg-white p-4 rounded">
                <div className="flex items-start flex-1">
                  <input
                    type="checkbox"
                    id="analytics"
                    checked={activeConsent.analytics}
                    onChange={(e) =>
                      setActiveConsent((prev) => ({
                        ...prev,
                        analytics: e.target.checked,
                      }))
                    }
                    className="w-5 h-5 mt-1 mr-4 accent-black cursor-pointer"
                  />
                  <div>
                    <label
                      htmlFor="analytics"
                      className="text-black font-semibold text-base block cursor-pointer mb-1"
                    >
                      {t("section3.categories.analytics.label")}
                    </label>
                    <p className="text-gray-600 text-sm">
                      {t("section3.categories.analytics.helper")}
                    </p>
                  </div>
                </div>
              </div>

              {/* MARKETING */}
              <div className="flex items-start justify-between bg-white p-4 rounded">
                <div className="flex items-start flex-1">
                  <input
                    type="checkbox"
                    id="marketing"
                    checked={activeConsent.marketing}
                    onChange={(e) =>
                      setActiveConsent((prev) => ({
                        ...prev,
                        marketing: e.target.checked,
                      }))
                    }
                    className="w-5 h-5 mt-1 mr-4 accent-black cursor-pointer"
                  />
                  <div>
                    <label
                      htmlFor="marketing"
                      className="text-black font-semibold text-base block cursor-pointer mb-1"
                    >
                      {t("section3.categories.marketing.label")}
                    </label>
                    <p className="text-gray-600 text-sm">
                      {t("section3.categories.marketing.helper")}
                    </p>
                  </div>
                </div>
              </div>

              {/* FUNCTIONAL */}
              <div className="flex items-start justify-between bg-white p-4 rounded">
                <div className="flex items-start flex-1">
                  <input
                    type="checkbox"
                    id="functional"
                    checked={activeConsent.functional}
                    onChange={(e) =>
                      setActiveConsent((prev) => ({
                        ...prev,
                        functional: e.target.checked,
                      }))
                    }
                    className="w-5 h-5 mt-1 mr-4 accent-black cursor-pointer"
                  />
                  <div>
                    <label
                      htmlFor="functional"
                      className="text-black font-semibold text-base block cursor-pointer mb-1"
                    >
                      {t("section3.categories.functional.label")}
                    </label>
                    <p className="text-gray-600 text-sm">
                      {t("section3.categories.functional.helper")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <AnimatedButton
                onClick={handleSavePreferences}
                ariaLabel={t("buttons.save.aria")}
                variant="cookieAccept"
                className="w-full sm:w-[271px] lg:w-[250px] h-[53px] rounded-none"
              >
                {t("buttons.save.label")}
              </AnimatedButton>

              <AnimatedButton
                onClick={handleAcceptAll}
                ariaLabel={t("buttons.acceptAll.aria")}
                variant="cookieDetailed"
                className="w-full sm:w-[283px] lg:w-[260px] h-[53px] rounded-none"
              >
                {t("buttons.acceptAll.label")}
              </AnimatedButton>
            </div>

            {feedbackMessage && (
              <p
                className="text-gray-600 text-xs mt-4 italic"
                aria-live="polite"
              >
                {feedbackMessage}
              </p>
            )}

            <p className="text-gray-500 text-xs mt-4">
              {t("section3.browserInfo")}
            </p>
          </div>
        </section>

        {/* SECTION 4 – Third-party cookies */}
        <section className="mb-[60px] lg:mb-[100px]">
          <h2 className="text-black font-semibold text-[32px] lg:text-[44px] mb-8 leading-[100%]">
            {t("section4.title")}
          </h2>

          <div className="grid md:grid-cols-2 gap-6 max-w-[770px]">
            <div className="bg-white border border-gray-200 p-6">
              <h3 className="text-black font-semibold text-[20px] mb-3">
                {t("section4.cards.googleFonts.title")}
              </h3>
              <p className="text-gray-600 text-sm">
                {t("section4.cards.googleFonts.body")}
              </p>
            </div>

            <div className="bg-white border border-gray-200 p-6">
              <h3 className="text-black font-semibold text-[20px] mb-3">
                {t("section4.cards.googleAnalytics.title")}
              </h3>
              <p className="text-gray-600 text-sm">
                {t("section4.cards.googleAnalytics.body")}
              </p>
            </div>

            <div className="bg-white border border-gray-200 p-6">
              <h3 className="text-black font-semibold text-[20px] mb-3">
                {t("section4.cards.formspree.title")}
              </h3>
              <p className="text-gray-600 text-sm">
                {t("section4.cards.formspree.body")}
              </p>
            </div>

            <div className="bg-white border border-gray-200 p-6">
              <h3 className="text-black font-semibold text-[20px] mb-3">
                {t("section4.cards.social.title")}
              </h3>
              <p className="text-gray-600 text-sm">
                {t("section4.cards.social.body")}
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 5 – Disable cookies in browser */}
        <section className="mb-[60px] lg:mb-[100px]">
          <h2 className="text-black font-semibold text-[32px] lg:text-[44px] mb-8 leading-[100%]">
            {t("section5.title")}
          </h2>

          <div className="bg-black text-white p-8 max-w-[770px]">
            <p className="font-semibold text-base mb-6">
              {t("section5.important")}
            </p>
            <p className="font-medium text-base mb-6">
              {t("section5.body")}
            </p>

            <div className="space-y-3 text-sm border-t border-white/20 pt-6">
              <p>{t("section5.browsers.chrome")}</p>
              <p>{t("section5.browsers.firefox")}</p>
              <p>{t("section5.browsers.safari")}</p>
              <p>{t("section5.browsers.edge")}</p>
            </div>
          </div>
        </section>

        {/* FOOTER INFO */}
        <div className="border-t border-gray-200 pt-8 max-w-[770px]">
          <p className="text-black font-semibold text-base mb-4">
            {t("footer.title")}
          </p>
          <p className="text-gray-600 text-sm">{t("footer.body")}</p>
        </div>
      </div>
    </div>
  );
}
