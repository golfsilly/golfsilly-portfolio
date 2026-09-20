import type { Locale } from "@/i18n/routing";

export type ProjectCopy = {
  title: string;
  category: string;
  summary: string;
  imageAlt: string;
  problem: string;
  role: string;
  approach: string;
  outcome: string;
};

export type DatabaseProject = {
  id: string;
  slug: string;
  order: number;
  featured: boolean;
  sample: boolean;
  stack: string[];
  image: string;
  tone: "cyan" | "violet" | "amber";
  links: { live?: string; source?: string };
  contentLocale: Locale;
  isFallback: boolean;
} & ProjectCopy;
