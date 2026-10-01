import Link from "next/link";

import { projects } from "@/content/projects";
import {
  caseStudyHref,
  hasCaseStudy,
} from "@/lib/projectLinks";

const featuredSlugs = [
  "vanguard-x",
  "aurora-borealis",
  "paratrace",
] as const;

const projectMetrics: Record<
  string,
  readonly [
    { value: string; label: string },
    { value: string; label: string },
  ]
> = {
  "vanguard-x": [
    {
      value: "21,348",
      label: "reports / sec",
    },
    {
      value: "18.45 ms",
      label: "p95 latency",
    },
  ],

  "aurora-borealis": [
    {
      value: "7.89M",
      label: "messages / sec",
    },
    {
      value: "38.573 μs",
      label: "p99 association",
    },
  ],

  paratrace: [
    {
      value: "4,416",
      label: "LLM rewrites",
    },
    {
      value: "552",
      label: "transcripts",
    },
  ],
};

export function SpotlightProjects() {
  const featuredProjects = featuredSlugs
    .map((slug) =>
      projects.find(
        (project) => project.slug === slug,
      ),
    )
    .filter(
      (
        project,
      ): project is (typeof projects)[number] =>
        project !== undefined,
    );

  return (
    <section
      id="featured-work"
      className="spotlight"
      aria-label="Featured projects"
    >
      <div className="spotlight__grid">
        {featuredProjects.map((project, index) => {
          const pageHref = hasCaseStudy(project.slug)
            ? caseStudyHref(project.slug)
            : project.repository ?? "/projects";

          const metrics =
            projectMetrics[project.slug];

          return (
            <article
              className="home-project"
              key={project.slug}
            >
              <Link
                href={pageHref}
                className="home-project__link"
                aria-label={`Open ${project.title} case study`}
              >
                <div className="home-project__surface">
                  <span className="home-project__number">
                    {index + 1}.0
                  </span>

                  <div className="home-project__center">
                    <span
                      className="home-project__bracket"
                      aria-hidden="true"
                    >
                      [
                    </span>

                    <h2>{project.title}</h2>

                    <span
                      className="home-project__bracket"
                      aria-hidden="true"
                    >
                      ]
                    </span>
                  </div>

                  <div className="home-project__description">
                    <p className="copy-en">
                      {project.summary.en}
                    </p>

                    <p className="copy-fr">
                      {project.summary.fr}
                    </p>

                    {metrics ? (
                      <div className="home-project__metrics">
                        {metrics.map((metric) => (
                          <div
                            className="home-project__metric"
                            key={metric.label}
                          >
                            <strong>
                              {metric.value}
                            </strong>

                            <span>
                              {metric.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>

                  <div className="home-project__view">
                    <span>
                      VIEW CASE STUDY
                    </span>

                    <span aria-hidden="true">
                      ↗
                    </span>
                  </div>

                  <div className="home-project__footer">
                    <span>
                      PROJECT {index + 1}.0
                    </span>

                    <span>
                      {project.year}
                    </span>
                  </div>
                </div>
              </Link>

              <div className="home-project__meta">
                <div className="home-project__meta-head">
                  <h3>
                    {project.title}
                  </h3>

                  {project.repository ? (
                    <a
                      href={project.repository}
                      target="_blank"
                      rel="noreferrer"
                      className="home-project__repo"
                    >
                      <span>
                        repo
                      </span>

                      <span aria-hidden="true">
                        ↗
                      </span>
                    </a>
                  ) : null}
                </div>

                <div className="home-project__tags">
                  {project.tags
                    .slice(0, 4)
                    .map((tag) => (
                      <span key={tag}>
                        {tag}
                      </span>
                    ))}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}