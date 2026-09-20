import type { Metadata } from "next";
import type { Locale } from "@/i18n/routing";
import { messages } from "@/i18n/messages";
import { env } from "@/env";

export const siteUrl = new URL(
  env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
);
export const isPublishable = Boolean(env.NEXT_PUBLIC_SITE_URL);

export function pageMetadata(
  locale: Locale,
  path = "",
  title?: string,
  description?: string,
): Metadata {
  const copy = messages[locale].meta;
  const resolvedTitle = title ?? copy.title;
  const resolvedDescription = description ?? copy.description;
  return {
    metadataBase: siteUrl,
    title: resolvedTitle,
    description: resolvedDescription,
    alternates: {
      canonical: path || "/",
    },
    openGraph: {
      title: resolvedTitle,
      description: resolvedDescription,
      url: path || "/",
      siteName: "golfsilly",
      locale: locale === "th" ? "th_TH" : "en_US",
      alternateLocale: locale === "th" ? "en_US" : "th_TH",
      type: "website",
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: "golfsilly — Design, code & curiosity",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description: resolvedDescription,
      images: ["/opengraph-image"],
    },
    robots: isPublishable
      ? { index: true, follow: true }
      : { index: false, follow: false },
  };
}
