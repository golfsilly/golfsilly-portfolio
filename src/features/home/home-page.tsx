import {
  ArrowDown,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Braces,
  Code2,
  Layers3,
  MoveUpRight,
  Orbit,
  Sparkles,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { messages } from "@/i18n/messages";
import { profile } from "@/content/profile";
import { getProjects } from "@/features/projects/data";
import { ProjectCard } from "@/features/projects/project-card";
import { HomeMotion } from "@/components/motion/home-motion";
import { Reveal } from "@/components/motion/reveal";
import { ContactActions } from "./contact-actions";

export async function HomePage({ locale }: { locale: Locale }) {
  const t = messages[locale].home;
  const projects = (await getProjects(locale)).filter(
    (project) => project.featured,
  );
  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-grid" aria-hidden="true" />
        <div className="container-shell hero-inner">
          <div className="hero-copy">
            <p className="eyebrow hero-eyebrow">
              <span className="status-dot" />
              {t.eyebrow}
            </p>
            <h1 id="hero-title">
              {t.title}
              <br />
              <span>{t.titleAccent}</span>
            </h1>
            <p className="hero-intro">{t.intro}</p>
            <div className="hero-actions">
              <Link href="/projects" className="button-primary">
                {t.cta}
                <ArrowUpRight size={19} />
              </Link>
              <a href="#about" className="button-text">
                {t.secondary}
                <ArrowRight size={17} />
              </a>
            </div>
            <div className="hero-signature">
              <span className="signature-line" />
              <span className="mono">GOLFSILLY / PORTFOLIO</span>
            </div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <span className="art-label mono">
              FIG. 001 — CONTINUOUS EXPLORATION
            </span>
            <div className="orbital-art">
              <div className="orbital-glow" />
              <div className="orbit-ring orbit-ring-one" />
              <div className="orbit-ring orbit-ring-two" />
              <div className="orbit-ring orbit-ring-three" />
              <div className="orbit-ring orbit-ring-four" />
              <div className="orb-core">
                <span>
                  g<span>.</span>
                </span>
              </div>
              <div className="orbit-satellite satellite-one" />
              <div className="orbit-satellite satellite-two" />
            </div>
            <div className="art-caption mono">
              <span>CREATIVE SYSTEM_01</span>
              <span className="art-cross">+</span>
              <span>IDEAS IN ORBIT</span>
            </div>
          </div>
          <div className="hero-bottom">
            <a href="#work" className="scroll-cue mono">
              <ArrowDown size={15} />
              {t.scroll}
            </a>
            <span className="hero-coordinate mono">
              {t.coordinate}
              <span className="tiny-plus">+</span>
            </span>
          </div>
        </div>
      </section>

      <div className="tool-rail" aria-label={t.stackTitle}>
        <div className="container-shell">
          {[
            "Next.js",
            "TypeScript",
            "React",
            "shadcn/ui",
            "Motion",
            "GSAP",
          ].map((tool) => (
            <span key={tool}>
              <span className="rail-star" aria-hidden="true">
                ✳
              </span>
              {tool}
            </span>
          ))}
        </div>
      </div>

      <section
        id="work"
        className="section-space container-shell"
        aria-labelledby="work-title"
      >
        <div className="section-heading">
          <div>
            <p className="eyebrow">{t.workLabel}</p>
            <h2 id="work-title">{t.workTitle}</h2>
          </div>
          <Link href="/projects" className="text-link">
            {t.allWork}
            <ArrowUpRight size={18} />
          </Link>
        </div>
        <p className="section-intro">{t.workDescription}</p>
        <div className="work-rule" aria-hidden="true">
          <span className="work-progress" />
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
      </section>

      <section
        id="about"
        className="about-section section-space"
        aria-labelledby="about-title"
      >
        <div className="container-shell about-layout">
          <div className="about-heading">
            <p className="eyebrow">{t.aboutLabel}</p>
            <h2 id="about-title" className="preserve-lines">
              {t.aboutTitle}
            </h2>
            <ArrowDownRight
              className="about-arrow"
              size={70}
              strokeWidth={1}
              aria-hidden="true"
            />
            <div className="about-symbol" aria-hidden="true">
              <Braces size={80} strokeWidth={1} />
              <span className="mono">ENDLESS POSSIBILITIES.</span>
            </div>
          </div>
          <div className="about-copy">
            <p className="about-lead">{t.aboutBody}</p>
            <p className="about-note">{t.aboutNote}</p>
            <div className="principles">
              {[
                {
                  title: t.principleOne,
                  body: t.principleOneBody,
                  Icon: Code2,
                },
                {
                  title: t.principleTwo,
                  body: t.principleTwoBody,
                  Icon: Sparkles,
                },
                {
                  title: t.principleThree,
                  body: t.principleThreeBody,
                  Icon: Orbit,
                },
              ].map(({ title, body, Icon }, i) => (
                <div className="principle" key={title}>
                  <span className="principle-number mono">0{i + 1}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{body}</p>
                  </div>
                  <Icon size={19} aria-hidden="true" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="stack"
        className="section-space container-shell"
        aria-labelledby="stack-title"
      >
        <div className="section-heading">
          <div>
            <p className="eyebrow">{t.stackLabel}</p>
            <h2 id="stack-title">{t.stackTitle}</h2>
          </div>
          <Layers3
            className="section-icon"
            size={34}
            strokeWidth={1.3}
            aria-hidden="true"
          />
        </div>
        <p className="section-intro">{t.stackBody}</p>
        <div className="stack-grid">
          {(["frontend", "backend", "animation"] as const).map((group, i) => (
            <Reveal className="stack-card" key={group}>
              <div className="stack-card-label">
                <span className="mono">0{i + 1}</span>
                <h3>{t[group]}</h3>
              </div>
              <div className="stack-tools">
                {profile.toolkit[group].map((tool) => (
                  <span key={tool}>
                    {tool}
                    <MoveUpRight size={12} aria-hidden="true" />
                  </span>
                ))}
              </div>
              {group === "backend" && (
                <p className="stack-note">{t.backendNote}</p>
              )}
            </Reveal>
          ))}
        </div>
      </section>

      <section
        id="contact"
        className="contact-section section-space"
        aria-labelledby="contact-title"
      >
        <div className="container-shell">
          <p className="eyebrow">{t.contactLabel}</p>
          <div className="contact-heading">
            <h2 id="contact-title" className="preserve-lines">
              {t.contactTitle}
            </h2>
            <ArrowUpRight
              className="contact-arrow"
              size={96}
              strokeWidth={1}
              aria-hidden="true"
            />
          </div>
          <div className="contact-bottom">
            <p>{t.contactBody}</p>
            <div>
              {profile.email ? (
                <ContactActions email={profile.email} />
              ) : (
                <p className="contact-pending">
                  <span className="status-dot" />
                  {t.contactPending}
                </p>
              )}
              {profile.socials.length > 0 && (
                <div className="social-links">
                  {profile.socials.map((social) => (
                    <a
                      key={social.url}
                      href={social.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {social.label}
                      <ArrowUpRight size={15} />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <HomeMotion />
    </>
  );
}
