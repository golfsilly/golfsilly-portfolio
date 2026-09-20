import type { MetadataRoute } from "next";
import { getProjects } from "@/features/projects/data";
import { siteUrl, isPublishable } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!isPublishable) return [];
  const paths = [
    "",
    "/projects",
    "/privacy",
    "/cookies",
    ...(await getProjects("th")).map((p) => `/projects/${p.slug}`),
  ];
  return paths.map((path) => ({ url: new URL(path || "/", siteUrl).href }));
}
