// app/[locale]/HomePageClient.tsx
"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "@/lib/useTranslations";
import Hero from "@/components/Sections/hero/Hero";
import Intro from "@/components/Sections/intro/Intro";
import Footer from "@/components/Sections/footer/Footer";
import OrnamentsShuffle from "@/components/Sections/hero/OrnamentsShuffle";

// SVG jako komponenty (SVGR) – z src/assets
import Ornament1 from "@/assets/Ornament1.svg";
import Ornament2 from "@/assets/Ornament2.svg";
import Ornament3 from "@/assets/Ornament3.svg";

// Fallback dla projektów – korzysta z tłumaczeń
function ProjectsShowcaseFallback() {
  const t = useTranslations("loading");

  return (
    <div className="w-full h-[400px] flex items-center justify-center">
      <div className="animate-pulse text-gray-400">
        {t("projects")}
      </div>
    </div>
  );
}

// Fallback dla TikToka – korzysta z tłumaczeń
function TikTokShowcaseFallback() {
  const t = useTranslations("loading");

  return (
    <div className="w-full h-[400px] flex items-center justify-center">
      <div className="animate-pulse text-gray-400">
        {t("content")}
      </div>
    </div>
  );
}

// Lazy load heavy components with dynamic imports
const ProjectsShowcase = dynamic(
  () => import("@/components/projects/ProjectsShowcase"),
  {
    loading: () => <ProjectsShowcaseFallback />,
    ssr: true,
  }
);

const TikTokShowcase = dynamic(
  () => import("@/components/Sections/tiktok/TikTokShowcase"),
  {
    loading: () => <TikTokShowcaseFallback />,
    ssr: false, // UI / “social proof”
  }
);

export default function HomePageClient() {
  // ✅ Regulacja tempa + kill switch
  const ORNAMENTS_ENABLED = true;
  const ORNAMENTS_INTERVAL_MS = 300;

  return (
    <div className="page-wrapper relative min-h-screen">
      {/* Navbar jest globalnie w NavbarWrapper (layout.tsx) */}

      <Hero
        rightOrnaments={
          <OrnamentsShuffle
            icons={[Ornament1, Ornament2, Ornament3]}
            intervalMs={ORNAMENTS_INTERVAL_MS}
            enabled={ORNAMENTS_ENABLED}
            className="h-7 w-7 text-white/90"
          />
        }
      />

      {/* z-index hero/footer reveal sterowany w SmoothScroll przez lenis.on("scroll") */}
      <main className="main-content relative z-20 bg-white">
        <Intro />
      </main>

      {/* ✅ Sticky działa, bo to jest poza transformowanym wrapperem */}
      <ProjectsShowcase />

      {/* TikTok: UI / social proof */}
      <TikTokShowcase className="last-section" />

      <Footer />
      {/* ContactPopup siedzi w ContactPopupProvider, nie tutaj */}
    </div>
  );
}
