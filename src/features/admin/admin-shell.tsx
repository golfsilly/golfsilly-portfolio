"use client";

import type { ReactNode } from "react";
import {
  FolderKanban,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useLocale } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import type { Locale } from "@/i18n/routing";
import { useAdminUiStore } from "./admin-store";
import { adminCopy } from "./copy";

export function AdminShell({
  children,
  email,
}: {
  children: ReactNode;
  email: string;
}) {
  const locale = useLocale() as Locale;
  const copy = adminCopy[locale];
  const router = useRouter();
  const collapsed = useAdminUiStore((state) => state.sidebarCollapsed);
  const toggleSidebar = useAdminUiStore((state) => state.toggleSidebar);

  return (
    <div className={`admin-shell${collapsed ? " is-collapsed" : ""}`}>
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <Link href="/admin/projects">
            g<span className="brand-dot">.</span>
          </Link>
          {!collapsed && <span>{copy.admin}</span>}
        </div>
        <nav aria-label={copy.admin}>
          <Link href="/admin/projects">
            <FolderKanban size={19} />
            <span>{copy.projects}</span>
          </Link>
        </nav>
        <div className="admin-sidebar-footer">
          {!collapsed && <small title={email}>{email}</small>}
          <button onClick={toggleSidebar} aria-label="Toggle sidebar">
            {collapsed ? (
              <PanelLeftOpen size={18} />
            ) : (
              <PanelLeftClose size={18} />
            )}
          </button>
          <button
            aria-label={copy.signOut}
            onClick={async () => {
              await authClient.signOut();
              router.replace("/admin/sign-in");
              router.refresh();
            }}
          >
            <LogOut size={18} />
            <span>{copy.signOut}</span>
          </button>
        </div>
      </aside>
      <main className="admin-main" id="main">
        {children}
      </main>
    </div>
  );
}
