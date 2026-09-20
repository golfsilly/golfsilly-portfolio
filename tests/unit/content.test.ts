import { test } from "node:test";
import assert from "node:assert/strict";
import { messages } from "../../src/i18n/messages";
import { projectInputSchema } from "../../src/features/admin/projects/schemas";

const blankTranslation = {
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

const validProject = {
  slug: "orbit-workspace",
  sortOrder: 1,
  featured: true,
  sample: false,
  tone: "cyan" as const,
  stack: ["Next.js"],
  imagePath: "project/cover.webp",
  liveUrl: "",
  sourceUrl: "",
  translations: {
    th: { ...blankTranslation },
    en: {
      title: "Orbit",
      category: "Web app",
      summary: "A focused workspace.",
      imageAlt: "Orbit workspace dashboard",
      problem: "Work can become noisy.",
      role: "Design and development",
      approach: "Clear hierarchy and reusable components.",
      outcome: "A calmer interface.",
      published: true,
    },
  },
};

test("allows publishing one complete language", () => {
  assert.equal(projectInputSchema.safeParse(validProject).success, true);
});

test("allows incomplete translations while they remain drafts", () => {
  const draft = { ...structuredClone(validProject), imagePath: null };
  draft.translations.en.published = false;
  assert.equal(projectInputSchema.safeParse(draft).success, true);
});

test("rejects incomplete published translations", () => {
  const incomplete = structuredClone(validProject);
  incomplete.translations.en.approach = " ";
  assert.equal(projectInputSchema.safeParse(incomplete).success, false);
});

test("rejects unsafe project slugs", () => {
  assert.equal(
    projectInputSchema.safeParse({ ...validProject, slug: "Orbit Workspace" })
      .success,
    false,
  );
});

test("UI translation keys are identical and non-empty", () => {
  function keys(value: Record<string, unknown>, prefix = ""): string[] {
    return Object.entries(value)
      .flatMap(([key, child]) => {
        const path = prefix ? `${prefix}.${key}` : key;
        if (typeof child === "string") {
          assert.ok(child.trim(), `Empty translation: ${path}`);
          return [path];
        }
        return keys(child as Record<string, unknown>, path);
      })
      .sort();
  }
  assert.deepEqual(keys(messages.th), keys(messages.en));
});
