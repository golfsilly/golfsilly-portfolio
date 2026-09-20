import "server-only";

import type { Prisma } from "@/generated/prisma/client";
import { getPrisma } from "@/lib/prisma";
import { getProjectImageUrl } from "@/lib/supabase-storage";
import type { ProjectInput, ProjectListQuery } from "./schemas";
import type { AdminProject, ProjectListResponse } from "./types";

type ProjectWithTranslations = Prisma.ProjectGetPayload<{
  include: { translations: true };
}>;

const emptyTranslation: ProjectInput["translations"]["th"] = {
  title: "",
  category: "",
  summary: "",
  imageAlt: "",
  problem: "",
  role: "",
  approach: "",
  outcome: "",
  published: false,
};

function serialize(project: ProjectWithTranslations): AdminProject {
  const translations = Object.fromEntries(
    project.translations.map((copy) => [
      copy.locale,
      {
        title: copy.title,
        category: copy.category,
        summary: copy.summary,
        imageAlt: copy.imageAlt,
        problem: copy.problem,
        role: copy.role,
        approach: copy.approach,
        outcome: copy.outcome,
        published: Boolean(copy.publishedAt),
      },
    ]),
  ) as Partial<ProjectInput["translations"]>;

  return {
    id: project.id,
    imageUrl: getProjectImageUrl(project.imagePath),
    slug: project.slug,
    sortOrder: project.sortOrder,
    featured: project.featured,
    sample: project.sample,
    tone: project.tone,
    stack: project.stack,
    imagePath: project.imagePath,
    liveUrl: project.liveUrl ?? "",
    sourceUrl: project.sourceUrl ?? "",
    translations: {
      th: translations.th ?? { ...emptyTranslation },
      en: translations.en ?? { ...emptyTranslation },
    },
    archivedAt: project.archivedAt?.toISOString() ?? null,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
  };
}

function translationWrites(input: ProjectInput) {
  return (["th", "en"] as const).map((locale) => {
    const translation = input.translations[locale];
    return {
      locale,
      title: translation.title,
      category: translation.category,
      summary: translation.summary,
      imageAlt: translation.imageAlt,
      problem: translation.problem,
      role: translation.role,
      approach: translation.approach,
      outcome: translation.outcome,
      publishedAt: translation.published ? new Date() : null,
    };
  });
}

function baseWrite(input: ProjectInput) {
  return {
    slug: input.slug,
    sortOrder: input.sortOrder,
    featured: input.featured,
    sample: input.sample,
    tone: input.tone,
    stack: input.stack,
    imagePath: input.imagePath,
    liveUrl: input.liveUrl || null,
    sourceUrl: input.sourceUrl || null,
  };
}

export async function listAdminProjects(
  query: ProjectListQuery,
): Promise<ProjectListResponse> {
  const prisma = getPrisma();
  const where: Prisma.ProjectWhereInput = {
    ...(query.q
      ? {
          OR: [
            { slug: { contains: query.q, mode: "insensitive" } },
            {
              translations: {
                some: { title: { contains: query.q, mode: "insensitive" } },
              },
            },
          ],
        }
      : {}),
    ...(query.status === "archived"
      ? { archivedAt: { not: null } }
      : query.status === "published"
        ? {
            archivedAt: null,
            translations: { some: { publishedAt: { not: null } } },
          }
        : query.status === "draft"
          ? {
              archivedAt: null,
              translations: { none: { publishedAt: { not: null } } },
            }
          : {}),
  };
  const orderBy: Prisma.ProjectOrderByWithRelationInput[] =
    query.sort === "newest"
      ? [{ createdAt: "desc" }]
      : query.sort === "oldest"
        ? [{ createdAt: "asc" }]
        : query.sort === "title"
          ? [{ slug: "asc" }]
          : [{ sortOrder: "asc" }, { createdAt: "desc" }];
  const [items, total] = await prisma.$transaction([
    prisma.project.findMany({
      where,
      include: { translations: true },
      orderBy,
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
    }),
    prisma.project.count({ where }),
  ]);
  return {
    items: items.map(serialize),
    total,
    page: query.page,
    pageSize: query.pageSize,
  };
}

export async function getAdminProject(id: string) {
  const project = await getPrisma().project.findUnique({
    where: { id },
    include: { translations: true },
  });
  return project ? serialize(project) : null;
}

export async function createAdminProject(input: ProjectInput) {
  const project = await getPrisma().project.create({
    data: {
      ...baseWrite(input),
      translations: { create: translationWrites(input) },
    },
    include: { translations: true },
  });
  return serialize(project);
}

export async function updateAdminProject(id: string, input: ProjectInput) {
  const translations = translationWrites(input);
  const project = await getPrisma().project.update({
    where: { id },
    data: {
      ...baseWrite(input),
      translations: {
        upsert: translations.map((translation) => ({
          where: {
            projectId_locale: { projectId: id, locale: translation.locale },
          },
          create: translation,
          update: translation,
        })),
      },
    },
    include: { translations: true },
  });
  return serialize(project);
}

export async function setProjectArchived(id: string, archived: boolean) {
  const project = await getPrisma().project.update({
    where: { id },
    data: { archivedAt: archived ? new Date() : null },
    include: { translations: true },
  });
  return serialize(project);
}

export async function permanentlyDeleteProject(id: string, slug: string) {
  const project = await getPrisma().project.findUnique({ where: { id } });
  if (!project) return null;
  if (project.slug !== slug)
    throw new Error("Confirmation slug does not match");
  await getPrisma().project.delete({ where: { id } });
  return project;
}
