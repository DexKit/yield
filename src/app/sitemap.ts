import type { MetadataRoute } from "next";
import { SITEMAP_CONTENT_PATHS, SITEMAP_WALLET_SLUGS } from "@/lib/constants/trust";
import { absoluteUrl, SITE_URL } from "@/lib/seo/site";

/**
 * Sitemap for crawl discovery. Wallet URLs are also linked from search results
 * and inbound shares; additional slugs can be added to SITEMAP_WALLET_SLUGS.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
  ];

  for (const slug of SITEMAP_WALLET_SLUGS) {
    entries.push({
      url: absoluteUrl(`/${encodeURIComponent(slug)}`),
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    });
  }

  for (const path of SITEMAP_CONTENT_PATHS) {
    entries.push({
      url: absoluteUrl(path),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    });
  }

  // Comparison and programmatic content pages — add here when shipped.

  return entries;
}
