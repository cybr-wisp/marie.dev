"use client";

import Link from "next/link";

import type { Project } from "@/types/content";

type ParaTraceCaseStudyProps = Readonly<{
  project: Project;
}>;

const technologies = [
  "Python",
  "scikit-learn",
  "spaCy",
  "Sentence Transformers",
  "SciPy",
  "pandas",
  "NumPy",
  "OpenAI",
  "Anthropic",
  "FastAPI",
  "React",
  "TypeScript",
] as const;

export function ParaTraceCaseStudy({
  project,
}: ParaTraceCaseStudyProps) {
  const repository =
    project.repository ??
    "https://github.com/cybr-wisp/paratrace-cym2026";

  return (
    <article className="pcs">
      <style>{CASE_STUDY_CSS}</style>

      <Link
        href="/projects"
        className="pcs__back"
      >
        ← all projects
      </Link>

      <div className="pcs__panel">
        <header className="pcs__hero">
          <p className="pcs__eyebrow">
            AI safety · applied ML · research · 2026
          </p>

          <h1>ParaTrace</h1>

          <p className="pcs__statement">
            Semantic fidelity is not necessarily downstream fidelity.
          </p>

          <p className="pcs__deck">
            ParaTrace investigates whether LLM rewriting can preserve the
            apparent meaning of clinical speech while silently erasing
            cognitive-linguistic structure used by downstream dementia
            classifiers.
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
              href="/docs/paratrace-abstract.pdf"
              target="_blank"
              rel="noreferrer"
              className="pcs__action"
            >
              Abstract ↗
            </a>

            <a
              href="https://github.com/cybr-wisp/paratrace-cym2026/blob/master/docs/research.md"
              target="_blank"
              rel="noreferrer"
              className="pcs__action"
            >
              Research ↗
            </a>
          </div>
        </header>

        <section
          className="pcs__metrics"
          aria-label="ParaTrace research highlights"
        >
          <article className="pcs__metric">
            <strong>552</strong>
            <span>clinically labelled transcripts</span>
          </article>

          <article className="pcs__metric">
            <strong>4,416</strong>
            <span>LLM rewrites</span>
          </article>

          <article className="pcs__metric">
            <strong>20</strong>
            <span>linguistic biomarkers</span>
          </article>

          <article className="pcs__metric">
            <strong>71.7 → 49.9%</strong>
            <span>classification · L0 to L3</span>
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
                Clinical AI is optimized to make speech cleaner. Cognitive
                models can depend on the parts being cleaned away.
              </h3>

              <p>
                Ambient clinical scribes and rewriting systems are designed to
                turn spontaneous speech into concise, readable documentation.
                They remove repetitions, disfluencies, incomplete phrases,
                grammatical errors, hesitations, and redundant language.
              </p>

              <p>
                That is useful for documentation, but computational
                cognitive-screening systems can rely on those exact surface
                patterns as predictive evidence. A note can therefore become
                easier for a clinician to read while becoming less useful to a
                classifier trained on spontaneous speech.
              </p>

              <div className="pcs__highlight">
                The central problem was not whether the rewritten transcript
                still meant approximately the same thing. It was whether the
                linguistic representation carrying diagnostic signal survived
                the rewrite.
              </div>
            </div>
          </section>

          <section className="pcs__section">
            <header className="pcs__label">
              <span>02</span>
              <h2>Experimental constraints</h2>
            </header>

            <div className="pcs__copy">
              <h3>
                The experiment had to isolate rewriting rather than accidentally
                measure leakage, changing folds, or model-specific randomness.
              </h3>

              <p>
                Several design choices mattered before any model result could be
                trusted.
              </p>

              <ul>
                <li>
                  Multiple transcripts can belong to the same participant, so
                  train/test separation had to happen at participant level.
                </li>

                <li>
                  Rewrite severity needed to increase systematically rather than
                  mixing unrelated prompting strategies.
                </li>

                <li>
                  Every L0–L4 condition needed aligned held-out participants.
                </li>

                <li>
                  Semantic preservation and biomarker preservation needed
                  separate measurements.
                </li>

                <li>
                  The effect needed to replicate across more than one LLM
                  provider.
                </li>
              </ul>

              <p>
                I therefore treated the rewrite level as the experimental
                intervention and kept the evaluation structure fixed around it.
              </p>
            </div>
          </section>

          <section className="pcs__section">
            <header className="pcs__label">
              <span>03</span>
              <h2>Design decisions</h2>
            </header>

            <div className="pcs__copy">
              <h3>
                Freeze everything possible and let rewriting be the variable
                that changes.
              </h3>

              <div className="pcs__decision-grid">
                <article className="pcs__decision">
                  <span>01</span>

                  <strong>PRESERVE RAW SPEECH</strong>

                  <p>
                    Parse CHAT transcripts without normalizing away the
                    linguistic phenomena the study is trying to measure.
                  </p>
                </article>

                <article className="pcs__decision">
                  <span>02</span>

                  <strong>GROUP BY PARTICIPANT</strong>

                  <p>
                    Prevent transcripts from the same participant from appearing
                    on both sides of evaluation.
                  </p>
                </article>

                <article className="pcs__decision">
                  <span>03</span>

                  <strong>REPLICATE BACKENDS</strong>

                  <p>
                    Run matched rewrite conditions using both OpenAI and
                    Anthropic instead of depending on one provider.
                  </p>
                </article>
              </div>

              <p>
                L0 represents the original speech. L1 performs grammar-level
                cleanup, L2 introduces light paraphrasing, L3 performs moderate
                reformulation, and L4 produces the strongest rewrite.
              </p>

              <p>
                The downstream classifier is anchored to the original
                cognitive-linguistic representation and evaluated against
                progressively transformed versions of the same underlying
                speech.
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
                Build a feature-level audit instead of reducing the experiment
                to a single accuracy number.
              </h3>

              <p>
                The pipeline extracts 20 linguistic biomarkers spanning several
                categories:
              </p>

              <ul>
                <li>lexical diversity;</li>
                <li>repetition and fluency;</li>
                <li>semantic coherence;</li>
                <li>syntactic complexity;</li>
                <li>idea and information density;</li>
                <li>word-finding behavior;</li>
                <li>vocabulary sophistication;</li>
                <li>content-unit preservation.</li>
              </ul>

              <p>
                For every rewrite level, I measured three separate outcomes:
                downstream classification performance, biomarker drift, and
                semantic similarity.
              </p>

              <p>
                Paired biomarker comparisons used Wilcoxon signed-rank tests
                with Benjamini-Hochberg false-discovery-rate correction so the
                analysis could distinguish systematic feature movement from
                noise across many simultaneous tests.
              </p>

              <p>
                Semantic similarity was measured independently using sentence
                embeddings. That mattered because a high semantic score could
                otherwise hide substantial structural changes in the language.
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
                Meaning stayed similar while predictive linguistic structure
                deteriorated.
              </h3>

              <p>
                Classification accuracy fell from <strong>71.7%</strong> at L0
                to <strong>65.0%</strong> at L1,{" "}
                <strong>57.0%</strong> at L2,{" "}
                <strong>49.9%</strong> at L3, and{" "}
                <strong>48.4%</strong> at L4.
              </p>

              <p>
                By L2, <strong>19 of 20 biomarkers</strong> showed significant
                shifts for both model backends after multiple-comparison
                correction.
              </p>

              <p>
                At the same time, semantic cosine similarity remained high:
                approximately <strong>0.864</strong> for Anthropic and{" "}
                <strong>0.849</strong> for OpenAI.
              </p>

              <div className="pcs__highlight">
                That is the failure mode ParaTrace exposes: a transformed
                transcript can remain semantically faithful to a human reader
                while no longer preserving the representation used by a
                downstream behavioral model.
              </div>

              <p className="pcs__note">
                The study uses 552 DementiaBank Pitt transcripts from 292
                participants and 4,416 generated rewrites.
              </p>
            </div>
          </section>

          <section className="pcs__section">
            <header className="pcs__label">
              <span>06</span>
              <h2>What I learned</h2>
            </header>

            <div className="pcs__copy">
              <h3>
                AI preprocessing should be evaluated against downstream
                invariants, not just readability and semantic similarity.
              </h3>

              <p>
                The project changed the way I think about AI transformation
                pipelines. A preprocessing step is not neutral simply because it
                preserves the apparent meaning of the input.
              </p>

              <p>
                If another model depends on stylistic, behavioral, temporal, or
                structural features, every transformation becomes an
                intervention on that feature space.
              </p>

              <p>
                The appropriate validation question is therefore not only
                “does the output look correct?” but also “which downstream
                properties were supposed to remain invariant, and did they?”
              </p>
            </div>
          </section>

          <section className="pcs__section">
            <header className="pcs__label">
              <span>07</span>
              <h2>Built with</h2>
            </header>

            <div className="pcs__copy">
              <h3>Implementation stack</h3>

              <div className="pcs__stack">
                {technologies.map((technology) => (
                  <span key={technology}>
                    {technology}
                  </span>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>

      <footer className="pcs__footer">
        <span>
          ParaTrace / AI safety / 2026
        </span>

        <Link href="/projects/microgrid-ml">
          next · microgrid ml →
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

  body:has(.pcs) .site-rule {
    display: none !important;
  }

  .pcs__back {
    display: inline-block;
    margin-bottom: 1.25rem;
    color: var(--muted);
    font-size: 0.72rem;
    text-decoration: none;
    transition: color 160ms ease;
  }

  .pcs__back:hover,
  .pcs__back:focus-visible {
    color: var(--blue);
  }

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
    font-size: 0.58rem;
    font-weight: 700;
    letter-spacing: 0.09em;
    text-transform: uppercase;
  }

  .pcs__hero h1 {
    margin-top: 0.75rem;
    font-family: var(--font-display);
    font-size: clamp(3.5rem, 7.5vw, 6.5rem);
    font-weight: 700;
    line-height: 0.87;
    letter-spacing: -0.07em;
  }

  .pcs__statement {
    max-width: 900px;
    margin-top: 1.45rem;
    color: var(--blue);
    font-family: var(--font-display);
    font-size: clamp(1.2rem, 2.15vw, 1.85rem);
    font-weight: 700;
    line-height: 1.07;
    letter-spacing: -0.035em;
  }

  .pcs__deck {
    max-width: 820px;
    margin-top: 1rem;
    color: #292929;
    font-size: 0.94rem;
    line-height: 1.6;
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
    min-height: 39px;
    padding: 0.62rem 0.88rem;
    border: 1px solid var(--blue);
    border-radius: 999px;
    color: var(--blue);
    font-family: var(--font-display);
    font-size: 0.59rem;
    font-weight: 700;
    letter-spacing: 0.045em;
    text-decoration: none;
    text-transform: uppercase;

    transition:
      background 180ms ease,
      color 180ms ease,
      transform 180ms ease;
  }

  .pcs__action:hover,
  .pcs__action:focus-visible {
    background: var(--blue);
    color: #fff;
    transform: translateY(-2px);
  }

  .pcs__metrics {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    border-bottom: 1px solid var(--line);
  }

  .pcs__metric {
    min-width: 0;
    min-height: 132px;
    padding: 1.4rem;
    border-right: 1px solid var(--line);
    background: var(--soft);
  }

  .pcs__metric:last-child {
    border-right: 0;
  }

  .pcs__metric strong {
    display: block;
    color: var(--blue);
    font-family: var(--font-display);
    font-size: clamp(1.5rem, 2.7vw, 2.45rem);
    font-weight: 700;
    line-height: 0.95;
    letter-spacing: -0.05em;
  }

  .pcs__metric span {
    display: block;
    max-width: 200px;
    margin-top: 0.6rem;
    color: var(--muted);
    font-family: var(--font-display);
    font-size: 0.54rem;
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

  .pcs__section:first-child {
    padding-top: 0;
  }

  .pcs__section:last-child {
    padding-bottom: 0;
    border-bottom: 0;
  }

  .pcs__label h2 {
    margin-top: 0.4rem;
    font-family: var(--font-display);
    font-size: 0.68rem;
    font-weight: 700;
    line-height: 1.05;
    text-transform: uppercase;
  }

  .pcs__copy h3 {
    max-width: 860px;
    font-family: var(--font-display);
    font-size: clamp(1.55rem, 2.9vw, 2.45rem);
    font-weight: 700;
    line-height: 1;
    letter-spacing: -0.04em;
  }

  .pcs__copy p,
  .pcs__copy li {
    max-width: 850px;
    font-size: 0.91rem;
    line-height: 1.66;
  }

  .pcs__copy p {
    margin-top: 0.95rem;
  }

  .pcs__copy ul {
    max-width: 850px;
    margin-top: 0.95rem;
    padding-left: 1.15rem;
  }

  .pcs__copy li + li {
    margin-top: 0.35rem;
  }

  .pcs__highlight {
    max-width: 850px;
    margin-top: 1.25rem;
    padding: 0.95rem 1.05rem;
    border-left: 3px solid var(--blue);
    background: var(--soft);
    font-size: 0.9rem;
    line-height: 1.58;
  }

  .pcs__decision-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    max-width: 950px;
    margin-top: 1.3rem;
    border-top: 1px solid var(--line);
    border-left: 1px solid var(--line);
  }

  .pcs__decision {
    min-width: 0;
    padding: 0.95rem;
    border-right: 1px solid var(--line);
    border-bottom: 1px solid var(--line);
  }

  .pcs__decision span {
    color: var(--blue);
    font-family: var(--font-display);
    font-size: 0.53rem;
    font-weight: 700;
    letter-spacing: 0.07em;
  }

  .pcs__decision strong {
    display: block;
    margin-top: 0.45rem;
    font-family: var(--font-display);
    font-size: 0.72rem;
    line-height: 1.08;
  }

  .pcs__decision p {
    margin-top: 0.45rem;
    color: var(--muted);
    font-size: 0.76rem;
    line-height: 1.44;
  }

  .pcs__stack {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 1.1rem;
  }

  .pcs__stack span {
    padding: 0.44rem 0.63rem;
    border: 1px solid rgba(0, 47, 167, 0.35);
    border-radius: 999px;
    color: var(--blue);
    font-family: var(--font-display);
    font-size: 0.56rem;
    font-weight: 700;
    letter-spacing: 0.035em;
    text-transform: uppercase;
  }

  .pcs__note {
    color: var(--muted);
    font-size: 0.81rem !important;
  }

  .pcs__footer {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    margin-top: 1.3rem;
    color: var(--muted);
    font-family: var(--font-display);
    font-size: 0.58rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .pcs__footer a {
    color: var(--blue);
    text-decoration: none;
  }

  @media (max-width: 850px) {
    .pcs__metrics {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .pcs__metric:nth-child(2) {
      border-right: 0;
    }

    .pcs__metric:nth-child(-n + 2) {
      border-bottom: 1px solid var(--line);
    }

    .pcs__section {
      grid-template-columns: 1fr;
      gap: 0.8rem;
    }

    .pcs__decision-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 520px) {
    .pcs {
      width: min(calc(100% - 1rem), 1280px);
    }

    .pcs__panel {
      border-radius: 18px;
    }

    .pcs__metrics {
      grid-template-columns: 1fr;
    }

    .pcs__metric {
      border-right: 0;
      border-bottom: 1px solid var(--line);
    }

    .pcs__metric:last-child {
      border-bottom: 0;
    }
  }
`;