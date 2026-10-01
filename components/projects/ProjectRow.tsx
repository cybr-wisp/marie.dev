import Link from "next/link";

import type { Project } from "@/types/content";

type ProjectRowProps = Readonly<{
  project: Project;
}>;

const ongoingProjects = new Set([
  "helios",
  "tracellm",
]);

export function ProjectRow({
  project,
}: ProjectRowProps) {
  const isOngoing =
    ongoingProjects.has(project.slug);

  const content = (
    <>
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
          {isOngoing
            ? "IN PROGRESS"
            : project.year}
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
          {isOngoing ? (
            <>
              <span className="copy-en">
                ONGOING
              </span>

              <span className="copy-fr">
                EN COURS
              </span>
            </>
          ) : (
            <>
              <span className="copy-en">
                OPEN →
              </span>

              <span className="copy-fr">
                OUVRIR →
              </span>
            </>
          )}
        </span>
      </div>
    </>
  );

  if (isOngoing) {
    return (
      <div
        className="project-row project-row--ongoing"
        id={project.slug}
        aria-label={`${project.title} — project in progress`}
      >
        {content}
      </div>
    );
  }

  return (
    <Link
      className="project-row"
      href={`/projects/${project.slug}`}
      aria-label={`Open ${project.title} project`}
    >
      {content}
    </Link>
  );
}