import { assertPrivacySafeProps } from "@/analytics/normalize";

declare global {
  interface Window {
    umami?: {
      track: (event: string, data?: Record<string, string>) => void;
    };
  }
}

export interface AnalyticsProvider {
  track(event: string, props?: Record<string, string>): void;
  isEnabled(): boolean;
}

const DEFAULT_UMAMI_SCRIPT_URL = "https://cloud.umami.is/script.js";

function toPropStrings(props: Record<string, string>): Record<string, string> {
  return assertPrivacySafeProps(
    Object.fromEntries(
      Object.entries(props).map(([key, value]) => [key, String(value)]),
    ),
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

    window.umami?.track(event, props ? toPropStrings(props) : undefined);
  }
}

export function createUmamiProvider(): UmamiAnalyticsProvider {
  return new UmamiAnalyticsProvider(process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID);
}
