// app/[locale]/gallery/layout.tsx
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
  const path = `/${locale}/gallery`;

  const title = isPl
    ? "Galeria — Fritz Głowacki"
    : "Gallery — Fritz Glowacki";

  const description = isPl
    ? "Galeria moich prac i treści: short-form wideo, motion, eksperymenty wizualne i materiały z procesu. Zobacz, jak łączę design i storytelling."
    : "A gallery of my work and content: short-form video, motion, visual experiments and process snippets. See how I blend design and storytelling.";

  return {
    metadataBase: base,
    title,
    description,
    alternates: {
      canonical: path,
      languages: {
        en: "/en/gallery",
        pl: "/pl/gallery",
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

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
