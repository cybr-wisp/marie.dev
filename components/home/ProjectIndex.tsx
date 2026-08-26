import Link from "next/link";

import { projects } from "@/content/projects";

export function ProjectIndex() {
  const featuredProjects = projects.slice(0, 2);

  return (
    <section
      className="index-work"
      id="work"
      aria-label="Featured projects"
    >
      <header className="index-masthead">
        <div className="index-masthead__copy">
          <p className="copy-en">
            <strong>hi, i&apos;m marie.</strong>
            <span>
              i build things at the intersection of mathematics,{" "}
              <span className="keep-together">
                machine learning
              </span>
              , and systems.
            </span>
          </p>

          <p className="copy-fr">
            <strong>salut, moi c&apos;est marie.</strong>
            <span>
              je construis des choses à l&apos;intersection
              des mathématiques, de l&apos;apprentissage automatique
              et des systèmes.
            </span>
          </p>
        </div>

        <div className="index-masthead__meta">
          <span>SELECTED · 02</span>
          <span>2026</span>
        </div>
      </header>

      <div className="index-exhibits">
        {featuredProjects.map((project) => (
          <article
            className="index-exhibit"
            key={project.slug}
          >
            <Link
              className="index-exhibit__object"
              href={`/projects/${project.slug}`}
              aria-label={`Open ${project.title}`}
            >
              <div className="index-exhibit__top">
                <span className="index-exhibit__number">
                  {project.number}
                </span>
              </div>

              <div className="index-exhibit__center">
                <span
                  className="index-exhibit__bracket"
                  aria-hidden="true"
                >
                  [
                </span>

                <h2>{project.title}</h2>

                <span
                  className="index-exhibit__bracket"
                  aria-hidden="true"
                >
                  ]
                </span>
              </div>

              <span className="index-exhibit__view">
                VIEW PROJECT
                <span aria-hidden="true">↗</span>
              </span>

              <div className="index-exhibit__footer">
                <span>PROJECT {project.number}</span>
                <span>{project.year}</span>
              </div>
            </Link>

            <div
              className="index-exhibit__hover-note"
              aria-hidden="true"
            >
              <svg
                className="index-exhibit__sketch-arrow"
                viewBox="0 0 180 140"
                aria-hidden="true"
              >
                <path
                  className="index-exhibit__sketch-stroke"
                  pathLength="1"
                  d="
                    M158 40
                    C147 13, 122 7, 98 9
                    C64 12, 42 33, 33 61
                    C28 77, 29 92, 36 106
                  "
                />

                <path
                  className="index-exhibit__sketch-head"
                  pathLength="1"
                  d="
                    M20 90
                    L36 106
                    L48 83
                  "
                />
              </svg>

              <div className="index-exhibit__description">
                <p className="copy-en">
                  {project.summary.en}
                </p>

                <p className="copy-fr">
                  {project.summary.fr}
                </p>
              </div>
            </div>

            <div className="index-exhibit__meta">
              <h3>{project.title}</h3>

              <div className="index-exhibit__tags">
                {project.tags
                  .slice(0, 3)
                  .map((tag) => (
                    <span key={tag}>
                      {tag}
                    </span>
                  ))}
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="field-notes-footer">
        <a
          href="https://github.com/cybr-wisp/marie.dev"
          target="_blank"
          rel="noreferrer"
        >
          <span className="copy-en">
            ACCESS FIELD NOTES →
          </span>
          <span className="copy-fr">
            ACCÉDER AUX NOTES DE TERRAIN →
          </span>
        </a>
      </div>

      <div className="index-projects-footer">
        <Link href="/projects">
          <span className="copy-en">
            ALL PROJECTS →
          </span>
          <span className="copy-fr">
            TOUS LES PROJETS →
          </span>
        </Link>
      </div>
    </section>
  );
}
