import { redirect } from "next/navigation";
import Link from "next/link";
import { getBackendConfiguration } from "@/env";
import { getAdminSession } from "@/lib/admin-session";
import { getAppLocale } from "@/i18n/get-locale";
import { adminCopy } from "@/features/admin/copy";
import { SignInForm } from "@/features/admin/sign-in-form";

export const metadata = {
  title: "Admin sign in — golfsilly",
  robots: { index: false, follow: false },
};

export default async function AdminSignInPage() {
  const locale = await getAppLocale();
  const copy = adminCopy[locale];
  let configured = false;
  let configurationError = "";
  try {
    configured = Boolean(getBackendConfiguration());
  } catch (error) {
    configurationError =
      error instanceof Error ? error.message : "Invalid backend configuration";
  }

  if (configured && (await getAdminSession())) redirect("/admin/projects");

  return (
    <main className="admin-auth-page" id="main">
      {configured ? (
        <SignInForm />
      ) : (
        <div className="admin-auth-card">
          <p className="eyebrow">SETUP REQUIRED</p>
          <h1>{copy.notConfigured}</h1>
          <p>{copy.notConfiguredBody}</p>
          {configurationError && <code>{configurationError}</code>}
          <Link className="text-link" href="/">
            Back to portfolio
          </Link>
        </div>
      )}
    </main>
  );
}
