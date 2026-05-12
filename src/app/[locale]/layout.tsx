// src/app/[locale]/layout.tsx
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import localFont from "next/font/local";
import React, { Suspense } from "react";

import "@/app/globals.css";

const inter = localFont({
  src: [
    {
      path: "../fonts/InterVariable.woff2",
      style: "normal",
      weight: "100 900",
    },
    {
      path: "../fonts/InterVariable-Italic.woff2",
      style: "italic",
      weight: "100 900",
    },
  ],
  variable: "--font-inter",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
});

import NavbarWrapper from "@/components/NavbarWrapper";
import SmoothScroll from "@/components/smooth-scroll/SmoothScroll";
import CookieConsent from "@/components/Sections/cookie-consent/CookieConsent";
import WebVitals from "@/components/web-vitals/WebVitals";
import GoogleTagManager from "@/components/Sections/analytics/GoogleTagManager";
import GoogleAnalytics from "@/components/Sections/analytics/GoogleAnalytics";
import { ContactPopupProvider } from "@/hooks/ContactPopupContext";
import { setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";

// Re-eksport dla zgodności z istniejącymi importami (works/page.tsx, about/layout.tsx, gallery/layout.tsx).
export const locales = routing.locales;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// --- generateMetadata: async + await params (Next 15 style) ---
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isPl = locale === "pl";

  const baseUrl = "https://www.fritzglowacki.com";
  const url = `${baseUrl}/${locale}`;

  const titleDefault = isPl
    ? "Fritz Glowacki — Designer: Web, UI/UX, Branding i Motion"
    : "Fritz Glowacki — Web, UI/UX, Brand & Motion Designer";

  const description = isPl
    ? "Designer i projektant: strony internetowe, UI/UX, branding i motion. Zobacz wybrane case studies i projekty — od koncepcji po finalny design."
    : "Web, UI/UX, Brand & Motion Designer. I design high-converting interfaces, cohesive brands, and motion systems. Explore selected case studies and projects.";

  const keywords = isPl
    ? [
        "grafik",
        "projektant ui ux",
        "projektant stron internetowych",
        "web designer",
        "branding",
        "identyfikacja wizualna",
        "motion design",
        "animacje ui",
        "design system",
        "Fritz Glowacki",
        "Fryderyk Głowacki",
      ]
    : [
        "web designer",
        "ui ux designer",
        "product designer",
        "brand designer",
        "motion designer",
        "motion design",
        "visual identity",
        "design systems",
        "Fritz Glowacki",
        "Fryderyk Głowacki",
      ];

  const ogTitle = "Fritz Glowacki — Portfolio";

  return {
    metadataBase: new URL(baseUrl),

    title: {
      default: titleDefault,
      template: "%s | Fritz Glowacki",
    },
    description,
    keywords,

    alternates: {
      canonical: url,
      languages: {
        en: `${baseUrl}/en`,
        pl: `${baseUrl}/pl`,
      },
    },

    authors: [{ name: "Fritz Glowacki" }],
    creator: "Fritz Glowacki",
    publisher: "Fritz Glowacki",
    category: "Design",
    applicationName: "Fritz Portfolio",

    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },

    openGraph: {
      type: "website",
      locale: isPl ? "pl_PL" : "en_US",
      url,
      title: ogTitle,
      description,
      siteName: "Fritz Glowacki Portfolio",
      images: [
        {
          url: "/images/OG.webp",
          width: 1200,
          height: 630,
          alt: isPl
            ? "Portfolio — Fritz Glowacki"
            : "Portfolio — Fritz Glowacki",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: ogTitle,
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

    appleWebApp: {
      title: "FRITZ",
      statusBarStyle: "black-translucent",
      capable: true,
    },

    icons: {
      icon: [
        { url: "/favicon.ico" },
        { url: "/icon1.png", sizes: "192x192", type: "image/png" },
      ],
      apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    },

    manifest: "/manifest.json",
  };
}

// --- The layout wrapper for localized pages ---
export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);

  let messages;
  try {
    messages = (await import(`@/messages/${locale}.json`)).default;
  } catch {
    notFound();
  }

  return (
    <html lang={locale} className={inter.variable}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ContactPopupProvider>
            <Suspense
              fallback={
                <div className="min-h-screen bg-white flex items-center justify-center">
                  <p className="text-black">Loading...</p>
                </div>
              }
            >
              <GoogleTagManager />
              <GoogleAnalytics />
              <WebVitals />
              <NavbarWrapper />
              <SmoothScroll>
                {children}
                <CookieConsent />
              </SmoothScroll>
            </Suspense>
          </ContactPopupProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
