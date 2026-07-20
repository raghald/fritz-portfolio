// app/[locale]/about/page.tsx
// Server component. Kanoniczny H1 renderuje IntroAbout jako widoczny <h1>
// (hybrydowy: widoczny tekst + sr-only suffix SEO) — przy output: "export"
// komponent kliencki jest prerenderowany do statycznego HTML.
import React from "react";
import { setRequestLocale } from "next-intl/server";
import AboutPageClient from "./AboutPageClient";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AboutPageClient />;
}
