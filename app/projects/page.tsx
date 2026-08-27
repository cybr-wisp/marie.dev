import type { Metadata } from "next";

import { ArchiveRail } from "@/components/chrome/ArchiveRail";
import { ProjectsExplorer } from "@/components/projects/ProjectsExplorer";
import { projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Software, systems, machine learning, and research projects.",
};

export default function ProjectsPage() {
  return (
    <main
      id="main-content"
      className="archive-page"
    >
      <div className="archive-frame">
        <ArchiveRail current="work" />

        <section className="archive-content archive-content--work">
          <header className="archive-header fade-up" style={{ animationDelay: "0.1s" }}>
            <div>
              <span className="archive-kicker">
                <span className="copy-en">
                  02 · PROJECTS
                </span>

                <span className="copy-fr">
                  02 · PROJETS
                </span>
              </span>

              <h1 className="archive-title">
                <span className="copy-en">
                  projects
                </span>

                <span className="copy-fr">
                  projets
                </span>
              </h1>
            </div>
          </header>

          <ProjectsExplorer projects={projects} />
        </section>
      </div>

      <div className="field-notes-footer fade-up" style={{ animationDelay: "0.6s" }}>
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
    </main>
  );
}
