import { AnalyticsEvents } from "@/analytics/events";
import {
  assertPrivacySafeProps,
  classifyPageType,
  sanitizeAnalyticsPath,
  sanitizeAnalyticsTitle,
} from "@/analytics/normalize";

declare global {
  interface Window {
    umami?: {
      track: {
        (): void;
        (event: string, data?: Record<string, string>): void;
        (
          payload:
            | Record<string, unknown>
            | ((props: Record<string, unknown>) => Record<string, unknown>),
        ): void;
      };
    };
  }
}

export interface AnalyticsProvider {
  track(event: string, props?: Record<string, string>): void;
  trackPageView(pathname: string): void;
  isEnabled(): boolean;
}

const DEFAULT_UMAMI_SCRIPT_URL = "https://cloud.umami.is/script.js";
const UMAMI_READY_RETRIES = 30;
const UMAMI_READY_INTERVAL_MS = 100;

function toPropStrings(props: Record<string, string>): Record<string, string> {
  return assertPrivacySafeProps(
    Object.fromEntries(
      Object.entries(props).map(([key, value]) => [key, String(value)]),
    ),
  );
}

function whenUmamiReady(run: () => void, attempt = 0): void {
  if (typeof window === "undefined") {
    return;
  }

  if (window.umami?.track) {
    run();
    return;
  }

  if (attempt >= UMAMI_READY_RETRIES) {
    return;
  }

  window.setTimeout(
    () => whenUmamiReady(run, attempt + 1),
    UMAMI_READY_INTERVAL_MS,
  );
}

export function getUmamiScriptUrl(): string {
  return process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL ?? DEFAULT_UMAMI_SCRIPT_URL;
}

export function getUmamiApiHost(): string | undefined {
  try {
    return new URL(getUmamiScriptUrl()).origin;
  } catch {
    return undefined;
  }
}

export class UmamiAnalyticsProvider implements AnalyticsProvider {
  constructor(private readonly websiteId: string | undefined) {}

  isEnabled(): boolean {
    return Boolean(this.websiteId);
  }

  track(event: string, props?: Record<string, string>): void {
    if (!this.isEnabled() || typeof window === "undefined") {
      return;
    }

    whenUmamiReady(() => {
      window.umami?.track(
        event,
        props ? toPropStrings(props) : undefined,
      );
    });
  }

  /** Sends a real Umami pageview (Overview) plus a custom page_view event (Events tab). */
  trackPageView(pathname: string): void {
    if (!this.isEnabled() || typeof window === "undefined") {
      return;
    }

    const pageType = classifyPageType(pathname);
    const url = sanitizeAnalyticsPath(pathname);
    const title = sanitizeAnalyticsTitle(pageType);

    whenUmamiReady(() => {
      const track = window.umami?.track;
      if (!track) {
        return;
      }

      // Overview: visitors, views, bounce rate
      track((props) => ({
        ...props,
        url,
        title,
      }));

      // Events tab: home vs wallet vs compare breakdown
      track(AnalyticsEvents.PAGE_VIEW, { pageType });
    });
  }
}

export function createUmamiProvider(): UmamiAnalyticsProvider {
  return new UmamiAnalyticsProvider(process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID);
}
