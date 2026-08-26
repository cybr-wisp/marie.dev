import Link from "next/link";

import type { Project } from "@/types/content";

type ProjectRowProps = Readonly<{
  project: Project;
}>;

export function ProjectRow({
  project,
}: ProjectRowProps) {
  return (
    <Link
      className="project-row"
      href={`/projects/${project.slug}`}
      aria-label={`Open ${project.title} project`}
    >
      <span className="project-number">
        {project.number}
      </span>

      <div className="project-main">
        <h3 className="project-title">
          {project.title}
        </h3>

        <p className="project-summary copy-en">
          {project.summary.en}
        </p>

        <p className="project-summary copy-fr">
          {project.summary.fr}
        </p>
      </div>

      <div className="project-meta">
        <span className="project-year">
          {project.year}
        </span>

        <div
          className="project-tags"
          aria-label="Technologies"
        >
          {project.tags.map((tag) => (
            <span
              className="project-tag"
              key={tag}
            >
              {tag}
            </span>
          ))}
        </div>

        <span className="project-open">
          <span className="copy-en">
            OPEN →
          </span>

          <span className="copy-fr">
            OUVRIR →
          </span>
        </span>
      </div>
    </Link>
  );
}
