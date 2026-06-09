// app/[locale]/about/layout.tsx
import type { Metadata } from "next";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isPl = locale === "pl";

  const BASE = "https://www.fritzglowacki.com";
  const urlEn = `${BASE}/about/`;
  const urlPl = `${BASE}/pl/about/`;
  const url = isPl ? urlPl : urlEn;

  const title = isPl
    ? "O mnie — Fritz Głowacki"
    : "About — Fritz Glowacki";

  const description = isPl
    ? "Poznaj Fryderyka Głowackiego (Fritz) — grafika i web / UI/UX designera. Web design, branding, motion i podejście oparte na standardach."
    : "Learn more about Fryderyk Glowacki (Fritz) — web & UI/UX designer working across web design, branding and motion.";

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
            ? "O mnie — Fritz Głowacki"
            : "About — Fritz Glowacki",
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

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
