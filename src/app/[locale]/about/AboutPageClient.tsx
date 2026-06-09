"use client";

import IntroAbout from "@/components/Sections/intro/IntroAbout";
import Skills from "@/components/Sections/skills/Skills";
import WhatIDo from "@/components/Sections/intro/WhatIDo";
import MediaCarousel from "@/components/Sections/intro/MediaCarousel";
import Footer from "@/components/Sections/footer/Footer";
import { useFooterReveal } from "@/hooks/useFooterReveal";
import { useTranslations } from "@/lib/useTranslations";

export default function AboutPageClient() {
  useFooterReveal();

  const t = useTranslations("about");

  return (
    <div className="page-wrapper relative min-h-screen">
      <main className="main-content relative z-20 bg-white max-w-[1440px] mx-auto">
        {/* H1 + lead są renderowane serwerowo w app/[locale]/about/page.tsx (sr-only).
            Tutaj zostają tylko interaktywne sekcje. */}

        <section aria-label={t("introAria")}>
          <IntroAbout />
        </section>

        <section aria-label={t("skillsAria")}>
          <Skills />
        </section>

        <section aria-label={t("whatIDoAria")}>
          <WhatIDo />
        </section>

        <section aria-label={t("mediaCarouselAria")}>
          <MediaCarousel className="last-section" />
        </section>
      </main>

      <Footer />
    </div>
  );
}
