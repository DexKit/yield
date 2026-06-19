import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/site";

/**
 * Static sitemap seed. Wallet profile URLs are discovered via crawl and inbound links;
 * a dynamic wallet index is planned — see docs/seo/ARCHITECTURE.md.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ];
}
