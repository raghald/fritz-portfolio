"use client";

import { useCallback, useEffect, useState } from "react";

import {
  CONSENT_EVENT,
  CONSENT_KEY,
  PREFERENCES_KEY,
  acceptAll as acceptAllImpl,
  hasDecision,
  readConsent,
  rejectAll as rejectAllImpl,
  saveCustom as saveCustomImpl,
  type ConsentCategories,
} from "@/lib/consent";

export type UseConsentResult = {
  /** Stored consent or null if the user hasn't decided yet. */
  consent: ConsentCategories | null;
  /** True once we've finished reading localStorage on the client. */
  ready: boolean;
  /** True if the user has made any decision (banner should stay hidden). */
  decided: boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  save: (consent: ConsentCategories) => void;
};

export function useConsent(): UseConsentResult {
  const [consent, setConsent] = useState<ConsentCategories | null>(null);
  const [ready, setReady] = useState(false);
  const [decided, setDecided] = useState(false);

  useEffect(() => {
    setConsent(readConsent());
    setDecided(hasDecision());
    setReady(true);

    const handleChange = (event: Event) => {
      const detail = (event as CustomEvent<ConsentCategories>).detail;
      setConsent(detail ?? readConsent());
      setDecided(hasDecision());
    };

    // Sync across tabs as well — localStorage events fire on other tabs only.
    const handleStorage = (event: StorageEvent) => {
      if (event.key === CONSENT_KEY || event.key === PREFERENCES_KEY) {
        setConsent(readConsent());
        setDecided(hasDecision());
      }
    };

    window.addEventListener(CONSENT_EVENT, handleChange);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener(CONSENT_EVENT, handleChange);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const acceptAll = useCallback(() => acceptAllImpl(), []);
  const rejectAll = useCallback(() => rejectAllImpl(), []);
  const save = useCallback((next: ConsentCategories) => saveCustomImpl(next), []);

  return { consent, ready, decided, acceptAll, rejectAll, save };
}
