import { getAdminSession } from "@/lib/admin-session";
import { apiError, unauthorized } from "@/lib/api-response";
import { uploadProjectImage } from "@/lib/supabase-storage";
import { uploadSchema } from "@/features/admin/projects/schemas";

export async function POST(request: Request) {
  if (!(await getAdminSession(request.headers))) return unauthorized();
  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return Response.json(
        {
          error: {
            code: "MISSING_FILE",
            message: "Choose an image to upload.",
          },
        },
        { status: 400 },
      );
    }
    uploadSchema.parse({ type: file.type, size: file.size });
    return Response.json(
      { data: await uploadProjectImage(file) },
      { status: 201 },
    );
  } catch (error) {
    return apiError(error);
  }
}
