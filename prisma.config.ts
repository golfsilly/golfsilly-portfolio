import dotenv from "dotenv";
import { defineConfig } from "prisma/config";

// Prisma CLI does not load Next.js' `.env` automatically. Load the
// local file first, then let `.env` provide shared defaults.
dotenv.config({ path: ".env.development" });

// Load the validated env after dotenv. Static imports are evaluated before
// dotenv.config(), which would otherwise make process.env appear empty.
const { env } = await import("./src/env");

const directUrl = env.DIRECT_URL ?? env.DATABASE_URL;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: directUrl ? { url: directUrl } : undefined,
});
