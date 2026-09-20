"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ImageUp, LoaderCircle, Plus, Trash2 } from "lucide-react";
import { useLocale } from "next-intl";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Link from "next/link";
import type { Locale } from "@/i18n/routing";
import { adminCopy } from "@/features/admin/copy";
import { useAdminUiStore } from "@/features/admin/admin-store";
import {
  projectFormSchema,
  projectInputSchema,
  type ProjectFormInput,
  type ProjectInput,
} from "./schemas";
import { projectKeys } from "./query-keys";
import type { AdminProject, ApiError } from "./types";

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

const blankProject: ProjectFormInput = {
  slug: "",
  sortOrder: 0,
  featured: false,
  sample: false,
  tone: "cyan",
  stackItems: [{ value: "Next.js" }],
  imagePath: null,
  liveUrl: "",
  sourceUrl: "",
  translations: { th: { ...blankTranslation }, en: { ...blankTranslation } },
};

async function readResponse<T>(response: Response): Promise<T> {
  const body = (await response.json()) as { data?: T } & ApiError;
  if (!response.ok || !body.data)
    throw new Error(body.error?.message ?? "Request failed");
  return body.data;
}

async function readResponseWithWarning<T>(
  response: Response,
): Promise<{ data: T; warning?: string }> {
  const body = (await response.json()) as {
    data?: T;
    warning?: string;
  } & ApiError;
  if (!response.ok || !body.data)
    throw new Error(body.error?.message ?? "Request failed");
  return { data: body.data, warning: body.warning };
}

function toForm(project: AdminProject): ProjectFormInput {
  return {
    slug: project.slug,
    sortOrder: project.sortOrder,
    featured: project.featured,
    sample: project.sample,
    tone: project.tone,
    stackItems: project.stack.length
      ? project.stack.map((value) => ({ value }))
      : [{ value: "" }],
    imagePath: project.imagePath,
    liveUrl: project.liveUrl,
    sourceUrl: project.sourceUrl,
    translations: project.translations,
  };
}

export function ProjectEditor({ id }: { id?: string }) {
  const locale = useLocale() as Locale;
  const copy = adminCopy[locale];
  const router = useRouter();
  const queryClient = useQueryClient();
  const editorLocale = useAdminUiStore((state) => state.editorLocale);
  const setEditorLocale = useAdminUiStore((state) => state.setEditorLocale);
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);
  const form = useForm<ProjectFormInput>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: blankProject,
  });
  const stack = useFieldArray({ control: form.control, name: "stackItems" });
  const published = useWatch({
    control: form.control,
    name: `translations.${editorLocale}.published`,
  });
  const project = useQuery({
    queryKey: id ? projectKeys.detail(id) : ["admin", "projects", "new"],
    queryFn: async () =>
      readResponse<AdminProject>(await fetch(`/api/admin/projects/${id}`)),
    enabled: Boolean(id),
  });

  useEffect(() => {
    if (!project.data) return;
    form.reset(toForm(project.data));
  }, [form, project.data]);

  const upload = useMutation({
    mutationFn: async (file: File) => {
      const data = new FormData();
      data.set("file", file);
      return readResponse<{ path: string; url: string }>(
        await fetch("/api/admin/uploads", { method: "POST", body: data }),
      );
    },
    onSuccess: ({ path, url }) => {
      form.setValue("imagePath", path, {
        shouldDirty: true,
        shouldValidate: true,
      });
      setUploadedPreview(url);
      toast.success("Image uploaded");
    },
    onError: (error) => toast.error(error.message),
  });

  const save = useMutation({
    mutationFn: async (input: ProjectInput) =>
      readResponseWithWarning<AdminProject>(
        await fetch(id ? `/api/admin/projects/${id}` : "/api/admin/projects", {
          method: id ? "PATCH" : "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(id ? { intent: "save", project: input } : input),
        }),
      ),
    onSuccess: ({ data: saved, warning }) => {
      if (warning) toast.warning(warning);
      else toast.success(copy.saved);
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
      if (!id) router.replace(`/admin/projects/${saved.id}`);
      else {
        form.reset(toForm(saved));
        setUploadedPreview(saved.imageUrl);
      }
    },
    onError: (error) => toast.error(error.message),
  });

  function submit(values: ProjectFormInput) {
    const result = projectInputSchema.safeParse({
      ...values,
      stack: values.stackItems.map((item) => item.value),
    });
    if (!result.success) {
      toast.error(
        result.error.issues[0]?.message ?? "Check the project fields",
      );
      return;
    }
    save.mutate(result.data);
  }

  if (id && project.isLoading)
    return (
      <div className="admin-loading">
        <LoaderCircle className="spin" /> Loading project…
      </div>
    );
  if (project.error)
    return <p className="admin-error">{project.error.message}</p>;

  const fields = [
    ["title", "Title"],
    ["category", "Category"],
    ["summary", "Summary"],
    ["imageAlt", "Image alt text"],
    ["problem", "Problem / idea"],
    ["role", "Role / scope"],
    ["approach", "Approach"],
    ["outcome", "Outcome"],
  ] as const;
  const preview = uploadedPreview ?? project.data?.imageUrl ?? null;

  return (
    <section className="admin-page admin-editor">
      <header className="admin-page-header">
        <div>
          <Link className="admin-back" href="/admin/projects">
            <ArrowLeft size={16} />
            {copy.projects}
          </Link>
          <h1>{id ? copy.edit : copy.newProject}</h1>
        </div>
        <button
          className="button-primary"
          form="project-form"
          disabled={save.isPending}
        >
          {save.isPending && <LoaderCircle className="spin" size={17} />}
          {save.isPending ? copy.saving : copy.save}
        </button>
      </header>
      <form id="project-form" onSubmit={form.handleSubmit(submit)}>
        <div className="admin-editor-grid">
          <div className="admin-card admin-form-grid">
            <h2>{copy.details}</h2>
            <label>
              <span>Slug</span>
              <input {...form.register("slug")} />
              {form.formState.errors.slug && (
                <small>{form.formState.errors.slug.message}</small>
              )}
            </label>
            <label>
              <span>Order</span>
              <input
                type="number"
                {...form.register("sortOrder", { valueAsNumber: true })}
              />
            </label>
            <label>
              <span>Tone</span>
              <select {...form.register("tone")}>
                <option value="cyan">Cyan</option>
                <option value="violet">Violet</option>
                <option value="amber">Amber</option>
              </select>
            </label>
            <div className="admin-inline-checks">
              <label>
                <input type="checkbox" {...form.register("featured")} />{" "}
                Featured
              </label>
              <label>
                <input type="checkbox" {...form.register("sample")} /> Sample
                concept
              </label>
            </div>
            <label>
              <span>Live URL</span>
              <input type="url" {...form.register("liveUrl")} />
            </label>
            <label>
              <span>Source URL</span>
              <input type="url" {...form.register("sourceUrl")} />
            </label>
            <fieldset className="admin-stack-fields">
              <legend>Technology stack</legend>
              {stack.fields.map((item, index) => (
                <div key={item.id}>
                  <input {...form.register(`stackItems.${index}.value`)} />
                  <button
                    type="button"
                    aria-label="Remove technology"
                    onClick={() => stack.remove(index)}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => stack.append({ value: "" })}>
                <Plus size={15} /> Add technology
              </button>
            </fieldset>
          </div>
          <aside className="admin-card admin-media-card">
            <h2>{copy.media}</h2>
            {preview ? (
              <Image
                src={preview}
                alt="Project cover preview"
                width={600}
                height={432}
                unoptimized
              />
            ) : (
              <div className="admin-image-placeholder">
                <ImageUp size={34} />
                <span>No cover image</span>
              </div>
            )}
            <label className="admin-upload-button">
              <ImageUp size={17} />
              {upload.isPending ? "Uploading…" : copy.upload}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                disabled={upload.isPending}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) upload.mutate(file);
                }}
              />
            </label>
            <small>{copy.uploadHint}</small>
          </aside>
        </div>
        <div className="admin-card admin-content-card">
          <div className="admin-content-heading">
            <h2>{copy.content}</h2>
            <div className="admin-locale-tabs" role="tablist">
              {(["th", "en"] as const).map((item) => (
                <button
                  type="button"
                  role="tab"
                  aria-selected={editorLocale === item}
                  key={item}
                  onClick={() => setEditorLocale(item)}
                >
                  {item.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div className="admin-publish-toggle">
            <label>
              <input
                type="checkbox"
                {...form.register(`translations.${editorLocale}.published`)}
              />{" "}
              {copy.published}
            </label>
            <span>{published ? copy.published : copy.draft}</span>
          </div>
          <div className="admin-translation-fields">
            {fields.map(([field, label]) => {
              const multiline = [
                "summary",
                "problem",
                "role",
                "approach",
                "outcome",
              ].includes(field);
              const registration = form.register(
                `translations.${editorLocale}.${field}`,
              );
              return (
                <label key={field}>
                  <span>{label}</span>
                  {multiline ? (
                    <textarea
                      rows={field === "summary" ? 3 : 6}
                      {...registration}
                    />
                  ) : (
                    <input {...registration} />
                  )}
                </label>
              );
            })}
          </div>
        </div>
      </form>
    </section>
  );
}
