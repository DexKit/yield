import { getUmamiScriptUrl } from "@/analytics/umami";

/** Privacy-friendly analytics via Umami (no cookies, no auto URL capture). */
export function Analytics() {
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

  if (!websiteId) return null;

  return (
    <script
      defer
      src={getUmamiScriptUrl()}
      data-website-id={websiteId}
      data-auto-track="false"
    />
  );
}
