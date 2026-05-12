// Google Tag Manager & Google Analytics type declarations

interface GTMDataLayer {
  push(data: Record<string, unknown>): void;
}

interface GTMContainer {
  dataLayer: GTMDataLayer;
}

// Google Analytics gtag function
interface Gtag {
  (command: "config", targetId: string, config?: Record<string, unknown>): void;
  (command: "set", config: Record<string, unknown>): void;
  (
    command: "event",
    eventName: string,
    eventParams?: Record<string, unknown>
  ): void;
  (
    command: "consent",
    consentArg: string,
    consentParams: Record<string, unknown>
  ): void;
  (command: "js", date: Date): void;
}

declare global {
  interface Window {
    dataLayer: GTMDataLayer;
    google_tag_manager?: Record<string, GTMContainer>;
    gtag: Gtag;
  }
}

export {};
