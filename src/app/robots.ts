import type { MetadataRoute } from "next";
import { siteUrl, isPublishable } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      ...(isPublishable ? { allow: "/" } : { disallow: "/" }),
    },
    ...(isPublishable
      ? { sitemap: new URL("/sitemap.xml", siteUrl).href }
      : {}),
  };
}
