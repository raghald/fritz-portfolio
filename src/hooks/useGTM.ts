"use client";

import { useCallback } from "react";

interface GTMEvent {
  event: string;
  [key: string]: unknown;
}

/**
 * Custom hook for tracking events with Google Tag Manager
 * @example
 * const { trackEvent } = useGTM();
 * trackEvent('button_click', { button_name: 'Contact', page: '/about' });
 */
export function useGTM() {
  const trackEvent = useCallback(
    (eventName: string, eventData?: Record<string, unknown>) => {
      if (typeof window !== "undefined" && window.dataLayer) {
        const gtmEvent: GTMEvent = {
          event: eventName,
          ...eventData,
          timestamp: new Date().toISOString(),
          page_path: window.location.pathname,
          page_title: document.title,
        };

        window.dataLayer.push(gtmEvent);

        // Optional: Log in development
        if (process.env.NODE_ENV === "development") {
          console.log("GTM Event:", gtmEvent);
        }
      }
    },
    []
  );

  const trackPageView = useCallback(
    (pagePath?: string, pageTitle?: string) => {
      trackEvent("page_view", {
        page_path: pagePath || window.location.pathname,
        page_title: pageTitle || document.title,
      });
    },
    [trackEvent]
  );

  const trackButtonClick = useCallback(
    (buttonName: string, additionalData?: Record<string, unknown>) => {
      trackEvent("button_click", {
        button_name: buttonName,
        ...additionalData,
      });
    },
    [trackEvent]
  );

  const trackFormSubmit = useCallback(
    (formName: string, additionalData?: Record<string, unknown>) => {
      trackEvent("form_submit", {
        form_name: formName,
        ...additionalData,
      });
    },
    [trackEvent]
  );

  const trackVideoInteraction = useCallback(
    (
      action: "play" | "pause" | "complete",
      videoName: string,
      additionalData?: Record<string, unknown>
    ) => {
      trackEvent("video_interaction", {
        action,
        video_name: videoName,
        ...additionalData,
      });
    },
    [trackEvent]
  );

  return {
    trackEvent,
    trackPageView,
    trackButtonClick,
    trackFormSubmit,
    trackVideoInteraction,
  };
}
