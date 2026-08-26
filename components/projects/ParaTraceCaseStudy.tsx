"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
} from "react";

import { CaseStudyTechStack } from "@/components/projects/CaseStudyTechStack";
import type { Project } from "@/types/content";

type ParaTraceCaseStudyProps = Readonly<{
  project: Project;
}>;

const levels = [
  {
    id: "L0",
    label: "ORIGINAL",
    anthropic: 73.4,
    openai: 73.4,
    average: 73.4,
    detail: "Original clinical speech. No rewriting.",
  },
  {
    id: "L1",
    label: "GRAMMAR",
    anthropic: 78.1,
    openai: 74.8,
    average: 76.5,
    detail:
      "Correct spelling and grammar while explicitly preserving repetitions, fillers, hesitations, vocabulary, and sentence structure.",
  },
  {
    id: "L2",
    label: "LIGHT",
    anthropic: 65.9,
    openai: 58.7,
    average: 62.3,
    detail:
      "Remove obvious fillers and smooth awkward phrasing while preserving ideas and vocabulary level.",
  },
  {
    id: "L3",
    label: "MODERATE",
    anthropic: 47.6,
    openai: 53.8,
    average: 50.7,
    detail:
      "Restructure the language, improve vocabulary, organize ideas, and remove repetition.",
  },
  {
    id: "L4",
    label: "FULL",
    anthropic: 53.8,
    openai: 49.6,
    average: 51.7,
    detail:
      "Full professional reformulation using polished vocabulary and more complex sentence structures.",
  },
] as const;

const providers = [
  {
    id: "ANTHROPIC",
    model: "CLAUDE SONNET 4.6",
    l4: 53.8,
    role: "Independent rewrite backend",
    detail:
      "Anthropic's model receives the same intervention instructions, source transcript, temperature, and output constraints.",
  },
  {
    id: "OPENAI",
    model: "GPT-4o-mini",
    l4: 49.6,
    role: "Independent rewrite backend",
    detail:
      "OpenAI's model independently reproduces the same degradation pattern under matched experimental conditions.",
  },
] as const;

const techGroups = [
  {
    label: "LANGUAGE / FEATURES",
    items: [
      {
        name: "Python 3.11+",
        detail: "research pipeline",
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
        name: "NLTK",
        detail: "text processing",
        mark: "NLP",
      },
      {
        name: "LexicalRichness",
        detail: "TTR / MTLD / MATTR",
        mark: "LEX",
      },
      {
        name: "PyLangAcq",
        detail: "CHAT / .cha ingestion",
        mark: "CHA",
      },
    ],
  },
  {
    label: "MODELING / STATISTICS",
    items: [
      {
        name: "scikit-learn",
        detail: "RF · GBT · logistic",
        icon: "scikitlearn",
      },
      {
        name: "SciPy",
        detail: "Wilcoxon testing",
        icon: "scipy",
      },
      {
        name: "NumPy",
        detail: "numeric feature arrays",
        icon: "numpy",
      },
      {
        name: "pandas",
        detail: "experiment tables",
        icon: "pandas",
      },
      {
        name: "Matplotlib",
        detail: "research figures",
        icon: "python",
      },
    ],
  },
  {
    label: "LLM / APPLICATION",
    items: [
      {
        name: "OpenAI",
        detail: "GPT-4o-mini rewrite backend",
        icon: "openai",
      },
      {
        name: "Anthropic",
        detail: "Claude Sonnet 4.6 backend",
        icon: "anthropic",
      },
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
        detail: "frontend typing",
        icon: "typescript",
      },
      {
        name: "Vite",
        detail: "frontend build",
        icon: "vite",
      },
      {
        name: "Recharts",
        detail: "interactive results",
        mark: "CH",
      },
      {
        name: "Tailwind CSS",
        detail: "frontend styling",
        icon: "tailwindcss",
      },
      {
        name: "Docker",
        detail: "containerized deployment",
        icon: "docker",
      },
      {
        name: "Railway",
        detail: "deployment target",
        icon: "railway",
      },
    ],
  },
] as const;

const technicalStages = [
  [
    "INGEST",
    "Parse access-controlled DementiaBank CHAT transcripts while preserving the speech phenomena that may carry clinical information.",
  ],
  [
    "FEATURES",
    "Extract 20 biomarkers spanning lexical diversity, repetition, coherence, syntax, fluency, vocabulary, and content units.",
  ],
  [
    "REWRITE",
    "Run identical L1–L4 intervention levels through OpenAI and Anthropic at temperature 0.3 with deterministic disk caching.",
  ],
  [
    "EVALUATE",
    "Establish an L0 baseline with stratified 5-fold CV, then measure degradation when an original-speech classifier encounters rewritten feature distributions.",
  ],
] as const;

function y(value: number) {
  const min = 45;
  const max = 82;

  return 250 - ((value - min) / (max - min)) * 180;
}

function points(
  key: "anthropic" | "openai" | "average",
) {
  return levels
    .map(
      (level, index) =>
        `${70 + index * 190},${y(level[key]).toFixed(1)}`,
    )
    .join(" ");
}

export function ParaTraceCaseStudy({
  project,
}: ParaTraceCaseStudyProps) {
  const [activeLevel, setActiveLevel] =
    useState(4);

  const rootRef =
    useRef<HTMLElement>(null);

  const selected = levels[activeLevel];

  const repository =
    project.repository ??
    "https://github.com/cybr-wisp/paratrace-cym2026";

  useEffect(() => {
    const root = rootRef.current;

    if (!root) {
      return;
    }

    const revealNodes =
      root.querySelectorAll<HTMLElement>(
        "[data-reveal]",
      );

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      revealNodes.forEach((node) => {
        node.classList.add("is-visible");
      });

      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add(
            "is-visible",
          );

          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -8% 0px",
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
    70 + activeLevel * 190;

  return (
    <article
      ref={rootRef}
      className="case-study ptv2"
    >
      <Link
        href="/projects"
        className="archive-back ptv2__back"
      >
        ← PROJECTS
      </Link>

      {/* =====================================================
          HERO
          ===================================================== */}

      <header className="ptv2-hero">
        <span className="ptv2-kicker">
          02 · PROJECT / AI SAFETY RESEARCH
        </span>

        <h1>{project.title}</h1>

        <p className="ptv2-hero__statement copy-en">
          AI preserved <em>what</em> patients
          said — while erasing part of{" "}
          <em>how</em> they said it.
        </p>

        <p className="ptv2-hero__statement copy-fr">
          L&apos;IA a préservé{" "}
          <em>ce qui</em> était dit — tout en
          effaçant une partie de{" "}
          <em>la manière</em> de le dire.
        </p>

        <p className="ptv2-hero__dek copy-en">
          A controlled audit of whether
          generative rewriting can preserve
          semantic meaning while destroying the
          linguistic structure used by
          downstream cognitive-screening
          models.
        </p>

        <p className="ptv2-hero__dek copy-fr">
          Un audit contrôlé visant à déterminer
          si la réécriture générative peut
          préserver le sens tout en détruisant
          la structure linguistique utilisée par
          des modèles de dépistage cognitif.
        </p>

        <dl className="ptv2-meta">
          <div>
            <dt>DATA</dt>
            <dd>552 TRANSCRIPTS</dd>
          </div>

          <div>
            <dt>EXPERIMENT</dt>
            <dd>4,416 REWRITES</dd>
          </div>

          <div>
            <dt>FEATURES</dt>
            <dd>20 BIOMARKERS</dd>
          </div>

          <div>
            <dt>LLMs</dt>
            <dd>2 PROVIDERS</dd>
          </div>

          <div>
            <dt>SOURCE</dt>
            <dd>
              <a
                href={repository}
                target="_blank"
                rel="noreferrer"
              >
                GITHUB ↗
              </a>
            </dd>
          </div>
        </dl>
      </header>

      {/* =====================================================
          HEADLINE RESULT
          ===================================================== */}

      <section
        className="ptv2-headline-result"
        aria-label="ParaTrace headline result"
        data-reveal
      >
        <div>
          <span>ORIGINAL SPEECH</span>
          <strong>73.4%</strong>
          <small>
            diagnostic classification
          </small>
        </div>

        <div className="ptv2-headline-result__bridge">
          <span>PROGRESSIVE REWRITE</span>
          <b>→</b>
        </div>

        <div className="is-accent">
          <span>FULL REFORMULATION</span>
          <strong>51.7%</strong>
          <small>
            two-model average · near chance
          </small>
        </div>
      </section>

      <CaseStudyTechStack
        groups={techGroups}
        eyebrow="RESEARCH + PRODUCT STACK"
      />

      {/* =====================================================
          01 — PROBLEM
          ===================================================== */}

      <section className="ptv2-section">
        <div className="ptv2-section__marker">
          <span>01</span>
          <h2>THE PROBLEM</h2>
        </div>

        <div className="ptv2-section__body">
          <p className="ptv2-lead copy-en">
            Clinical documentation systems are
            rewarded for producing clean,
            concise language. Cognitive
            screening can depend on exactly the
            opposite: repetitions, hesitations,
            reduced coherence, unusual lexical
            distributions, and simplified
            syntax.
          </p>

          <p className="ptv2-lead copy-fr">
            Les systèmes de documentation
            clinique sont conçus pour produire
            un langage clair et concis. Le
            dépistage cognitif peut au contraire
            dépendre des répétitions, hésitations,
            variations de cohérence et
            simplifications syntaxiques.
          </p>

          <div
            className="ptv2-collision"
            data-reveal
          >
            <article>
              <span>OBJECTIVE A</span>
              <strong>
                MAKE THE NOTE CLEANER
              </strong>
              <p>
                Remove filler, repetition,
                awkward phrasing, and
                grammatical irregularity.
              </p>
            </article>

            <div
              className="ptv2-collision__mark"
              aria-hidden="true"
            >
              ×
            </div>

            <article className="is-accent">
              <span>OBJECTIVE B</span>
              <strong>
                PRESERVE CLINICAL SIGNAL
              </strong>
              <p>
                Retain speech characteristics
                that may differentiate healthy
                and cognitively impaired
                language.
              </p>
            </article>
          </div>

          <div
            className="ptv2-question"
            data-reveal
          >
            <span>RESEARCH QUESTION</span>

            <strong>
              If a diagnostic mapping is learned
              from original speech, how much of
              that signal survives when different
              LLMs progressively rewrite the same
              transcript?
            </strong>
          </div>
        </div>
      </section>

      {/* =====================================================
          02 — EXPERIMENT
          ===================================================== */}

      <section className="ptv2-section">
        <div className="ptv2-section__marker">
          <span>02</span>
          <h2>CONTROLLED EXPERIMENT</h2>
        </div>

        <div className="ptv2-section__body">
          <p className="ptv2-lead copy-en">
            Instead of asking whether one model
            makes one transcript look different,
            ParaTrace holds the experiment
            constant across an entire clinically
            labelled corpus and changes the
            intensity of rewriting systematically.
          </p>

          <p className="ptv2-lead copy-fr">
            ParaTrace maintient les conditions
            expérimentales constantes sur un
            corpus clinique complet et fait
            varier systématiquement l&apos;intensité
            de la réécriture.
          </p>

          <div
            className="ptv2-stage-grid"
            data-reveal
          >
            {technicalStages.map(
              ([label, copy], index) => (
                <article key={label}>
                  <span>
                    {String(
                      index + 1,
                    ).padStart(2, "0")}
                  </span>

                  <h3>{label}</h3>

                  <p>{copy}</p>
                </article>
              ),
            )}
          </div>

          <div className="ptv2-method-strip">
            <div>
              <span>CLASSIFIERS</span>
              <strong>
                RF 200 · GBT 150 · LOGISTIC
              </strong>
            </div>

            <div>
              <span>BASELINE</span>
              <strong>
                STRATIFIED 5-FOLD CV
              </strong>
            </div>

            <div>
              <span>STATS</span>
              <strong>
                WILCOXON · COHEN&apos;S d · BRR
              </strong>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          03 — CROSS MODEL
          ===================================================== */}

      <section className="ptv2-section">
        <div className="ptv2-section__marker">
          <span>03</span>
          <h2>CROSS-MODEL TEST</h2>
        </div>

        <div className="ptv2-section__body">
          <p className="ptv2-lead">
            The key replication test is whether
            the effect belongs to one vendor or
            survives a change in model provider.
            Both backends receive the same
            transcript and matched intervention
            instructions.
          </p>

          <div
            className="ptv2-provider-grid"
            data-reveal
          >
            {providers.map((provider) => (
              <article key={provider.id}>
                <div className="ptv2-provider-grid__top">
                  <span>{provider.id}</span>
                  <small>
                    {provider.role}
                  </small>
                </div>

                <h3>{provider.model}</h3>

                <p>{provider.detail}</p>

                <div className="ptv2-provider-grid__metric">
                  <span>L4 ACCURACY</span>
                  <strong>
                    {provider.l4.toFixed(1)}%
                  </strong>
                </div>
              </article>
            ))}
          </div>

          <div
            className="ptv2-controls"
            data-reveal
          >
            <span>SAME SOURCE TRANSCRIPT</span>
            <span>SAME L1–L4 PROMPTS</span>
            <span>TEMPERATURE · 0.3</span>
            <span>MAX TOKENS · 2000</span>
            <span>DISK-CACHED OUTPUTS</span>
          </div>

          <div className="ptv2-model-table">
            <div className="ptv2-model-table__head">
              <span>LEVEL</span>
              <span>ANTHROPIC</span>
              <span>OPENAI</span>
              <span>AVERAGE</span>
            </div>

            {levels.map((level) => (
              <button
                type="button"
                key={level.id}
                className={
                  activeLevel ===
                  levels.indexOf(level)
                    ? "is-active"
                    : ""
                }
                onClick={() =>
                  setActiveLevel(
                    levels.indexOf(level),
                  )
                }
              >
                <span>
                  {level.id} · {level.label}
                </span>

                <strong>
                  {level.anthropic.toFixed(1)}%
                </strong>

                <strong>
                  {level.openai.toFixed(1)}%
                </strong>

                <strong>
                  {level.average.toFixed(1)}%
                </strong>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          04 — SIGNAL ERASURE
          ===================================================== */}

      <section className="ptv2-section">
        <div className="ptv2-section__marker">
          <span>04</span>
          <h2>SIGNAL ERASURE</h2>
        </div>

        <div className="ptv2-section__body">
          <div
            className="ptv2-levels"
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
            className="ptv2-level-readout ptv2-level-readout--animated"
            aria-live="polite"
          >
            <div>
              <span>
                {selected.id} ·{" "}
                {selected.label}
              </span>

              <p>
                {selected.detail}
              </p>
            </div>

            <div>
              <span>ANTHROPIC</span>
              <strong>
                {selected.anthropic.toFixed(1)}%
              </strong>
            </div>

            <div>
              <span>OPENAI</span>
              <strong>
                {selected.openai.toFixed(1)}%
              </strong>
            </div>

            <div className="is-accent">
              <span>AVERAGE</span>
              <strong>
                {selected.average.toFixed(1)}%
              </strong>
            </div>
          </div>

          <div
            className="ptv2-chart"
            data-reveal
          >
            <div className="ptv2-chart__head">
              <span>
                DIAGNOSTIC ACCURACY BY REWRITE
                LEVEL
              </span>

              <strong>
                19 / 20 FEATURES SIGNIFICANTLY
                ALTERED BY L2
              </strong>
            </div>

            <div className="ptv2-chart__legend">
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

            <svg
              viewBox="0 0 900 290"
              role="img"
              aria-label="Diagnostic accuracy degradation across L0 to L4"
            >
              <g className="ptv2-chart__grid">
                <line
                  x1="45"
                  x2="850"
                  y1="70"
                  y2="70"
                />
                <line
                  x1="45"
                  x2="850"
                  y1="130"
                  y2="130"
                />
                <line
                  x1="45"
                  x2="850"
                  y1="190"
                  y2="190"
                />
                <line
                  x1="45"
                  x2="850"
                  y1="250"
                  y2="250"
                />
              </g>

              <line
                className="ptv2-chart__chance"
                x1="45"
                x2="850"
                y1={y(50)}
                y2={y(50)}
              />

              <text
                className="ptv2-chart__chance-label"
                x="855"
                y={y(50) + 4}
              >
                50% CHANCE
              </text>

              <line
                className="ptv2-chart__focus"
                x1={activeX}
                x2={activeX}
                y1="55"
                y2="250"
              />

              <polyline
                pathLength="1"
                className="ptv2-chart__anthropic ptv2-chart__series"
                points={points("anthropic")}
              />

              <polyline
                pathLength="1"
                className="ptv2-chart__openai ptv2-chart__series"
                points={points("openai")}
              />

              <polyline
                pathLength="1"
                className="ptv2-chart__average ptv2-chart__series"
                points={points("average")}
              />

              {levels.map(
                (level, index) => {
                  const x =
                    70 + index * 190;

                  return (
                    <g key={level.id}>
                      <circle
                        className="ptv2-chart__provider-dot ptv2-chart__provider-dot--anthropic"
                        cx={x}
                        cy={y(
                          level.anthropic,
                        )}
                        r="3"
                      />

                      <circle
                        className="ptv2-chart__provider-dot ptv2-chart__provider-dot--openai"
                        cx={x}
                        cy={y(
                          level.openai,
                        )}
                        r="3"
                      />

                      <circle
                        className={`ptv2-chart__dot ${
                          activeLevel ===
                          index
                            ? "is-active"
                            : ""
                        }`}
                        cx={x}
                        cy={y(
                          level.average,
                        )}
                        r="4"
                      />

                      <text
                        className={`ptv2-chart__x ${
                          activeLevel ===
                          index
                            ? "is-active"
                            : ""
                        }`}
                        x={x}
                        y="278"
                      >
                        {level.id}
                      </text>
                    </g>
                  );
                },
              )}
            </svg>
          </div>
        </div>
      </section>

      {/* =====================================================
          05 — WHAT VS HOW
          ===================================================== */}

      <section className="ptv2-section">
        <div className="ptv2-section__marker">
          <span>05</span>
          <h2>WHAT VS HOW</h2>
        </div>

        <div className="ptv2-section__body">
          <div
            className="ptv2-what-how"
            data-reveal
          >
            <article>
              <span>WHAT</span>
              <strong>&gt;83%</strong>
              <h3>SEMANTIC SIMILARITY</h3>
              <p>
                Meaning remained highly aligned
                with the original transcript.
              </p>
            </article>

            <article className="is-accent">
              <span>HOW</span>
              <strong>51.7%</strong>
              <h3>DIAGNOSTIC ACCURACY</h3>
              <p>
                The linguistic form carrying the
                classification signal fell
                toward binary chance.
              </p>
            </article>
          </div>

          <blockquote
            className="ptv2-thesis"
            data-reveal
          >
            Semantic fidelity is not diagnostic
            fidelity.
          </blockquote>

          <p className="ptv2-technical-note">
            A rewrite can therefore be
            semantically excellent and still be
            destructive to another downstream
            task. The content survives; the
            distributional and structural
            properties of the language do not.
          </p>
        </div>
      </section>

      {/* =====================================================
          06 — MECHANISM
          ===================================================== */}

      <section className="ptv2-section">
        <div className="ptv2-section__marker">
          <span>06</span>
          <h2>WHY IT BREAKS</h2>
        </div>

        <div className="ptv2-section__body">
          <div
            className="ptv2-feature-summary"
            data-reveal
          >
            <div>
              <span>
                STRONGEST PREDICTORS
              </span>

              <strong>
                GLOBAL COHERENCE
              </strong>

              <strong>
                PRONOUN : NOUN RATIO
              </strong>

              <strong>CIU RATIO</strong>
            </div>

            <div>
              <span>FEATURE SPACE</span>

              <p>
                Lexical diversity · repetition
                · semantic coherence · syntactic
                complexity · propositional
                density · word finding ·
                vocabulary sophistication ·
                content units
              </p>
            </div>
          </div>

          <div
            className="ptv2-mechanism"
            data-reveal
          >
            <div>
              <span>RAW SPEECH</span>
              <p>
                Hesitation · repetition ·
                irregular syntax · local
                coherence variation
              </p>
            </div>

            <b>→</b>

            <div>
              <span>LLM OBJECTIVE</span>
              <p>
                Fluency · clarity · organization
                · normalization
              </p>
            </div>

            <b>→</b>

            <div className="is-accent">
              <span>SHIFTED FEATURE SPACE</span>
              <p>
                Language becomes easier to read
                while drifting away from the
                distribution the diagnostic
                model learned.
              </p>
            </div>
          </div>

          <p className="ptv2-technical-note copy-en">
            The important failure mode is not
            simple semantic corruption. LLMs can
            keep the topic and meaning
            recognizable while systematically
            regularizing disfluency, repetition,
            coherence, lexical distribution, and
            syntactic form — exactly the
            dimensions the downstream model
            uses.
          </p>

          <p className="ptv2-technical-note copy-fr">
            Le mode d&apos;échec important
            n&apos;est pas une simple corruption
            sémantique. Les LLM peuvent préserver
            le sujet et le sens tout en
            régularisant les dimensions
            linguistiques utilisées en aval.
          </p>
        </div>
      </section>

      {/* =====================================================
          07 — PROPOSED SOLUTION
          ===================================================== */}

      <section className="ptv2-section">
        <div className="ptv2-section__marker">
          <span>07</span>
          <h2>PROPOSED SOLUTION</h2>
        </div>

        <div className="ptv2-section__body">
          <p className="ptv2-lead copy-en">
            The proposed fix is architectural,
            not prompt-based: preserve the
            diagnostic representation before a
            generative model is allowed to
            normalize the language.
          </p>

          <p className="ptv2-lead copy-fr">
            La solution proposée est
            architecturale : préserver la
            représentation diagnostique avant
            qu&apos;un modèle génératif ne
            normalise le langage.
          </p>

          <div
            className="ptv2-current-path"
            data-reveal
          >
            <span className="ptv2-diagram-label">
              CURRENT / FRAGILE PATH
            </span>

            <div>
              <strong>RAW SPEECH</strong>
            </div>

            <b>→</b>

            <div>
              <strong>AI REWRITE</strong>
            </div>

            <b>→</b>

            <div>
              <strong>
                FEATURE EXTRACTION
              </strong>
            </div>

            <b>→</b>

            <div className="is-risk">
              <strong>
                ALTERED SIGNAL
              </strong>
            </div>
          </div>

          <div
            className="ptv2-architecture"
            aria-label="ParaTrace pre-extraction architecture"
            data-reveal
          >
            <div>
              <span>01</span>

              <strong>
                RAW SPEECH / ASR
              </strong>

              <small>
                access-controlled source
              </small>
            </div>

            <b>→</b>

            <div className="ptv2-architecture__fork">
              <div className="is-accent">
                <span>02A</span>

                <strong>
                  BIOMARKER EXTRACTION
                </strong>

                <small>
                  preserve 20-feature vector
                  before rewrite
                </small>
              </div>

              <div>
                <span>02B</span>

                <strong>AI SCRIBE</strong>

                <small>
                  readability / documentation
                </small>
              </div>
            </div>

            <b>→</b>

            <div className="is-accent">
              <span>03</span>

              <strong>
                CLINICAL OUTPUT
              </strong>

              <small>
                polished note + preserved
                feature profile
              </small>
            </div>
          </div>

          <div
            className="ptv2-solution-principle"
            data-reveal
          >
            <span>DESIGN PRINCIPLE</span>

            <strong>
              Do not ask the generative layer to
              preserve information it was
              explicitly optimized to smooth
              away.
            </strong>
          </div>
        </div>
      </section>

      {/* =====================================================
          08 — SCOPE
          ===================================================== */}

      <section className="ptv2-section">
        <div className="ptv2-section__marker">
          <span>08</span>
          <h2>SCOPE</h2>
        </div>

        <div className="ptv2-section__body">
          <p className="ptv2-lead">
            ParaTrace is a failure-mode audit,
            not a clinical diagnostic system.
            The experiment establishes that
            linguistic normalization can alter
            downstream signal; it does not claim
            that every deployed AI scribe behaves
            identically.
          </p>

          <div
            className="ptv2-limit-grid"
            data-reveal
          >
            <article>
              <span>01</span>
              <strong>
                NOT A DIAGNOSTIC TOOL
              </strong>
              <p>
                Classification is used to measure
                information degradation, not to
                make clinical decisions.
              </p>
            </article>

            <article>
              <span>02</span>
              <strong>
                CONTROLLED REWRITING
              </strong>
              <p>
                The experiment isolates language
                transformation rather than
                reproducing every proprietary
                production scribe pipeline.
              </p>
            </article>

            <article>
              <span>03</span>
              <strong>
                ACCESS-CONTROLLED DATA
              </strong>
              <p>
                Raw DementiaBank participant
                transcripts are not included in
                the public repository.
              </p>
            </article>
          </div>

          <div className="ptv2-scope">
            <span>
              AI SAFETY AUDIT · NOT A
              DIAGNOSTIC TOOL
            </span>

            <span>
              NO RAW PATIENT TRANSCRIPTS IN
              PUBLIC REPOSITORY
            </span>

            <span>
              REPRODUCIBLE PIPELINE · CACHED
              REWRITES
            </span>
          </div>
        </div>
      </section>

      <footer className="ptv2-footer">
        <a
          href={repository}
          target="_blank"
          rel="noreferrer"
        >
          VIEW SOURCE ↗
        </a>

        <Link href="/projects/microgrid-ml">
          NEXT · MICROGRID ML →
        </Link>
      </footer>


      <style>{`
        /* =========================================================
           PARATRACE — SELF-CONTAINED CASE STUDY STYLES
           These rules intentionally use .ptv2 as an extra scope so
           they override the older global ParaTrace selectors.
           ========================================================= */

        .ptv2 {
          width: min(calc(100% - 2rem), 1040px);
          margin-inline: auto;
          padding: 2.2rem 0 5rem;
        }

        body:has(.ptv2) .site-rule {
          display: none !important;
        }

        .ptv2 .ptv2__back {
          display: inline-block;
          margin-bottom: 3rem;
        }

        /* ---------- hero ---------- */

        .ptv2 .ptv2-hero {
          padding-bottom: 2.5rem;
          border-bottom: 1px solid var(--rule-strong);
        }

        .ptv2 .ptv2-kicker {
          display: block;
          margin-bottom: 1rem;
          color: var(--muted);
          font-family: var(--font-display);
          font-size: 0.4rem;
          font-weight: 700;
          letter-spacing: 0.09em;
        }

        .ptv2 .ptv2-hero h1 {
          max-width: 900px;
          font-size: clamp(4.4rem, 10vw, 8.5rem);
          font-weight: 700;
          line-height: 0.82;
          letter-spacing: -0.07em;
        }

        .ptv2 .ptv2-hero__statement {
          max-width: 850px;
          margin-top: 1.55rem;
          font-family: var(--font-display);
          font-size: clamp(1.65rem, 3.4vw, 2.9rem);
          font-weight: 700;
          line-height: 1;
          letter-spacing: -0.045em;
        }

        .ptv2 .ptv2-hero__statement em {
          color: var(--klein-blue);
          font-style: normal;
        }

        .ptv2 .ptv2-hero__dek {
          max-width: 720px;
          margin-top: 1rem;
          color: var(--muted);
          font-size: 1.02rem;
          line-height: 1.42;
        }

        .ptv2 .ptv2-meta {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          margin-top: 2rem;
          border-top: 1px solid var(--rule);
        }

        .ptv2 .ptv2-meta > div {
          min-width: 0;
          padding: 0.8rem 0.7rem 0 0;
        }

        .ptv2 .ptv2-meta dt {
          color: var(--muted);
          font-family: var(--font-display);
          font-size: 0.31rem;
          font-weight: 700;
          letter-spacing: 0.08em;
        }

        .ptv2 .ptv2-meta dd {
          margin-top: 0.23rem;
          overflow-wrap: anywhere;
          font-family: var(--font-display);
          font-size: 0.43rem;
          font-weight: 700;
          line-height: 1.1;
        }

        .ptv2 .ptv2-meta a {
          color: var(--klein-blue);
        }

        /* ---------- headline result ---------- */

        .ptv2 .ptv2-headline-result {
          display: grid;
          grid-template-columns:
            minmax(0, 1fr)
            minmax(130px, 0.45fr)
            minmax(0, 1fr);
          gap: 1.25rem;
          align-items: center;
          margin: 2.4rem 0;
          padding: 1.4rem 0;
          border-top: 1px solid var(--rule-strong);
          border-bottom: 1px solid var(--rule-strong);
          font-family: var(--font-display);
        }

        .ptv2 .ptv2-headline-result > div:not(.ptv2-headline-result__bridge) {
          display: flex;
          min-width: 0;
          flex-direction: column;
        }

        .ptv2 .ptv2-headline-result span,
        .ptv2 .ptv2-headline-result small {
          color: var(--muted);
          font-size: 0.35rem;
          font-weight: 700;
          letter-spacing: 0.07em;
        }

        .ptv2 .ptv2-headline-result strong {
          margin: 0.2rem 0;
          font-size: clamp(2.7rem, 6vw, 5.3rem);
          line-height: 0.9;
          letter-spacing: -0.06em;
        }

        .ptv2 .ptv2-headline-result .is-accent strong {
          color: var(--klein-blue);
        }

        .ptv2 .ptv2-headline-result__bridge {
          display: flex;
          align-items: center;
          flex-direction: column;
          gap: 0.35rem;
          text-align: center;
        }

        .ptv2 .ptv2-headline-result__bridge b {
          color: var(--klein-blue);
          font-size: 1.3rem;
          font-weight: 400;
        }

        /* ---------- section shell ---------- */

        .ptv2 .ptv2-section {
          display: grid;
          grid-template-columns: 150px minmax(0, 1fr);
          gap: 2rem;
          padding: 3.25rem 0;
          border-top: 1px solid var(--rule);
        }

        .ptv2 .ptv2-section__marker > span {
          display: block;
          color: var(--klein-blue);
          font-family: var(--font-display);
          font-size: 0.34rem;
          font-weight: 700;
          letter-spacing: 0.08em;
        }

        .ptv2 .ptv2-section__marker h2 {
          margin-top: 0.4rem;
          font-size: 0.76rem;
          line-height: 1.05;
        }

        .ptv2 .ptv2-section__body {
          min-width: 0;
        }

        .ptv2 .ptv2-lead {
          max-width: 760px;
          font-size: 1rem;
          line-height: 1.45;
        }

        /* ---------- 01 problem ---------- */

        .ptv2 .ptv2-collision {
          display: grid;
          grid-template-columns:
            minmax(0, 1fr)
            48px
            minmax(0, 1fr);
          margin-top: 1.35rem;
          border: 1px solid var(--rule-strong);
          background: var(--surface);
        }

        .ptv2 .ptv2-collision > article {
          min-width: 0;
          padding: 1rem;
        }

        .ptv2 .ptv2-collision > article > span {
          display: block;
          margin-bottom: 0.5rem;
          color: var(--muted);
          font-family: var(--font-display);
          font-size: 0.32rem;
          font-weight: 700;
          letter-spacing: 0.08em;
        }

        .ptv2 .ptv2-collision > article > strong {
          display: block;
          font-family: var(--font-display);
          font-size: 0.67rem;
          line-height: 1.05;
        }

        .ptv2 .ptv2-collision > article > p {
          margin-top: 0.45rem;
          color: var(--muted);
          font-size: 0.84rem;
          line-height: 1.28;
        }

        .ptv2 .ptv2-collision > article.is-accent {
          background:
            color-mix(
              in srgb,
              var(--klein-blue) 4%,
              var(--surface)
            );
        }

        .ptv2 .ptv2-collision > article.is-accent > strong {
          color: var(--klein-blue);
        }

        .ptv2 .ptv2-collision__mark {
          display: grid;
          place-items: center;
          border-left: 1px solid var(--rule);
          border-right: 1px solid var(--rule);
          color: var(--klein-blue);
          font-family: var(--font-display);
          font-size: 0.9rem;
          font-weight: 700;
        }

        .ptv2 .ptv2-question {
          margin-top: 0.8rem;
          padding: 0.95rem 1rem;
          border-left: 2px solid var(--klein-blue);
          background:
            color-mix(
              in srgb,
              var(--klein-blue) 4%,
              var(--surface)
            );
        }

        .ptv2 .ptv2-question > span {
          display: block;
          margin-bottom: 0.35rem;
          color: var(--klein-blue);
          font-family: var(--font-display);
          font-size: 0.32rem;
          font-weight: 700;
          letter-spacing: 0.08em;
        }

        .ptv2 .ptv2-question > strong {
          display: block;
          max-width: 780px;
          font-family: var(--font-body);
          font-size: 1rem;
          font-weight: 600;
          line-height: 1.35;
        }

        /* ---------- 02 experiment ---------- */

        .ptv2 .ptv2-stage-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          margin-top: 1.4rem;
          border-top: 1px solid var(--rule-strong);
          border-left: 1px solid var(--rule-strong);
        }

        .ptv2 .ptv2-stage-grid article {
          min-width: 0;
          min-height: 150px;
          padding: 0.85rem;
          border-right: 1px solid var(--rule-strong);
          border-bottom: 1px solid var(--rule-strong);
          background: var(--surface);
        }

        .ptv2 .ptv2-stage-grid article > span {
          color: var(--klein-blue);
          font-family: var(--font-display);
          font-size: 0.31rem;
          font-weight: 700;
        }

        .ptv2 .ptv2-stage-grid h3 {
          margin-top: 1.3rem;
          font-family: var(--font-display);
          font-size: 0.55rem;
        }

        .ptv2 .ptv2-stage-grid p {
          margin-top: 0.4rem;
          color: var(--muted);
          font-size: 0.77rem;
          line-height: 1.25;
        }

        .ptv2 .ptv2-method-strip {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          margin-top: 0.75rem;
          border: 1px solid var(--rule);
        }

        .ptv2 .ptv2-method-strip > div {
          min-width: 0;
          padding: 0.72rem;
          border-right: 1px solid var(--rule);
        }

        .ptv2 .ptv2-method-strip > div:last-child {
          border-right: 0;
        }

        .ptv2 .ptv2-method-strip span {
          display: block;
          color: var(--muted);
          font-family: var(--font-display);
          font-size: 0.29rem;
          font-weight: 700;
          letter-spacing: 0.07em;
        }

        .ptv2 .ptv2-method-strip strong {
          display: block;
          margin-top: 0.25rem;
          font-family: var(--font-display);
          font-size: 0.43rem;
          line-height: 1.08;
        }

        /* ---------- 03 providers ---------- */

        .ptv2 .ptv2-provider-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          margin-top: 1.35rem;
          border: 1px solid var(--rule-strong);
          background: var(--surface);
        }

        .ptv2 .ptv2-provider-grid > article {
          min-width: 0;
          padding: 1rem;
        }

        .ptv2 .ptv2-provider-grid > article + article {
          border-left: 1px solid var(--rule);
        }

        .ptv2 .ptv2-provider-grid__top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
        }

        .ptv2 .ptv2-provider-grid__top > span {
          color: var(--klein-blue);
          font-family: var(--font-display);
          font-size: 0.34rem;
          font-weight: 700;
          letter-spacing: 0.08em;
        }

        .ptv2 .ptv2-provider-grid__top > small {
          max-width: 11rem;
          color: var(--muted);
          font-family: var(--font-display);
          font-size: 0.3rem;
          font-weight: 700;
          line-height: 1.2;
          text-align: right;
        }

        .ptv2 .ptv2-provider-grid h3 {
          margin-top: 0.75rem;
          font-family: var(--font-display);
          font-size: clamp(1.05rem, 2vw, 1.4rem);
          line-height: 1;
          letter-spacing: -0.035em;
        }

        .ptv2 .ptv2-provider-grid article > p {
          margin-top: 0.6rem;
          color: var(--muted);
          font-size: 0.84rem;
          line-height: 1.3;
        }

        .ptv2 .ptv2-provider-grid__metric {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 0.7rem;
          margin-top: 0.9rem;
          padding-top: 0.7rem;
          border-top: 1px solid var(--rule);
        }

        .ptv2 .ptv2-provider-grid__metric span {
          color: var(--muted);
          font-family: var(--font-display);
          font-size: 0.31rem;
          font-weight: 700;
          letter-spacing: 0.06em;
        }

        .ptv2 .ptv2-provider-grid__metric strong {
          font-family: var(--font-display);
          font-size: 1.35rem;
          line-height: 0.95;
        }

        .ptv2 .ptv2-controls {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
          margin-top: 0.7rem;
        }

        .ptv2 .ptv2-controls span {
          display: inline-block;
          padding: 0.35rem 0.48rem;
          border: 1px solid var(--rule);
          color: var(--muted);
          background: var(--surface);
          font-family: var(--font-display);
          font-size: 0.3rem;
          font-weight: 700;
          letter-spacing: 0.05em;
        }

        .ptv2 .ptv2-model-table {
          width: 100%;
          margin-top: 0.85rem;
          border-top: 1px solid var(--rule-strong);
          border-left: 1px solid var(--rule-strong);
          font-family: var(--font-display);
        }

        .ptv2 .ptv2-model-table__head,
        .ptv2 .ptv2-model-table > button {
          display: grid;
          grid-template-columns:
            minmax(150px, 1.45fr)
            repeat(3, minmax(92px, 0.72fr));
          align-items: stretch;
        }

        .ptv2 .ptv2-model-table__head > span,
        .ptv2 .ptv2-model-table > button > span,
        .ptv2 .ptv2-model-table > button > strong {
          min-width: 0;
          padding: 0.58rem 0.62rem;
          border-right: 1px solid var(--rule);
          border-bottom: 1px solid var(--rule);
        }

        .ptv2 .ptv2-model-table__head > span {
          color: var(--muted);
          font-size: 0.3rem;
          font-weight: 700;
          letter-spacing: 0.07em;
        }

        .ptv2 .ptv2-model-table > button {
          width: 100%;
          padding: 0;
          border: 0;
          background: var(--surface);
          color: var(--text);
          cursor: none;
          text-align: left;
        }

        .ptv2 .ptv2-model-table > button > span {
          font-size: 0.49rem;
          font-weight: 700;
        }

        .ptv2 .ptv2-model-table > button > strong {
          font-size: 0.56rem;
          line-height: 1;
        }

        .ptv2 .ptv2-model-table > button > strong:last-child {
          color: var(--klein-blue);
        }

        .ptv2 .ptv2-model-table > button.is-active {
          background:
            color-mix(
              in srgb,
              var(--klein-blue) 7%,
              var(--surface)
            );
        }

        .ptv2 .ptv2-model-table > button.is-active > span {
          color: var(--klein-blue);
        }

        /* ---------- 04 signal erasure ---------- */

        .ptv2 .ptv2-levels {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          border-top: 1px solid var(--rule-strong);
          border-left: 1px solid var(--rule-strong);
        }

        .ptv2 .ptv2-levels button {
          min-height: 72px;
          padding: 0.65rem;
          border: 0;
          border-right: 1px solid var(--rule-strong);
          border-bottom: 1px solid var(--rule-strong);
          background: var(--surface);
          color: var(--text);
          cursor: none;
          text-align: left;
        }

        .ptv2 .ptv2-levels button strong,
        .ptv2 .ptv2-levels button span {
          display: block;
          font-family: var(--font-display);
        }

        .ptv2 .ptv2-levels button strong {
          font-size: 0.45rem;
        }

        .ptv2 .ptv2-levels button span {
          margin-top: 0.3rem;
          color: var(--muted);
          font-size: 0.28rem;
          font-weight: 700;
          letter-spacing: 0.05em;
        }

        .ptv2 .ptv2-levels button.is-active {
          background: var(--klein-blue);
          color: white;
        }

        .ptv2 .ptv2-levels button.is-active span {
          color: white;
        }

        .ptv2 .ptv2-level-readout {
          display: grid;
          grid-template-columns:
            minmax(0, 1.55fr)
            repeat(3, minmax(100px, 0.65fr));
          margin-top: 0.7rem;
          border: 1px solid var(--rule);
        }

        .ptv2 .ptv2-level-readout > div {
          min-width: 0;
          padding: 0.8rem;
          border-right: 1px solid var(--rule);
        }

        .ptv2 .ptv2-level-readout > div:last-child {
          border-right: 0;
        }

        .ptv2 .ptv2-level-readout span {
          display: block;
          color: var(--muted);
          font-family: var(--font-display);
          font-size: 0.3rem;
          font-weight: 700;
          letter-spacing: 0.06em;
        }

        .ptv2 .ptv2-level-readout p {
          margin-top: 0.35rem;
          color: var(--muted);
          font-size: 0.78rem;
          line-height: 1.23;
        }

        .ptv2 .ptv2-level-readout strong {
          display: block;
          margin-top: 0.35rem;
          font-family: var(--font-display);
          font-size: 1.25rem;
        }

        .ptv2 .ptv2-level-readout .is-accent strong {
          color: var(--klein-blue);
        }

        .ptv2 .ptv2-level-readout--animated {
          animation:
            ptv2-local-readout
            280ms
            var(--ease, cubic-bezier(.22,1,.36,1))
            both;
        }

        .ptv2 .ptv2-chart {
          margin-top: 0.8rem;
          padding: 0.9rem;
          border: 1px solid var(--rule-strong);
          background: var(--surface);
        }

        .ptv2 .ptv2-chart__head {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          align-items: flex-start;
          font-family: var(--font-display);
        }

        .ptv2 .ptv2-chart__head span,
        .ptv2 .ptv2-chart__head strong {
          font-size: 0.31rem;
          font-weight: 700;
          letter-spacing: 0.06em;
        }

        .ptv2 .ptv2-chart__head span {
          color: var(--muted);
        }

        .ptv2 .ptv2-chart__head strong {
          color: var(--klein-blue);
          text-align: right;
        }

        .ptv2 .ptv2-chart__legend {
          display: flex;
          flex-wrap: wrap;
          gap: 0.55rem 1rem;
          margin-top: 0.65rem;
          margin-bottom: 0.5rem;
        }

        .ptv2 .ptv2-chart__legend span {
          display: inline-flex;
          align-items: center;
          gap: 0.38rem;
          color: var(--muted);
          font-family: var(--font-display);
          font-size: 0.29rem;
          font-weight: 700;
          letter-spacing: 0.05em;
        }

        .ptv2 .ptv2-chart__legend span::before {
          content: "";
          display: block;
          width: 22px;
          height: 2px;
          background: var(--text);
        }

        .ptv2 .ptv2-chart__legend .is-anthropic::before {
          height: 1px;
          background: var(--muted);
        }

        .ptv2 .ptv2-chart__legend .is-openai::before {
          height: 1px;
          background:
            repeating-linear-gradient(
              to right,
              var(--text) 0 4px,
              transparent 4px 7px
            );
        }

        .ptv2 .ptv2-chart__legend .is-average::before {
          background: var(--klein-blue);
        }

        .ptv2 .ptv2-chart svg {
          display: block;
          width: 100%;
          height: auto;
          overflow: visible;
        }

        .ptv2 .ptv2-chart__grid line {
          stroke: var(--rule);
          stroke-width: 1;
          vector-effect: non-scaling-stroke;
        }

        .ptv2 .ptv2-chart__chance {
          stroke: var(--muted);
          stroke-width: 1;
          stroke-dasharray: 5 6;
          opacity: 0.7;
          vector-effect: non-scaling-stroke;
        }

        .ptv2 .ptv2-chart__chance-label,
        .ptv2 .ptv2-chart__x {
          fill: var(--muted);
          font-family: var(--font-display);
          font-size: 10px;
          font-weight: 700;
        }

        .ptv2 .ptv2-chart__focus {
          stroke: var(--klein-blue);
          stroke-width: 1;
          stroke-dasharray: 3 5;
          opacity: 0.3;
          vector-effect: non-scaling-stroke;
          transition:
            x1 260ms var(--ease, cubic-bezier(.22,1,.36,1)),
            x2 260ms var(--ease, cubic-bezier(.22,1,.36,1));
        }

        .ptv2 .ptv2-chart__series {
          fill: none;
          vector-effect: non-scaling-stroke;
          opacity: 0;
          transition:
            opacity 700ms var(--ease, cubic-bezier(.22,1,.36,1));
        }

        .ptv2 .ptv2-chart.is-visible .ptv2-chart__series {
          opacity: 1;
        }

        .ptv2 .ptv2-chart__anthropic {
          stroke: var(--muted);
          stroke-width: 1.3;
        }

        .ptv2 .ptv2-chart__openai {
          stroke: var(--text);
          stroke-width: 1.3;
          stroke-dasharray: 7 7;
        }

        .ptv2 .ptv2-chart__average {
          stroke: var(--klein-blue);
          stroke-width: 2.2;
        }

        .ptv2 .ptv2-chart__provider-dot--anthropic {
          fill: var(--muted);
        }

        .ptv2 .ptv2-chart__provider-dot--openai {
          fill: var(--text);
        }

        .ptv2 .ptv2-chart__dot {
          fill: var(--klein-blue);
          transform-box: fill-box;
          transform-origin: center;
          transition:
            transform 260ms var(--ease, cubic-bezier(.22,1,.36,1));
        }

        .ptv2 .ptv2-chart__dot.is-active {
          transform: scale(1.45);
        }

        .ptv2 .ptv2-chart__x.is-active {
          fill: var(--klein-blue);
        }

        /* ---------- 05 what vs how ---------- */

        .ptv2 .ptv2-what-how {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          border: 1px solid var(--rule-strong);
        }

        .ptv2 .ptv2-what-how article {
          min-width: 0;
          padding: 1rem;
        }

        .ptv2 .ptv2-what-how article + article {
          border-left: 1px solid var(--rule);
        }

        .ptv2 .ptv2-what-how span {
          color: var(--muted);
          font-family: var(--font-display);
          font-size: 0.32rem;
          font-weight: 700;
        }

        .ptv2 .ptv2-what-how strong {
          display: block;
          margin-top: 0.55rem;
          font-family: var(--font-display);
          font-size: clamp(2.4rem, 5vw, 4.4rem);
          line-height: 0.9;
          letter-spacing: -0.05em;
        }

        .ptv2 .ptv2-what-how h3 {
          margin-top: 0.45rem;
          font-size: 0.5rem;
        }

        .ptv2 .ptv2-what-how p {
          margin-top: 0.45rem;
          color: var(--muted);
          font-size: 0.82rem;
          line-height: 1.25;
        }

        .ptv2 .ptv2-what-how .is-accent strong {
          color: var(--klein-blue);
        }

        .ptv2 .ptv2-thesis {
          margin-top: 0.8rem;
          padding: 1rem;
          border-left: 2px solid var(--klein-blue);
          background:
            color-mix(
              in srgb,
              var(--klein-blue) 4%,
              var(--surface)
            );
          font-family: var(--font-display);
          font-size: clamp(1.35rem, 3vw, 2.2rem);
          font-weight: 700;
          line-height: 1.04;
          letter-spacing: -0.035em;
        }

        .ptv2 .ptv2-technical-note {
          max-width: 760px;
          margin-top: 1rem;
          color: var(--muted);
          font-size: 0.9rem;
          line-height: 1.38;
        }

        /* ---------- 06 mechanism ---------- */

        .ptv2 .ptv2-feature-summary {
          display: grid;
          grid-template-columns:
            minmax(0, 0.8fr)
            minmax(0, 1.2fr);
          gap: 0.55rem;
        }

        .ptv2 .ptv2-feature-summary > div {
          min-width: 0;
          padding: 0.95rem;
          border: 1px solid var(--rule);
        }

        .ptv2 .ptv2-feature-summary span {
          display: block;
          margin-bottom: 0.55rem;
          color: var(--muted);
          font-family: var(--font-display);
          font-size: 0.31rem;
          font-weight: 700;
          letter-spacing: 0.06em;
        }

        .ptv2 .ptv2-feature-summary strong {
          display: block;
          padding: 0.3rem 0;
          border-top: 1px solid var(--rule);
          font-family: var(--font-display);
          font-size: 0.49rem;
        }

        .ptv2 .ptv2-feature-summary p {
          color: var(--muted);
          font-size: 0.85rem;
          line-height: 1.32;
        }

        .ptv2 .ptv2-mechanism {
          display: grid;
          grid-template-columns:
            minmax(0, 1fr)
            34px
            minmax(0, 1fr)
            34px
            minmax(0, 1fr);
          gap: 0.45rem;
          align-items: stretch;
          margin-top: 0.8rem;
        }

        .ptv2 .ptv2-mechanism > div {
          min-width: 0;
          padding: 0.85rem;
          border: 1px solid var(--rule);
          background: var(--surface);
        }

        .ptv2 .ptv2-mechanism > b {
          align-self: center;
          color: var(--klein-blue);
          text-align: center;
        }

        .ptv2 .ptv2-mechanism span {
          display: block;
          color: var(--muted);
          font-family: var(--font-display);
          font-size: 0.3rem;
          font-weight: 700;
          letter-spacing: 0.06em;
        }

        .ptv2 .ptv2-mechanism p {
          margin-top: 0.4rem;
          color: var(--muted);
          font-size: 0.78rem;
          line-height: 1.24;
        }

        .ptv2 .ptv2-mechanism .is-accent {
          border-color: var(--klein-blue);
        }

        /* ---------- 07 solution ---------- */

        .ptv2 .ptv2-current-path {
          display: grid;
          grid-template-columns:
            minmax(0, 1fr)
            28px
            minmax(0, 1fr)
            28px
            minmax(0, 1fr)
            28px
            minmax(0, 1fr);
          gap: 0.38rem;
          align-items: center;
        }

        .ptv2 .ptv2-diagram-label {
          grid-column: 1 / -1;
          color: var(--muted);
          font-family: var(--font-display);
          font-size: 0.3rem;
          font-weight: 700;
          letter-spacing: 0.07em;
        }

        .ptv2 .ptv2-current-path > div {
          min-width: 0;
          padding: 0.78rem;
          border: 1px solid var(--rule);
          background: var(--surface);
        }

        .ptv2 .ptv2-current-path > b {
          color: var(--muted);
          text-align: center;
        }

        .ptv2 .ptv2-current-path strong {
          display: block;
          overflow-wrap: anywhere;
          font-family: var(--font-display);
          font-size: 0.43rem;
          line-height: 1.1;
        }

        .ptv2 .ptv2-current-path .is-risk {
          border-color: var(--klein-blue);
        }

        .ptv2 .ptv2-current-path .is-risk strong {
          color: var(--klein-blue);
        }

        .ptv2 .ptv2-architecture {
          display: grid;
          grid-template-columns:
            minmax(160px, 0.8fr)
            40px
            minmax(0, 1.4fr)
            40px
            minmax(160px, 0.9fr);
          gap: 0.5rem;
          align-items: center;
          margin-top: 1rem;
        }

        .ptv2 .ptv2-architecture > div:not(.ptv2-architecture__fork) {
          min-width: 0;
          padding: 0.85rem;
          border: 1px solid var(--rule-strong);
        }

        .ptv2 .ptv2-architecture > b {
          color: var(--klein-blue);
          text-align: center;
        }

        .ptv2 .ptv2-architecture__fork {
          display: grid;
          gap: 0.5rem;
        }

        .ptv2 .ptv2-architecture__fork > div {
          min-width: 0;
          padding: 0.8rem;
          border: 1px solid var(--rule);
        }

        .ptv2 .ptv2-architecture span,
        .ptv2 .ptv2-architecture small {
          display: block;
          color: var(--muted);
          font-family: var(--font-display);
          font-size: 0.3rem;
          font-weight: 700;
        }

        .ptv2 .ptv2-architecture strong {
          display: block;
          margin-top: 0.22rem;
          overflow-wrap: anywhere;
          font-family: var(--font-display);
          font-size: 0.48rem;
          line-height: 1.08;
        }

        .ptv2 .ptv2-architecture small {
          margin-top: 0.25rem;
          line-height: 1.2;
        }

        .ptv2 .ptv2-architecture .is-accent {
          border-color: var(--klein-blue) !important;
        }

        .ptv2 .ptv2-solution-principle {
          display: grid;
          grid-template-columns: 150px minmax(0, 1fr);
          gap: 1rem;
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

        .ptv2 .ptv2-solution-principle span {
          color: var(--klein-blue);
          font-family: var(--font-display);
          font-size: 0.31rem;
          font-weight: 700;
          letter-spacing: 0.07em;
        }

        .ptv2 .ptv2-solution-principle strong {
          font-family: var(--font-body);
          font-size: 0.97rem;
          font-weight: 600;
          line-height: 1.32;
        }

        /* ---------- 08 scope ---------- */

        .ptv2 .ptv2-limit-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          margin-top: 1.2rem;
          border: 1px solid var(--rule-strong);
          background: var(--surface);
        }

        .ptv2 .ptv2-limit-grid article {
          min-width: 0;
          padding: 0.9rem;
        }

        .ptv2 .ptv2-limit-grid article + article {
          border-left: 1px solid var(--rule);
        }

        .ptv2 .ptv2-limit-grid article > span {
          display: block;
          color: var(--klein-blue);
          font-family: var(--font-display);
          font-size: 0.31rem;
          font-weight: 700;
        }

        .ptv2 .ptv2-limit-grid strong {
          display: block;
          margin-top: 0.4rem;
          font-family: var(--font-display);
          font-size: 0.5rem;
          line-height: 1.08;
        }

        .ptv2 .ptv2-limit-grid p {
          margin-top: 0.45rem;
          color: var(--muted);
          font-size: 0.78rem;
          line-height: 1.25;
        }

        .ptv2 .ptv2-scope {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin-top: 0.8rem;
        }

        .ptv2 .ptv2-scope span {
          padding: 0.4rem 0.52rem;
          border: 1px solid var(--rule);
          color: var(--muted);
          font-family: var(--font-display);
          font-size: 0.31rem;
          font-weight: 700;
          letter-spacing: 0.04em;
        }

        /* ---------- footer ---------- */

        .ptv2 .ptv2-footer {
          display: flex;
          justify-content: space-between;
          gap: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--rule-strong);
          font-family: var(--font-display);
          font-size: 0.42rem;
          font-weight: 700;
        }

        /* ---------- reveal animation ---------- */

        .ptv2 [data-reveal] {
          opacity: 0;
          transform: translateY(12px);
          transition:
            opacity 500ms var(--ease, cubic-bezier(.22,1,.36,1)),
            transform 620ms var(--ease, cubic-bezier(.22,1,.36,1));
        }

        .ptv2 [data-reveal].is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .ptv2 .ptv2-stage-grid.is-visible article,
        .ptv2 .ptv2-provider-grid.is-visible article,
        .ptv2 .ptv2-limit-grid.is-visible article {
          animation:
            ptv2-local-card-in
            520ms
            var(--ease, cubic-bezier(.22,1,.36,1))
            both;
        }

        .ptv2 .ptv2-stage-grid.is-visible article:nth-child(2),
        .ptv2 .ptv2-provider-grid.is-visible article:nth-child(2),
        .ptv2 .ptv2-limit-grid.is-visible article:nth-child(2) {
          animation-delay: 70ms;
        }

        .ptv2 .ptv2-stage-grid.is-visible article:nth-child(3),
        .ptv2 .ptv2-limit-grid.is-visible article:nth-child(3) {
          animation-delay: 140ms;
        }

        .ptv2 .ptv2-stage-grid.is-visible article:nth-child(4) {
          animation-delay: 210ms;
        }

        @keyframes ptv2-local-card-in {
          from {
            opacity: 0;
            transform: translateY(8px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes ptv2-local-readout {
          from {
            opacity: 0;
            transform: translateY(6px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* ---------- responsive ---------- */

        @media (max-width: 980px) {
          .ptv2 .ptv2-meta {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .ptv2 .ptv2-stage-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .ptv2 .ptv2-mechanism,
          .ptv2 .ptv2-current-path,
          .ptv2 .ptv2-architecture {
            grid-template-columns: 1fr;
          }

          .ptv2 .ptv2-mechanism > b,
          .ptv2 .ptv2-current-path > b,
          .ptv2 .ptv2-architecture > b {
            transform: rotate(90deg);
          }

          .ptv2 .ptv2-diagram-label {
            grid-column: 1;
          }
        }

        @media (max-width: 800px) {
          .ptv2 {
            width: min(calc(100% - 1.25rem), 1040px);
          }

          .ptv2 .ptv2-section {
            grid-template-columns: 1fr;
            gap: 1.1rem;
          }

          .ptv2 .ptv2-headline-result {
            grid-template-columns: 1fr;
          }

          .ptv2 .ptv2-headline-result__bridge {
            flex-direction: row;
            justify-content: flex-start;
          }

          .ptv2 .ptv2-collision,
          .ptv2 .ptv2-provider-grid,
          .ptv2 .ptv2-what-how,
          .ptv2 .ptv2-feature-summary,
          .ptv2 .ptv2-limit-grid {
            grid-template-columns: 1fr;
          }

          .ptv2 .ptv2-collision__mark {
            min-height: 42px;
            border-top: 1px solid var(--rule);
            border-right: 0;
            border-bottom: 1px solid var(--rule);
            border-left: 0;
          }

          .ptv2 .ptv2-provider-grid > article + article,
          .ptv2 .ptv2-what-how article + article,
          .ptv2 .ptv2-limit-grid article + article {
            border-top: 1px solid var(--rule);
            border-left: 0;
          }

          .ptv2 .ptv2-level-readout {
            grid-template-columns: 1fr 1fr;
          }

          .ptv2 .ptv2-level-readout > div {
            border-bottom: 1px solid var(--rule);
          }

          .ptv2 .ptv2-level-readout > div:nth-child(2) {
            border-right: 0;
          }

          .ptv2 .ptv2-level-readout > div:nth-last-child(-n + 2) {
            border-bottom: 0;
          }

          .ptv2 .ptv2-solution-principle {
            grid-template-columns: 1fr;
          }

          .ptv2 .ptv2-footer {
            align-items: flex-start;
            flex-direction: column;
          }
        }

        @media (max-width: 660px) {
          .ptv2 .ptv2-meta,
          .ptv2 .ptv2-stage-grid,
          .ptv2 .ptv2-method-strip {
            grid-template-columns: 1fr;
          }

          .ptv2 .ptv2-method-strip > div {
            border-right: 0;
            border-bottom: 1px solid var(--rule);
          }

          .ptv2 .ptv2-method-strip > div:last-child {
            border-bottom: 0;
          }

          .ptv2 .ptv2-provider-grid__top,
          .ptv2 .ptv2-provider-grid__metric,
          .ptv2 .ptv2-chart__head {
            align-items: flex-start;
            flex-direction: column;
          }

          .ptv2 .ptv2-provider-grid__top > small,
          .ptv2 .ptv2-chart__head strong {
            max-width: none;
            text-align: left;
          }

          .ptv2 .ptv2-levels {
            grid-template-columns: repeat(5, minmax(80px, 1fr));
            overflow-x: auto;
          }

          .ptv2 .ptv2-model-table {
            overflow-x: auto;
          }

          .ptv2 .ptv2-model-table__head,
          .ptv2 .ptv2-model-table > button {
            min-width: 650px;
          }

          .ptv2 .ptv2-chart {
            overflow-x: auto;
          }

          .ptv2 .ptv2-chart svg {
            min-width: 650px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ptv2 [data-reveal] {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }

          .ptv2 .ptv2-stage-grid.is-visible article,
          .ptv2 .ptv2-provider-grid.is-visible article,
          .ptv2 .ptv2-limit-grid.is-visible article,
          .ptv2 .ptv2-level-readout--animated {
            animation: none !important;
          }

          .ptv2 .ptv2-chart__series {
            opacity: 1 !important;
            transition: none !important;
          }

          .ptv2 .ptv2-chart__focus,
          .ptv2 .ptv2-chart__dot {
            transition: none !important;
          }
        }
      `}</style>
    </article>
  );
}