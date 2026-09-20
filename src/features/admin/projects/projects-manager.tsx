"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Archive,
  ArchiveRestore,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
} from "lucide-react";
import { useLocale } from "next-intl";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  coreFeatures,
  createColumnHelper,
  flexRender,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import { toast } from "sonner";
import type { Locale } from "@/i18n/routing";
import { adminCopy } from "@/features/admin/copy";
import { useAdminUiStore } from "@/features/admin/admin-store";
import { projectKeys } from "./query-keys";
import type { AdminProject, ApiError, ProjectListResponse } from "./types";

async function readResponse<T>(response: Response): Promise<T> {
  const body = (await response.json()) as { data?: T } & ApiError;
  if (!response.ok || !body.data)
    throw new Error(body.error?.message ?? "Request failed");
  return body.data;
}

const features = tableFeatures({ ...coreFeatures });
const column = createColumnHelper<typeof features, AdminProject>();

export function ProjectsManager() {
  const locale = useLocale() as Locale;
  const copy = adminCopy[locale];
  const client = useQueryClient();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("order");
  const [page, setPage] = useState(1);
  const [confirming, setConfirming] = useState<AdminProject | null>(null);
  const [confirmation, setConfirmation] = useState("");
  const compact = useAdminUiStore((state) => state.compactTable);
  const setCompact = useAdminUiStore((state) => state.setCompactTable);
  const search = new URLSearchParams({
    q,
    status,
    sort,
    page: String(page),
    pageSize: "20",
  }).toString();

  const projects = useQuery({
    queryKey: projectKeys.list(search),
    queryFn: async () =>
      readResponse<ProjectListResponse>(
        await fetch(`/api/admin/projects?${search}`),
      ),
  });

  const archive = useMutation({
    mutationFn: async ({
      project,
      archived,
    }: {
      project: AdminProject;
      archived: boolean;
    }) =>
      readResponse<AdminProject>(
        await fetch(`/api/admin/projects/${project.id}`, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ intent: "archive", archived }),
        }),
      ),
    onSuccess: () =>
      client.invalidateQueries({ queryKey: projectKeys.lists() }),
    onError: (error) => toast.error(error.message),
  });

  const remove = useMutation({
    mutationFn: async (project: AdminProject) =>
      readResponse<{ deleted: boolean; storageCleanup: boolean }>(
        await fetch(`/api/admin/projects/${project.id}`, {
          method: "DELETE",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ confirmationSlug: confirmation }),
        }),
      ),
    onSuccess: (result) => {
      toast.success(
        result.storageCleanup
          ? "Project deleted"
          : "Project deleted; image cleanup is still needed",
      );
      setConfirming(null);
      setConfirmation("");
      client.invalidateQueries({ queryKey: projectKeys.lists() });
    },
    onError: (error) => toast.error(error.message),
  });

  const columns = useMemo(
    () =>
      column.columns([
        column.accessor("sortOrder", {
          header: "#",
          cell: (info) => info.getValue(),
        }),
        column.accessor("slug", {
          header: "Project",
          cell: ({ row }) => (
            <div>
              <strong>
                {row.original.translations[locale].title || row.original.slug}
              </strong>
              <small>{row.original.slug}</small>
            </div>
          ),
        }),
        column.display({
          id: "languages",
          header: "TH / EN",
          cell: ({ row }) => (
            <span className="admin-language-state">
              <i data-active={row.original.translations.th.published}>TH</i>
              <i data-active={row.original.translations.en.published}>EN</i>
            </span>
          ),
        }),
        column.display({
          id: "status",
          header: "Status",
          cell: ({ row }) => (
            <span
              className="admin-status"
              data-status={
                row.original.archivedAt
                  ? "archived"
                  : row.original.translations.th.published ||
                      row.original.translations.en.published
                    ? "published"
                    : "draft"
              }
            >
              {row.original.archivedAt
                ? copy.archived
                : row.original.translations.th.published ||
                    row.original.translations.en.published
                  ? copy.published
                  : copy.draft}
            </span>
          ),
        }),
        column.display({
          id: "actions",
          header: "",
          cell: ({ row }) => (
            <div className="admin-row-actions">
              <Link href={`/admin/projects/${row.original.id}`}>
                {copy.edit}
              </Link>
              <button
                onClick={() =>
                  archive.mutate({
                    project: row.original,
                    archived: !row.original.archivedAt,
                  })
                }
                aria-label={
                  row.original.archivedAt ? copy.restore : copy.archive
                }
              >
                {row.original.archivedAt ? (
                  <ArchiveRestore size={16} />
                ) : (
                  <Archive size={16} />
                )}
              </button>
              <button
                className="danger"
                onClick={() => setConfirming(row.original)}
                aria-label={copy.delete}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ),
        }),
      ]),
    [archive, copy, locale],
  );

  const table = useTable({
    features,
    data: projects.data?.items ?? [],
    columns,
  });
  const pageCount = Math.max(1, Math.ceil((projects.data?.total ?? 0) / 20));

  return (
    <section className="admin-page">
      <header className="admin-page-header">
        <div>
          <p className="eyebrow">CONTENT</p>
          <h1>{copy.projects}</h1>
        </div>
        <Link className="button-primary" href="/admin/projects/new">
          <Plus size={18} />
          {copy.newProject}
        </Link>
      </header>
      <div className="admin-toolbar">
        <input
          value={q}
          onChange={(event) => {
            setQ(event.target.value);
            setPage(1);
          }}
          placeholder={copy.search}
          aria-label={copy.search}
        />
        <select
          value={status}
          onChange={(event) => {
            setStatus(event.target.value);
            setPage(1);
          }}
          aria-label="Status"
        >
          <option value="all">{copy.all}</option>
          <option value="published">{copy.published}</option>
          <option value="draft">{copy.draft}</option>
          <option value="archived">{copy.archived}</option>
        </select>
        <select
          value={sort}
          onChange={(event) => setSort(event.target.value)}
          aria-label="Sort"
        >
          <option value="order">Order</option>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="title">Slug</option>
        </select>
        <label className="admin-check">
          <input
            type="checkbox"
            checked={compact}
            onChange={(event) => setCompact(event.target.checked)}
          />
          {copy.compact}
        </label>
      </div>
      <div
        className={`admin-table-wrap${compact ? " is-compact" : ""}`}
        aria-busy={projects.isLoading}
      >
        <table>
          <thead>
            {table.getHeaderGroups().map((group) => (
              <tr key={group.id}>
                {group.headers.map((header) => (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getAllCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {!projects.isLoading && !table.getRowModel().rows.length && (
          <p className="admin-empty">{copy.empty}</p>
        )}
        {projects.error && (
          <p className="admin-error" role="alert">
            {projects.error.message}
          </p>
        )}
      </div>
      <footer className="admin-pagination">
        <span>{projects.data?.total ?? 0} projects</span>
        <div>
          <button
            disabled={page <= 1}
            onClick={() => setPage((value) => value - 1)}
          >
            <ChevronLeft size={17} />
          </button>
          <span>
            {page} / {pageCount}
          </span>
          <button
            disabled={page >= pageCount}
            onClick={() => setPage((value) => value + 1)}
          >
            <ChevronRight size={17} />
          </button>
        </div>
      </footer>
      {confirming && (
        <div
          className="admin-confirm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-title"
        >
          <div>
            <h2 id="delete-title">{copy.delete}</h2>
            <p>{copy.confirmDelete}</p>
            <code>{confirming.slug}</code>
            <input
              autoFocus
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
            />
            <div>
              <button
                onClick={() => {
                  setConfirming(null);
                  setConfirmation("");
                }}
              >
                Cancel
              </button>
              <button
                className="danger"
                disabled={confirmation !== confirming.slug || remove.isPending}
                onClick={() => remove.mutate(confirming)}
              >
                {copy.delete}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
