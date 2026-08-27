import type { Metadata } from "next";

import { ArchiveRail } from "@/components/chrome/ArchiveRail";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Marie Sindhu and marie.dev.",
};

const linkedinUrl =
  "https://www.linkedin.com/in/ACoAAFCaDngBeiBq3ohp7D5FYLxryNlIygc9FiA";

const technologies = [
  "PYTHON",
  "C++",
  "TYPESCRIPT",
  "SQL",
  "FASTAPI",
  "REACT",
  "DOCKER",
  "LINUX",
  "PYTORCH",
] as const;

const experience = [
  {
    period: "SEP — DEC 2026",
    role: "Incoming · Optical Software Engineering Intern",
    organization: "Nokia",
    description: {
      en:
        "Joining Nokia in Ottawa to work around optical systems, test automation, data analysis, and software for lab instrumentation.",
      fr:
        "Arrivée chez Nokia à Ottawa pour travailler sur les systèmes optiques, l'automatisation des tests, l'analyse de données et les logiciels pour l'instrumentation de laboratoire.",
    },
  },
  {
    period: "JAN 2026 — PRESENT",
    role: "Tutor",
    organization: "Tutorax",
    description: {
      en:
        "Teaching mathematics and computer science, from pre-algebra through data structures and algorithms.",
      fr:
        "Enseignement des mathématiques et de l'informatique, de la préalgèbre aux structures de données et aux algorithmes.",
    },
  },
  {
    period: "2024 — 2025",
    role: "Software Engineering + Machine Learning Intern",
    organization: "Inovedia Technologies",
    description: {
      en:
        "Worked across backend systems, Python evaluation tooling, SQL, cloud infrastructure, testing, and deployment automation.",
      fr:
        "Travail sur les systèmes backend, les outils d'évaluation Python, SQL, l'infrastructure cloud, les tests et l'automatisation du déploiement.",
    },
  },
] as const;

export default function AboutPage() {
  return (
    <main
      id="main-content"
      className="archive-page"
    >
      <div className="archive-frame">
        <ArchiveRail current="about" />

        <section className="archive-content archive-content--about">
          <header className="archive-header fade-up" style={{ animationDelay: "0.1s" }}>
            <div>
              <span className="archive-kicker">
                <span className="copy-en">
                  04 · ABOUT
                </span>

                <span className="copy-fr">
                  04 · À PROPOS
                </span>
              </span>

              <h1 className="archive-title">
                <span className="copy-en">
                  about
                </span>

                <span className="copy-fr">
                  à propos
                </span>
              </h1>
            </div>
          </header>

          <div className="about-grid">
            <div className="about-lead fade-up" style={{ animationDelay: "0.25s" }}>
              <p className="copy-en">
                i&apos;m an honours computer science undergrad at
                uottawa with a mathematics minor, currently building
                real-time geospatial pipelines in java and researching
                linguistic biomarker preservation in llm outputs.
                this fall, i&apos;m joining nokia for an optical
                software engineering co-op.
              </p>

              <p className="copy-fr">
                je suis étudiante au baccalauréat spécialisé en
                informatique à l&apos;Université d&apos;Ottawa avec
                une mineure en mathématiques, où je construis
                actuellement des pipelines géospatiaux en temps réel
                en java et j&apos;étudie la préservation des
                biomarqueurs linguistiques dans les sorties de llm.
                cet automne, je rejoindrai nokia pour un stage en
                génie logiciel optique.
              </p>
            </div>

            <div className="about-details fade-up" style={{ animationDelay: "0.4s" }}>
              <section>
                <span className="about-label">
                  STACK
                </span>

                <div className="about-stack">
                  {technologies.map((technology) => (
                    <span
                      className="about-stack__badge"
                      key={technology}
                    >
                      {technology}
                    </span>
                  ))}
                </div>
              </section>

              <section>
                <span className="about-label">
                  CURRENT
                </span>

                <p>
                  OTTAWA · CANADA
                  <br />
                  2026
                </p>
              </section>

              <section>
                <span className="about-label">
                  LINKS
                </span>

                <div className="about-links">
                  <a
                    href={siteConfig.github}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="GitHub"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M12 2.7a9.6 9.6 0 0 0-3 18.7c.5.1.7-.2.7-.5v-1.9c-2.8.6-3.4-1.2-3.4-1.2-.5-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-4.8 0-1.1.4-1.9 1-2.6-.1-.3-.4-1.3.1-2.6 0 0 .8-.3 2.7 1a9.4 9.4 0 0 1 4.9 0c1.9-1.3 2.7-1 2.7-1 .5 1.3.2 2.3.1 2.6.6.7 1 1.6 1 2.6 0 3.7-2.3 4.5-4.6 4.8.4.3.7.9.7 1.8v2.7c0 .3.2.6.7.5A9.6 9.6 0 0 0 12 2.7Z" />
                    </svg>

                    <span>GITHUB</span>
                  </a>

                  <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M5.2 8.3H2.1V21h3.1V8.3ZM3.7 3A1.8 1.8 0 1 0 3.7 6.6 1.8 1.8 0 0 0 3.7 3ZM21 13.7c0-3.8-2-5.6-4.7-5.6-2.2 0-3.1 1.2-3.7 2V8.3H9.5V21h3.1v-6.3c0-1.7.3-3.3 2.4-3.3 2 0 2 1.9 2 3.4V21H21v-7.3Z" />
                    </svg>

                    <span>LINKEDIN</span>
                  </a>
                </div>
              </section>
            </div>
          </div>

          <section
            className="about-experience fade-up"
            style={{ animationDelay: "0.55s" }}
            aria-labelledby="experience-heading"
          >
            <div className="about-experience__heading">
              <span className="about-label">
                01
              </span>

              <h2 id="experience-heading">
                EXPERIENCE
              </h2>
            </div>

            <div className="about-timeline">
              {experience.map((item, idx) => (
                <article
                  className="about-timeline__item fade-up"
                  style={{ animationDelay: `${0.65 + idx * 0.12}s` }}
                  key={`${item.period}-${item.role}`}
                >
                  <span
                    className="about-timeline__node"
                    aria-hidden="true"
                  />

                  <time className="about-timeline__period">
                    {item.period}
                  </time>

                  <div className="about-timeline__copy">
                    <h3>
                      {item.role}
                    </h3>

                    <span className="about-timeline__organization">
                      {item.organization}
                    </span>

                    <p className="copy-en">
                      {item.description.en}
                    </p>

                    <p className="copy-fr">
                      {item.description.fr}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </section>
      </div>

      <div className="field-notes-footer fade-up" style={{ animationDelay: "1s" }}>
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
