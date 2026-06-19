import { assertPrivacySafeProps } from "@/analytics/normalize";
import { getUmamiApiHost } from "@/analytics/umami";

function getSiteOrigin(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://yield.dexkit.com";
}

function getUmamiWebsiteId(): string | undefined {
  return process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
}

/** Server-side Umami events — no wallet/ENS data in props. */
export async function trackServerEvent(
  name: string,
  props?: Record<string, string>,
  pageUrl?: string,
): Promise<void> {
  const websiteId = getUmamiWebsiteId();
  const host = getUmamiApiHost();

  if (!websiteId || !host) {
    return;
  }

  const safeProps = props ? assertPrivacySafeProps(props) : undefined;

  try {
    await fetch(`${host}/api/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "YieldByDexKit/1.0",
      },
      body: JSON.stringify({
        type: "event",
        payload: {
          website: websiteId,
          url: pageUrl ?? getSiteOrigin(),
          name,
          ...(safeProps ? { data: safeProps } : {}),
        },
      }),
      keepalive: true,
    });
  } catch {
    // Analytics must never break product flows.
  }
}
