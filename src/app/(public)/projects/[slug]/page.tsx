import Image from "next/image";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { messages } from "@/i18n/messages";
import { getProjectBySlug, getProjects } from "@/features/projects/data";
import { pageMetadata } from "@/lib/site";
import { getAppLocale } from "@/i18n/get-locale";

export async function generateStaticParams() {
  return (await getProjects("th")).map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const locale = await getAppLocale();
  const project = await getProjectBySlug(locale, slug);
  if (!project) notFound();

  return pageMetadata(
    locale,
    `/projects/${slug}`,
    `${project.title} — golfsilly`,
    project.summary,
  );
}

export default async function ProjectPage({
  params,
}: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const locale = await getAppLocale();
  const project = await getProjectBySlug(locale, slug);
  if (!project) notFound();

  const t = messages[locale].projects;
  const all = await getProjects(locale);
  const next = all[(all.findIndex((p) => p.slug === slug) + 1) % all.length];

  return (
    <article className="container-shell page-space project-detail">
      <Link href="/projects" className="text-link">
        <ArrowLeft size={16} />
        {t.back}
      </Link>
      <header className="detail-heading">
        <p className="eyebrow">{project.category}</p>
        <h1>
          {project.title}
          <span className="brand-dot">.</span>
        </h1>
        <p>{project.summary}</p>
        {project.isFallback && (
          <span className="sample-badge">
            {t.fallback.replace(
              "{locale}",
              project.contentLocale.toUpperCase(),
            )}
          </span>
        )}
        {project.sample && <span className="sample-badge">{t.sample}</span>}
      </header>
      <div className={`detail-image tone-${project.tone}`}>
        <Image
          src={project.image}
          alt={project.imageAlt}
          width={1000}
          height={720}
          sizes="(max-width: 1200px) 92vw, 1200px"
          preload
        />
      </div>
      <div className="detail-body">
        <aside>
          <h2 className="eyebrow">{t.stack}</h2>
          <div className="tech-tags">
            {project.stack.map((tech) => (
              <span key={tech}>{tech}</span>
            ))}
          </div>
          <div className="project-external">
            {project.links.live && (
              <a
                className="text-link"
                href={project.links.live}
                target="_blank"
                rel="noreferrer"
              >
                {t.live}
                <ArrowUpRight size={16} />
              </a>
            )}
            {project.links.source && (
              <a
                className="text-link"
                href={project.links.source}
                target="_blank"
                rel="noreferrer"
              >
                {t.source}
                <ArrowUpRight size={16} />
              </a>
            )}
          </div>
        </aside>
        <div>
          {(["problem", "role", "approach", "outcome"] as const).map(
            (key, index) => (
              <section className="case-section" key={key}>
                <p className="eyebrow">0{index + 1}</p>
                <h2>{t[key]}</h2>
                <p>{project[key]}</p>
              </section>
            ),
          )}
          {project.sample && <p className="sample-disclaimer">{t.note}</p>}
        </div>
      </div>
      {next && next.slug !== slug && (
        <Link href={`/projects/${next.slug}`} className="next-project">
          <div>
            <p className="eyebrow">{t.next}</p>
            <h2>{next.title}</h2>
          </div>
          <ArrowUpRight size={40} strokeWidth={1} />
        </Link>
      )}
    </article>
  );
}
