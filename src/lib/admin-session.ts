import "server-only";

import { headers } from "next/headers";
import { getBackendConfiguration } from "@/env";
import { getAuth, hasAdminRole } from "@/lib/auth";

export async function getAdminSession(requestHeaders?: Headers) {
  if (!getBackendConfiguration()) return null;
  const session = await getAuth().api.getSession({
    headers: requestHeaders ?? (await headers()),
  });
  if (!session || !hasAdminRole(session.user.role)) return null;
  return session;
}
