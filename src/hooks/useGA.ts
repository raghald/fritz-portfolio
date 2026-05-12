"use client";

import { useCallback } from "react";

/**
 * Custom hook for tracking events with Google Analytics 4
 * @example
 * const { gtagEvent } = useGA();
 * gtagEvent('button_click', { button_name: 'Contact' });
 */
export function useGA() {
  const gtagEvent = useCallback(
    (eventName: string, eventParams?: Record<string, unknown>) => {
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", eventName, {
          ...eventParams,
          timestamp: new Date().toISOString(),
        });

        // Optional: Log in development
        if (process.env.NODE_ENV === "development") {
          console.log("GA Event:", eventName, eventParams);
        }
      }
    },
    []
  );

  const gtagPageView = useCallback((pageTitle?: string, pagePath?: string) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "page_view", {
        page_title: pageTitle || document.title,
        page_path: pagePath || window.location.pathname,
      });
    }
  }, []);

  const gtagPurchase = useCallback(
    (transactionId: string, value: number, currency = "USD") => {
      gtagEvent("purchase", {
        transaction_id: transactionId,
        value,
        currency,
      });
    },
    [gtagEvent]
  );

  const gtagConversion = useCallback(
    (conversionLabel: string, value?: number) => {
      gtagEvent("conversion", {
        send_to: conversionLabel,
        value,
      });
    },
    [gtagEvent]
  );

  return {
    gtagEvent,
    gtagPageView,
    gtagPurchase,
    gtagConversion,
  };
}
