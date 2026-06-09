#!/usr/bin/env node
// Generuje warianty responsive (srcset) dla największych obrazów statycznych:
//   - public/images/photo.webp (Intro on home, 2.1 MB → ~30-150 KB per variant)
//   - public/images/Hero/*.webp (3 portrety Hero, 361-801 KB → ~40-180 KB per variant)
//
// Uruchom: node scripts/optimize-photos.mjs
// Niedotykowe, można odpalić wielokrotnie — sharp nadpisuje warianty.
//
// next.config.ts ma `images: { unoptimized: true }` (wymóg output: "export"),
// więc Next nie generuje srcset za nas. Robimy to ręcznie + używamy <picture>
// w Intro.tsx / HeroMedia.tsx.

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

/**
 * @typedef {Object} Target
 * @property {string} src - ścieżka do oryginału (relatywna do projectRoot)
 * @property {number[]} widths - szerokości wariantów w px
 * @property {number} quality - 0–100, WebP quality
 */

/** @type {Target[]} */
const TARGETS = [
  {
    // Intro section na home. Renderowane jako 492×576 w Intro.tsx.
    // Oryginał: 4301×5004 (2.1 MB) — kompletny overkill.
    src: "public/images/photo.webp",
    widths: [492, 984],
    quality: 78,
  },
  {
    // Hero portret 1. Oryginał: 2209×2708 (361 KB).
    // Renderowane w photoWrap ~600px — generujemy 1x + 2x retina.
    src: "public/images/Hero/48C7C530-329B-4F4E-B84A-D53ED3B58B25.webp",
    widths: [600, 1200],
    quality: 78,
  },
  {
    // Hero portret 2. Oryginał: 3728×4970 (512 KB).
    src: "public/images/Hero/6672.webp",
    widths: [600, 1200],
    quality: 78,
  },
  {
    // Hero portret 3. Oryginał: 6240×4160 LANDSCAPE (801 KB).
    // Inna proporcja (3:2) niż pozostałe dwa portrety — może wymagać
    // dopasowania w object-fit przez CSS, ale wymiary OK.
    src: "public/images/Hero/9603.webp",
    widths: [600, 1200],
    quality: 76,
  },
];

const variantPath = (originalPath, width) => {
  const dir = path.dirname(originalPath);
  const base = path.basename(originalPath, path.extname(originalPath));
  return path.join(dir, `${base}-${width}w.webp`);
};

async function generate(target) {
  const absSrc = path.join(projectRoot, target.src);
  const original = await sharp(absSrc).metadata();
  const originalKb = (await fs.stat(absSrc)).size / 1024;

  console.log(
    `\n[${target.src}] oryginał: ${original.width}×${original.height} (${originalKb.toFixed(0)} KB)`
  );

  for (const w of target.widths) {
    if (w >= original.width) {
      console.log(`  ${w}w — pominięty (szerokość ≥ oryginału, brak sensu upscalować)`);
      continue;
    }

    const outPath = path.join(projectRoot, variantPath(target.src, w));
    await sharp(absSrc)
      .resize(w, null, { withoutEnlargement: true })
      .webp({ quality: target.quality, effort: 5 })
      .toFile(outPath);

    const newKb = (await fs.stat(outPath)).size / 1024;
    console.log(
      `  ${w}w → ${path.relative(projectRoot, outPath)} (${newKb.toFixed(0)} KB)`
    );
  }
}

async function main() {
  for (const target of TARGETS) {
    await generate(target);
  }
  console.log("\nDone.");
}

main().catch((err) => {
  console.error("[optimize-photos] błąd:", err);
  process.exit(1);
});
