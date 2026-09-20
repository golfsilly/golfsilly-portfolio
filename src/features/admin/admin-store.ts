"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Locale } from "@/i18n/routing";

type AdminUiState = {
  sidebarCollapsed: boolean;
  compactTable: boolean;
  editorLocale: Locale;
  columnVisibility: Record<string, boolean>;
  toggleSidebar: () => void;
  setCompactTable: (compact: boolean) => void;
  setEditorLocale: (locale: Locale) => void;
  setColumnVisibility: (visibility: Record<string, boolean>) => void;
};

export const useAdminUiStore = create<AdminUiState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      compactTable: false,
      editorLocale: "th",
      columnVisibility: {},
      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setCompactTable: (compactTable) => set({ compactTable }),
      setEditorLocale: (editorLocale) => set({ editorLocale }),
      setColumnVisibility: (columnVisibility) => set({ columnVisibility }),
    }),
    {
      name: "golfsilly-admin-ui",
      partialize: ({
        sidebarCollapsed,
        compactTable,
        editorLocale,
        columnVisibility,
      }) => ({
        sidebarCollapsed,
        compactTable,
        editorLocale,
        columnVisibility,
      }),
    },
  ),
);
