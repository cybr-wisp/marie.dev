import type { Metadata } from "next";

import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: "About Marie Sindhu and marie.dev.",
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
    description:
      "Joining Nokia in Ottawa to work around optical systems, test automation, data analysis, and software for lab instrumentation.",
  },
  {
    period: "JAN 2026 — PRESENT",
    role: "Tutor",
    organization: "Tutorax",
    description:
      "Teaching mathematics and computer science, from pre-algebra through data structures and algorithms.",
  },
  {
    period: "2024 — 2025",
    role: "Software Engineering + Machine Learning Intern",
    organization: "Inovedia Technologies",
    description:
      "Worked across backend systems, Python evaluation tooling, SQL, cloud infrastructure, testing, and deployment automation.",
  },
] as const;

export default function AboutPage() {
  return (
    <main id="main-content" className="editorial-page editorial-about">
      <section className="about-shell" aria-labelledby="about-title">
        <header className="section-heading about-heading">
          <span className="section-kicker copy-en">03 · ABOUT</span>
          <span className="section-kicker copy-fr">03 · À PROPOS</span>

          <h1 id="about-title">
            <span className="copy-en">about me</span>
            <span className="copy-fr">à propos</span>
          </h1>
        </header>

        <div className="about-intro-grid">
          <div className="about-copy">
            <p className="copy-en">
              i’m an honours cs + math undergrad @uottawa, building a
              real-time geospatial system in java and researching how LLM
              rewriting affects linguistic biomarkers.
            </p>

            <p className="copy-en">
              this fall, i’m joining nokia as an optical swe. i like people
              with unconventional opinions who think critically and challenge
              assumptions. if that sounds like you, let’s talk. i’m always up
              to collaborate on an idea, product, research question, or project.
            </p>

            <p className="copy-fr">
              je suis étudiante en informatique + maths @uottawa. je construis
              un système géospatial temps réel en java et j’étudie comment la
              réécriture par LLM modifie les biomarqueurs linguistiques.
            </p>

            <p className="copy-fr">
              cet automne, je rejoins nokia en génie logiciel optique. j’aime
              les personnes qui pensent de façon indépendante, remettent les
              hypothèses en question et aiment construire. je suis toujours
              partante pour collaborer sur une idée, un produit ou un projet.
            </p>
          </div>

          <aside className="about-meta" aria-label="About details">
            <section>
              <span className="about-label">STACK</span>
              <div className="about-stack">
                {technologies.map((technology) => (
                  <span key={technology}>{technology}</span>
                ))}
              </div>
            </section>

            <section>
              <span className="about-label">CURRENT</span>
              <p>
                OTTAWA · CANADA
                <br />
                2026
              </p>
            </section>

            <section>
              <span className="about-label">LINKS</span>
              <div className="about-links">
                <a href={siteConfig.github} target="_blank" rel="noreferrer">
                  github
                </a>
                <a href={linkedinUrl} target="_blank" rel="noreferrer">
                  linkedin
                </a>
              </div>
            </section>
          </aside>
        </div>

        <section className="experience-section" aria-labelledby="experience-title">
          <div className="experience-label">
            <span>01</span>
            <h2 id="experience-title">EXPERIENCE</h2>
          </div>

          <div className="experience-timeline">
            {experience.map((item) => (
              <article className="experience-item" key={`${item.period}-${item.role}`}>
                <span className="experience-node" aria-hidden="true" />
                <time>{item.period}</time>
                <div className="experience-copy">
                  <h3>{item.role}</h3>
                  <span>{item.organization}</span>
                  <p>{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
