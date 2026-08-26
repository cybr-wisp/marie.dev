"use client";

import Link from "next/link";
import { useState } from "react";

import type {
  Project,
  ProjectCategory,
} from "@/types/content";

type ProjectsExplorerProps = Readonly<{
  projects: readonly Project[];
}>;

const filters = [
  "ALL",
  "RESEARCH",
  "AI / ML",
  "DEVELOPER TOOLS",
] as const;

type Filter =
  | "ALL"
  | ProjectCategory;

export function ProjectsExplorer({
  projects,
}: ProjectsExplorerProps) {
  const [activeFilter, setActiveFilter] =
    useState<Filter>("ALL");

  const filteredProjects =
    activeFilter === "ALL"
      ? projects
      : projects.filter((project) =>
          project.categories.includes(activeFilter),
        );

  return (
    <div className="work-browser">
      <div className="work-tools">
        <div
          className="work-filters"
          aria-label="Project filters"
        >
          {filters.map((filter) => (
            <button
              type="button"
              key={filter}
              className={
                activeFilter === filter
                  ? "work-filter is-active"
                  : "work-filter"
              }
              onClick={() =>
                setActiveFilter(filter)
              }
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="work-card-grid">
        {filteredProjects.map((project) => (
          <article
            className="work-card"
            key={project.slug}
          >
            <Link
              href={`/projects/${project.slug}`}
              className="work-card__link"
              aria-label={`Open ${project.title}`}
            >
              <div className="work-card__top">
                <span>{project.number}</span>
              </div>

              <div className="work-card__center">
                <span
                  className="work-card__bracket"
                  aria-hidden="true"
                >
                  [
                </span>

                <h2>{project.title}</h2>

                <span
                  className="work-card__bracket"
                  aria-hidden="true"
                >
                  ]
                </span>
              </div>

              <span className="work-card__view">
                VIEW PROJECT
                <span aria-hidden="true">↗</span>
              </span>

              <div className="work-card__bottom">
                <span>PROJECT {project.number}</span>
                <span>{project.year}</span>
              </div>
            </Link>

            <div className="work-card__meta">
              <h3>{project.title}</h3>

              <div className="work-card__tech">
                {project.tags
                  .slice(0, 4)
                  .map((tag) => (
                    <span
                      key={tag}
                      className="tech-badge"
                    >
                      {tag}
                    </span>
                  ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
