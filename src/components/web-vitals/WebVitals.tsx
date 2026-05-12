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
 * Results are logged to console in development and can be sent to analytics in production
 * 
 * Good thresholds:
 * - LCP: < 2.5s (good), < 4s (needs improvement), > 4s (poor)
 * - INP: < 200ms (good), < 500ms (needs improvement), > 500ms (poor)
 * - CLS: < 0.1 (good), < 0.25 (needs improvement), > 0.25 (poor)
 */

function sendToAnalytics(metric: Metric) {
  // Log to console in development
  if (process.env.NODE_ENV === "development") {
    console.log(`[Web Vitals] ${metric.name}:`, {
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
    });
  }

  // In production, send to your analytics service
  // Example for Google Analytics:
  // if (window.gtag) {
  //   window.gtag('event', metric.name, {
  //     value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
  //     event_category: 'Web Vitals',
  //     event_label: metric.id,
  //     non_interaction: true,
  //   });
  // }

  // Example for Vercel Analytics:
  // if (window.va) {
  //   window.va('event', {
  //     name: metric.name,
  //     data: {
  //       value: metric.value,
  //       rating: metric.rating,
  //     },
  //   });
  // }
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
