import type { ProjectInput } from "./schemas";

export type AdminProject = ProjectInput & {
  id: string;
  imageUrl: string | null;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ProjectListResponse = {
  items: AdminProject[];
  total: number;
  page: number;
  pageSize: number;
};

export type ApiError = {
  error: {
    code: string;
    message: string;
    fieldErrors?: Record<string, string[]>;
  };
};
