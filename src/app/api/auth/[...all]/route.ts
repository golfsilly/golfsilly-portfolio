import { getBackendConfiguration } from "@/env";
import { getAuth } from "@/lib/auth";

async function handler(request: Request) {
  if (!getBackendConfiguration()) {
    return Response.json(
      {
        error: {
          code: "BACKEND_NOT_CONFIGURED",
          message: "Backend is not configured.",
        },
      },
      { status: 503 },
    );
  }
  return getAuth().handler(request);
}

export const GET = handler;
export const POST = handler;
