"use client";

import { useEffect, useState } from "react";

import AnimatedButton from "@/components/AnimatedButton";
import RevealOnScroll from "@/components/RevealOnScroll";
import { useConsent } from "@/hooks/useConsent";
import { ALL_DENIED, ALL_GRANTED, type ConsentCategories } from "@/lib/consent";
import { useTranslations } from "@/lib/useTranslations";

export default function CookiesContent() {
  const t = useTranslations("cookiePolicy");
  const { consent, ready, acceptAll, rejectAll, save } = useConsent();

  const [activeConsent, setActiveConsent] = useState<ConsentCategories>(ALL_DENIED);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Sync UI with whatever the central consent store holds, including changes
  // coming from the banner or another tab.
  useEffect(() => {
    if (!ready) return;
    setActiveConsent(consent ?? ALL_DENIED);
  }, [consent, ready]);

  // Auto-clear the confirmation message so it doesn't linger forever.
  useEffect(() => {
    if (!feedbackMessage) return;
    const id = window.setTimeout(() => setFeedbackMessage(null), 4000);
    return () => window.clearTimeout(id);
  }, [feedbackMessage]);

  const handleAcceptAll = () => {
    setActiveConsent(ALL_GRANTED);
    acceptAll();
    setFeedbackMessage(t("feedback.acceptAll"));
  };

  const handleRejectAll = () => {
    setActiveConsent(ALL_DENIED);
    rejectAll();
    setFeedbackMessage(t("feedback.rejectAll"));
  };

  const handleSavePreferences = () => {
    save(activeConsent);
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
          <RevealOnScroll start="top 90%" end="top 60%">
            <h2 className="text-black font-semibold text-[32px] lg:text-[44px] leading-[100%] mb-8">
              {t("section1.title")}
            </h2>
          </RevealOnScroll>
          <RevealOnScroll start="top 90%" end="top 50%">
            <p className="text-black font-medium text-base leading-[150%] tracking-[0.16px] max-w-[770px]">
              {t("section1.body")}
            </p>
          </RevealOnScroll>
        </section>

        {/* SECTION 2 – What cookies do we use */}
        <section className="mb-[60px] lg:mb-[100px]">
          <RevealOnScroll start="top 90%" end="top 60%">
            <h2 className="text-black font-semibold text-[32px] lg:text-[44px] leading-[100%] mb-8">
              {t("section2.title")}
            </h2>
          </RevealOnScroll>

          <RevealOnScroll start="top 90%" end="top 50%">
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
          </RevealOnScroll>
        </section>

        {/* SECTION 3 – Consent management */}
        <section className="mb-[60px] lg:mb-[100px]">
          <RevealOnScroll start="top 90%" end="top 60%">
            <h2 className="text-black font-semibold text-[32px] lg:text-[44px] leading-[100%] mb-8">
              {t("section3.title")}
            </h2>
          </RevealOnScroll>

          <RevealOnScroll start="top 90%" end="top 50%">
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
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 mt-8">
              <AnimatedButton
                onClick={handleSavePreferences}
                ariaLabel={t("buttons.save.aria")}
                variant="cookieAccept"
                className="w-full sm:w-[230px] h-[53px] rounded-none"
              >
                {t("buttons.save.label")}
              </AnimatedButton>

              <AnimatedButton
                onClick={handleAcceptAll}
                ariaLabel={t("buttons.acceptAll.aria")}
                variant="cookieDetailed"
                className="w-full sm:w-[210px] h-[53px] rounded-none"
              >
                {t("buttons.acceptAll.label")}
              </AnimatedButton>

              <AnimatedButton
                onClick={handleRejectAll}
                ariaLabel={t("buttons.rejectAll.aria")}
                variant="cookieDetailed"
                className="w-full sm:w-[210px] h-[53px] rounded-none"
              >
                {t("buttons.rejectAll.label")}
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
          </RevealOnScroll>
        </section>

        {/* SECTION 4 – Third-party cookies */}
        <section className="mb-[60px] lg:mb-[100px]">
          <RevealOnScroll start="top 90%" end="top 60%">
            <h2 className="text-black font-semibold text-[32px] lg:text-[44px] mb-8 leading-[100%]">
              {t("section4.title")}
            </h2>
          </RevealOnScroll>

          <RevealOnScroll start="top 90%" end="top 50%">
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
          </RevealOnScroll>
        </section>

        {/* SECTION 5 – Disable cookies in browser */}
        <section className="mb-[60px] lg:mb-[100px]">
          <RevealOnScroll start="top 90%" end="top 60%">
            <h2 className="text-black font-semibold text-[32px] lg:text-[44px] mb-8 leading-[100%]">
              {t("section5.title")}
            </h2>
          </RevealOnScroll>

          <RevealOnScroll start="top 90%" end="top 50%">
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
          </RevealOnScroll>
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
