// Google Consent Mode v2 bootstrap.
//
// Must render BEFORE any Google script (GTM / GA / Ads). It is rendered as a
// plain inline <script>, so it runs synchronously while the browser parses the
// document — before any `strategy="afterInteractive"` script from next/script
// has had a chance to start.
//
// What it does:
//   1. Initialises window.dataLayer and the gtag() shim.
//   2. Sets all consent categories to "denied" as the default (Consent Mode v2).
//   3. Reads the user's stored decision (if any) and immediately pushes a
//      consent update, so GTM/GA load with the correct state on the very first
//      hit instead of needing a second event.
export default function ConsentDefaults() {
  // The script is intentionally minimal and self-contained — it cannot import
  // anything because it runs before any module is hydrated.
  const code = `
    (function () {
      try {
        window.dataLayer = window.dataLayer || [];
        function gtag() { window.dataLayer.push(arguments); }
        window.gtag = window.gtag || gtag;

        gtag('consent', 'default', {
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied',
          analytics_storage: 'denied',
          functionality_storage: 'denied',
          personalization_storage: 'denied',
          security_storage: 'granted',
          wait_for_update: 500
        });

        var decision = null;
        var raw = null;
        try {
          decision = localStorage.getItem('cookieConsent');
          raw = localStorage.getItem('cookiePreferences');
        } catch (e) { /* storage unavailable */ }

        if (decision && raw) {
          try {
            var p = JSON.parse(raw);
            if (p && p.v === 2) {
              gtag('consent', 'update', {
                analytics_storage: p.analytics ? 'granted' : 'denied',
                security_storage: 'granted'
              });
            }
          } catch (e) { /* malformed prefs */ }
        }
      } catch (e) { /* never break the page over consent init */ }
    })();
  `;

  return (
    <script
      id="consent-defaults"
      dangerouslySetInnerHTML={{ __html: code }}
    />
  );
}
