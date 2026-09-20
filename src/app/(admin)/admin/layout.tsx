import { redirect } from "next/navigation";
import { getBackendConfiguration } from "@/env";
import { getAdminSession } from "@/lib/admin-session";
import { AdminQueryProvider } from "@/providers/admin-query-provider";
import { AdminShell } from "@/features/admin/admin-shell";

export const metadata = {
  title: "Portfolio admin — golfsilly",
  robots: { index: false, follow: false },
};

export default async function ProtectedAdminLayout({
  children,
}: LayoutProps<"/admin">) {
  if (!getBackendConfiguration()) redirect("/admin/sign-in");
  const session = await getAdminSession();
  if (!session) redirect("/admin/sign-in");

  return (
    <AdminQueryProvider>
      <AdminShell email={session.user.email}>{children}</AdminShell>
    </AdminQueryProvider>
  );
}
