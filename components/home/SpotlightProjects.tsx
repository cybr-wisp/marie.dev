import Link from "next/link";

import { projects } from "@/content/projects";

const featuredSlugs = [
  "vanguard-x",
  "aurora-borealis",
  "paratrace",
] as const;

const spotlightDetails: Record<
  string,
  {
    displayNumber: string;
    repo: string;
    tags: string[];
    metrics: {
      value: string;
      label: string;
    }[];
  }
> = {
  "vanguard-x": {
    displayNumber: "1.0",
    repo: "https://github.com/cybr-wisp/vanguard-x",
    tags: [
      "JAVA",
      "KAFKA",
      "REDIS",
      "PROTOBUF",
    ],
    metrics: [
      {
        value: "23K",
        label: "events / sec",
      },
      {
        value: "~12 ms",
        label: "p99 latency",
      },
    ],
  },

  "aurora-borealis": {
    displayNumber: "2.0",
    repo: "https://github.com/cybr-wisp/aurora-borealis",
    tags: [
      "PYTHON",
      "C++",
      "EKF",
      "UKF",
    ],
    metrics: [
      {
        value: "91.97%",
        label: "RMSE reduction",
      },
      {
        value: "1.37 m",
        label: "tracking RMSE",
      },
    ],
  },

  paratrace: {
    displayNumber: "3.0",
    repo: "https://github.com/cybr-wisp/paratrace-cym2026",
    tags: [
      "PYTHON",
      "NLP",
      "SCIKIT-LEARN",
      "LLM EVAL",
    ],
    metrics: [
      {
        value: "4,416",
        label: "LLM rewrites",
      },
      {
        value: "21.2 pt",
        label: "accuracy drop",
      },
    ],
  },
};

const featuredProjects = featuredSlugs.flatMap((slug) => {
  const project = projects.find(
    (candidate) => candidate.slug === slug,
  );

  return project ? [project] : [];
});

export function SpotlightProjects() {
  return (
    <section
      id="featured-work"
      className="spotlight"
      aria-label="Featured projects"
    >
      <div className="spotlight__grid">
        {featuredProjects.map((project) => {
          const spotlight =
            spotlightDetails[project.slug];

          return (
            <article
              className="home-project"
              key={project.slug}
            >
              <Link
                href={`/projects/${project.slug}`}
                className="home-project__link"
                aria-label={`Open ${project.title}`}
              >
                <div className="home-project__surface">
                  <span className="home-project__number">
                    {spotlight.displayNumber}
                  </span>

                  <div className="home-project__center">
                    <span
                      className="home-project__bracket"
                      aria-hidden="true"
                    >
                      [
                    </span>

                    <h2>
                      {project.title}
                    </h2>

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

                    <div className="home-project__metrics">
                      {spotlight.metrics.map(
                        (metric) => (
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
                        ),
                      )}
                    </div>
                  </div>

                  <div className="home-project__view">
                    <span>
                      VIEW PROJECT
                    </span>

                    <span aria-hidden="true">
                      {"\u2197"}
                    </span>
                  </div>

                  <div className="home-project__footer">
                    <span>
                      PROJECT {spotlight.displayNumber}
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

                  <a
                    href={spotlight.repo}
                    target="_blank"
                    rel="noreferrer"
                    className="home-project__repo"
                    aria-label={`${project.title} repository`}
                  >
                    <span>repo</span>
                    <span aria-hidden="true">
                      {"\u2197"}
                    </span>
                  </a>
                </div>

                <div className="home-project__tags">
                  {spotlight.tags.map((tag) => (
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
