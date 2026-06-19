import type { Metadata } from "next";
import { absoluteUrl, SITE_NAME } from "@/lib/seo/site";

const DEFAULT_OG_IMAGE = absoluteUrl("/opengraph-image");

export function buildContentPageMetadata(
  path: string,
  title: string,
  description: string,
): Metadata {
  const url = absoluteUrl(path);

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      url,
      title,
      description,
      locale: "en_US",
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
