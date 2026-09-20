import "server-only";

import { createClient } from "@supabase/supabase-js";
import { getBackendConfiguration } from "@/env";

let storageClient: ReturnType<typeof createClient> | undefined;

function getStorageClient() {
  const configuration = getBackendConfiguration();
  if (!configuration) throw new Error("Backend is not configured");
  storageClient ??= createClient(
    configuration.supabaseUrl,
    configuration.supabaseServiceRoleKey,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
  return { client: storageClient, configuration };
}

export function getProjectImageUrl(path: string | null) {
  if (!path) return null;
  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("/")
  ) {
    return path;
  }
  const configuration = getBackendConfiguration();
  if (!configuration) return null;
  return `${configuration.supabaseUrl}/storage/v1/object/public/${configuration.storageBucket}/${path}`;
}

export async function uploadProjectImage(file: File) {
  const { client, configuration } = getStorageClient();
  const extension = file.name.split(".").pop()?.toLowerCase() || "bin";
  const path = `${crypto.randomUUID()}/${crypto.randomUUID()}.${extension}`;
  const { error } = await client.storage
    .from(configuration.storageBucket)
    .upload(path, await file.arrayBuffer(), {
      contentType: file.type,
      upsert: false,
    });
  if (error) throw error;
  return { path, url: getProjectImageUrl(path)! };
}

export async function removeProjectImage(path: string | null) {
  if (!path || path.startsWith("http") || path.startsWith("/")) return;
  const { client, configuration } = getStorageClient();
  const { error } = await client.storage
    .from(configuration.storageBucket)
    .remove([path]);
  if (error) throw error;
}
