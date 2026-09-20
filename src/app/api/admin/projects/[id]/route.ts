import { revalidateTag } from "next/cache";
import { getAdminSession } from "@/lib/admin-session";
import { apiError, unauthorized } from "@/lib/api-response";
import { removeProjectImage } from "@/lib/supabase-storage";
import {
  getAdminProject,
  permanentlyDeleteProject,
  setProjectArchived,
  updateAdminProject,
} from "@/features/admin/projects/repository";
import {
  deleteProjectSchema,
  projectPatchSchema,
} from "@/features/admin/projects/schemas";

export async function GET(
  request: Request,
  context: RouteContext<"/api/admin/projects/[id]">,
) {
  if (!(await getAdminSession(request.headers))) return unauthorized();
  try {
    const { id } = await context.params;
    const project = await getAdminProject(id);
    if (!project)
      return Response.json(
        { error: { code: "NOT_FOUND", message: "Project not found." } },
        { status: 404 },
      );
    return Response.json({ data: project });
  } catch (error) {
    return apiError(error);
  }
}

export async function PATCH(
  request: Request,
  context: RouteContext<"/api/admin/projects/[id]">,
) {
  if (!(await getAdminSession(request.headers))) return unauthorized();
  try {
    const { id } = await context.params;
    const body = projectPatchSchema.parse(await request.json());
    const previous = body.intent === "save" ? await getAdminProject(id) : null;
    const project =
      body.intent === "archive"
        ? await setProjectArchived(id, body.archived)
        : await updateAdminProject(id, body.project);
    revalidateTag("projects", { expire: 0 });
    let storageCleanup = true;
    if (
      body.intent === "save" &&
      previous?.imagePath &&
      previous.imagePath !== body.project.imagePath
    ) {
      try {
        await removeProjectImage(previous.imagePath);
      } catch {
        storageCleanup = false;
      }
    }
    return Response.json({
      data: project,
      ...(storageCleanup
        ? {}
        : {
            warning:
              "The project was updated, but its previous image needs manual cleanup.",
          }),
    });
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(
  request: Request,
  context: RouteContext<"/api/admin/projects/[id]">,
) {
  if (!(await getAdminSession(request.headers))) return unauthorized();
  try {
    const { id } = await context.params;
    const { confirmationSlug } = deleteProjectSchema.parse(
      await request.json(),
    );
    const project = await permanentlyDeleteProject(id, confirmationSlug);
    if (!project) {
      return Response.json(
        { error: { code: "NOT_FOUND", message: "Project not found." } },
        { status: 404 },
      );
    }
    revalidateTag("projects", { expire: 0 });
    try {
      await removeProjectImage(project.imagePath);
      return Response.json({ data: { deleted: true, storageCleanup: true } });
    } catch {
      return Response.json({
        data: { deleted: true, storageCleanup: false },
        warning: "The project was deleted, but its image needs manual cleanup.",
      });
    }
  } catch (error) {
    return apiError(error);
  }
}
