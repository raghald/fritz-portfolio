// app/[locale]/gallery/page.tsx
"use client";

import { useLocale } from "next-intl";
import IntroGallery from "@/components/Sections/intro/IntroGallery";
import GalleryGrid from "@/components/Sections/gallery/GalleryGrid";
import Footer from "@/components/Sections/footer/Footer";
import { useTranslations } from "@/lib/useTranslations";

export default function GalleryPage() {
  const t = useTranslations("gallery");
  const locale = useLocale() as "en" | "pl";
  const isPl = locale === "pl";

  const seoH1 = isPl
    ? "Galeria — motion, content i eksperymenty wizualne — Fritz Głowacki"
    : "Gallery — motion, content and visual experiments — Fritz Glowacki";

  const seoLead = isPl
    ? "Materiały z procesu, short-form wideo, motion i ujęcia zza kulis — miejsce, gdzie testuję rytm, obraz i storytelling."
    : "Process snippets, short-form video, motion and behind-the-scenes shots — a place where I explore rhythm, visuals and storytelling.";

  return (
    <div className="page-wrapper relative min-h-screen bg-white">
      <main className="main-content relative z-20" aria-label={t("pageAria")}>
        {/* ✅ Niewidoczne H1 + lead */}
        <header className="sr-only">
          <h1>{seoH1}</h1>
          <p>{seoLead}</p>
        </header>

        <div className="max-w-[1440px] mx-auto w-full">
          <section aria-label={t("introAria")}>
            <IntroGallery />
          </section>

          <section aria-label={t("gridAria")}>
            <GalleryGrid />
          </section>

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
