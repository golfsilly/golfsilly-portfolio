import type { Locale } from "@/i18n/routing";
import { policyCopy } from "@/content/policies";

export function PolicyPage({
  locale,
  type,
}: {
  locale: Locale;
  type: "privacy" | "cookies";
}) {
  const copy = policyCopy[locale][type];

  return (
    <article className="policy-document page-space">
      <header className="page-heading">
        <p className="eyebrow">{copy.label}</p>
        <h1>{copy.title}</h1>
        <p className="section-intro">{copy.intro}</p>
        <p className="policy-meta">{copy.effectiveDate}</p>
      </header>
      <div className="policy-sections">
        {copy.sections.map((section) => (
          <section className="policy-section" key={section.title}>
            <h2>{section.title}</h2>
            {section.paragraphs?.map((paragraph) => (
              <p
                className={
                  section.placeholder ? "policy-placeholder" : undefined
                }
                key={paragraph}
              >
                {paragraph}
              </p>
            ))}
            {section.items && (
              <ul>
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </article>
  );
}
