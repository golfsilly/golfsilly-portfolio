import "server-only";

import { unstable_cache } from "next/cache";
import { getBackendConfiguration } from "@/env";
import type { Locale } from "@/i18n/routing";
import { getPrisma } from "@/lib/prisma";
import { getProjectImageUrl } from "@/lib/supabase-storage";
import type { DatabaseProject } from "./types";

const queryPublishedProjects = unstable_cache(
  async () =>
    getPrisma().project.findMany({
      where: {
        archivedAt: null,
        translations: { some: { publishedAt: { not: null } } },
      },
      include: {
        translations: { where: { publishedAt: { not: null } } },
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    }),
  ["published-projects"],
  { tags: ["projects"], revalidate: 3600 },
);

function localizeProject(
  project: Awaited<ReturnType<typeof queryPublishedProjects>>[number],
  locale: Locale,
): DatabaseProject | null {
  const requested = project.translations.find((copy) => copy.locale === locale);
  const fallback = project.translations.find((copy) => copy.locale !== locale);
  const copy = requested ?? fallback;
  const image = getProjectImageUrl(project.imagePath);
  if (!copy || !image) return null;

  return {
    id: project.id,
    slug: project.slug,
    order: project.sortOrder,
    featured: project.featured,
    sample: project.sample,
    stack: project.stack,
    image,
    tone: project.tone,
    links: {
      live: project.liveUrl ?? undefined,
      source: project.sourceUrl ?? undefined,
    },
    contentLocale: copy.locale,
    isFallback: copy.locale !== locale,
    title: copy.title,
    category: copy.category,
    summary: copy.summary,
    imageAlt: copy.imageAlt,
    problem: copy.problem,
    role: copy.role,
    approach: copy.approach,
    outcome: copy.outcome,
  };
}

export async function getProjects(locale: Locale): Promise<DatabaseProject[]> {
  if (!getBackendConfiguration()) return [];
  const projects = await queryPublishedProjects();
  return projects.flatMap((project) => {
    const localized = localizeProject(project, locale);
    return localized ? [localized] : [];
  });
}

export async function getProjectBySlug(locale: Locale, slug: string) {
  const projects = await getProjects(locale);
  return projects.find((project) => project.slug === slug) ?? null;
}
