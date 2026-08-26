import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArchiveRail } from "@/components/chrome/ArchiveRail";
import { CanaryCaseStudy } from "@/components/projects/CanaryCaseStudy";
import { MicrogridCaseStudy } from "@/components/projects/MicrogridCaseStudy";
import { ParaTraceCaseStudy } from "@/components/projects/ParaTraceCaseStudy";
import { projects } from "@/content/projects";

type ProjectPageProps = Readonly<{
  params: Promise<{
    slug: string;
  }>;
}>;

export function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;

  const project = projects.find(
    (item) => item.slug === slug,
  );

  if (!project) {
    return {};
  }

  return {
    title: project.title,
    description: project.summary.en,
  };
}

export default async function ProjectPage({
  params,
}: ProjectPageProps) {
  const { slug } = await params;

  const project = projects.find(
    (item) => item.slug === slug,
  );

  if (!project) {
    notFound();
  }

  if (project.slug === "canary") {
    return (
      <CanaryCaseStudy
        project={project}
      />
    );
  }

  if (project.slug === "paratrace") {
    return (
      <ParaTraceCaseStudy
        project={project}
      />
    );
  }

  if (project.slug === "microgrid-ml") {
    return (
      <MicrogridCaseStudy
        project={project}
      />
    );
  }

  return (
    <main
      id="main-content"
      className="archive-page"
    >
      <div className="archive-frame">
        <ArchiveRail current="work" />

        <article className="case-study">
          <Link
            href="/projects"
            className="archive-back"
          >
            ← WORK
          </Link>

          <header className="case-header">
            <span className="case-number">
              [{project.number}]
            </span>

            <div>
              <h1>
                {project.title}
              </h1>

              <p className="case-intro copy-en">
                {project.intro.en}
              </p>

              <p className="case-intro copy-fr">
                {project.intro.fr}
              </p>
            </div>

            <div className="case-meta">
              <span>
                {project.year}
              </span>

              {project.tags.map((tag) => (
                <span key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          </header>

          <div className="case-sections">
            {project.sections.map(
              (section, index) => (
                <section
                  className="case-section"
                  key={section.label.en}
                >
                  <span className="case-section-number">
                    {String(index + 1).padStart(
                      2,
                      "0",
                    )}
                  </span>

                  <h2>
                    <span className="copy-en">
                      {section.label.en}
                    </span>

                    <span className="copy-fr">
                      {section.label.fr}
                    </span>
                  </h2>

                  <p className="copy-en">
                    {section.body.en}
                  </p>

                  <p className="copy-fr">
                    {section.body.fr}
                  </p>
                </section>
              ),
            )}
          </div>

          {project.repository ? (
            <a
              href={project.repository}
              target="_blank"
              rel="noreferrer"
              className="case-repository"
            >
              GITHUB ↗
            </a>
          ) : null}
        </article>
      </div>
    </main>
  );
}