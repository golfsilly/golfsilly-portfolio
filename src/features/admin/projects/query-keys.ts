import type { QueryKey } from "@tanstack/query-core";

export const projectKeys = {
  all: ["admin", "projects"] as const,
  lists: () => [...projectKeys.all, "list"] as const,
  list: (search: string): QueryKey => [...projectKeys.lists(), search] as const,
  detail: (id: string): QueryKey => [...projectKeys.all, "detail", id] as const,
};
