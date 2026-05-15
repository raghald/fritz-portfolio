"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { useTranslations } from "@/lib/useTranslations";
import { localePath } from "@/i18n/routing";

export default function RootNotFound() {
  const locale = useLocale();
  const t = useTranslations("NotFound");

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      <h1 className="text-3xl md:text-4xl font-semibold mb-4">
        {t("title")}
      </h1>

      <p className="text-sm md:text-base text-white/70 max-w-md text-center mb-6">
        {t("desc")}
      </p>

      <Link
        href={localePath(locale)}
        className="underline underline-offset-4 text-white/90 hover:text-white transition-colors"
      >
        {t("back")}
      </Link>
    </div>
  );
}
