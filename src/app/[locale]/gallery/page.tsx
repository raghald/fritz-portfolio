// app/[locale]/gallery/page.tsx
// Server component — H1 + lead trafiają do statycznego HTML.
import React from "react";
import { setRequestLocale } from "next-intl/server";
import GalleryPageClient from "./GalleryPageClient";

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const isPl = locale === "pl";

  const seoH1 = isPl
    ? "Galeria — motion, content i eksperymenty wizualne — Fritz Głowacki"
    : "Gallery — motion, content and visual experiments — Fritz Glowacki";

  const seoLead = isPl
    ? "Materiały z procesu, short-form wideo, motion i ujęcia zza kulis — miejsce, gdzie testuję rytm, obraz i storytelling."
    : "Process snippets, short-form video, motion and behind-the-scenes shots — a place where I explore rhythm, visuals and storytelling.";

  return (
    <>
      <header className="sr-only">
        <h1>{seoH1}</h1>
        <p>{seoLead}</p>
      </header>
      <GalleryPageClient />
    </>
  );
}
