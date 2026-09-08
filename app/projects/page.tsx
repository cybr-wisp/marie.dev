import type { Metadata } from "next";

import { ProjectsExplorer } from "@/components/projects/ProjectsExplorer";
import { projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "Software, systems, machine learning, and research projects.",
};

export default function ProjectsPage() {
  return (
    <main id="main-content" className="editorial-page editorial-projects">
      <section className="projects-shell" aria-labelledby="projects-title">
        <header className="section-heading">
          <span className="section-kicker copy-en">02 · PROJECTS</span>
          <span className="section-kicker copy-fr">02 · PROJETS</span>

          <h1 id="projects-title">
            <span className="copy-en">projects</span>
            <span className="copy-fr">projets</span>
          </h1>
        </header>

        <ProjectsExplorer projects={projects} />
      </section>
    </main>
  );
}
