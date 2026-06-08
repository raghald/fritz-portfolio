// src/app/[locale]/layout.tsx
import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import localFont from "next/font/local";
import React from "react";

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
// PageTransition tymczasowo wyłączone — odkomentuj import i wrapper w JSX, by włączyć z powrotem.
// import PageTransition from "@/components/transition/PageTransition";
import CookieConsent from "@/components/Sections/cookie-consent/CookieConsent";
import WebVitals from "@/components/web-vitals/WebVitals";
import ConsentDefaults from "@/components/Sections/analytics/ConsentDefaults";
import GoogleTagManager from "@/components/Sections/analytics/GoogleTagManager";
import GoogleAnalytics from "@/components/Sections/analytics/GoogleAnalytics";
import JsonLd from "@/components/JsonLd";
import { ContactPopupProvider } from "@/hooks/ContactPopupContext";
import { setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";

const BASE_URL = "https://www.fritzglowacki.com";

// --- Viewport (Next 15: osobny export poza Metadata) ---
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#E2E2E2" },
    { media: "(prefers-color-scheme: dark)", color: "#111111" },
  ],
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
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
  const urlEn = `${baseUrl}/`;
  const urlPl = `${baseUrl}/pl/`;
  const url = isPl ? urlPl : urlEn;

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
        en: urlEn,
        pl: urlPl,
        "x-default": urlEn,
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
      alternateLocale: isPl ? "en_US" : "pl_PL",
      url,
      title: ogTitle,
      description,
      siteName: "Fritz Glowacki Portfolio",
      images: [
        {
          url: "/images/OG.webp",
          width: 1200,
          height: 630,
          alt: "Portfolio — Fritz Glowacki",
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

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);

  let messages;
  try {
    messages = (await import(`@/messages/${locale}.json`)).default;
  } catch {
    notFound();
  }

  const isPl = locale === "pl";
  const urlEn = `${BASE_URL}/`;
  const urlPl = `${BASE_URL}/pl/`;
  const url = isPl ? urlPl : urlEn;

  // JSON-LD: Person (Fritz) + WebSite. Wstawiane statycznie do <body>
  // w server component — widoczne dla crawlerów bez wymogu hydratacji.
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${BASE_URL}/#person`,
    name: "Fryderyk Głowacki",
    alternateName: ["Fritz Glowacki", "Fritz Głowacki", "Fryderyk Glowacki"],
    givenName: "Fryderyk",
    familyName: "Głowacki",
    jobTitle: isPl
      ? "Projektant Web, UI/UX, brandingu i motion"
      : "Web, UI/UX, Brand & Motion Designer",
    description: isPl
      ? "Designer i projektant: strony internetowe, UI/UX, branding i motion."
      : "Web, UI/UX, Brand & Motion Designer working across web, brand and motion systems.",
    url,
    image: `${BASE_URL}/images/photo.webp`,
    email: "info@fritzglowacki.com",
    telephone: "+48506989423",
    knowsLanguage: ["pl", "en"],
    sameAs: [
      "https://www.instagram.com/fritzglowacki/",
      "https://www.linkedin.com/in/fryderyk-glowacki/",
    ],
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    url: urlEn,
    name: "Fritz Glowacki — Portfolio",
    inLanguage: isPl ? "pl-PL" : "en-US",
    publisher: { "@id": `${BASE_URL}/#person` },
  };

  return (
    <html lang={locale} className={inter.variable}>
      <body>
        {/* Consent Mode v2 defaults — inline <script> so it runs synchronously
            before any of next/script's afterInteractive scripts (GTM/GA) can start. */}
        <ConsentDefaults />
        <JsonLd data={personJsonLd} />
        <JsonLd data={websiteJsonLd} />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ContactPopupProvider>
            {/* PageTransition tymczasowo wyłączone — przywróć wrapper, by włączyć przejścia z powrotem.
                Globalny Suspense został celowo usunięty — useSearchParams w LanguageToggle
                (wewnątrz Navbar) ma już własny Suspense boundary, więc tutaj nie potrzeba
                bailout-bezpieczeństwa, a bez wrappera reszta drzewa pre-renderuje się do statycznego HTML. */}
            <GoogleTagManager />
            <GoogleAnalytics />
            <WebVitals />
            <NavbarWrapper />
            <SmoothScroll>
              {children}
              <CookieConsent />
            </SmoothScroll>
          </ContactPopupProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
