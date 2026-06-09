"use client";

import { useEffect } from "react";
import { onCLS, onFCP, onLCP, onTTFB, onINP, type Metric } from "web-vitals";

/**
 * Web Vitals Monitoring Component
 *
 * Tracks Core Web Vitals:
 * - CLS (Cumulative Layout Shift): Visual stability
 * - INP (Interaction to Next Paint): Responsiveness (replaces FID)
 * - LCP (Largest Contentful Paint): Loading performance
 * - FCP (First Contentful Paint): Initial rendering
 * - TTFB (Time to First Byte): Server response time
 *
 * Good thresholds:
 * - LCP: < 2.5s (good), < 4s (needs improvement), > 4s (poor)
 * - INP: < 200ms (good), < 500ms (needs improvement), > 500ms (poor)
 * - CLS: < 0.1 (good), < 0.25 (needs improvement), > 0.25 (poor)
 *
 * W produkcji wysyła metryki do GA4 jako custom event "web_vitals"
 * (tylko gdy gtag jest dostępny — czyli user dał consent analytics).
 */

// `window.gtag: Gtag` jest zadeklarowany globalnie w src/types/gtm.d.ts.
// W runtime jednak nie zawsze istnieje (GTM/GA loadują się dopiero po consent
// analytics), więc używamy `typeof window.gtag === "function"` jako guard.

function sendToAnalytics(metric: Metric) {
  if (process.env.NODE_ENV === "development") {
    console.log(`[Web Vitals] ${metric.name}:`, {
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
    });
  }

  // GA4: gtag jest emitowany przez GoogleAnalytics.tsx tylko gdy consent.analytics
  // jest udzielony. Tutaj graceful skip jeśli nie istnieje — bez crashy i bez
  // wycieku metryk dla użytkowników bez zgody.
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  // CLS jest ułamkiem (0–1) — mnożymy ×1000 dla czytelnych liczb całkowitych w GA4.
  // Pozostałe metryki są w milisekundach, zaokrąglamy do najbliższego.
  const value = Math.round(
    metric.name === "CLS" ? metric.value * 1000 : metric.value
  );

  window.gtag("event", "web_vitals", {
    metric_name: metric.name,
    metric_value: value,
    metric_rating: metric.rating, // "good" | "needs-improvement" | "poor"
    metric_delta: Math.round(
      metric.name === "CLS" ? metric.delta * 1000 : metric.delta
    ),
    metric_id: metric.id,
    non_interaction: true,
  });
}

export default function WebVitals() {
  useEffect(() => {
    // Track all Core Web Vitals
    onCLS(sendToAnalytics);
    onFCP(sendToAnalytics);
    onLCP(sendToAnalytics);
    onTTFB(sendToAnalytics);
    onINP(sendToAnalytics);
  }, []);

  return null; // This component doesn't render anything
}
