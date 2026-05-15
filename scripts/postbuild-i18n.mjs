#!/usr/bin/env node
// Po `next build` (output: "export") struktura `out/` ma podkatalogi
// dla każdego locale: out/en/, out/pl/. Strategia URL portfolio:
// EN bez prefiksu (kanoniczna), PL pod /pl/. Dlatego po buildzie
// promujemy zawartość `out/en/*` do roota `out/` i usuwamy `out/en/`.
//
// out/pl/ zostaje nietknięty — to nadal właściwa ścieżka PL.

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, "..");
const outDir = path.join(projectRoot, "out");
const enDir = path.join(outDir, "en");

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function moveEntry(src, dest) {
  // Jeśli dest istnieje (np. plik z public/ już skopiowany do out/),
  // wersja z out/en/ ma pierwszeństwo bo to wygenerowana strona EN.
  if (await exists(dest)) {
    await fs.rm(dest, { recursive: true, force: true });
  }
  await fs.rename(src, dest);
}

async function main() {
  if (!(await exists(outDir))) {
    console.error("[postbuild-i18n] out/ nie istnieje — pomijam.");
    process.exit(0);
  }
  if (!(await exists(enDir))) {
    console.error("[postbuild-i18n] out/en/ nie istnieje — pomijam.");
    process.exit(0);
  }

  const entries = await fs.readdir(enDir);
  for (const name of entries) {
    const src = path.join(enDir, name);
    const dest = path.join(outDir, name);
    await moveEntry(src, dest);
    console.log(`[postbuild-i18n] ${name}: out/en/${name} → out/${name}`);
  }

  await fs.rm(enDir, { recursive: true, force: true });
  console.log("[postbuild-i18n] usunięto pusty out/en/.");

  // Sanity check: out/pl/ powinno istnieć po buildzie z PL.
  const plDir = path.join(outDir, "pl");
  if (!(await exists(plDir))) {
    console.warn("[postbuild-i18n] UWAGA: out/pl/ nie istnieje — sprawdź build PL.");
  } else {
    console.log("[postbuild-i18n] out/pl/ obecne — OK.");
  }
}

main().catch((err) => {
  console.error("[postbuild-i18n] błąd:", err);
  process.exit(1);
});
