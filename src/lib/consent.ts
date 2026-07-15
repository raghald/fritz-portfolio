// Central consent management for cookies / Google Consent Mode v2.
// Single source of truth for:
//   - reading and writing the stored decision
//   - pushing `gtag('consent', 'update', …)` so Consent Mode reacts in runtime
//   - notifying React (and other) listeners that the decision changed

export type ConsentCategories = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
};

export type ConsentDecision = "accepted" | "rejected" | "custom";

export const CONSENT_KEY = "cookieConsent";
export const PREFERENCES_KEY = "cookiePreferences";
export const CONSENT_VERSION = 1;
export const CONSENT_EVENT = "cookieconsentchange";

export const ALL_DENIED: ConsentCategories = {
  necessary: true,
  analytics: false,
  marketing: false,
  functional: false,
};

export const ALL_GRANTED: ConsentCategories = {
  necessary: true,
  analytics: true,
  marketing: true,
  functional: true,
};

type StoredPreferences = {
  v: number;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
};

function safeLocalStorageGet(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeLocalStorageSet(key: string, value: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* storage unavailable (private mode, quota, etc.) */
  }
}

export function hasDecision(): boolean {
  // A decision counts only when the full, version-matching consent parses back.
  // Presence of the bare CONSENT_KEY is not enough: readConsent() returns null
  // for a missing/mismatched/corrupt PREFERENCES_KEY, which would otherwise
  // leave `consent === null && decided === true` and hide the banner wrongly.
  return readConsent() !== null;
}

export function readConsent(): ConsentCategories | null {
  const decision = safeLocalStorageGet(CONSENT_KEY);
  const raw = safeLocalStorageGet(PREFERENCES_KEY);
  if (!decision || !raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<StoredPreferences>;
    if (parsed.v !== CONSENT_VERSION) return null;
    return {
      necessary: true,
      analytics: parsed.analytics === true,
      marketing: parsed.marketing === true,
      functional: parsed.functional === true,
    };
  } catch {
    return null;
  }
}

function toGtagConsentMap(consent: ConsentCategories) {
  return {
    ad_storage: consent.marketing ? "granted" : "denied",
    ad_user_data: consent.marketing ? "granted" : "denied",
    ad_personalization: consent.marketing ? "granted" : "denied",
    analytics_storage: consent.analytics ? "granted" : "denied",
    functionality_storage: consent.functional ? "granted" : "denied",
    personalization_storage: consent.functional ? "granted" : "denied",
    security_storage: "granted",
  } as const;
}

// Cookies that GA4 / GTM set autonomously once tracking is allowed. They have
// a 2-year expiry, so revoking consent via Consent Mode v2 alone leaves them
// sitting in the browser. Deleting them on revoke gives a clean cut and means
// a re-accept generates a fresh client identifier instead of resurrecting the
// old one.
function clearAnalyticsCookies(): void {
  if (typeof document === "undefined") return;
  const host = window.location.hostname;
  const apex = host.replace(/^www\./, "");
  const names = document.cookie
    .split("; ")
    .map((cookie) => cookie.split("=")[0])
    .filter(
      (name) =>
        name === "_ga" ||
        name === "_gid" ||
        name.startsWith("_ga_") ||
        name.startsWith("_gat"),
    );
  // Cookies can only be cleared by the (name, domain, path) tuple they were
  // set with. We don't know the exact domain GA used, so we try the obvious
  // candidates: no domain attribute, the current host, and the bare apex.
  const domains = ["", host, `.${apex}`];
  for (const name of names) {
    for (const domain of domains) {
      const domainPart = domain ? `; domain=${domain}` : "";
      document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT${domainPart}`;
    }
  }
}

function pushConsentUpdate(consent: ConsentCategories): void {
  if (typeof window === "undefined") return;
  // Make sure dataLayer / gtag exist even if the defaults script didn't run yet
  // (e.g. blocked by an extension). Without this the consent update would be lost.
  window.dataLayer = window.dataLayer || ([] as unknown as Window["dataLayer"]);
  if (typeof window.gtag !== "function") {
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      (window.dataLayer as unknown as { push: (a: IArguments) => void }).push(arguments);
    } as unknown as Window["gtag"];
  }
  window.gtag("consent", "update", toGtagConsentMap(consent));
}

function dispatchChange(consent: ConsentCategories): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<ConsentCategories>(CONSENT_EVENT, { detail: consent }),
  );
}

export function writeConsent(
  consent: ConsentCategories,
  decision: ConsentDecision,
): void {
  const payload: StoredPreferences = {
    v: CONSENT_VERSION,
    analytics: consent.analytics,
    marketing: consent.marketing,
    functional: consent.functional,
  };
  safeLocalStorageSet(CONSENT_KEY, decision);
  safeLocalStorageSet(PREFERENCES_KEY, JSON.stringify(payload));
  if (!consent.analytics) {
    clearAnalyticsCookies();
  }
  pushConsentUpdate(consent);
  dispatchChange(consent);
}

export const acceptAll = (): void => writeConsent(ALL_GRANTED, "accepted");
export const rejectAll = (): void => writeConsent(ALL_DENIED, "rejected");
export const saveCustom = (consent: ConsentCategories): void =>
  writeConsent(consent, "custom");