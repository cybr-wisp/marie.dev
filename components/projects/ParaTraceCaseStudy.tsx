"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { CaseStudyTechStack } from "@/components/projects/CaseStudyTechStack";
import type { Project } from "@/types/content";

type ParaTraceCaseStudyProps = Readonly<{
  project: Project;
}>;

/**
 * ParaTrace portfolio case study
 *
 * Recruiter-facing goal:
 * - ~3 minute scan
 * - show the engineering/research reasoning, not every implementation detail
 * - give immediate access to the research document, live app, and source
 *
 * NOTE:
 * The repository currently does not contain a standalone abstract PDF.
 * ABSTRACT_URL points to docs/research.md as the research-document fallback.
 * Replace this one constant when you upload the final abstract/PDF.
 */
const ABSTRACT_URL =
  "https://github.com/cybr-wisp/paratrace-cym2026/blob/master/docs/research.md";

const LIVE_URL =
  "https://paratrace-production.up.railway.app/";

const REPOSITORY_URL =
  "https://github.com/cybr-wisp/paratrace-cym2026";

const levels = [
  {
    id: "L0",
    label: "ORIGINAL",
    anthropic: 73.4,
    openai: 73.4,
    average: 73.4,
    detail:
      "Unaltered spontaneous speech. This is the distribution the downstream classifier learns from.",
  },
  {
    id: "L1",
    label: "GRAMMAR",
    anthropic: 68.8,
    openai: 66.5,
    average: 67.7,
    detail:
      "Correct spelling and grammar while preserving fillers, repetition, wording, and sentence structure as much as possible.",
  },
  {
    id: "L2",
    label: "LIGHT",
    anthropic: 62.3,
    openai: 56.9,
    average: 59.6,
    detail:
      "Remove obvious fillers and smooth awkward phrasing while preserving the same ideas and vocabulary level.",
  },
  {
    id: "L3",
    label: "MODERATE",
    anthropic: 51.8,
    openai: 52.5,
    average: 52.2,
    detail:
      "Reorganize ideas, remove repetition, and improve vocabulary and sentence structure while retaining propositional meaning.",
  },
  {
    id: "L4",
    label: "FULL",
    anthropic: 54.2,
    openai: 53.3,
    average: 53.8,
    detail:
      "Produce a fluent professional rewrite with more sophisticated vocabulary and sentence structure.",
  },
] as const;

const process = [
  {
    number: "01",
    title: "PRESERVE",
    detail:
      "Parse access-controlled DementiaBank CHAT transcripts without cleaning away the speech phenomena I wanted to measure.",
  },
  {
    number: "02",
    title: "REPRESENT",
    detail:
      "Extract 20 linguistic biomarkers spanning coherence, fluency, lexical diversity, syntax, repetition, and content.",
  },
  {
    number: "03",
    title: "INTERVENE",
    detail:
      "Apply four progressively stronger rewrite levels through OpenAI and Anthropic under matched generation settings.",
  },
  {
    number: "04",
    title: "MEASURE",
    detail:
      "Train on original speech, keep folds fixed, then test how rewritten feature distributions affect downstream classification.",
  },
] as const;

const decisions = [
  {
    title: "FREEZE THE PROTOCOL",
    why:
      "Pre-specify hypotheses and evaluation before final analysis so the story is not rewritten around the result.",
  },
  {
    title: "KEEP FOLDS FIXED",
    why:
      "Use identical stratified 5-fold assignments across L0–L4 so changes are attributable to the intervention, not split noise.",
  },
  {
    title: "REPLICATE ACROSS PROVIDERS",
    why:
      "Run matched conditions through two independent LLM backends so the failure mode is not framed as a one-vendor artifact.",
  },
  {
    title: "CACHE EVERY REWRITE",
    why:
      "Persist deterministic outputs to make long runs resumable, cheaper to reproduce, and easier to audit.",
  },
] as const;

const takeaways = [
  {
    title: "SEMANTIC FIDELITY IS NOT ENOUGH",
    detail:
      "A rewrite can preserve meaning while shifting the structural representation another system depends on.",
  },
  {
    title: "THE SYSTEM BOUNDARY MATTERS",
    detail:
      "If downstream analysis needs raw-speech characteristics, preserve that representation before a generative layer normalizes it.",
  },
  {
    title: "MEASURE THE DOWNSTREAM TASK",
    detail:
      "Readability and semantic similarity are useful metrics, but they do not prove information preservation for another model.",
  },
] as const;

const techGroups = [
  {
    label: "RESEARCH PIPELINE",
    items: [
      {
        name: "Python",
        detail: "experiment orchestration",
        icon: "python",
      },
      {
        name: "spaCy",
        detail: "syntax + linguistic features",
        icon: "spacy",
      },
      {
        name: "Sentence Transformers",
        detail: "semantic similarity",
        icon: "huggingface",
      },
      {
        name: "PyLangAcq",
        detail: "CHAT transcript ingestion",
        mark: "CHA",
      },
    ],
  },
  {
    label: "EVALUATION",
    items: [
      {
        name: "scikit-learn",
        detail: "classification",
        icon: "scikitlearn",
      },
      {
        name: "SciPy",
        detail: "Wilcoxon testing",
        icon: "scipy",
      },
      {
        name: "pandas",
        detail: "experiment tables",
        icon: "pandas",
      },
      {
        name: "NumPy",
        detail: "numeric feature arrays",
        icon: "numpy",
      },
    ],
  },
  {
    label: "PRODUCT / DEPLOYMENT",
    items: [
      {
        name: "FastAPI",
        detail: "analysis API",
        icon: "fastapi",
      },
      {
        name: "React",
        detail: "research interface",
        icon: "react",
      },
      {
        name: "TypeScript",
        detail: "frontend",
        icon: "typescript",
      },
      {
        name: "Docker",
        detail: "containerized deployment",
        icon: "docker",
      },
      {
        name: "Railway",
        detail: "live deployment",
        icon: "railway",
      },
    ],
  },
] as const;

const chartMin = 48;
const chartMax = 76;
const chartTop = 38;
const chartBottom = 220;
const chartStartX = 62;
const chartStepX = 166;

function chartY(value: number) {
  const normalized =
    (value - chartMin) /
    (chartMax - chartMin);

  return (
    chartBottom -
    normalized *
      (chartBottom - chartTop)
  );
}

function chartPoints(
  key: "anthropic" | "openai" | "average",
) {
  return levels
    .map(
      (level, index) =>
        `${chartStartX + index * chartStepX},${chartY(
          level[key],
        ).toFixed(1)}`,
    )
    .join(" ");
}

function ExternalLink({
  href,
  children,
  primary = false,
}: Readonly<{
  href: string;
  children: ReactNode;
  primary?: boolean;
}>) {
  return (
    <a
      className={`pt3-action ${
        primary ? "is-primary" : ""
      }`}
      href={href}
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </a>
  );
}

export function ParaTraceCaseStudy({
  project,
}: ParaTraceCaseStudyProps) {
  const [activeLevel, setActiveLevel] =
    useState(3);

  const rootRef =
    useRef<HTMLElement>(null);

  const selected = levels[activeLevel];

  const repository =
    project.repository ??
    REPOSITORY_URL;

  useEffect(() => {
    const root = rootRef.current;

    if (!root) {
      return;
    }

    const revealNodes =
      root.querySelectorAll<HTMLElement>(
        "[data-reveal]",
      );

    const reduceMotion =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

    if (reduceMotion) {
      revealNodes.forEach((node) => {
        node.classList.add("is-visible");
      });

      return;
    }

    const observer =
      new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              return;
            }

            entry.target.classList.add(
              "is-visible",
            );

            observer.unobserve(
              entry.target,
            );
          });
        },
        {
          threshold: 0.13,
          rootMargin:
            "0px 0px -7% 0px",
        },
      );

    revealNodes.forEach((node) => {
      observer.observe(node);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const activeX =
    chartStartX +
    activeLevel * chartStepX;

  return (
    <article
      ref={rootRef}
      className="case-study pt3"
    >
      <Link
        href="/projects"
        className="archive-back pt3__back"
      >
        ← PROJECTS
      </Link>

      {/* =====================================================
          HERO
          ===================================================== */}

      <header className="pt3-hero" data-reveal>
        <span className="pt3-kicker">
          02 · AI SAFETY / APPLIED ML
        </span>

        <h1>{project.title}</h1>

        <p className="pt3-hero__statement copy-en">
          AI preserved <em>what</em> patients
          said while erasing part of{" "}
          <em>how</em> they said it.
        </p>

        <p className="pt3-hero__statement copy-fr">
          L&apos;IA a préservé{" "}
          <em>ce qui</em> était dit tout en
          modifiant une partie de{" "}
          <em>la manière</em> de le dire.
        </p>

        <p className="pt3-hero__dek copy-en">
          ParaTrace is a controlled failure-mode
          audit of LLM rewriting in clinical speech:
          I tested whether increasingly polished
          rewrites preserve semantic meaning while
          shifting the linguistic biomarkers used by
          a downstream cognitive-status classifier.
        </p>

        <p className="pt3-hero__dek copy-fr">
          ParaTrace est un audit contrôlé des
          effets de la réécriture par LLM sur la
          parole clinique, en comparant la fidélité
          sémantique à la préservation des
          biomarqueurs linguistiques utilisés en
          aval.
        </p>

        <nav
          className="pt3-actions"
          aria-label="ParaTrace project links"
        >
          <ExternalLink
            href={ABSTRACT_URL}
            primary
          >
            ABSTRACT / RESEARCH DOC ↗
          </ExternalLink>

          <ExternalLink href={LIVE_URL}>
            LIVE APP ↗
          </ExternalLink>

          <ExternalLink href={repository}>
            GITHUB ↗
          </ExternalLink>
        </nav>

        <dl className="pt3-meta">
          <div>
            <dt>CORPUS</dt>
            <dd>552 TRANSCRIPTS</dd>
          </div>

          <div>
            <dt>EXPERIMENT</dt>
            <dd>4,416 REWRITES</dd>
          </div>

          <div>
            <dt>REPRESENTATION</dt>
            <dd>20 BIOMARKERS</dd>
          </div>

          <div>
            <dt>REPLICATION</dt>
            <dd>2 LLM PROVIDERS</dd>
          </div>
        </dl>
      </header>

      {/* =====================================================
          HEADLINE RESULT
          ===================================================== */}

      <section
        className="pt3-result"
        aria-label="ParaTrace headline result"
        data-reveal
      >
        <article>
          <span>ORIGINAL SPEECH</span>
          <strong>73.4%</strong>
          <small>
            downstream classification
          </small>
        </article>

        <div
          className="pt3-result__arrow"
          aria-hidden="true"
        >
          →
        </div>

        <article className="is-accent">
          <span>MODERATE REWRITE · L3</span>
          <strong>52.2%</strong>
          <small>
            two-provider average
          </small>
        </article>

        <article className="pt3-result__note">
          <span>MEANING RETAINED</span>
          <strong>&gt;83%</strong>
          <small>
            semantic cosine similarity
          </small>
        </article>
      </section>

      {/* =====================================================
          01 — PROBLEM
          ===================================================== */}

      <section className="pt3-section" data-reveal>
        <div className="pt3-section__marker">
          <span>01</span>
          <h2>THE TENSION</h2>
        </div>

        <div className="pt3-section__body">
          <p className="pt3-lead copy-en">
            Clinical documentation systems are
            rewarded for making speech cleaner and
            more concise. Cognitive-language models
            can depend on the opposite: hesitation,
            repetition, coherence, lexical choice,
            and syntactic form.
          </p>

          <p className="pt3-lead copy-fr">
            Les systèmes de documentation clinique
            cherchent à rendre la parole plus claire
            et concise, alors que certains modèles
            cognitifs dépendent précisément des
            hésitations, répétitions et structures
            linguistiques supprimées.
          </p>

          <div
            className="pt3-collision"
            data-reveal
          >
            <article>
              <span>PRODUCT OBJECTIVE</span>
              <strong>
                MAKE THE NOTE BETTER
              </strong>
              <p>
                Improve fluency, grammar,
                organization, and readability.
              </p>
            </article>

            <div
              className="pt3-collision__mark"
              aria-hidden="true"
            >
              ×
            </div>

            <article className="is-accent">
              <span>DOWNSTREAM REQUIREMENT</span>
              <strong>
                PRESERVE THE SIGNAL
              </strong>
              <p>
                Retain measurable properties of
                spontaneous speech used by another
                system.
              </p>
            </article>
          </div>

          <div
            className="pt3-question"
            data-reveal
          >
            <span>QUESTION I TESTED</span>
            <strong>
              If a classifier learns from original
              spontaneous speech, how much of that
              signal survives progressive LLM
              rewriting?
            </strong>
          </div>
        </div>
      </section>

      {/* =====================================================
          02 — ENGINEERING PROCESS
          ===================================================== */}

      <section className="pt3-section" data-reveal>
        <div className="pt3-section__marker">
          <span>02</span>
          <h2>HOW I APPROACHED IT</h2>
        </div>

        <div className="pt3-section__body">
          <p className="pt3-lead copy-en">
            I treated rewriting as a controlled
            intervention. The goal was not to ask
            whether two texts “look different,” but
            to isolate whether increasing
            normalization moves the representation
            away from the distribution the
            downstream model learned.
          </p>

          <p className="pt3-lead copy-fr">
            J&apos;ai traité la réécriture comme une
            intervention contrôlée afin d&apos;isoler
            l&apos;effet de la normalisation sur la
            représentation utilisée par le modèle en
            aval.
          </p>

          <div
            className="pt3-process"
            data-reveal
          >
            {process.map((step) => (
              <article key={step.number}>
                <span>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.detail}</p>
              </article>
            ))}
          </div>

          <div
            className="pt3-decision-header"
            data-reveal
          >
            <span>EXPERIMENTAL DECISIONS</span>
            <strong>
              The controls mattered as much as the
              model.
            </strong>
          </div>

          <div
            className="pt3-decisions"
            data-reveal
          >
            {decisions.map((decision) => (
              <article key={decision.title}>
                <h3>{decision.title}</h3>
                <p>{decision.why}</p>
              </article>
            ))}
          </div>

          <div className="pt3-method">
            <span>
              STRATIFIED 5-FOLD CV
            </span>
            <span>
              MATCHED L0–L4 FOLDS
            </span>
            <span>
              OPENAI + ANTHROPIC
            </span>
            <span>
              TEMP · 0.3
            </span>
            <span>
              DISK-CACHED OUTPUTS
            </span>
            <span>
              WILCOXON + BH FDR
            </span>
          </div>
        </div>
      </section>

      {/* =====================================================
          03 — EVIDENCE
          ===================================================== */}

      <section className="pt3-section" data-reveal>
        <div className="pt3-section__marker">
          <span>03</span>
          <h2>WHAT THE DATA SHOWED</h2>
        </div>

        <div className="pt3-section__body">
          <div
            className="pt3-levels"
            role="group"
            aria-label="Rewrite level"
          >
            {levels.map(
              (level, index) => (
                <button
                  type="button"
                  key={level.id}
                  className={
                    activeLevel === index
                      ? "is-active"
                      : ""
                  }
                  onClick={() =>
                    setActiveLevel(index)
                  }
                >
                  <strong>
                    {level.id}
                  </strong>
                  <span>
                    {level.label}
                  </span>
                </button>
              ),
            )}
          </div>

          <div
            key={selected.id}
            className="pt3-readout"
            aria-live="polite"
          >
            <div className="pt3-readout__copy">
              <span>
                {selected.id} ·{" "}
                {selected.label}
              </span>
              <p>{selected.detail}</p>
            </div>

            <div>
              <span>ANTHROPIC</span>
              <strong>
                {selected.anthropic.toFixed(
                  1,
                )}
                %
              </strong>
            </div>

            <div>
              <span>OPENAI</span>
              <strong>
                {selected.openai.toFixed(
                  1,
                )}
                %
              </strong>
            </div>

            <div className="is-accent">
              <span>AVERAGE</span>
              <strong>
                {selected.average.toFixed(
                  1,
                )}
                %
              </strong>
            </div>
          </div>

          <div
            className="pt3-chart"
            data-reveal
          >
            <div className="pt3-chart__head">
              <div>
                <span>
                  DOWNSTREAM ACCURACY
                </span>
                <strong>
                  SAME CLASSIFIER · SHIFTED
                  INPUT DISTRIBUTION
                </strong>
              </div>

              <div className="pt3-chart__legend">
                <span className="is-anthropic">
                  ANTHROPIC
                </span>
                <span className="is-openai">
                  OPENAI
                </span>
                <span className="is-average">
                  AVERAGE
                </span>
              </div>
            </div>

            <svg
              viewBox="0 0 790 260"
              role="img"
              aria-label="Classification accuracy across ParaTrace rewrite levels"
            >
              <g className="pt3-chart__grid">
                {[55, 65, 75].map(
                  (value) => (
                    <g key={value}>
                      <line
                        x1="38"
                        x2="752"
                        y1={chartY(value)}
                        y2={chartY(value)}
                      />
                      <text
                        x="6"
                        y={
                          chartY(value) + 4
                        }
                      >
                        {value}%
                      </text>
                    </g>
                  ),
                )}
              </g>

              <line
                className="pt3-chart__chance"
                x1="38"
                x2="752"
                y1={chartY(50)}
                y2={chartY(50)}
              />

              <text
                className="pt3-chart__chance-label"
                x="650"
                y={chartY(50) - 7}
              >
                50% CHANCE
              </text>

              <line
                className="pt3-chart__focus"
                x1={activeX}
                x2={activeX}
                y1="28"
                y2="220"
              />

              <polyline
                className="pt3-chart__line pt3-chart__line--anthropic"
                points={chartPoints(
                  "anthropic",
                )}
              />

              <polyline
                className="pt3-chart__line pt3-chart__line--openai"
                points={chartPoints(
                  "openai",
                )}
              />

              <polyline
                className="pt3-chart__line pt3-chart__line--average"
                points={chartPoints(
                  "average",
                )}
              />

              {levels.map(
                (level, index) => {
                  const x =
                    chartStartX +
                    index * chartStepX;

                  return (
                    <g key={level.id}>
                      <circle
                        className="pt3-chart__dot pt3-chart__dot--anthropic"
                        cx={x}
                        cy={chartY(
                          level.anthropic,
                        )}
                        r="3"
                      />

                      <circle
                        className="pt3-chart__dot pt3-chart__dot--openai"
                        cx={x}
                        cy={chartY(
                          level.openai,
                        )}
                        r="3"
                      />

                      <circle
                        className={`pt3-chart__dot pt3-chart__dot--average ${
                          activeLevel ===
                          index
                            ? "is-active"
                            : ""
                        }`}
                        cx={x}
                        cy={chartY(
                          level.average,
                        )}
                        r="4"
                      />

                      <text
                        className={`pt3-chart__x ${
                          activeLevel ===
                          index
                            ? "is-active"
                            : ""
                        }`}
                        x={x}
                        y="248"
                      >
                        {level.id}
                      </text>
                    </g>
                  );
                },
              )}
            </svg>
          </div>

          <div
            className="pt3-findings"
            data-reveal
          >
            <article>
              <span>FEATURE DRIFT · L2</span>
              <strong>
                19 / 20
              </strong>
              <p>
                Anthropic biomarkers
                significantly altered; OpenAI
                reached 20 / 20 under paired
                Wilcoxon testing with BH-FDR
                correction.
              </p>
            </article>

            <article className="is-accent">
              <span>WHAT VS HOW</span>
              <strong>
                &gt;83% ≠ 52.2%
              </strong>
              <p>
                Semantic similarity stayed high
                even when L3 classification fell
                close to binary chance.
              </p>
            </article>
          </div>

          <blockquote
            className="pt3-thesis"
            data-reveal
          >
            Semantic fidelity is not necessarily
            downstream fidelity.
          </blockquote>
        </div>
      </section>

      {/* =====================================================
          04 — DESIGN RESPONSE
          ===================================================== */}

      <section className="pt3-section" data-reveal>
        <div className="pt3-section__marker">
          <span>04</span>
          <h2>THE DESIGN RESPONSE</h2>
        </div>

        <div className="pt3-section__body">
          <p className="pt3-lead copy-en">
            The failure suggested an architectural
            response rather than a better prompt:
            preserve the diagnostic representation
            before the generative layer is allowed
            to optimize the text for readability.
          </p>

          <p className="pt3-lead copy-fr">
            Le résultat suggère une réponse
            architecturale plutôt qu&apos;un meilleur
            prompt : préserver la représentation
            utile avant que la couche générative
            n&apos;optimise le texte.
          </p>

          <div
            className="pt3-path"
            data-reveal
          >
            <span className="pt3-path__label">
              FRAGILE PATH
            </span>

            <div>
              RAW SPEECH
            </div>
            <b>→</b>
            <div>
              AI REWRITE
            </div>
            <b>→</b>
            <div>
              FEATURE EXTRACTION
            </div>
            <b>→</b>
            <div className="is-risk">
              SHIFTED SIGNAL
            </div>
          </div>

          <div
            className="pt3-architecture"
            data-reveal
          >
            <div>
              <span>01</span>
              <strong>
                RAW SPEECH / ASR
              </strong>
            </div>

            <b>→</b>

            <div className="pt3-architecture__fork">
              <article className="is-accent">
                <span>02A</span>
                <strong>
                  PRE-EXTRACT FEATURES
                </strong>
                <small>
                  preserve original linguistic
                  representation
                </small>
              </article>

              <article>
                <span>02B</span>
                <strong>
                  GENERATE CLINICAL NOTE
                </strong>
                <small>
                  optimize for readability
                </small>
              </article>
            </div>

            <b>→</b>

            <div className="is-accent">
              <span>03</span>
              <strong>
                DUAL OUTPUT
              </strong>
              <small>
                polished note + preserved
                feature profile
              </small>
            </div>
          </div>

          <div className="pt3-boundary">
            <span>IMPORTANT BOUNDARY</span>
            <p>
              This is a mitigation hypothesis, not
              a clinically validated deployment.
              ParaTrace demonstrates the failure
              mode and motivates the architecture;
              it does not claim improved clinical
              outcomes.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          05 — TAKEAWAYS
          ===================================================== */}

      <section className="pt3-section" data-reveal>
        <div className="pt3-section__marker">
          <span>05</span>
          <h2>WHAT I TOOK AWAY</h2>
        </div>

        <div className="pt3-section__body">
          <div
            className="pt3-takeaways"
            data-reveal
          >
            {takeaways.map(
              (takeaway, index) => (
                <article
                  key={takeaway.title}
                >
                  <span>
                    {String(
                      index + 1,
                    ).padStart(2, "0")}
                  </span>
                  <h3>
                    {takeaway.title}
                  </h3>
                  <p>
                    {takeaway.detail}
                  </p>
                </article>
              ),
            )}
          </div>

          <div
            className="pt3-scope"
            data-reveal
          >
            <span>
              FAILURE-MODE AUDIT
            </span>
            <span>
              NOT A DIAGNOSTIC TOOL
            </span>
            <span>
              ACCESS-CONTROLLED DATA
            </span>
            <span>
              NO RAW PATIENT TRANSCRIPTS PUBLIC
            </span>
          </div>
        </div>
      </section>

      <CaseStudyTechStack
        groups={techGroups}
        eyebrow="BUILT WITH"
      />

      <footer className="pt3-footer">
        <div className="pt3-footer__links">
          <ExternalLink
            href={ABSTRACT_URL}
            primary
          >
            RESEARCH DOC ↗
          </ExternalLink>

          <ExternalLink href={LIVE_URL}>
            LIVE APP ↗
          </ExternalLink>

          <ExternalLink href={repository}>
            SOURCE ↗
          </ExternalLink>
        </div>

        <Link href="/projects/microgrid-ml">
          NEXT · MICROGRID ML →
        </Link>
      </footer>

      <style>{`
        /* =========================================================
           PARATRACE — RECRUITER CASE STUDY
           Compact, reasoning-first, ~3 minute scan.
           ========================================================= */

        .pt3 {
          width: min(calc(100% - 2rem), 1040px);
          margin-inline: auto;
          padding: 2.2rem 0 5rem;
        }

        body:has(.pt3) .site-rule {
          display: none !important;
        }

        .pt3 .pt3__back {
          display: inline-block;
          margin-bottom: 3rem;
        }

        /* ---------- hero ---------- */

        .pt3 .pt3-hero {
          padding-bottom: 2.35rem;
          border-bottom: 1px solid var(--rule-strong);
        }

        .pt3 .pt3-kicker {
          display: block;
          margin-bottom: 0.9rem;
          color: var(--muted);
          font-family: var(--font-display);
          font-size: 0.4rem;
          font-weight: 700;
          letter-spacing: 0.09em;
        }

        .pt3 .pt3-hero h1 {
          max-width: 900px;
          font-size: clamp(3.4rem, 7vw, 5.8rem);
          font-weight: 700;
          line-height: 0.82;
          letter-spacing: -0.07em;
        }

        .pt3 .pt3-hero__statement {
          max-width: 850px;
          margin-top: 1.55rem;
          font-family: var(--font-display);
          font-size: clamp(1.45rem, 2.8vw, 2.2rem);
          font-weight: 700;
          line-height: 1;
          letter-spacing: -0.045em;
        }

        .pt3 .pt3-hero__statement em {
          color: var(--klein-blue);
          font-style: normal;
        }

        .pt3 .pt3-hero__dek {
          max-width: 720px;
          margin-top: 1rem;
          color: var(--muted);
          font-size: 1rem;
          line-height: 1.45;
        }

        .pt3 .pt3-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.55rem;
          margin-top: 1.45rem;
        }

        .pt3 .pt3-action {
          display: inline-flex;
          align-items: center;
          min-height: 38px;
          padding: 0.65rem 0.78rem;
          border: 1px solid var(--rule-strong);
          background: var(--surface);
          color: var(--text);
          font-family: var(--font-display);
          font-size: 0.36rem;
          font-weight: 700;
          letter-spacing: 0.055em;
          transition:
            transform 180ms ease,
            border-color 180ms ease,
            background 180ms ease,
            color 180ms ease;
        }

        .pt3 .pt3-action:hover {
          transform: translateY(-2px);
          border-color: var(--klein-blue);
        }

        .pt3 .pt3-action.is-primary {
          border-color: var(--klein-blue);
          background: var(--klein-blue);
          color: white;
        }

        .pt3 .pt3-meta {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          margin-top: 2rem;
          border-top: 1px solid var(--rule);
        }

        .pt3 .pt3-meta > div {
          min-width: 0;
          padding: 0.8rem 0.7rem 0 0;
        }

        .pt3 .pt3-meta dt {
          color: var(--muted);
          font-family: var(--font-display);
          font-size: 0.31rem;
          font-weight: 700;
          letter-spacing: 0.08em;
        }

        .pt3 .pt3-meta dd {
          margin-top: 0.24rem;
          font-family: var(--font-display);
          font-size: 0.44rem;
          font-weight: 700;
          line-height: 1.1;
        }

        /* ---------- headline result ---------- */

        .pt3 .pt3-result {
          display: grid;
          grid-template-columns:
            minmax(0, 1fr)
            34px
            minmax(0, 1fr)
            minmax(180px, 0.8fr);
          gap: 1rem;
          align-items: center;
          margin: 2rem 0;
          padding: 1.3rem 0;
          border-top: 1px solid var(--rule-strong);
          border-bottom: 1px solid var(--rule-strong);
          font-family: var(--font-display);
        }

        .pt3 .pt3-result article {
          min-width: 0;
        }

        .pt3 .pt3-result span,
        .pt3 .pt3-result small {
          display: block;
          color: var(--muted);
          font-size: 0.33rem;
          font-weight: 700;
          letter-spacing: 0.065em;
        }

        .pt3 .pt3-result strong {
          display: block;
          margin: 0.18rem 0;
          font-size: clamp(2.5rem, 5vw, 4.8rem);
          line-height: 0.9;
          letter-spacing: -0.06em;
        }

        .pt3 .pt3-result .is-accent strong {
          color: var(--klein-blue);
        }

        .pt3 .pt3-result__arrow {
          color: var(--klein-blue);
          font-family: var(--font-display);
          font-size: 1.2rem;
          text-align: center;
        }

        .pt3 .pt3-result__note {
          padding-left: 1rem;
          border-left: 1px solid var(--rule);
        }

        .pt3 .pt3-result__note strong {
          font-size: clamp(1.9rem, 4vw, 3.4rem);
        }

        /* ---------- section shell ---------- */

        .pt3 .pt3-section {
          display: grid;
          grid-template-columns: 150px minmax(0, 1fr);
          gap: 2rem;
          padding: 3rem 0;
          border-top: 1px solid var(--rule);
        }

        .pt3 .pt3-section__marker > span {
          display: block;
          color: var(--klein-blue);
          font-family: var(--font-display);
          font-size: 0.34rem;
          font-weight: 700;
          letter-spacing: 0.08em;
        }

        .pt3 .pt3-section__marker h2 {
          margin-top: 0.4rem;
          font-size: 0.68rem;
          line-height: 1.05;
        }

        .pt3 .pt3-section__body {
          min-width: 0;
        }

        .pt3 .pt3-lead {
          max-width: 760px;
          font-size: 1rem;
          line-height: 1.48;
        }

        /* ---------- problem ---------- */

        .pt3 .pt3-collision {
          display: grid;
          grid-template-columns:
            minmax(0, 1fr)
            46px
            minmax(0, 1fr);
          margin-top: 1.25rem;
          border: 1px solid var(--rule-strong);
          background: var(--surface);
        }

        .pt3 .pt3-collision article {
          min-width: 0;
          padding: 1rem;
        }

        .pt3 .pt3-collision article > span {
          display: block;
          color: var(--muted);
          font-family: var(--font-display);
          font-size: 0.31rem;
          font-weight: 700;
          letter-spacing: 0.07em;
        }

        .pt3 .pt3-collision article > strong {
          display: block;
          margin-top: 0.48rem;
          font-family: var(--font-display);
          font-size: 0.68rem;
          line-height: 1.05;
        }

        .pt3 .pt3-collision article > p {
          margin-top: 0.5rem;
          color: var(--muted);
          font-size: 0.83rem;
          line-height: 1.3;
        }

        .pt3 .pt3-collision article.is-accent {
          background:
            color-mix(
              in srgb,
              var(--klein-blue) 4%,
              var(--surface)
            );
        }

        .pt3 .pt3-collision article.is-accent > strong {
          color: var(--klein-blue);
        }

        .pt3 .pt3-collision__mark {
          display: grid;
          place-items: center;
          border-left: 1px solid var(--rule);
          border-right: 1px solid var(--rule);
          color: var(--klein-blue);
          font-family: var(--font-display);
          font-size: 0.9rem;
          font-weight: 700;
        }

        .pt3 .pt3-question {
          margin-top: 0.8rem;
          padding: 0.9rem 1rem;
          border-left: 2px solid var(--klein-blue);
          background:
            color-mix(
              in srgb,
              var(--klein-blue) 4%,
              var(--surface)
            );
        }

        .pt3 .pt3-question > span {
          display: block;
          color: var(--klein-blue);
          font-family: var(--font-display);
          font-size: 0.31rem;
          font-weight: 700;
          letter-spacing: 0.07em;
        }

        .pt3 .pt3-question > strong {
          display: block;
          max-width: 780px;
          margin-top: 0.35rem;
          font-family: var(--font-body);
          font-size: 1rem;
          font-weight: 600;
          line-height: 1.35;
        }

        /* ---------- process ---------- */

        .pt3 .pt3-process {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          margin-top: 1.35rem;
          border-top: 1px solid var(--rule-strong);
          border-left: 1px solid var(--rule-strong);
        }

        .pt3 .pt3-process article {
          min-width: 0;
          min-height: 162px;
          padding: 0.85rem;
          border-right: 1px solid var(--rule-strong);
          border-bottom: 1px solid var(--rule-strong);
          background: var(--surface);
        }

        .pt3 .pt3-process article > span {
          color: var(--klein-blue);
          font-family: var(--font-display);
          font-size: 0.31rem;
          font-weight: 700;
        }

        .pt3 .pt3-process h3 {
          margin-top: 1.05rem;
          font-family: var(--font-display);
          font-size: 0.56rem;
        }

        .pt3 .pt3-process p {
          margin-top: 0.45rem;
          color: var(--muted);
          font-size: 0.76rem;
          line-height: 1.28;
        }

        .pt3 .pt3-decision-header {
          display: grid;
          grid-template-columns: 170px minmax(0, 1fr);
          gap: 1rem;
          margin-top: 1.25rem;
          padding: 0.8rem 0;
          border-top: 1px solid var(--rule);
        }

        .pt3 .pt3-decision-header span {
          color: var(--klein-blue);
          font-family: var(--font-display);
          font-size: 0.31rem;
          font-weight: 700;
          letter-spacing: 0.07em;
        }

        .pt3 .pt3-decision-header strong {
          font-size: 0.95rem;
          line-height: 1.3;
        }

        .pt3 .pt3-decisions {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          border: 1px solid var(--rule-strong);
          background: var(--surface);
        }

        .pt3 .pt3-decisions article {
          min-width: 0;
          padding: 0.9rem;
          border-right: 1px solid var(--rule);
          border-bottom: 1px solid var(--rule);
        }

        .pt3 .pt3-decisions article:nth-child(2n) {
          border-right: 0;
        }

        .pt3 .pt3-decisions article:nth-last-child(-n + 2) {
          border-bottom: 0;
        }

        .pt3 .pt3-decisions h3 {
          font-family: var(--font-display);
          font-size: 0.5rem;
        }

        .pt3 .pt3-decisions p {
          margin-top: 0.42rem;
          color: var(--muted);
          font-size: 0.79rem;
          line-height: 1.3;
        }

        .pt3 .pt3-method {
          display: flex;
          flex-wrap: wrap;
          gap: 0.34rem;
          margin-top: 0.7rem;
        }

        .pt3 .pt3-method span {
          padding: 0.37rem 0.48rem;
          border: 1px solid var(--rule);
          background: var(--surface);
          color: var(--muted);
          font-family: var(--font-display);
          font-size: 0.29rem;
          font-weight: 700;
          letter-spacing: 0.05em;
        }

        /* ---------- levels / evidence ---------- */

        .pt3 .pt3-levels {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          border-top: 1px solid var(--rule-strong);
          border-left: 1px solid var(--rule-strong);
        }

        .pt3 .pt3-levels button {
          min-height: 68px;
          padding: 0.62rem;
          border: 0;
          border-right: 1px solid var(--rule-strong);
          border-bottom: 1px solid var(--rule-strong);
          background: var(--surface);
          color: var(--text);
          cursor: pointer;
          text-align: left;
          transition:
            background 170ms ease,
            color 170ms ease;
        }

        .pt3 .pt3-levels button strong,
        .pt3 .pt3-levels button span {
          display: block;
          font-family: var(--font-display);
        }

        .pt3 .pt3-levels button strong {
          font-size: 0.45rem;
        }

        .pt3 .pt3-levels button span {
          margin-top: 0.25rem;
          color: var(--muted);
          font-size: 0.28rem;
          font-weight: 700;
          letter-spacing: 0.05em;
        }

        .pt3 .pt3-levels button.is-active {
          background: var(--klein-blue);
          color: white;
        }

        .pt3 .pt3-levels button.is-active span {
          color: rgba(255, 255, 255, 0.78);
        }

        .pt3 .pt3-readout {
          display: grid;
          grid-template-columns:
            minmax(0, 2fr)
            repeat(3, minmax(105px, 0.7fr));
          border-right: 1px solid var(--rule-strong);
          border-bottom: 1px solid var(--rule-strong);
          border-left: 1px solid var(--rule-strong);
          background: var(--surface);
          animation:
            pt3-readout-in
            300ms
            var(--ease, cubic-bezier(.22,1,.36,1))
            both;
        }

        .pt3 .pt3-readout > div {
          min-width: 0;
          padding: 0.85rem;
          border-right: 1px solid var(--rule);
        }

        .pt3 .pt3-readout > div:last-child {
          border-right: 0;
        }

        .pt3 .pt3-readout span {
          display: block;
          color: var(--muted);
          font-family: var(--font-display);
          font-size: 0.3rem;
          font-weight: 700;
          letter-spacing: 0.06em;
        }

        .pt3 .pt3-readout p {
          margin-top: 0.42rem;
          color: var(--muted);
          font-size: 0.8rem;
          line-height: 1.3;
        }

        .pt3 .pt3-readout strong {
          display: block;
          margin-top: 0.4rem;
          font-family: var(--font-display);
          font-size: 1.2rem;
          line-height: 1;
        }

        .pt3 .pt3-readout .is-accent strong {
          color: var(--klein-blue);
        }

        .pt3 .pt3-chart {
          margin-top: 0.9rem;
          padding: 0.9rem;
          border: 1px solid var(--rule-strong);
          background: var(--surface);
        }

        .pt3 .pt3-chart__head {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          align-items: flex-start;
        }

        .pt3 .pt3-chart__head > div:first-child span,
        .pt3 .pt3-chart__head > div:first-child strong {
          display: block;
          font-family: var(--font-display);
        }

        .pt3 .pt3-chart__head > div:first-child span {
          color: var(--muted);
          font-size: 0.3rem;
          font-weight: 700;
          letter-spacing: 0.07em;
        }

        .pt3 .pt3-chart__head > div:first-child strong {
          margin-top: 0.28rem;
          font-size: 0.48rem;
        }

        .pt3 .pt3-chart__legend {
          display: flex;
          flex-wrap: wrap;
          gap: 0.55rem;
          font-family: var(--font-display);
          font-size: 0.28rem;
          font-weight: 700;
          letter-spacing: 0.05em;
        }

        .pt3 .pt3-chart__legend span::before {
          content: "";
          display: inline-block;
          width: 12px;
          height: 2px;
          margin-right: 5px;
          vertical-align: middle;
          background: currentColor;
        }

        .pt3 .pt3-chart__legend .is-anthropic {
          color: var(--muted);
        }

        .pt3 .pt3-chart__legend .is-openai {
          color: var(--text);
        }

        .pt3 .pt3-chart__legend .is-average {
          color: var(--klein-blue);
        }

        .pt3 .pt3-chart svg {
          display: block;
          width: 100%;
          height: auto;
          margin-top: 0.55rem;
          overflow: visible;
        }

        .pt3 .pt3-chart__grid line {
          stroke: var(--rule);
          stroke-width: 1;
        }

        .pt3 .pt3-chart__grid text,
        .pt3 .pt3-chart__chance-label,
        .pt3 .pt3-chart__x {
          fill: var(--muted);
          font-family: var(--font-display);
          font-size: 9px;
          font-weight: 700;
        }

        .pt3 .pt3-chart__chance {
          stroke: var(--rule-strong);
          stroke-width: 1;
          stroke-dasharray: 5 6;
        }

        .pt3 .pt3-chart__focus {
          stroke: var(--klein-blue);
          stroke-width: 1;
          opacity: 0.22;
          transition: x1 220ms ease, x2 220ms ease;
        }

        .pt3 .pt3-chart__line {
          fill: none;
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .pt3 .pt3-chart__line--anthropic {
          stroke: var(--muted);
        }

        .pt3 .pt3-chart__line--openai {
          stroke: var(--text);
        }

        .pt3 .pt3-chart__line--average {
          stroke: var(--klein-blue);
          stroke-width: 2.6;
        }

        .pt3 .pt3-chart__dot--anthropic {
          fill: var(--muted);
        }

        .pt3 .pt3-chart__dot--openai {
          fill: var(--text);
        }

        .pt3 .pt3-chart__dot--average {
          fill: var(--surface);
          stroke: var(--klein-blue);
          stroke-width: 2;
          transition:
            r 170ms ease,
            fill 170ms ease;
        }

        .pt3 .pt3-chart__dot--average.is-active {
          r: 6;
          fill: var(--klein-blue);
        }

        .pt3 .pt3-chart__x {
          text-anchor: middle;
        }

        .pt3 .pt3-chart__x.is-active {
          fill: var(--klein-blue);
        }

        .pt3 .pt3-findings {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          margin-top: 0.9rem;
          border: 1px solid var(--rule-strong);
          background: var(--surface);
        }

        .pt3 .pt3-findings article {
          min-width: 0;
          padding: 1rem;
        }

        .pt3 .pt3-findings article + article {
          border-left: 1px solid var(--rule);
        }

        .pt3 .pt3-findings span {
          display: block;
          color: var(--muted);
          font-family: var(--font-display);
          font-size: 0.31rem;
          font-weight: 700;
          letter-spacing: 0.07em;
        }

        .pt3 .pt3-findings strong {
          display: block;
          margin-top: 0.45rem;
          font-family: var(--font-display);
          font-size: clamp(1.7rem, 4vw, 3rem);
          line-height: 0.95;
          letter-spacing: -0.04em;
        }

        .pt3 .pt3-findings article.is-accent strong {
          color: var(--klein-blue);
        }

        .pt3 .pt3-findings p {
          margin-top: 0.55rem;
          color: var(--muted);
          font-size: 0.82rem;
          line-height: 1.3;
        }

        .pt3 .pt3-thesis {
          margin-top: 0.9rem;
          padding: 1rem 0 0.1rem;
          border-top: 1px solid var(--rule);
          font-family: var(--font-display);
          font-size: clamp(1.35rem, 3vw, 2.1rem);
          font-weight: 700;
          line-height: 1.05;
          letter-spacing: -0.035em;
        }

        /* ---------- architecture ---------- */

        .pt3 .pt3-path {
          display: grid;
          grid-template-columns:
            minmax(0, 1fr)
            auto
            minmax(0, 1fr)
            auto
            minmax(0, 1fr)
            auto
            minmax(0, 1fr);
          gap: 0.45rem;
          align-items: center;
          margin-top: 1.25rem;
          padding-top: 1.6rem;
          position: relative;
        }

        .pt3 .pt3-path__label {
          position: absolute;
          top: 0;
          left: 0;
          color: var(--muted);
          font-family: var(--font-display);
          font-size: 0.3rem;
          font-weight: 700;
          letter-spacing: 0.07em;
        }

        .pt3 .pt3-path > div {
          min-width: 0;
          padding: 0.7rem;
          border: 1px solid var(--rule);
          background: var(--surface);
          font-family: var(--font-display);
          font-size: 0.38rem;
          font-weight: 700;
          text-align: center;
        }

        .pt3 .pt3-path > b {
          color: var(--muted);
          font-weight: 500;
        }

        .pt3 .pt3-path > .is-risk {
          border-color: var(--klein-blue);
          color: var(--klein-blue);
        }

        .pt3 .pt3-architecture {
          display: grid;
          grid-template-columns:
            minmax(0, 0.85fr)
            auto
            minmax(0, 1.45fr)
            auto
            minmax(0, 0.85fr);
          gap: 0.55rem;
          align-items: center;
          margin-top: 0.8rem;
        }

        .pt3 .pt3-architecture > div:not(.pt3-architecture__fork),
        .pt3 .pt3-architecture__fork article {
          min-width: 0;
          padding: 0.82rem;
          border: 1px solid var(--rule-strong);
          background: var(--surface);
        }

        .pt3 .pt3-architecture > b {
          color: var(--klein-blue);
          font-weight: 500;
        }

        .pt3 .pt3-architecture__fork {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.45rem;
        }

        .pt3 .pt3-architecture span {
          display: block;
          color: var(--muted);
          font-family: var(--font-display);
          font-size: 0.29rem;
          font-weight: 700;
        }

        .pt3 .pt3-architecture strong {
          display: block;
          margin-top: 0.3rem;
          font-family: var(--font-display);
          font-size: 0.45rem;
          line-height: 1.08;
        }

        .pt3 .pt3-architecture small {
          display: block;
          margin-top: 0.35rem;
          color: var(--muted);
          font-size: 0.7rem;
          line-height: 1.25;
        }

        .pt3 .pt3-architecture .is-accent {
          border-color: var(--klein-blue) !important;
        }

        .pt3 .pt3-architecture .is-accent strong {
          color: var(--klein-blue);
        }

        .pt3 .pt3-boundary {
          display: grid;
          grid-template-columns: 150px minmax(0, 1fr);
          gap: 1rem;
          margin-top: 0.85rem;
          padding: 0.9rem 1rem;
          border-left: 2px solid var(--klein-blue);
          background:
            color-mix(
              in srgb,
              var(--klein-blue) 4%,
              var(--surface)
            );
        }

        .pt3 .pt3-boundary span {
          color: var(--klein-blue);
          font-family: var(--font-display);
          font-size: 0.31rem;
          font-weight: 700;
          letter-spacing: 0.07em;
        }

        .pt3 .pt3-boundary p {
          font-size: 0.86rem;
          line-height: 1.35;
        }

        /* ---------- takeaways ---------- */

        .pt3 .pt3-takeaways {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          border: 1px solid var(--rule-strong);
          background: var(--surface);
        }

        .pt3 .pt3-takeaways article {
          min-width: 0;
          padding: 0.95rem;
        }

        .pt3 .pt3-takeaways article + article {
          border-left: 1px solid var(--rule);
        }

        .pt3 .pt3-takeaways article > span {
          color: var(--klein-blue);
          font-family: var(--font-display);
          font-size: 0.3rem;
          font-weight: 700;
        }

        .pt3 .pt3-takeaways h3 {
          margin-top: 0.8rem;
          font-family: var(--font-display);
          font-size: 0.5rem;
          line-height: 1.08;
        }

        .pt3 .pt3-takeaways p {
          margin-top: 0.48rem;
          color: var(--muted);
          font-size: 0.79rem;
          line-height: 1.3;
        }

        .pt3 .pt3-scope {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin-top: 0.75rem;
        }

        .pt3 .pt3-scope span {
          padding: 0.38rem 0.5rem;
          border: 1px solid var(--rule);
          color: var(--muted);
          font-family: var(--font-display);
          font-size: 0.29rem;
          font-weight: 700;
          letter-spacing: 0.04em;
        }

        /* ---------- footer ---------- */

        .pt3 .pt3-footer {
          display: flex;
          justify-content: space-between;
          gap: 1.5rem;
          align-items: center;
          margin-top: 2.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--rule-strong);
          font-family: var(--font-display);
          font-size: 0.4rem;
          font-weight: 700;
        }

        .pt3 .pt3-footer__links {
          display: flex;
          flex-wrap: wrap;
          gap: 0.45rem;
        }

        /* ---------- reveal ---------- */

        .pt3 [data-reveal] {
          opacity: 0;
          transform: translate3d(0, 18px, 0);
          filter: blur(3px);
          will-change: opacity, transform, filter;
          transition:
            opacity 680ms var(--ease, cubic-bezier(.22,1,.36,1)),
            transform 760ms var(--ease, cubic-bezier(.22,1,.36,1)),
            filter 680ms ease;
        }

        .pt3 [data-reveal].is-visible {
          opacity: 1;
          transform: translate3d(0, 0, 0);
          filter: blur(0);
        }

        .pt3 .pt3-section.is-visible .pt3-section__body > * {
          animation: pt3-content-in 620ms var(--ease, cubic-bezier(.22,1,.36,1)) both;
        }

        .pt3 .pt3-section.is-visible .pt3-section__body > *:nth-child(2) {
          animation-delay: 70ms;
        }

        .pt3 .pt3-section.is-visible .pt3-section__body > *:nth-child(3) {
          animation-delay: 140ms;
        }

        .pt3 .pt3-section.is-visible .pt3-section__body > *:nth-child(4) {
          animation-delay: 210ms;
        }

        .pt3 .pt3-section.is-visible .pt3-section__body > *:nth-child(5) {
          animation-delay: 280ms;
        }

        @keyframes pt3-content-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .pt3 .pt3-chart.is-visible .pt3-chart__line {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: pt3-line-draw 1050ms var(--ease, cubic-bezier(.22,1,.36,1)) forwards;
        }

        .pt3 .pt3-chart.is-visible .pt3-chart__line--openai {
          animation-delay: 90ms;
        }

        .pt3 .pt3-chart.is-visible .pt3-chart__line--average {
          animation-delay: 180ms;
        }

        @keyframes pt3-line-draw {
          to {
            stroke-dashoffset: 0;
          }
        }

        .pt3 .pt3-process.is-visible article,
        .pt3 .pt3-decisions.is-visible article,
        .pt3 .pt3-findings.is-visible article,
        .pt3 .pt3-takeaways.is-visible article {
          animation:
            pt3-card-in
            480ms
            var(--ease, cubic-bezier(.22,1,.36,1))
            both;
        }

        .pt3 .pt3-process.is-visible article:nth-child(2),
        .pt3 .pt3-decisions.is-visible article:nth-child(2),
        .pt3 .pt3-findings.is-visible article:nth-child(2),
        .pt3 .pt3-takeaways.is-visible article:nth-child(2) {
          animation-delay: 60ms;
        }

        .pt3 .pt3-process.is-visible article:nth-child(3),
        .pt3 .pt3-decisions.is-visible article:nth-child(3),
        .pt3 .pt3-takeaways.is-visible article:nth-child(3) {
          animation-delay: 120ms;
        }

        .pt3 .pt3-process.is-visible article:nth-child(4),
        .pt3 .pt3-decisions.is-visible article:nth-child(4) {
          animation-delay: 180ms;
        }

        @keyframes pt3-card-in {
          from {
            opacity: 0;
            transform: translateY(7px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pt3-readout-in {
          from {
            opacity: 0;
            transform: translateY(4px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* ---------- responsive ---------- */

        @media (max-width: 960px) {
          .pt3 .pt3-result {
            grid-template-columns:
              minmax(0, 1fr)
              30px
              minmax(0, 1fr);
          }

          .pt3 .pt3-result__note {
            grid-column: 1 / -1;
            padding-top: 0.8rem;
            padding-left: 0;
            border-top: 1px solid var(--rule);
            border-left: 0;
          }

          .pt3 .pt3-process {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .pt3 .pt3-path,
          .pt3 .pt3-architecture {
            grid-template-columns: 1fr;
          }

          .pt3 .pt3-path > b,
          .pt3 .pt3-architecture > b {
            transform: rotate(90deg);
            text-align: center;
          }

          .pt3 .pt3-path__label {
            position: static;
            margin-bottom: 0.2rem;
          }

          .pt3 .pt3-path {
            padding-top: 0;
          }
        }

        @media (max-width: 800px) {
          .pt3 {
            width: min(calc(100% - 1.25rem), 1040px);
          }

          .pt3 .pt3-section {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .pt3 .pt3-meta {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .pt3 .pt3-collision,
          .pt3 .pt3-findings,
          .pt3 .pt3-takeaways {
            grid-template-columns: 1fr;
          }

          .pt3 .pt3-collision__mark {
            min-height: 42px;
            border-top: 1px solid var(--rule);
            border-right: 0;
            border-bottom: 1px solid var(--rule);
            border-left: 0;
          }

          .pt3 .pt3-findings article + article,
          .pt3 .pt3-takeaways article + article {
            border-top: 1px solid var(--rule);
            border-left: 0;
          }

          .pt3 .pt3-readout {
            grid-template-columns: 1fr 1fr;
          }

          .pt3 .pt3-readout__copy {
            grid-column: 1 / -1;
            border-bottom: 1px solid var(--rule);
          }

          .pt3 .pt3-readout > div:nth-child(3) {
            border-right: 0;
          }

          .pt3 .pt3-readout > div:last-child {
            grid-column: 1 / -1;
            border-top: 1px solid var(--rule);
          }

          .pt3 .pt3-boundary {
            grid-template-columns: 1fr;
          }

          .pt3 .pt3-footer {
            align-items: flex-start;
            flex-direction: column;
          }
        }

        @media (max-width: 640px) {
          .pt3 .pt3-result {
            grid-template-columns: 1fr;
          }

          .pt3 .pt3-result__arrow {
            text-align: left;
            transform: rotate(90deg);
            transform-origin: left center;
          }

          .pt3 .pt3-result__note {
            grid-column: auto;
          }

          .pt3 .pt3-process,
          .pt3 .pt3-decisions,
          .pt3 .pt3-meta {
            grid-template-columns: 1fr;
          }

          .pt3 .pt3-decisions article {
            border-right: 0;
            border-bottom: 1px solid var(--rule);
          }

          .pt3 .pt3-decisions article:nth-last-child(-n + 2) {
            border-bottom: 1px solid var(--rule);
          }

          .pt3 .pt3-decisions article:last-child {
            border-bottom: 0;
          }

          .pt3 .pt3-decision-header {
            grid-template-columns: 1fr;
          }

          .pt3 .pt3-levels {
            grid-template-columns: repeat(5, minmax(78px, 1fr));
            overflow-x: auto;
          }

          .pt3 .pt3-readout {
            grid-template-columns: 1fr;
          }

          .pt3 .pt3-readout__copy,
          .pt3 .pt3-readout > div:last-child {
            grid-column: auto;
          }

          .pt3 .pt3-readout > div {
            border-right: 0;
            border-bottom: 1px solid var(--rule);
          }

          .pt3 .pt3-readout > div:last-child {
            border-bottom: 0;
          }

          .pt3 .pt3-chart {
            overflow-x: auto;
          }

          .pt3 .pt3-chart svg {
            min-width: 650px;
          }

          .pt3 .pt3-chart__head {
            align-items: flex-start;
            flex-direction: column;
          }

          .pt3 .pt3-architecture__fork {
            grid-template-columns: 1fr;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .pt3 [data-reveal] {
            opacity: 1 !important;
            transform: none !important;
            filter: none !important;
            transition: none !important;
          }

          .pt3 .pt3-section.is-visible .pt3-section__body > *,
          .pt3 .pt3-chart.is-visible .pt3-chart__line {
            animation: none !important;
            stroke-dashoffset: 0 !important;
          }

          .pt3 .pt3-process.is-visible article,
          .pt3 .pt3-decisions.is-visible article,
          .pt3 .pt3-findings.is-visible article,
          .pt3 .pt3-takeaways.is-visible article,
          .pt3 .pt3-readout {
            animation: none !important;
          }

          .pt3 .pt3-action {
            transition: none !important;
          }
        }
      `}</style>
    </article>
  );
}
