// app/[locale]/about/page.tsx
// Server component — H1 + lead trafiają do statycznego HTML.
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

  const isPl = locale === "pl";

  const seoH1 = isPl
    ? "O mnie — Fryderyk Głowacki (Fritz), grafik i web / UI/UX designer"
    : "About — Fryderyk Glowacki (Fritz), web & UI/UX designer";

  const seoLead = isPl
    ? "Poznaj moje doświadczenie w web designie, UI/UX, brandingu i motion — podejście oparte na standardach, procesie i wdrożeniu."
    : "Learn about my approach to web design, UI/UX, branding and motion — standards-driven, process-focused and implementation-aware.";

  return (
    <>
      <header className="sr-only">
        <h1>{seoH1}</h1>
        <p>{seoLead}</p>
      </header>
      <AboutPageClient />
    </>
  );
}
