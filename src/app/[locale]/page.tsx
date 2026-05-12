// app/[locale]/page.tsx
import React from "react";
import HomePageClient from "./HomePageClient";

export const dynamicParams = false;

export function generateStaticParams() {
  return [
    { locale: "en" },
    { locale: "pl" },
  ];
}

export default function LocaleHomePage() {
  return <HomePageClient />;
}
