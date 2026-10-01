"use client";

import Link from "next/link";

import type { Project } from "@/types/content";

type CanaryCaseStudyProps = Readonly<{
  project: Project;
}>;

const technologies = [
  "Python 3.11+",
  "AST",
  "FastAPI",
  "GitHub Apps",
  "Checks API",
  "Typer",
  "Rich",
  "Pydantic",
  "HTTPX",
  "pytest",
  "GitHub Actions",
] as const;

export function CanaryCaseStudy({
  project,
}: CanaryCaseStudyProps) {
  const repository =
    project.repository ??
    "https://github.com/cybr-wisp/canary";

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
            Developer tools · static analysis · 2026
          </p>

          <h1>Canary</h1>

          <p className="pcs__statement">
            What existing code could this change break?
          </p>

          <p className="pcs__deck">
            Canary is a deterministic, repository-aware
            compatibility analyzer for Python pull requests.
            It compares API contracts across BASE and HEAD,
            traces changed symbols into real call sites, and
            proves which existing calls no longer satisfy the
            new contract.
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
          </div>
        </header>

        <section
          className="pcs__metrics"
          aria-label="Canary benchmark highlights"
        >
          <article className="pcs__metric">
            <strong>64.45 ms</strong>
            <span>median analysis latency</span>
          </article>

          <article className="pcs__metric">
            <strong>118,549</strong>
            <span>lines analyzed / second</span>
          </article>

          <article className="pcs__metric">
            <strong>100 / 100</strong>
            <span>semantic mutation cases</span>
          </article>

          <article className="pcs__metric">
            <strong>50 / 50</strong>
            <span>identical repeated executions</span>
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
                Valid Python can still introduce a
                repository-level breaking change.
              </h3>

              <p>
                A pull request can modify a function
                signature, pass syntax checks, satisfy the
                project&apos;s current tests, and still break
                an existing caller that the test suite never
                exercises.
              </p>

              <p>
                Consider a function changing from:
              </p>

              <div className="pcs__highlight">
                authenticate(token) → authenticate(token,
                strict)
              </div>

              <p>
                The new function definition is valid Python.
                The existing caller is also valid Python.
                The incompatibility only becomes visible when
                those two pieces of code are analyzed together.
              </p>

              <p>
                That makes semantic compatibility a
                repository-level problem rather than a
                file-level diff problem.
              </p>
            </div>
          </section>

          <section className="pcs__section">
            <header className="pcs__label">
              <span>02</span>
              <h2>Constraints</h2>
            </header>

            <div className="pcs__copy">
              <h3>
                Python&apos;s flexibility makes false certainty
                dangerous.
              </h3>

              <p>
                Static analysis has to reason about more than
                simple positional function calls.
              </p>

              <ul>
                <li>
                  imports can be aliased or relative;
                </li>

                <li>
                  parameters can be positional-only or
                  keyword-only;
                </li>

                <li>
                  calls may contain <code>*args</code> and{" "}
                  <code>**kwargs</code>;
                </li>

                <li>
                  defaults can disappear between BASE and
                  HEAD;
                </li>

                <li>
                  sync functions can become async;
                </li>

                <li>
                  public functions can disappear entirely;
                </li>

                <li>
                  dynamic dispatch and reflection cannot
                  always be resolved safely.
                </li>
              </ul>

              <p>
                A useful analyzer therefore cannot simply
                label every unresolved case safe or broken.
              </p>
            </div>
          </section>

          <section className="pcs__section">
            <header className="pcs__label">
              <span>03</span>
              <h2>Design</h2>
            </header>

            <div className="pcs__copy">
              <h3>
                Separate API change detection from caller
                impact analysis.
              </h3>

              <div className="pcs__decision-grid">
                <article className="pcs__decision">
                  <span>01</span>

                  <strong>EXTRACT CONTRACTS</strong>

                  <p>
                    Parse BASE and HEAD Python APIs into
                    structured AST-derived callable
                    contracts.
                  </p>
                </article>

                <article className="pcs__decision">
                  <span>02</span>

                  <strong>INDEX CALL SITES</strong>

                  <p>
                    Build a repository-wide index of imports,
                    aliases, symbols, and candidate calls.
                  </p>
                </article>

                <article className="pcs__decision">
                  <span>03</span>

                  <strong>RE-BIND ARGUMENTS</strong>

                  <p>
                    Apply existing positional and keyword
                    arguments against the changed signature.
                  </p>
                </article>
              </div>

              <p>
                This separates the question:
              </p>

              <div className="pcs__highlight">
                “Did an API change?” from “Which existing
                callers are actually incompatible with that
                change?”
              </div>

              <p>
                That distinction is what prevents Canary from
                turning every signature change into a noisy
                pull-request warning.
              </p>
            </div>
          </section>

          <section className="pcs__section">
            <header className="pcs__label">
              <span>04</span>
              <h2>Static binding</h2>
            </header>

            <div className="pcs__copy">
              <h3>
                Reconstruct Python argument binding instead
                of relying on text matching.
              </h3>

              <p>
                Canary validates calls using the structure of
                the new function signature. It checks whether
                existing arguments still satisfy the changed
                contract.
              </p>

              <p>
                This includes:
              </p>

              <ul>
                <li>missing required arguments;</li>
                <li>removed keyword parameters;</li>
                <li>duplicate argument bindings;</li>
                <li>positional-only violations;</li>
                <li>keyword-only violations;</li>
                <li>removed defaults;</li>
                <li>argument ordering changes;</li>
                <li>await / non-await mismatches.</li>
              </ul>

              <p>
                Because the analysis understands argument
                semantics, two identical-looking signature
                diffs can produce different results depending
                on how the repository actually calls the
                function.
              </p>
            </div>
          </section>

          <section className="pcs__section">
            <header className="pcs__label">
              <span>05</span>
              <h2>Abstention</h2>
            </header>

            <div className="pcs__copy">
              <h3>
                UNKNOWN is a valid result when the evidence
                is insufficient.
              </h3>

              <p>
                Canary produces three outcomes rather than
                forcing a binary safe/broken decision.
              </p>

              <ul>
                <li>
                  <strong>BREAKS</strong> — incompatibility can
                  be proven from static evidence.
                </li>

                <li>
                  <strong>UNAFFECTED</strong> — the existing
                  call continues to satisfy the new contract.
                </li>

                <li>
                  <strong>UNKNOWN</strong> — static analysis
                  cannot safely prove either conclusion.
                </li>
              </ul>

              <p>
                This matters for dynamic Python behavior.
                Reflection, runtime-created arguments, or
                unresolved dispatch should not silently become
                false confidence.
              </p>

              <div className="pcs__highlight">
                Canary would rather explicitly abstain than
                manufacture certainty it cannot justify.
              </div>
            </div>
          </section>

          <section className="pcs__section">
            <header className="pcs__label">
              <span>06</span>
              <h2>Rules</h2>
            </header>

            <div className="pcs__copy">
              <h3>
                Compatibility rules represent different
                classes of semantic breakage.
              </h3>

              <p>
                The rule engine covers seven primary change
                classes:
              </p>

              <ul>
                <li>required parameter added;</li>
                <li>parameter removed;</li>
                <li>parameter reordered;</li>
                <li>default removed;</li>
                <li>return annotation changed;</li>
                <li>sync / async behavior changed;</li>
                <li>public API removed.</li>
              </ul>

              <p>
                Not every change produces the same confidence
                level. A removed required keyword may be a
                provable break, while a return-type annotation
                change may require downstream type information
                that is unavailable statically.
              </p>
            </div>
          </section>

          <section className="pcs__section">
            <header className="pcs__label">
              <span>07</span>
              <h2>Integration</h2>
            </header>

            <div className="pcs__copy">
              <h3>
                One deterministic engine powers both local
                analysis and pull-request review.
              </h3>

              <p>
                The core analysis engine is shared between the
                Typer CLI and the GitHub App.
              </p>

              <p>
                FastAPI handles webhook delivery while GitHub
                App authentication and Checks API integration
                live behind dedicated boundaries.
              </p>

              <p>
                Pull-request findings can include:
              </p>

              <ul>
                <li>changed symbol;</li>
                <li>semantic change category;</li>
                <li>affected caller;</li>
                <li>source file and line;</li>
                <li>confirmed incompatibility reason;</li>
                <li>unresolved / UNKNOWN callers.</li>
              </ul>

              <p>
                The same deterministic result can therefore be
                inspected locally or surfaced directly in the
                code-review workflow.
              </p>
            </div>
          </section>

          <section className="pcs__section">
            <header className="pcs__label">
              <span>08</span>
              <h2>Validation</h2>
            </header>

            <div className="pcs__copy">
              <h3>
                Test semantic behavior, determinism, and
                scaling independently.
              </h3>

              <p>
                Canary&apos;s benchmark suite exercises seeded
                semantic mutations, deliberately ambiguous
                cases, repeated execution, and generated
                repositories.
              </p>

              <p>
                The seeded semantic benchmark reported{" "}
                <strong>100 / 100</strong> cases with precision,
                recall, and F1 of{" "}
                <strong>100% / 100% / 1.0</strong>.
              </p>

              <p>
                All <strong>10 / 10</strong> deliberately
                ambiguous cases were preserved as abstentions.
              </p>

              <p>
                Repeating the same analysis{" "}
                <strong>50 times</strong> produced identical
                results in all 50 runs.
              </p>
            </div>
          </section>

          <section className="pcs__section">
            <header className="pcs__label">
              <span>09</span>
              <h2>Result</h2>
            </header>

            <div className="pcs__copy">
              <h3>
                Repository-wide analysis remained fast enough
                to fit naturally into code review.
              </h3>

              <p>
                Median analysis latency measured{" "}
                <strong>64.45 ms</strong>.
              </p>

              <p>
                Source-analysis throughput reached{" "}
                <strong>118,549 LOC/s</strong> under the
                repository benchmark.
              </p>

              <p>
                A generated <strong>1,000-file</strong>{" "}
                repository completed in{" "}
                <strong>210.36 ms</strong>.
              </p>

              <div className="pcs__highlight">
                The key result was not just detection accuracy.
                Canary could remain deterministic, explainable,
                and repository-aware without turning pull
                requests into multi-second analysis jobs.
              </div>

              <p className="pcs__note">
                These numbers describe controlled repository
                benchmarks and should not be interpreted as
                universal performance across arbitrary Python
                codebases.
              </p>
            </div>
          </section>

          <section className="pcs__section">
            <header className="pcs__label">
              <span>10</span>
              <h2>What I learned</h2>
            </header>

            <div className="pcs__copy">
              <h3>
                Developer tools become useful when they model
                uncertainty instead of hiding it.
              </h3>

              <p>
                The most important design choice in Canary was
                not a parser or framework. It was deciding
                that UNKNOWN should be a first-class result.
              </p>

              <p>
                Static analysis is strongest when it clearly
                distinguishes what it can prove from what it
                cannot.
              </p>

              <p>
                That same principle applies to code-review
                tooling more broadly: a smaller number of
                defensible findings is often more useful than
                a larger number of speculative warnings.
              </p>
            </div>
          </section>

          <section className="pcs__section">
            <header className="pcs__label">
              <span>11</span>
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
          Canary / static analysis / 2026
        </span>

        <Link href="/projects/paratrace">
          next · paratrace →
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