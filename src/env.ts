import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

/**
 * The single source of truth for environment variables used by the app.
 *
 * Keep server-only values in `server` as backend features are added. Public
 * values must be prefixed with `NEXT_PUBLIC_` so Next.js can expose them safely
 * to Client Components.
 */
export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1).optional(),
    DIRECT_URL: z.string().min(1).optional(),
    BETTER_AUTH_SECRET: z.string().min(32).optional(),
    BETTER_AUTH_URL: z.url().optional(),
    GITHUB_CLIENT_ID: z.string().min(1).optional(),
    GITHUB_CLIENT_SECRET: z.string().min(1).optional(),
    SUPABASE_URL: z.url().optional(),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
    SUPABASE_PROJECT_MEDIA_BUCKET: z.string().min(1).optional(),
  },
  client: {
    NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    DIRECT_URL: process.env.DIRECT_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    SUPABASE_PROJECT_MEDIA_BUCKET: process.env.SUPABASE_PROJECT_MEDIA_BUCKET,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },
  // An empty value in `.env.local` behaves like an omitted optional variable.
  emptyStringAsUndefined: true,
});

const backendKeys = [
  "DATABASE_URL",
  "DIRECT_URL",
  "BETTER_AUTH_SECRET",
  "BETTER_AUTH_URL",
  "GITHUB_CLIENT_ID",
  "GITHUB_CLIENT_SECRET",
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "SUPABASE_PROJECT_MEDIA_BUCKET",
] as const;

export function getBackendConfiguration() {
  const configured = backendKeys.filter((key) => Boolean(env[key]));

  if (configured.length === 0) return null;
  if (configured.length !== backendKeys.length) {
    const missing = backendKeys.filter((key) => !env[key]);
    throw new Error(
      `Backend configuration is incomplete: ${missing.join(", ")}`,
    );
  }

  return {
    databaseUrl: env.DATABASE_URL!,
    directUrl: env.DIRECT_URL!,
    betterAuthSecret: env.BETTER_AUTH_SECRET!,
    betterAuthUrl: env.BETTER_AUTH_URL!,
    githubClientId: env.GITHUB_CLIENT_ID!,
    githubClientSecret: env.GITHUB_CLIENT_SECRET!,
    supabaseUrl: env.SUPABASE_URL!,
    supabaseServiceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY!,
    storageBucket: env.SUPABASE_PROJECT_MEDIA_BUCKET!,
  };
}
