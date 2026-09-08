"use client";

import { useState } from "react";

import type { Project, ProjectCategory } from "@/types/content";

type ProjectsExplorerProps = Readonly<{
  projects: readonly Project[];
}>;

const filters = ["ALL", "RESEARCH", "AI / ML", "DEVELOPER TOOLS"] as const;

type Filter = "ALL" | ProjectCategory;

export function ProjectsExplorer({ projects }: ProjectsExplorerProps) {
  const [activeFilter, setActiveFilter] = useState<Filter>("ALL");

  const filteredProjects =
    activeFilter === "ALL"
      ? projects
      : projects.filter((project) => project.categories.includes(activeFilter));

  return (
    <div className="projects-browser">
      <div className="project-filters" aria-label="Project filters">
        {filters.map((filter) => (
          <button
            type="button"
            key={filter}
            className={
              activeFilter === filter
                ? "project-filter is-active"
                : "project-filter"
            }
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="project-grid">
        {filteredProjects.map((project) => (
          <article className="project-tile motion-card" id={project.slug} key={project.slug}>
            <div className="project-tile__surface">
              <div className="project-tile__topline">
                <span>{project.number}</span>
                <span>{project.year}</span>
              </div>

              <div className="project-tile__main">
                <p>{project.categories[0]}</p>
                <h2>{project.title}</h2>
              </div>

              <p className="project-tile__summary copy-en">{project.summary.en}</p>
              <p className="project-tile__summary copy-fr">{project.summary.fr}</p>
            </div>

            <div className="project-tile__meta">
              <div className="project-tile__tags">
                {project.tags.slice(0, 3).map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>

              {project.repository ? (
                <a href={project.repository} target="_blank" rel="noreferrer">
                  repo ↗
                </a>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
