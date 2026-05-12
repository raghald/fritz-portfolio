"use client";

import { useLocale } from "next-intl";

import IntroAbout from "@/components/Sections/intro/IntroAbout";
import Skills from "@/components/Sections/skills/Skills";
import WhatIDo from "@/components/Sections/intro/WhatIDo";
import MediaCarousel from "@/components/Sections/intro/MediaCarousel";
import Footer from "@/components/Sections/footer/Footer";
import { useFooterReveal } from "@/hooks/useFooterReveal";
import { useTranslations } from "@/lib/useTranslations";

const SectionSpacer = () => <div className="h-[60px] lg:h-[100px]" />;

export default function AboutPageClient() {
  useFooterReveal();

  const t = useTranslations("about");
  const locale = useLocale() as "en" | "pl";
  const isPl = locale === "pl";

  const seoH1 = isPl
    ? "O mnie — Fryderyk Głowacki (Fritz), grafik i web / UI/UX designer"
    : "About — Fryderyk Glowacki (Fritz), web & UI/UX designer";

  const seoLead = isPl
    ? "Poznaj moje doświadczenie w web designie, UI/UX, brandingu i motion — podejście oparte na standardach, procesie i wdrożeniu."
    : "Learn about my approach to web design, UI/UX, branding and motion — standards-driven, process-focused and implementation-aware.";

  return (
    <div className="page-wrapper relative min-h-screen">
      <main className="main-content relative z-20 bg-white max-w-[1440px] mx-auto">
        <header className="sr-only">
          <h1>{seoH1}</h1>
          <p>{seoLead}</p>
        </header>

        <section aria-label={t("introAria")}>
          <IntroAbout />
        </section>

        <SectionSpacer />

        <section aria-label={t("skillsAria")}>
          <Skills />
        </section>

        <SectionSpacer />

        <section aria-label={t("whatIDoAria")}>
          <WhatIDo />
        </section>

        <SectionSpacer />

        <section aria-label={t("mediaCarouselAria")}>
          <MediaCarousel className="last-section" />
        </section>
      </main>

      <Footer />
    </div>
  );
}
