import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { messages } from "@/i18n/messages";
import type { DatabaseProject } from "./types";

export function ProjectCard({
  project,
  locale,
  index = 0,
}: {
  project: DatabaseProject;
  locale: Locale;
  index?: number;
}) {
  const t = messages[locale].projects;
  return (
    <article className={`project-card tone-${project.tone}`}>
      <Link href={`/projects/${project.slug}`} className="project-link">
        <div className="project-visual">
          <div className="project-visual-top">
            <span className="mono">0{index + 1}</span>
            <span className="project-badges">
              {project.isFallback && (
                <span className="sample-badge">
                  {t.fallback.replace(
                    "{locale}",
                    project.contentLocale.toUpperCase(),
                  )}
                </span>
              )}
              {project.sample && (
                <span className="sample-badge">{t.sample}</span>
              )}
            </span>
          </div>
          <Image
            src={project.image}
            alt={project.imageAlt}
            width={1000}
            height={720}
            sizes="(max-width: 767px) 92vw, (max-width: 1023px) 45vw, 30vw"
          />
          <span className="project-open" aria-hidden="true">
            <ArrowUpRight size={23} />
          </span>
        </div>
        <div className="project-description">
          <p className="eyebrow">{project.category}</p>
          <h3>
            {project.title}
            <ArrowUpRight size={20} />
          </h3>
          <p>{project.summary}</p>
          <div className="tech-tags">
            {project.stack.map((tech) => (
              <span key={tech}>{tech}</span>
            ))}
          </div>
        </div>
      </Link>
    </article>
  );
}
