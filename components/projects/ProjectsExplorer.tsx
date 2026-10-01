"use client";

import Link from "next/link";
import { useState } from "react";

import {
  abstractHref,
  caseStudyHref,
  hasCaseStudy,
} from "@/lib/projectLinks";
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

const ongoingProjects = new Set([
  "aurora-borealis",
  "helios",
  "tracellm",
]);

type Filter = "ALL" | ProjectCategory;

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
    <div className="projects-browser">
      <div
        className="project-filters"
        aria-label="Project filters"
      >
        {filters.map((filter) => (
          <button
            type="button"
            key={filter}
            className={
              activeFilter === filter
                ? "project-filter is-active"
                : "project-filter"
            }
            onClick={() =>
              setActiveFilter(filter)
            }
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="project-grid">
        {filteredProjects.map((project) => {
          const isOngoing =
            ongoingProjects.has(project.slug);

          const hasInternalPage =
            hasCaseStudy(project.slug);

          const abstract =
            abstractHref(project.slug);

          const card = (
            <div className="project-tile__surface">
              <div className="project-tile__topline">
                <span>{project.number}</span>

                <span>
                  {isOngoing
                    ? "ONGOING"
                    : project.year}
                </span>
              </div>

              <div className="project-tile__main">
                <p>{project.categories[0]}</p>
                <h2>{project.title}</h2>
              </div>

              <p className="project-tile__summary copy-en">
                {project.summary.en}
              </p>

              <p className="project-tile__summary copy-fr">
                {project.summary.fr}
              </p>
            </div>
          );

          return (
            <article
              className={`project-tile motion-card ${
                isOngoing
                  ? "project-tile--ongoing"
                  : ""
              }`}
              id={project.slug}
              key={project.slug}
            >
              {hasInternalPage ? (
                <Link
                  href={caseStudyHref(project.slug)}
                  aria-label={`Open ${project.title} case study`}
                >
                  {card}
                </Link>
              ) : project.repository ? (
                <a
                  href={project.repository}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open ${project.title} on GitHub`}
                >
                  {card}
                </a>
              ) : (
                card
              )}

              <div className="project-tile__meta">
                <div className="project-tile__tags">
                  {project.tags
                    .slice(0, 3)
                    .map((tag) => (
                      <span key={tag}>
                        {tag}
                      </span>
                    ))}
                </div>

                <div className="project-tile__links">
                  {isOngoing ? (
                    <span className="project-tile__status">
                      in progress
                    </span>
                  ) : null}

                  {hasInternalPage ? (
                    <Link
                      href={caseStudyHref(project.slug)}
                    >
                      case study ↗
                    </Link>
                  ) : null}

                  {abstract ? (
                    <a
                      href={abstract}
                      target="_blank"
                      rel="noreferrer"
                    >
                      abstract ↗
                    </a>
                  ) : null}

                  {project.repository ? (
                    <a
                      href={project.repository}
                      target="_blank"
                      rel="noreferrer"
                    >
                      github ↗
                    </a>
                  ) : null}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
