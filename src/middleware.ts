// Aktywne tylko w `next dev`. Przy `next build` z `output: "export"`
// middleware jest pomijane (Apache + scripts/postbuild-i18n.mjs robią to samo
// statycznie na produkcji).
//
// Cel: w dev mode pozwolić wchodzić na czyste URL-e (`/`, `/about/`, `/works/`)
// i podmienić je transparentnie na rzeczywiste ścieżki `[locale]` (`/en/...`),
// żeby nie trzeba było ręcznie dopisywać `/en/`.

import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Pomijamy wszystko co ma kropkę (assety) i wewnętrzne ścieżki Next-a.
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
