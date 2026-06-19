import type { Metadata } from "next";
import {
  absoluteUrl,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "@/lib/seo/site";

const HOME_OG_IMAGE = absoluteUrl("/opengraph-image");

export function buildHomePageMetadata(): Metadata {
  const title = SITE_NAME;
  const description = SITE_DESCRIPTION;
  const url = SITE_URL;

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
          url: HOME_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} — DeFi yield estimates for any wallet`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [HOME_OG_IMAGE],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
