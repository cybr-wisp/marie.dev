"use client";

import Link from "next/link";

import type { Project } from "@/types/content";

type MicrogridCaseStudyProps = Readonly<{
  project: Project;
}>;

const technologies = [
  "Python",
  "PyTorch",
  "LSTM",
  "scikit-learn",
  "Random Forest",
  "FastAPI",
  "Pydantic",
  "NumPy",
  "pandas",
  "pytest",
  "React",
  "Vite",
] as const;

export function MicrogridCaseStudy({
  project,
}: MicrogridCaseStudyProps) {
  const repository =
    project.repository ??
    "https://github.com/cybr-wisp/microgrid-ml-cym2025";

  return (
    <article className="pcs">
      <style>{`
        ${CASE_STUDY_CSS}
      `}</style>

      <Link href="/projects" className="pcs__back">
        ← all projects
      </Link>

      <div className="pcs__panel">
        <header className="pcs__hero">
          <p className="pcs__eyebrow">
            Applied ML · energy systems · 2025
          </p>

          <h1>MicroGrid ML</h1>

          <p className="pcs__statement">
            Forecast demand. Rank fault risk. Do not leak the future.
          </p>

          <p className="pcs__deck">
            A leakage-aware machine-learning pipeline for next-hour residential
            electricity forecasting and temporal fault-risk detection, built
            around honest validation rather than optimistic random splits.
          </p>

          <div className="pcs__actions">
            <a
              href={repository}
              target="_blank"
              rel="noreferrer"
              className="pcs__action"
            >
              GitHub ↗
            </a>

            <a
              href="/docs/microgrid-ml-abstract.pdf"
              target="_blank"
              rel="noreferrer"
              className="pcs__action"
            >
              Abstract ↗
            </a>
          </div>
        </header>

        <section className="pcs__metrics">
          <article className="pcs__metric">
            <strong>1.46M+</strong>
            <span>raw records</span>
          </article>

          <article className="pcs__metric">
            <strong>384,480</strong>
            <span>forecast windows</span>
          </article>

          <article className="pcs__metric">
            <strong>85.44%</strong>
            <span>MSE reduction vs persistence</span>
          </article>

          <article className="pcs__metric">
            <strong>0.803</strong>
            <span>mean held-out PR-AUC</span>
          </article>
        </section>

        <div className="pcs__body">
          <section className="pcs__section">
            <header className="pcs__label">
              <span>01</span>
              <h2>Problem</h2>
            </header>

            <div className="pcs__copy">
              <h3>
                Time-series models can look excellent for completely invalid
                reasons.
              </h3>

              <p>
                MicroGrid ML contains two linked tasks: forecasting next-hour
                residential demand and identifying degradation patterns in
                household generation signals.
              </p>

              <p>
                Both are particularly vulnerable to leakage. Adjacent time
                windows are highly correlated, while repeated observations from
                the same household can allow a fault model to learn household
                identity rather than generalizable degradation patterns.
              </p>

              <div className="pcs__highlight">
                The engineering problem became: how do I make it difficult for
                the model to win for the wrong reason?
              </div>
            </div>
          </section>

          <section className="pcs__section">
            <header className="pcs__label">
              <span>02</span>
              <h2>Constraints</h2>
            </header>

            <div className="pcs__copy">
              <h3>
                Forecasting and fault detection require different definitions of
                generalization.
              </h3>

              <ul>
                <li>
                  Forecast evaluation must preserve chronology.
                </li>
                <li>
                  Scaling statistics cannot be fitted on future observations.
                </li>
                <li>
                  Large geographic regions cannot dominate simply because they
                  contain more premises.
                </li>
                <li>
                  Fault evaluation must test entirely unseen households.
                </li>
                <li>
                  Fault labels are rare, so accuracy is not an informative
                  primary metric.
                </li>
              </ul>
            </div>
          </section>

          <section className="pcs__section">
            <header className="pcs__label">
              <span>03</span>
              <h2>Decisions</h2>
            </header>

            <div className="pcs__copy">
              <h3>
                Design the evaluation protocol before optimizing the models.
              </h3>

              <div className="pcs__decision-grid">
                <article className="pcs__decision">
                  <span>01</span>
                  <strong>CHRONOLOGICAL SPLIT</strong>
                  <p>
                    Strict 70/15/15 ordering prevents future observations from
                    entering training.
                  </p>
                </article>

                <article className="pcs__decision">
                  <span>02</span>
                  <strong>TRAIN-ONLY SCALING</strong>
                  <p>
                    Normalization statistics are fitted on training data and
                    frozen afterwards.
                  </p>
                </article>

                <article className="pcs__decision">
                  <span>03</span>
                  <strong>HOUSEHOLD HOLDOUT</strong>
                  <p>
                    Fault evaluation removes the target faulty household
                    entirely during training.
                  </p>
                </article>
              </div>

              <p>
                For fault detection, the decision threshold comes from the 99th
                percentile of normal-class out-of-bag scores instead of an
                arbitrary 0.50 probability threshold.
              </p>
            </div>
          </section>

          <section className="pcs__section">
            <header className="pcs__label">
              <span>04</span>
              <h2>Implementation</h2>
            </header>

            <div className="pcs__copy">
              <h3>
                Two tasks, two models, one reproducible preprocessing pipeline.
              </h3>

              <p>
                More than 1.46 million raw records are cleaned and transformed
                into 397,296 aggregated observations and 384,480 forecasting
                windows across 534 complete demand series.
              </p>

              <p>
                The forecasting branch uses a PyTorch LSTM over 24 hours of
                normalized demand plus cyclical calendar features.
              </p>

              <p>
                The fault branch uses a 500-tree class-balanced Random Forest
                over relative drops, first differences, and
                variance-normalized degradation features.
              </p>

              <p>
                Models, scalers, thresholds, and configuration are persisted and
                loaded behind FastAPI + Pydantic request contracts so inference
                does not depend on the training process being present.
              </p>
            </div>
          </section>

          <section className="pcs__section">
            <header className="pcs__label">
              <span>05</span>
              <h2>Result</h2>
            </header>

            <div className="pcs__copy">
              <h3>
                The models beat meaningful baselines under leakage-aware
                evaluation.
              </h3>

              <p>
                Forecast test normalized MSE was{" "}
                <strong>0.008363</strong> versus{" "}
                <strong>0.057425</strong> for persistence, an{" "}
                <strong>85.44% reduction</strong>.
              </p>

              <p>
                Fault detection achieved a mean held-out-household PR-AUC of{" "}
                <strong>0.803</strong> across the faulty households used for
                evaluation.
              </p>

              <p>
                The project was selected top 5 from 60+ CYM submissions and
                placed <strong>3rd overall</strong>.
              </p>

              <p className="pcs__note">
                The fault dataset contains only 63 labelled fault observations
                across three faulty households, so this demonstrates evaluation
                methodology rather than production-grade fault accuracy.
              </p>
            </div>
          </section>

          <section className="pcs__section">
            <header className="pcs__label">
              <span>06</span>
              <h2>Built with</h2>
            </header>

            <div className="pcs__copy">
              <h3>Implementation stack</h3>

              <div className="pcs__stack">
                {technologies.map((tech) => (
                  <span key={tech}>{tech}</span>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>

      <footer className="pcs__footer">
        <span>MicroGrid ML / applied ML / 2025</span>

        <Link href="/projects/vanguard-x">
          next · vanguard-x →
        </Link>
      </footer>
    </article>
  );
}

const CASE_STUDY_CSS = `
  .pcs {
    --blue: #002fa7;
    --text: #090909;
    --muted: #676767;
    --line: rgba(9, 9, 9, 0.18);
    --soft: rgba(0, 47, 167, 0.055);
    width: min(calc(100% - 2rem), 1280px);
    margin-inline: auto;
    padding: 2.5rem 0 6rem;
    color: var(--text);
  }

  body:has(.pcs) .site-rule { display: none !important; }

  .pcs__back {
    display: inline-block;
    margin-bottom: 1.25rem;
    color: var(--muted);
    font-size: 0.74rem;
    text-decoration: none;
  }

  .pcs__back:hover { color: var(--blue); }

  .pcs__panel {
    overflow: hidden;
    border: 1px solid var(--line);
    border-radius: 28px;
    background: #fff;
  }

  .pcs__hero {
    padding: clamp(2rem, 5vw, 4.6rem);
    border-bottom: 1px solid var(--line);
  }

  .pcs__eyebrow,
  .pcs__label span {
    color: var(--blue);
    font-family: var(--font-display);
    font-size: 0.59rem;
    font-weight: 700;
    letter-spacing: 0.09em;
    text-transform: uppercase;
  }

  .pcs__hero h1 {
    margin-top: 0.75rem;
    font-family: var(--font-display);
    font-size: clamp(3.5rem, 7.5vw, 6.5rem);
    line-height: 0.87;
    letter-spacing: -0.07em;
  }

  .pcs__statement {
    max-width: 900px;
    margin-top: 1.45rem;
    color: var(--blue);
    font-family: var(--font-display);
    font-size: clamp(1.25rem, 2.25vw, 1.95rem);
    font-weight: 700;
    line-height: 1.06;
    letter-spacing: -0.035em;
  }

  .pcs__deck {
    max-width: 820px;
    margin-top: 1rem;
    color: #292929;
    font-size: 0.98rem;
    line-height: 1.58;
  }

  .pcs__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    margin-top: 1.6rem;
  }

  .pcs__action {
    display: inline-flex;
    align-items: center;
    min-height: 40px;
    padding: 0.65rem 0.9rem;
    border: 1px solid var(--blue);
    border-radius: 999px;
    color: var(--blue);
    font-family: var(--font-display);
    font-size: 0.61rem;
    font-weight: 700;
    letter-spacing: 0.045em;
    text-decoration: none;
    text-transform: uppercase;
  }

  .pcs__action:hover {
    background: var(--blue);
    color: #fff;
  }

  .pcs__metrics {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    border-bottom: 1px solid var(--line);
  }

  .pcs__metric {
    min-height: 135px;
    padding: 1.45rem;
    border-right: 1px solid var(--line);
    background: var(--soft);
  }

  .pcs__metric:last-child { border-right: 0; }

  .pcs__metric strong {
    display: block;
    color: var(--blue);
    font-family: var(--font-display);
    font-size: clamp(1.55rem, 2.8vw, 2.55rem);
    line-height: 0.95;
    letter-spacing: -0.05em;
  }

  .pcs__metric span {
    display: block;
    margin-top: 0.6rem;
    color: var(--muted);
    font-family: var(--font-display);
    font-size: 0.56rem;
    font-weight: 700;
    line-height: 1.3;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .pcs__body {
    padding: clamp(2rem, 5vw, 4.6rem);
  }

  .pcs__section {
    display: grid;
    grid-template-columns: 145px minmax(0, 1fr);
    gap: clamp(1.8rem, 5vw, 5rem);
    padding: 2.6rem 0;
    border-bottom: 1px solid var(--line);
  }

  .pcs__section:first-child { padding-top: 0; }
  .pcs__section:last-child { border-bottom: 0; padding-bottom: 0; }

  .pcs__label h2 {
    margin-top: 0.4rem;
    font-family: var(--font-display);
    font-size: 0.7rem;
    text-transform: uppercase;
  }

  .pcs__copy h3 {
    max-width: 850px;
    font-family: var(--font-display);
    font-size: clamp(1.6rem, 3vw, 2.55rem);
    line-height: 1;
    letter-spacing: -0.04em;
  }

  .pcs__copy p,
  .pcs__copy li {
    max-width: 850px;
    font-size: 0.96rem;
    line-height: 1.63;
  }

  .pcs__copy p { margin-top: 1rem; }

  .pcs__copy ul {
    margin-top: 1rem;
    padding-left: 1.15rem;
  }

  .pcs__copy li + li { margin-top: 0.4rem; }

  .pcs__highlight {
    max-width: 850px;
    margin-top: 1.3rem;
    padding: 1rem 1.1rem;
    border-left: 3px solid var(--blue);
    background: var(--soft);
    font-size: 0.95rem;
    line-height: 1.55;
  }

  .pcs__decision-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    max-width: 950px;
    margin-top: 1.35rem;
    border-top: 1px solid var(--line);
    border-left: 1px solid var(--line);
  }

  .pcs__decision {
    padding: 0.95rem;
    border-right: 1px solid var(--line);
    border-bottom: 1px solid var(--line);
  }

  .pcs__decision span {
    color: var(--blue);
    font-size: 0.55rem;
    font-weight: 700;
  }

  .pcs__decision strong {
    display: block;
    margin-top: 0.45rem;
    font-family: var(--font-display);
    font-size: 0.74rem;
  }

  .pcs__decision p {
    margin-top: 0.45rem;
    color: var(--muted);
    font-size: 0.79rem;
    line-height: 1.42;
  }

  .pcs__stack {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 1.1rem;
  }

  .pcs__stack span {
    padding: 0.45rem 0.65rem;
    border: 1px solid rgba(0, 47, 167, 0.35);
    border-radius: 999px;
    color: var(--blue);
    font-family: var(--font-display);
    font-size: 0.58rem;
    font-weight: 700;
    text-transform: uppercase;
  }

  .pcs__note {
    color: var(--muted);
    font-size: 0.84rem !important;
  }

  .pcs__footer {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    margin-top: 1.3rem;
    color: var(--muted);
    font-family: var(--font-display);
    font-size: 0.6rem;
    font-weight: 700;
    text-transform: uppercase;
  }

  .pcs__footer a {
    color: var(--blue);
    text-decoration: none;
  }

  @media (max-width: 850px) {
    .pcs__metrics { grid-template-columns: repeat(2, 1fr); }
    .pcs__section { grid-template-columns: 1fr; gap: 0.8rem; }
    .pcs__decision-grid { grid-template-columns: 1fr; }
  }

  @media (max-width: 520px) {
    .pcs { width: min(calc(100% - 1rem), 1280px); }
    .pcs__metrics { grid-template-columns: 1fr; }

    .pcs__metric {
      border-right: 0;
      border-bottom: 1px solid var(--line);
    }
  }
`;