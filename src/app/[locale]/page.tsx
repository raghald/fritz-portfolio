// app/[locale]/page.tsx
// Server component — gwarantuje, że H1 + lead trafiają do statycznego HTML
// (Next 15 + output: "export"). Animowane sekcje delegowane do HomePageClient.
import React from "react";
import { setRequestLocale } from "next-intl/server";
import HomePageClient from "./HomePageClient";

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "pl" }];
}

export default async function LocaleHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const isPl = locale === "pl";

  const seoH1 = isPl
    ? "Fryderyk Głowacki — projektant Web, UI/UX, brandingu i motion"
    : "Fryderyk Glowacki — Web, UI/UX, Brand & Motion Designer";

  const seoLead = isPl
    ? "Projektuję wysoko konwertujące interfejsy, spójne marki i systemy motion. Zobacz wybrane case studies i projekty."
    : "I design high-converting interfaces, cohesive brands and motion systems. Explore selected case studies and projects.";

  return (
    <>
      {/* Server-side SEO header — jeden, kanoniczny H1 per strona,
          dostępny dla crawlerów bez wymogu hydratacji JS. */}
      <header className="sr-only">
        <h1>{seoH1}</h1>
        <p>{seoLead}</p>
      </header>
      <HomePageClient />
    </>
  );
}
