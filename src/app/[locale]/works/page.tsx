// app/[locale]/works/page.tsx
export { generateStaticParams } from "../layout";

import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import WorksPageClient from "./WorksPageClient";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isPl = locale === "pl";

  const BASE = "https://www.fritzglowacki.com";
  const urlEn = `${BASE}/works/`;
  const urlPl = `${BASE}/pl/works/`;
  const url = isPl ? urlPl : urlEn;

  const title = isPl
    ? "Case study — zobacz moje realizacje — Fritz Głowacki"
    : "Case studies — selected works — Fritz Glowacki";

  const description = isPl
    ? "Zobacz wybrane case studies: web design, UI/UX i motion. Projekty od architektury informacji po finalny interfejs."
    : "Explore selected case studies in web design, UI/UX and motion — from information architecture to final UI.";

  return {
    metadataBase: new URL(BASE),
    title: { absolute: title },
    description,
    alternates: {
      canonical: url,
      languages: {
        en: urlEn,
        pl: urlPl,
        "x-default": urlEn,
      },
    },
    openGraph: {
      type: "website",
      locale: isPl ? "pl_PL" : "en_US",
      alternateLocale: isPl ? "en_US" : "pl_PL",
      url,
      title,
      description,
      siteName: "Fritz Glowacki Portfolio",
      images: [
        {
          url: "/images/OG.webp",
          width: 1200,
          height: 630,
          alt: isPl
            ? "Case study — Fritz Głowacki"
            : "Case studies — Fritz Glowacki",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/OG.webp"],
      creator: "@fritzglowacki",
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
  const { locale } = await params;
  setRequestLocale(locale);

  const isPl = locale === "pl";

  const seoH1 = isPl
    ? "Case study — zobacz moje realizacje — Fritz Głowacki"
    : "Case studies — selected works — Fritz Glowacki";

  const seoLead = isPl
    ? "Wybrane projekty z obszaru web designu, UI/UX i motion — od architektury informacji po dopracowany interfejs."
    : "Selected projects across web design, UI/UX and motion — from information architecture to polished interfaces.";

  return (
    <>
      <header className="sr-only">
        <h1>{seoH1}</h1>
        <p>{seoLead}</p>
      </header>
      <WorksPageClient />
    </>
  );
}
