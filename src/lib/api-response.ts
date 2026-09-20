import { ZodError } from "zod";

export function apiError(error: unknown) {
  if (error instanceof ZodError) {
    return Response.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: "The submitted data is invalid.",
          fieldErrors: error.flatten().fieldErrors,
        },
      },
      { status: 400 },
    );
  }
  const message = error instanceof Error ? error.message : "Unexpected error";
  if (message.includes("Confirmation slug")) {
    return Response.json(
      {
        error: {
          code: "INVALID_CONFIRMATION",
          message,
        },
      },
      { status: 400 },
    );
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  ) {
    return Response.json(
      {
        error: {
          code: "CONFLICT",
          message: "A record with that unique value already exists.",
        },
      },
      { status: 409 },
    );
  }

  console.error("Admin API request failed", error);
  return Response.json(
    {
      error: {
        code: "INTERNAL_ERROR",
        message: "The request could not be completed.",
      },
    },
    { status: 500 },
  );
}

export function unauthorized() {
  return Response.json(
    { error: { code: "UNAUTHORIZED", message: "Admin access is required." } },
    { status: 401 },
  );
}
