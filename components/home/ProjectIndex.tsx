import Link from "next/link";

import { projects } from "@/content/projects";
import { TypingHero } from "@/components/home/TypingHero";

function categoryLabel(category: string) {
  if (category === "AI / ML") return "APPLIED ML / AI";
  if (category === "DEVELOPER TOOLS") return "DEVELOPER TOOL";
  return category;
}

export function ProjectIndex() {
  const featuredProjects = projects.slice(0, 6);

  return (
    <section className="landing-work" id="work" aria-label="Selected projects">
      <TypingHero />

      <div className="landing-projects">
        {featuredProjects.map((project) => (
          <article className="landing-project" key={project.slug}>
            <Link
              href={`/projects/${project.slug}`}
              className="landing-project__card"
              aria-label={`Open ${project.title}`}
            >
              <div className="landing-project__top">
                <span>{project.number}</span>
              </div>

              <div className="landing-project__center">
                <span className="landing-project__bracket" aria-hidden="true">[</span>
                <h2>{project.title}</h2>
                <span className="landing-project__bracket" aria-hidden="true">]</span>
              </div>

              <div className="landing-project__description">
                <p className="copy-en">{project.summary.en}</p>
                <p className="copy-fr">{project.summary.fr}</p>
              </div>

              <div className="landing-project__view">
                <span>VIEW PROJECT</span>
                <span aria-hidden="true">↗</span>
              </div>

              <div className="landing-project__footer">
                <span>PROJECT {project.number}</span>
                <span>{project.year}</span>
              </div>
            </Link>

            <div className="landing-project__meta">
              <h3>{project.title}</h3>

              <div className="landing-project__meta-line">
                <div className="landing-project__tags">
                  {project.tags.slice(0, 3).map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>

                <span className="project-category-badge">
                  {categoryLabel(project.categories[0])}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      <Link href="/projects" className="landing-all-projects">
        <span className="copy-en">all projects ↗</span>
        <span className="copy-fr">tous les projets ↗</span>
      </Link>
    </section>
  );
}
