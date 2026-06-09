import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isPl = locale === "pl";

  const BASE = "https://www.fritzglowacki.com";
  const urlEn = `${BASE}/cookies/`;
  const urlPl = `${BASE}/pl/cookies/`;
  const url = isPl ? urlPl : urlEn;

  const title = isPl
    ? "Polityka cookies — Fritz Głowacki"
    : "Cookie Policy — Fritz Glowacki";

  const description = isPl
    ? "Dowiedz się, jak ta strona używa plików cookie i jak możesz zarządzać swoimi preferencjami."
    : "Learn how this site uses cookies and how you can manage your preferences.";

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
    },
    // Cookies to strona prawna / niskiej wartości dla SEO — noindex zostawia ją
    // dostępną dla użytkownika i linkowalną (footer), ale wycina z wyników wyszukiwania.
    // follow: true — crawler może iść za linkami stąd (np. do home).
    robots: {
      index: false,
      follow: true,
      googleBot: {
        index: false,
        follow: true,
      },
    },
  };
}

export default function CookiePolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
