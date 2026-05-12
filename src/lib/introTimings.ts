// src/lib/introTimings.ts

/**
 * AutoMs:
 * - number  → animacja startuje dokładnie w tym momencie (ms od startu Hero)
 * - "auto"  → start wyliczany automatycznie na podstawie poprzednich sekcji
 */
export type AutoMs = number | "auto";

/**
 * IntroTimings
 * Centralny kontroler całej sekwencji animacji w Hero.
 *
 * NOWOŚĆ:
 * - startOffsetMs → przesunięcie startu (ms) względem startMs (zarówno auto jak i number)
 *   np. startMs: "auto", startOffsetMs: 120  => "auto + 120ms"
 *   np. startMs: 900,   startOffsetMs: -80  => 820ms
 */
export type IntroTimings = {
  // ============================
  // TITLE — animowany tytuł (pisanie liter)
  // ============================

  titleStartMs: number;
  letterStaggerMs: number;
  letterFadeMs: number;

  // ============================
  // NAVBAR
  // ============================
  navbarExtraDelayMs: number;

  // ============================
  // TAGS
  // ============================
  tags: {
    startMs: AutoMs;

    /** przesunięcie startu tagów (ms) względem startMs */
    startOffsetMs?: number;

    gapAfterTitleMs: number;
    staggerMs: number;
    enterMs: number;
  };

  // ============================
  // ORNAMENTS
  // ============================
  ornaments: {
    startMs: AutoMs;

    /** przesunięcie startu ornamentów (ms) względem startMs */
    startOffsetMs?: number;

    gapAfterTagsMs: number;
    enterMs: number;
  };

  // ============================
  // SIDE COPY
  // ============================
  sideCopy: {
    startMs: AutoMs;

    /** przesunięcie startu sideCopy (ms) względem startMs */
    startOffsetMs?: number;

    enterMs: number;
  };

  // ============================
  // CTA
  // ============================
  cta: {
    startMs: AutoMs;

    /** przesunięcie startu CTA (ms) względem startMs */
    startOffsetMs?: number;

    gapAfterOrnamentsMs: number;
    enterMs: number;
  };
};

/**
 * Domyślne ustawienia Hero.
 * Zachowanie bez zmian, bo wszystkie offsety = 0 (albo undefined).
 *
 * Jeśli chcesz od razu wymusić różnice:
 * - sideCopy.startOffsetMs: 120  (wejdzie 120ms po ornamentach)
 * - cta.startOffsetMs: 200      (CTA później o 200ms)
 */
export const intro: IntroTimings = {
  // ===== TITLE =====
  titleStartMs: 0,
  letterStaggerMs: 100,
  letterFadeMs: 220,

  // ===== NAVBAR =====
  navbarExtraDelayMs: 0,

  // ===== TAGS =====
  tags: {
    startMs: "auto",
    startOffsetMs: 0, // <- możesz zmieniać
    gapAfterTitleMs: 180,
    staggerMs: 120,
    enterMs: 220,
  },

  // ===== ORNAMENTS =====
  ornaments: {
    startMs: "auto",
    startOffsetMs: 0, // <- możesz zmieniać
    gapAfterTagsMs: 20,
    enterMs: 60,
  },

  // ===== SIDE COPY =====
  sideCopy: {
    startMs: "auto",
    startOffsetMs: 0, // <- możesz zmieniać (np. 120)
    enterMs: 60,
  },

  // ===== CTA =====
  cta: {
    startMs: "auto",
    startOffsetMs: 0, // <- możesz zmieniać (np. 200)
    gapAfterOrnamentsMs: 40,
    enterMs: 120,
  },
};

// ============================
// HELPERY
// ============================

export const ms = (v: number) => v / 1000;

const applyOffset = (base: number, offset?: number) => base + (offset ?? 0);

export function calcTitleTotalMs(text: string, t: IntroTimings) {
  const letters = Math.max(1, text.length);
  return t.titleStartMs + (letters - 1) * t.letterStaggerMs + t.letterFadeMs;
}

export function calcTagsTotalMs(tagCount: number, startMs: number, t: IntroTimings) {
  const n = Math.max(1, tagCount);
  return startMs + (n - 1) * t.tags.staggerMs + t.tags.enterMs;
}

/**
 * resolveHeroTimeline
 * Wylicza realne starty (ms) dla bloków animacji w Hero.
 *
 * startMs:
 * - "auto" => wyliczamy na podstawie sekwencji
 * - number => bierzemy wprost
 *
 * startOffsetMs:
 * - dodajemy na końcu do wyliczonego startu (auto lub number)
 */
export function resolveHeroTimeline(params: {
  titleText: string;
  tagCount: number;
  timings: IntroTimings;
}) {
  const { titleText, tagCount, timings: t } = params;

  const titleEndMs = calcTitleTotalMs(titleText, t);

  // TAGS (auto => po tytule + gap)
  const tagsStartBase =
    t.tags.startMs === "auto" ? titleEndMs + t.tags.gapAfterTitleMs : t.tags.startMs;
  const tagsStartMs = applyOffset(tagsStartBase, t.tags.startOffsetMs);

  const tagsEndMs = calcTagsTotalMs(tagCount, tagsStartMs, t);

  // ORNAMENTS (auto => po tagach + gap)
  const ornamentsStartBase =
    t.ornaments.startMs === "auto"
      ? tagsEndMs + t.ornaments.gapAfterTagsMs
      : t.ornaments.startMs;
  const ornamentsStartMs = applyOffset(ornamentsStartBase, t.ornaments.startOffsetMs);

  // SIDE COPY (auto => razem z ornamentami)
  const sideCopyStartBase =
    t.sideCopy.startMs === "auto" ? ornamentsStartMs : t.sideCopy.startMs;
  const sideCopyStartMs = applyOffset(sideCopyStartBase, t.sideCopy.startOffsetMs);

  // CTA (auto => po ornamentach + gap)
  const ctaStartBase =
    t.cta.startMs === "auto"
      ? ornamentsStartMs + t.cta.gapAfterOrnamentsMs
      : t.cta.startMs;
  const ctaStartMs = applyOffset(ctaStartBase, t.cta.startOffsetMs);

  return {
    title: {
      startMs: t.titleStartMs,
      endMs: titleEndMs,
      durationMs: Math.max(0, titleEndMs - t.titleStartMs),
    },

    tags: {
      startMs: tagsStartMs,
      endMs: tagsEndMs,
      durationMs: Math.max(0, tagsEndMs - tagsStartMs),
      staggerMs: t.tags.staggerMs,
      enterMs: t.tags.enterMs,
    },

    ornaments: {
      startMs: ornamentsStartMs,
      enterMs: t.ornaments.enterMs,
    },

    sideCopy: {
      startMs: sideCopyStartMs,
      enterMs: t.sideCopy.enterMs,
    },

    cta: {
      startMs: ctaStartMs,
      enterMs: t.cta.enterMs,
    },
  };
}
