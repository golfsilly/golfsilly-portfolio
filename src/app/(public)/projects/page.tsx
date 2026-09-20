import { messages } from "@/i18n/messages";
import { getProjects } from "@/features/projects/data";
import { ProjectCard } from "@/features/projects/project-card";
import { pageMetadata } from "@/lib/site";
import { getAppLocale } from "@/i18n/get-locale";

export async function generateMetadata() {
  const locale = await getAppLocale();
  return pageMetadata(
    locale,
    "/projects",
    `${messages[locale].meta.projects} — golfsilly`,
  );
}

export default async function ProjectsPage() {
  const locale = await getAppLocale();
  const t = messages[locale].projects;
  const projects = await getProjects(locale);

  return (
    <div className="container-shell page-space">
      <header className="page-heading">
        <p className="eyebrow">{t.eyebrow}</p>
        <h1 className="preserve-lines">{t.title}</h1>
        <p className="section-intro">{t.intro}</p>
      </header>
      <div className="collection-label mono">
        <span>{t.count}</span>
        <span>({String(projects.length).padStart(2, "0")})</span>
      </div>
      <div className="projects-grid">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.slug}
            project={project}
            locale={locale}
            index={index}
          />
        ))}
      </div>
      {!projects.length && <p>{t.empty}</p>}
    </div>
  );
}
