// app/[locale]/gallery/page.tsx
// Server component. Kanoniczny H1 renderuje IntroGallery jako widoczny <h1>
// (hybrydowy: widoczny tekst + sr-only suffix SEO) — przy output: "export"
// komponent kliencki jest prerenderowany do statycznego HTML.
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

  return <GalleryPageClient />;
}
