import Script from "next/script";
import { getUmamiScriptUrl } from "@/analytics/umami";

/** Privacy-friendly analytics via Umami (no cookies, sanitized page URLs). */
export function Analytics() {
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

  if (!websiteId) return null;

  return (
    <Script
      src={getUmamiScriptUrl()}
      data-website-id={websiteId}
      data-auto-track="false"
      strategy="afterInteractive"
    />
  );
}
