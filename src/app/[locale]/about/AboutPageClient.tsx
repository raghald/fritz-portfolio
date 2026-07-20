"use client";

import IntroAbout from "@/components/Sections/intro/IntroAbout";
import Skills from "@/components/Sections/skills/Skills";
import WhatIDo from "@/components/Sections/intro/WhatIDo";
import MediaCarousel from "@/components/Sections/intro/MediaCarousel";
import Footer from "@/components/Sections/footer/Footer";
import { useFooterReveal } from "@/hooks/useFooterReveal";

export default function AboutPageClient() {
  useFooterReveal();

  return (
    <div className="page-wrapper relative min-h-screen">
      <main id="main-content" tabIndex={-1} className="main-content relative z-20 bg-white max-w-[1440px] mx-auto">
        {/* Każda sekcja jest samodzielnym landmarkiem (własny <section aria-label>
            w komponencie) — bez zewnętrznych wrapperów, żeby nie dublować regionów. */}
        <IntroAbout />
        <Skills />
        <WhatIDo />
        <MediaCarousel className="last-section" />
      </main>

      <Footer />
    </div>
  );
}
