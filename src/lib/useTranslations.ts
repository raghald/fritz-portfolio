// /src/lib/useTranslations.ts
"use client";

import { useCallback } from "react";
import {
  useTranslations as useTranslationsBase,
  useLocale,
} from "next-intl";
import { fixWidows } from "@/utils/fixWidows";

export function useTranslations(namespace?: string) {
  const tBase = useTranslationsBase(namespace);
  const locale = useLocale();

  const t = useCallback(
    (
      key: Parameters<typeof tBase>[0],
      values?: Parameters<typeof tBase>[1]
    ) => {
      const value = tBase(key, values);

      if (typeof value === "string" && locale === "pl") {
        return fixWidows(value);
      }

      return value;
    },
    [tBase, locale]
  );

  return t;
}
