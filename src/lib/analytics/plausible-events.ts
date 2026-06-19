/** Plausible custom events — privacy-friendly, no user profiling. */

export type ShareAnalyticsPlatform =
  | "x"
  | "telegram"
  | "discord"
  | "linkedin"
  | "copy_link";

declare global {
  interface Window {
    plausible?: (
      event: string,
      options?: { props?: Record<string, string> },
    ) => void;
  }
}

function track(event: string, props?: Record<string, string>): void {
  if (typeof window === "undefined") return;
  window.plausible?.(event, props ? { props } : undefined);
}

export function trackShareClick(platform: ShareAnalyticsPlatform): void {
  track("Share Click", { platform });
}

export function trackCardDownload(): void {
  track("Card Download");
}
