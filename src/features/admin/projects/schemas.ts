import { z } from "zod";

const optionalUrl = z.union([z.literal(""), z.url()]);

export const translationDraftSchema = z.object({
  title: z.string().max(120),
  category: z.string().max(120),
  summary: z.string().max(320),
  imageAlt: z.string().max(240),
  problem: z.string().max(5_000),
  role: z.string().max(5_000),
  approach: z.string().max(5_000),
  outcome: z.string().max(5_000),
  published: z.boolean(),
});

export const projectInputSchema = z
  .object({
    slug: z
      .string()
      .trim()
      .min(2)
      .max(100)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase kebab-case"),
    sortOrder: z.coerce.number().int().min(0).max(10_000),
    featured: z.boolean(),
    sample: z.boolean(),
    tone: z.enum(["cyan", "violet", "amber"]),
    stack: z.array(z.string().trim().min(1).max(50)).max(30),
    imagePath: z.string().trim().nullable(),
    liveUrl: optionalUrl,
    sourceUrl: optionalUrl,
    translations: z.object({
      th: translationDraftSchema,
      en: translationDraftSchema,
    }),
  })
  .superRefine((value, context) => {
    for (const locale of ["th", "en"] as const) {
      const translation = value.translations[locale];
      if (!translation.published) continue;
      if (!value.imagePath) {
        context.addIssue({
          code: "custom",
          path: ["imagePath"],
          message: "A cover image is required before publishing",
        });
      }
      for (const field of [
        "title",
        "category",
        "summary",
        "imageAlt",
        "problem",
        "role",
        "approach",
        "outcome",
      ] as const) {
        if (!translation[field].trim()) {
          context.addIssue({
            code: "custom",
            path: ["translations", locale, field],
            message: `Required to publish ${locale.toUpperCase()}`,
          });
        }
      }
    }
  });

export const projectListQuerySchema = z.object({
  q: z.string().trim().max(100).default(""),
  status: z.enum(["all", "published", "draft", "archived"]).default("all"),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(5).max(100).default(20),
  sort: z.enum(["order", "newest", "oldest", "title"]).default("order"),
});

export const projectPatchSchema = z.discriminatedUnion("intent", [
  z.object({ intent: z.literal("save"), project: projectInputSchema }),
  z.object({ intent: z.literal("archive"), archived: z.boolean() }),
]);

export const deleteProjectSchema = z.object({ confirmationSlug: z.string() });

export const uploadSchema = z.object({
  type: z.enum(["image/jpeg", "image/png", "image/webp", "image/avif"]),
  size: z
    .number()
    .positive()
    .max(5 * 1024 * 1024),
});

export const projectFormSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase kebab-case"),
  sortOrder: z.number().int().min(0).max(10_000),
  featured: z.boolean(),
  sample: z.boolean(),
  tone: z.enum(["cyan", "violet", "amber"]),
  stackItems: z
    .array(z.object({ value: z.string().trim().min(1).max(50) }))
    .max(30),
  imagePath: z.string().trim().nullable(),
  liveUrl: optionalUrl,
  sourceUrl: optionalUrl,
  translations: z.object({
    th: translationDraftSchema,
    en: translationDraftSchema,
  }),
});

export type ProjectInput = z.infer<typeof projectInputSchema>;
export type ProjectListQuery = z.infer<typeof projectListQuerySchema>;
export type ProjectFormInput = z.infer<typeof projectFormSchema>;
