import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins";
import { getBackendConfiguration } from "../env";
import { getPrisma } from "./prisma-core";

function createAuth() {
  const configuration = getBackendConfiguration();
  if (!configuration) throw new Error("Backend is not configured");
  return betterAuth({
    appName: "golfsilly portfolio",
    baseURL: configuration.betterAuthUrl,
    secret: configuration.betterAuthSecret,
    database: prismaAdapter(getPrisma(), { provider: "postgresql" }),
    emailAndPassword: {
      enabled: true,
      disableSignUp: true,
      minPasswordLength: 12,
    },
    socialProviders: {
      github: {
        clientId: configuration.githubClientId,
        clientSecret: configuration.githubClientSecret,
        disableSignUp: true,
      },
    },
    advanced: { database: { joins: true } },
    plugins: [admin()],
  });
}

let authInstance: ReturnType<typeof createAuth> | undefined;

export function getAuth() {
  authInstance ??= createAuth();
  return authInstance;
}

export function hasAdminRole(role: string | string[] | null | undefined) {
  if (Array.isArray(role)) return role.includes("admin");
  return (
    role
      ?.split(",")
      .map((item) => item.trim())
      .includes("admin") ?? false
  );
}
