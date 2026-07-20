"use client";

import IntroGallery from "@/components/Sections/intro/IntroGallery";
import GalleryGrid from "@/components/Sections/gallery/GalleryGrid";
import Footer from "@/components/Sections/footer/Footer";
import { useTranslations } from "@/lib/useTranslations";

export default function GalleryPageClient() {
  const t = useTranslations("gallery");

  return (
    <div className="page-wrapper relative min-h-screen bg-white">
      <main id="main-content" tabIndex={-1} className="main-content relative z-20" aria-label={t("pageAria")}>
        {/* H1 + lead renderowane serwerowo w app/[locale]/gallery/page.tsx (sr-only). */}

        <div className="max-w-[1440px] mx-auto w-full">
          {/* IntroGallery i GalleryGrid mają własne <section aria-label> —
              bez zewnętrznych wrapperów, żeby nie dublować regionów. */}
          <IntroGallery />
          <GalleryGrid />

          <div className="h-[60px] lg:h-[100px]" />

          <div className="px-8 md:px-8 lg:px-[52px]">
            <div className="w-full border-t border-black" />
          </div>

          <div className="h-[60px] lg:h-[100px]" />
        </div>
      </main>

      <Footer />
    </div>
  );
}
