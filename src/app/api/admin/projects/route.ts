import { revalidateTag } from "next/cache";
import { getAdminSession } from "@/lib/admin-session";
import { apiError, unauthorized } from "@/lib/api-response";
import {
  createAdminProject,
  listAdminProjects,
} from "@/features/admin/projects/repository";
import {
  projectInputSchema,
  projectListQuerySchema,
} from "@/features/admin/projects/schemas";

export async function GET(request: Request) {
  if (!(await getAdminSession(request.headers))) return unauthorized();
  try {
    const url = new URL(request.url);
    const query = projectListQuerySchema.parse(
      Object.fromEntries(url.searchParams.entries()),
    );
    return Response.json({ data: await listAdminProjects(query) });
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: Request) {
  if (!(await getAdminSession(request.headers))) return unauthorized();
  try {
    const input = projectInputSchema.parse(await request.json());
    const project = await createAdminProject(input);
    revalidateTag("projects", { expire: 0 });
    return Response.json({ data: project }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
