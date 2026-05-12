// app/[locale]/about/layout.tsx
import type { Metadata } from "next";
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
  const path = `/${locale}/about`;

  const title = isPl
    ? "O mnie — Fritz Głowacki"
    : "About — Fritz Glowacki";

  const description = isPl
    ? "Poznaj Fryderyka Głowackiego (Fritz) — grafika i web / UI/UX designera. Web design, branding, motion i podejście oparte na standardach."
    : "Learn more about Fryderyk Glowacki (Fritz) — web & UI/UX designer working across web design, branding and motion.";

  return {
    metadataBase: base,
    title,
    description,
    alternates: {
      canonical: path,
      languages: {
        en: "/en/about",
        pl: "/pl/about",
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

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
