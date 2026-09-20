import { ProjectEditor } from "@/features/admin/projects/project-editor";

export default async function EditProjectPage({
  params,
}: PageProps<"/admin/projects/[id]">) {
  const { id } = await params;
  return <ProjectEditor id={id} />;
}
