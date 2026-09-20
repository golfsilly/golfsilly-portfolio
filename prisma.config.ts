import "dotenv/config";
import { defineConfig } from "prisma/config";
import { env } from "./src/env";

const directUrl = env.DIRECT_URL ?? env.DATABASE_URL;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: directUrl ? { url: directUrl } : undefined,
});
