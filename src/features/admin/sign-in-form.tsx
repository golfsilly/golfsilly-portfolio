"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Code2, LoaderCircle } from "lucide-react";
import { useLocale } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";
import type { Locale } from "@/i18n/routing";
import { adminCopy } from "./copy";

const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(12),
});
type SignInInput = z.infer<typeof signInSchema>;

export function SignInForm() {
  const locale = useLocale() as Locale;
  const copy = adminCopy[locale];
  const [serverError, setServerError] = useState("");
  const form = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  async function signIn(input: SignInInput) {
    setServerError("");
    const result = await authClient.signIn.email({
      ...input,
      callbackURL: "/admin/projects",
    });
    if (result.error) setServerError(result.error.message ?? "Sign in failed");
  }

  return (
    <div className="admin-auth-card">
      <div>
        <p className="eyebrow">OWNER ACCESS</p>
        <h1>{copy.signIn}</h1>
        <p>{copy.signInIntro}</p>
      </div>
      <form onSubmit={form.handleSubmit(signIn)} className="admin-form-stack">
        <label>
          <span>{copy.email}</span>
          <input
            type="email"
            autoComplete="email"
            {...form.register("email")}
          />
          {form.formState.errors.email && (
            <small>{form.formState.errors.email.message}</small>
          )}
        </label>
        <label>
          <span>{copy.password}</span>
          <input
            type="password"
            autoComplete="current-password"
            {...form.register("password")}
          />
          {form.formState.errors.password && (
            <small>{form.formState.errors.password.message}</small>
          )}
        </label>
        {serverError && (
          <p className="admin-error" role="alert">
            {serverError}
          </p>
        )}
        <button
          className="button-primary"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting && (
            <LoaderCircle className="spin" size={17} />
          )}
          {copy.signIn}
        </button>
      </form>
      <div className="admin-auth-divider">
        <span>OR</span>
      </div>
      <button
        className="admin-secondary-button"
        onClick={() =>
          authClient.signIn.social({
            provider: "github",
            callbackURL: "/admin/projects",
          })
        }
      >
        <Code2 size={18} /> {copy.github}
      </button>
    </div>
  );
}
