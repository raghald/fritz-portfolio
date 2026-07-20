// app/[locale]/page.tsx
// Server component. Kanoniczny H1 renderuje Hero (AnimatedTitle jako <h1>,
// podejście hybrydowe) — przy output: "export" komponent kliencki jest
// prerenderowany do statycznego HTML, więc H1 trafia do out/index.html.
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

  return <HomePageClient />;
}
