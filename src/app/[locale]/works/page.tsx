// app/[locale]/works/page.tsx
export { generateStaticParams } from "../layout";

import type { Metadata } from "next";
import WorksPageClient from "./WorksPageClient";
import { locales } from "../layout";

type Locale = (typeof locales)[number];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isPl = locale === "pl";

  const base = new URL("https://www.fritzglowacki.com");
  const path = `/${locale}/works`;

  const title = isPl
    ? "Case study — zobacz moje realizacje — Fritz Głowacki"
    : "Case studies — selected works — Fritz Glowacki";

  const description = isPl
    ? "Zobacz wybrane case studies: web design, UI/UX, branding i motion. Projekty od architektury informacji po finalny interfejs."
    : "Explore selected case studies in web design, UI/UX, branding and motion — from information architecture to final UI.";

  return {
    metadataBase: base,
    title,
    description,
    alternates: {
      canonical: path,
      languages: {
        en: "/en/works",
        pl: "/pl/works",
      },
    },
    openGraph: {
      type: "website",
      locale: isPl ? "pl_PL" : "en_US",
      url: path,
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function WorksPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  await params;
  return <WorksPageClient />;
}
