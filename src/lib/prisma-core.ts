import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { getBackendConfiguration } from "../env";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export function getPrisma() {
  const configuration = getBackendConfiguration();
  if (!configuration) throw new Error("Backend is not configured");

  if (!globalForPrisma.prisma) {
    const adapter = new PrismaPg({
      connectionString: configuration.databaseUrl,
      max: 1,
      connectionTimeoutMillis: 5_000,
      idleTimeoutMillis: 10_000,
    });
    globalForPrisma.prisma = new PrismaClient({ adapter });
  }

  return globalForPrisma.prisma;
}
