"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

import { CaseStudyTechStack } from "@/components/projects/CaseStudyTechStack";
import type { Project } from "@/types/content";

type MicrogridCaseStudyProps = Readonly<{
  project: Project;
}>;

// Put the final abstract PDF at:
// public/docs/microgrid-ml-abstract.pdf
const ABSTRACT_URL =
  "/docs/microgrid-ml-abstract.pdf";

const techGroups = [
  {
    label: "MODELING",
    items: [
      {
        name: "Python",
        detail: "training + inference",
        icon: "python",
      },
      {
        name: "PyTorch",
        detail: "LSTM forecaster",
        icon: "pytorch",
      },
      {
        name: "scikit-learn",
        detail: "Random Forest",
        icon: "scikitlearn",
      },
      {
        name: "NumPy",
        detail: "feature arrays",
        icon: "numpy",
      },
    ],
  },
  {
    label: "DATA / EVALUATION",
    items: [
      {
        name: "pandas",
        detail: "IESO preprocessing",
        icon: "pandas",
      },
      {
        name: "IESO",
        detail: "Ontario consumption",
        mark: "ON",
      },
      {
        name: "Joblib",
        detail: "fault artifact",
        mark: "JL",
      },
      {
        name: "pytest",
        detail: "API validation",
        icon: "pytest",
      },
    ],
  },
  {
    label: "SERVING",
    items: [
      {
        name: "FastAPI",
        detail: "forecast + fault APIs",
        icon: "fastapi",
      },
      {
        name: "Pydantic",
        detail: "temporal contracts",
        icon: "pydantic",
      },
      {
        name: "Uvicorn",
        detail: "ASGI serving",
        mark: "ASGI",
      },
      {
        name: "HTTPX",
        detail: "integration tests",
        mark: "HTTP",
      },
    ],
  },
] as const;

const process = [
  {
    number: "01",
    title: "INGEST",
    detail:
      "Clean IESO residential demand and household-generation time series into explicit temporal schemas.",
  },
  {
    number: "02",
    title: "REPRESENT",
    detail:
      "Normalize demand per premise and engineer relative degradation features instead of household identity.",
  },
  {
    number: "03",
    title: "SPLIT",
    detail:
      "Protect evaluation with chronological forecasting splits and whole-household fault holdouts.",
  },
  {
    number: "04",
    title: "TRAIN",
    detail:
      "Fit an LSTM forecaster and class-balanced Random Forest under reproducible preprocessing.",
  },
  {
    number: "05",
    title: "EVALUATE",
    detail:
      "Compare forecasting against persistence and fault ranking with PR-AUC on unseen households.",
  },
  {
    number: "06",
    title: "SERVE",
    detail:
      "Persist models, scalers, thresholds, and config behind strict FastAPI request contracts.",
  },
] as const;

const decisions = [
  {
    title: "CHRONOLOGICAL SPLITTING",
    detail:
      "Overlapping windows make random splitting dangerously optimistic; future observations never enter training.",
  },
  {
    title: "TRAIN-ONLY SCALING",
    detail:
      "Normalization statistics are learned only from the training period and frozen for validation and test.",
  },
  {
    title: "PER-PREMISE TARGET",
    detail:
      "Demand is normalized by premise count so geography size does not become the forecasting shortcut.",
  },
  {
    title: "HOUSEHOLD HOLDOUT",
    detail:
      "Each faulty household is removed entirely during its evaluation round to prevent identity leakage.",
  },
  {
    title: "OOB-DERIVED THRESHOLD",
    detail:
      "The alert cutoff comes from the 99th percentile of normal out-of-bag scores instead of a default 0.50.",
  },
] as const;

const lessons = [
  {
    title: "BASELINES FIRST",
    detail:
      "A time-series model is only useful if it beats a strong persistence baseline on held-out future data.",
  },
  {
    title: "EVALUATION IS PART OF THE MODEL",
    detail:
      "Chronology, household isolation, and threshold selection materially change what the reported metrics mean.",
  },
  {
    title: "TRAINING AND SERVING SHOULD DECOUPLE",
    detail:
      "Saved artifacts make inference deterministic and keep the API independent of the training process.",
  },
] as const;

function EvaluationDiagram() {
  return (
    <figure
      className="mg3-eval-diagram"
      data-mg3-reveal
      aria-labelledby="mg3-eval-title"
    >
      <figcaption id="mg3-eval-title">
        DIAGRAM 01 · LEAKAGE-AWARE EVALUATION
      </figcaption>

      <div className="mg3-eval-diagram__block">
        <span>FORECASTING</span>

        <div className="mg3-time-axis">
          <small>PAST</small>
          <div className="is-train">
            TRAIN
          </div>
          <div className="is-val">
            VALIDATION
          </div>
          <div className="is-test">
            TEST
          </div>
          <small>FUTURE →</small>
        </div>

        <p>
          Fit scaler on train only · tune on
          validation · report once on future
          test.
        </p>
      </div>

      <div className="mg3-eval-diagram__block">
        <span>FAULT RISK</span>

        <div className="mg3-households">
          <div>H01</div>
          <div>H07</div>
          <div>H13</div>
          <b>→</b>
          <strong>
            LEAVE ONE FAULTY HOUSEHOLD OUT
          </strong>
        </div>

        <p>
          Train without the evaluated
          household; score generalization with
          PR-AUC because faults are rare.
        </p>
      </div>
    </figure>
  );
}

function ArchitectureDiagram() {
  return (
    <figure
      className="mg3-architecture"
      data-mg3-reveal
      aria-labelledby="mg3-architecture-title"
    >
      <figcaption id="mg3-architecture-title">
        DIAGRAM 02 · TRAIN OFFLINE, SERVE ONLINE
      </figcaption>

      <svg
        viewBox="0 0 980 360"
        role="img"
        aria-label="Microgrid ML architecture from datasets through offline model training and saved artifacts to FastAPI inference."
      >
        <defs>
          <marker
            id="mg3-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path
              d="M 0 0 L 10 5 L 0 10 z"
              className="mg3-architecture__arrow"
            />
          </marker>
        </defs>

        <text
          x="28"
          y="32"
          className="mg3-architecture__lane"
        >
          OFFLINE TRAINING
        </text>

        <text
          x="585"
          y="32"
          className="mg3-architecture__lane"
        >
          ONLINE INFERENCE
        </text>

        <line
          x1="530"
          x2="530"
          y1="24"
          y2="330"
          className="mg3-architecture__boundary"
        />

        <g className="mg3-architecture__node">
          <rect
            x="28"
            y="70"
            width="170"
            height="72"
            rx="2"
          />
          <text x="44" y="96">
            DATA
          </text>
          <text
            x="44"
            y="120"
            className="is-strong"
          >
            IESO + household
          </text>
        </g>

        <g className="mg3-architecture__node">
          <rect
            x="240"
            y="70"
            width="170"
            height="72"
            rx="2"
          />
          <text x="256" y="96">
            PREPROCESS
          </text>
          <text
            x="256"
            y="120"
            className="is-strong"
          >
            split · scale · features
          </text>
        </g>

        <path
          d="M198 106 H240"
          className="mg3-architecture__flow"
          markerEnd="url(#mg3-arrow)"
        />

        <g className="mg3-architecture__node">
          <rect
            x="28"
            y="198"
            width="170"
            height="78"
            rx="2"
          />
          <text x="44" y="224">
            FORECAST
          </text>
          <text
            x="44"
            y="250"
            className="is-strong"
          >
            PyTorch LSTM
          </text>
        </g>

        <g className="mg3-architecture__node">
          <rect
            x="240"
            y="198"
            width="170"
            height="78"
            rx="2"
          />
          <text x="256" y="224">
            FAULT RISK
          </text>
          <text
            x="256"
            y="250"
            className="is-strong"
          >
            Random Forest
          </text>
        </g>

        <path
          d="M325 142 V170 H113 V198"
          className="mg3-architecture__flow"
          markerEnd="url(#mg3-arrow)"
        />

        <path
          d="M325 142 V198"
          className="mg3-architecture__flow"
          markerEnd="url(#mg3-arrow)"
        />

        <g className="mg3-architecture__artifact">
          <rect
            x="145"
            y="302"
            width="150"
            height="38"
            rx="19"
          />
          <text
            x="220"
            y="326"
            textAnchor="middle"
          >
            SAVED ARTIFACTS
          </text>
        </g>

        <path
          d="M113 276 V292 H220 V302"
          className="mg3-architecture__flow"
          markerEnd="url(#mg3-arrow)"
        />

        <path
          d="M325 276 V292 H220"
          className="mg3-architecture__flow"
        />

        <g className="mg3-architecture__node is-accent">
          <rect
            x="590"
            y="82"
            width="180"
            height="78"
            rx="2"
          />
          <text x="606" y="108">
            API BOUNDARY
          </text>
          <text
            x="606"
            y="134"
            className="is-strong"
          >
            FastAPI + Pydantic
          </text>
        </g>

        <g className="mg3-architecture__node">
          <rect
            x="590"
            y="214"
            width="180"
            height="78"
            rx="2"
          />
          <text x="606" y="240">
            LOAD
          </text>
          <text
            x="606"
            y="266"
            className="is-strong"
          >
            model · scaler · config
          </text>
        </g>

        <g className="mg3-architecture__node is-accent">
          <rect
            x="806"
            y="148"
            width="146"
            height="78"
            rx="2"
          />
          <text x="822" y="174">
            RESPONSE
          </text>
          <text
            x="822"
            y="200"
            className="is-strong"
          >
            forecast / risk
          </text>
        </g>

        <path
          d="M295 321 H500 V253 H590"
          className="mg3-architecture__flow is-accent"
          markerEnd="url(#mg3-arrow)"
        />

        <path
          d="M680 160 V214"
          className="mg3-architecture__flow"
          markerEnd="url(#mg3-arrow)"
        />

        <path
          d="M770 253 H790 V187 H806"
          className="mg3-architecture__flow"
          markerEnd="url(#mg3-arrow)"
        />
      </svg>
    </figure>
  );
}

export function MicrogridCaseStudy({
  project,
}: MicrogridCaseStudyProps) {
  const articleRef =
    useRef<HTMLElement>(null);

  const repository =
    project.repository ??
    "https://github.com/cybr-wisp/microgrid-ml-cym2025";

  useEffect(() => {
    const root = articleRef.current;
    if (!root) return;

    const targets = Array.from(
      root.querySelectorAll<HTMLElement>(
        "[data-mg3-reveal]",
      ),
    );

    const reducedMotion =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

    if (reducedMotion) {
      targets.forEach((target) =>
        target.classList.add(
          "is-visible",
        ),
      );
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
          threshold: 0.12,
          rootMargin:
            "0px 0px -8% 0px",
        },
      );

    targets.forEach((target) =>
      observer.observe(target),
    );

    return () =>
      observer.disconnect();
  }, []);

  return (
    <article
      ref={articleRef}
      className="case-study mg3"
    >
      <Link
        href="/projects"
        className="archive-back mg3__back"
      >
        ← PROJECTS
      </Link>

      <header
        className="mg3-hero"
        data-mg3-reveal
      >
        <span className="mg3-kicker">
          03 · APPLIED ML / ENERGY SYSTEMS
        </span>

        <h1>Microgrid ML</h1>

        <p className="mg3-hero__statement copy-en">
          Forecasting demand. Ranking fault
          risk. Without leaking the future.
        </p>

        <p className="mg3-hero__statement copy-fr">
          Prévoir la demande. Classer le
          risque de panne. Sans fuite
          temporelle.
        </p>

        <p className="mg3-hero__deck copy-en">
          A production-shaped ML system for
          next-hour residential electricity
          forecasting and temporal
          degradation detection, rebuilt
          around leakage-aware evaluation,
          meaningful baselines, persisted
          artifacts, and strict inference
          contracts.
        </p>

        <p className="mg3-hero__deck copy-fr">
          Un système ML pour la prévision
          électrique à une heure et la
          détection de dégradation, reconstruit
          autour d&apos;une évaluation sans
          fuite, de baselines utiles,
          d&apos;artefacts persistés et de
          contrats d&apos;inférence stricts.
        </p>

        <div className="mg3-actions">
          <a
            href={ABSTRACT_URL}
            target="_blank"
            rel="noreferrer"
            className="is-primary"
          >
            ABSTRACT DOC ↗
          </a>

          <a
            href={repository}
            target="_blank"
            rel="noreferrer"
          >
            SOURCE ON GITHUB ↗
          </a>
        </div>

        <dl className="mg3-hero__metrics">
          <div>
            <dt>RAW DATA</dt>
            <dd>1.46M+</dd>
          </div>

          <div>
            <dt>FORECAST</dt>
            <dd>85.44%</dd>
            <small>
              MSE ↓ vs persistence
            </small>
          </div>

          <div>
            <dt>FAULT RANKING</dt>
            <dd>0.803</dd>
            <small>
              mean held-out PR-AUC
            </small>
          </div>

          <div>
            <dt>API</dt>
            <dd>7 / 7</dd>
            <small>
              validation tests passing
            </small>
          </div>
        </dl>
      </header>

      <section
        className="mg3-section"
        data-mg3-reveal
      >
        <header className="mg3-section__label">
          <span>01</span>
          <h2>Two ML problems</h2>
        </header>

        <div className="mg3-section__body">
          <p className="mg3-lead copy-en">
            The project has two deliberately
            different prediction tasks: one
            estimates the next hour of demand;
            the other ranks the risk that recent
            generation behavior resembles a
            degradation event.
          </p>

          <p className="mg3-lead copy-fr">
            Le projet combine deux tâches :
            prévoir la prochaine heure de
            consommation et classer le risque
            qu&apos;un signal de production
            récent ressemble à une dégradation.
          </p>

          <div className="mg3-task-grid">
            <article>
              <span>FORECASTING</span>
              <strong>
                24 HOURS × 5 FEATURES → t + 1
              </strong>
              <p>
                Global PyTorch LSTM over
                consumption per premise plus
                cyclical hour and day-of-week
                features.
              </p>
            </article>

            <article>
              <span>FAULT RISK</span>
              <strong>
                13 × 15 MIN READINGS → RISK
              </strong>
              <p>
                Class-balanced Random Forest
                over relative drops,
                first-differences, and
                variance-normalized degradation
                features.
              </p>
            </article>
          </div>

          <div className="mg3-data-strip">
            <span>
              534 COMPLETE DEMAND SERIES
            </span>
            <span>
              384,480 FORECAST WINDOWS
            </span>
            <span>
              50 HOUSEHOLDS
            </span>
            <span>
              63 FAULT LABELS · 0.65%
            </span>
          </div>
        </div>
      </section>

      <section
        className="mg3-section"
        data-mg3-reveal
      >
        <header className="mg3-section__label">
          <span>02</span>
          <h2>Engineering process</h2>
        </header>

        <div className="mg3-section__body">
          <p className="mg3-lead copy-en">
            The hardest part was not choosing
            the models. It was building an
            evaluation path where the models
            could not win through temporal
            leakage, geographic scale, or
            household identity.
          </p>

          <p className="mg3-lead copy-fr">
            Le point difficile n&apos;était pas
            le choix des modèles, mais la
            construction d&apos;une évaluation
            empêchant les raccourcis temporels,
            géographiques ou liés à
            l&apos;identité des ménages.
          </p>

          <div className="mg3-process">
            {process.map((step) => (
              <article key={step.number}>
                <span>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.detail}</p>
              </article>
            ))}
          </div>

          <EvaluationDiagram />

          <div className="mg3-decisions">
            {decisions.map(
              (decision, index) => (
                <article
                  key={decision.title}
                >
                  <span>
                    {String(
                      index + 1,
                    ).padStart(2, "0")}
                  </span>
                  <h3>
                    {decision.title}
                  </h3>
                  <p>
                    {decision.detail}
                  </p>
                </article>
              ),
            )}
          </div>
        </div>
      </section>

      <section
        className="mg3-section"
        data-mg3-reveal
      >
        <header className="mg3-section__label">
          <span>03</span>
          <h2>Model choices</h2>
        </header>

        <div className="mg3-section__body">
          <div className="mg3-models">
            <article>
              <span>FORECASTER</span>
              <h3>PyTorch LSTM</h3>

              <dl>
                <div>
                  <dt>Input</dt>
                  <dd>24 × 5</dd>
                </div>
                <div>
                  <dt>Hidden</dt>
                  <dd>64</dd>
                </div>
                <div>
                  <dt>Head</dt>
                  <dd>
                    Linear → ReLU → Linear
                  </dd>
                </div>
                <div>
                  <dt>Training</dt>
                  <dd>
                    Adam · MSE · early stopping
                  </dd>
                </div>
                <div>
                  <dt>Baseline</dt>
                  <dd>
                    persistence(t) → t + 1
                  </dd>
                </div>
              </dl>

              <p>
                A recurrent model fits the
                short-horizon temporal task, but
                only earns its complexity if it
                beats persistence on future data.
              </p>
            </article>

            <article>
              <span>FAULT DETECTOR</span>
              <h3>Random Forest</h3>

              <dl>
                <div>
                  <dt>Trees</dt>
                  <dd>500</dd>
                </div>
                <div>
                  <dt>Class weighting</dt>
                  <dd>
                    balanced_subsample
                  </dd>
                </div>
                <div>
                  <dt>Bootstrap / OOB</dt>
                  <dd>enabled</dd>
                </div>
                <div>
                  <dt>Threshold</dt>
                  <dd>
                    P99 normal OOB · 0.1658
                  </dd>
                </div>
                <div>
                  <dt>Metric</dt>
                  <dd>PR-AUC</dd>
                </div>
              </dl>

              <p>
                The detector is treated as a
                conservative ranking system:
                rare positives make PR-AUC and
                false-alarm-aware thresholding
                more useful than plain accuracy.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section
        className="mg3-section"
        data-mg3-reveal
      >
        <header className="mg3-section__label">
          <span>04</span>
          <h2>Evidence</h2>
        </header>

        <div className="mg3-section__body">
          <div className="mg3-results">
            <article className="mg3-results__forecast">
              <span>
                FORECAST · HELD-OUT FUTURE
              </span>

              <strong>85.44%</strong>

              <p>
                reduction in normalized MSE
                versus persistence.
              </p>

              <div className="mg3-bars">
                <div>
                  <small>
                    PERSISTENCE · 0.057425
                  </small>
                  <i>
                    <b
                      style={{
                        width: "100%",
                      }}
                    />
                  </i>
                </div>

                <div>
                  <small>
                    LSTM · 0.008363
                  </small>
                  <i>
                    <b
                      className="is-accent"
                      style={{
                        width: "14.56%",
                      }}
                    />
                  </i>
                </div>
              </div>

              <div className="mg3-mini-metrics">
                <span>
                  MAE · 0.014958
                  kWh/premise
                </span>
                <span>
                  RMSE · 0.024860
                  kWh/premise
                </span>
              </div>
            </article>

            <article className="mg3-results__fault">
              <span>
                FAULT RISK · UNSEEN HOUSEHOLDS
              </span>

              <strong>0.803</strong>

              <p>
                mean held-out-household PR-AUC.
              </p>

              <div className="mg3-prauc">
                {[
                  ["H01", 0.619],
                  ["H07", 0.991],
                  ["H13", 0.799],
                ].map(
                  ([label, score]) => (
                    <div
                      key={String(label)}
                    >
                      <small>
                        {label}
                      </small>
                      <i>
                        <b
                          style={{
                            width: `${
                              Number(
                                score,
                              ) * 100
                            }%`,
                          }}
                        />
                      </i>
                      <em>
                        {Number(
                          score,
                        ).toFixed(3)}
                      </em>
                    </div>
                  ),
                )}
              </div>
            </article>
          </div>

          <div className="mg3-caveat">
            <span>SCOPE</span>
            <p>
              The fault dataset is small and
              synthetic: 63 positive labels
              across only three faulty
              households. The result supports
              the evaluation methodology and
              ranking approach, not a claim of
              production-grade equipment-failure
              detection.
            </p>
          </div>
        </div>
      </section>

      <section
        className="mg3-section"
        data-mg3-reveal
      >
        <header className="mg3-section__label">
          <span>05</span>
          <h2>System design</h2>
        </header>

        <div className="mg3-section__body">
          <p className="mg3-lead copy-en">
            Training and inference are
            decoupled through saved artifacts.
            The serving layer validates the
            temporal contract first, then loads
            the exact model, scaler, threshold,
            and configuration needed for
            deterministic inference.
          </p>

          <p className="mg3-lead copy-fr">
            L&apos;entraînement et
            l&apos;inférence sont découplés par
            des artefacts sauvegardés. La couche
            de service valide le contrat
            temporel avant de charger le modèle,
            le scaler, le seuil et la
            configuration correspondants.
          </p>

          <ArchitectureDiagram />

          <div className="mg3-contracts">
            <article>
              <span>POST /forecast</span>
              <strong>24</strong>
              <p>
                hourly observations · exactly
                1h apart
              </p>
            </article>

            <article>
              <span>POST /fault</span>
              <strong>13</strong>
              <p>
                12 history + current · exactly
                15m apart
              </p>
            </article>

            <article>
              <span>ARTIFACTS</span>
              <strong>2</strong>
              <p>
                forecasting + fault model
                bundles
              </p>
            </article>
          </div>

          <div className="mg3-lessons">
            {lessons.map(
              (lesson, index) => (
                <article key={lesson.title}>
                  <span>
                    {String(
                      index + 1,
                    ).padStart(2, "0")}
                  </span>
                  <h3>{lesson.title}</h3>
                  <p>{lesson.detail}</p>
                </article>
              ),
            )}
          </div>

          <div className="mg3-footer-links">
            <a
              href={ABSTRACT_URL}
              target="_blank"
              rel="noreferrer"
            >
              ABSTRACT DOC ↗
            </a>

            <a
              href={repository}
              target="_blank"
              rel="noreferrer"
            >
              SOURCE ON GITHUB ↗
            </a>
          </div>
        </div>
      </section>

      <div
        className="mg3-tech-stack"
        data-mg3-reveal
      >
        <CaseStudyTechStack
          groups={techGroups}
          eyebrow="BUILT WITH"
        />
      </div>

      <footer className="mg3-footer">
        <span>
          MICROGRID ML / APPLIED ML / 2025–2026
        </span>
        <Link href="/projects">
          BACK TO PROJECTS →
        </Link>
      </footer>

      <style>{`
        .mg3 {
          width: min(calc(100% - 2rem), 1040px);
          margin-inline: auto;
          padding: 2.2rem 0 5rem;
        }

        body:has(.mg3) .site-rule {
          display: none !important;
        }

        .mg3 [data-mg3-reveal] {
          opacity: 0;
          transform: translate3d(0, 18px, 0);
          filter: blur(3px);
          will-change: opacity, transform, filter;
          transition:
            opacity 680ms var(--ease, cubic-bezier(.22,1,.36,1)),
            transform 760ms var(--ease, cubic-bezier(.22,1,.36,1)),
            filter 680ms ease;
        }

        .mg3 [data-mg3-reveal].is-visible {
          opacity: 1;
          transform: translate3d(0, 0, 0);
          filter: blur(0);
        }

        .mg3 .mg3-section.is-visible .mg3-section__body > * {
          animation: mg3-content-in 620ms var(--ease, cubic-bezier(.22,1,.36,1)) both;
        }

        .mg3 .mg3-section.is-visible .mg3-section__body > *:nth-child(2) {
          animation-delay: 70ms;
        }

        .mg3 .mg3-section.is-visible .mg3-section__body > *:nth-child(3) {
          animation-delay: 140ms;
        }

        .mg3 .mg3-section.is-visible .mg3-section__body > *:nth-child(4) {
          animation-delay: 210ms;
        }

        .mg3 .mg3-section.is-visible .mg3-section__body > *:nth-child(5) {
          animation-delay: 280ms;
        }

        @keyframes mg3-content-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .mg3 .mg3-eval-diagram.is-visible .mg3-time-axis > div,
        .mg3 .mg3-eval-diagram.is-visible .mg3-households > div,
        .mg3 .mg3-eval-diagram.is-visible .mg3-households > strong {
          animation: mg3-diagram-pop 520ms var(--ease, cubic-bezier(.22,1,.36,1)) both;
        }

        .mg3 .mg3-eval-diagram.is-visible .mg3-time-axis > div:nth-of-type(2),
        .mg3 .mg3-eval-diagram.is-visible .mg3-households > div:nth-of-type(2) {
          animation-delay: 90ms;
        }

        .mg3 .mg3-eval-diagram.is-visible .mg3-time-axis > div:nth-of-type(3),
        .mg3 .mg3-eval-diagram.is-visible .mg3-households > div:nth-of-type(3) {
          animation-delay: 180ms;
        }

        .mg3 .mg3-eval-diagram.is-visible .mg3-households > strong {
          animation-delay: 260ms;
        }

        @keyframes mg3-diagram-pop {
          from {
            opacity: 0;
            transform: scale(0.97) translateY(5px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .mg3 .mg3__back {
          display: inline-block;
          margin-bottom: 2.5rem;
        }

        .mg3 .mg3-hero {
          padding-bottom: 2.3rem;
          border-bottom: 1px solid var(--rule-strong);
        }

        .mg3 .mg3-kicker {
          display: block;
          color: var(--muted);
          font-family: var(--font-display);
          font-size: 0.34rem;
          font-weight: 700;
          letter-spacing: 0.08em;
        }

        .mg3 .mg3-hero h1 {
          margin-top: 0.9rem;
          font-family: var(--font-display);
          font-size: clamp(3.2rem, 6.7vw, 5.5rem);
          font-weight: 700;
          line-height: 0.9;
          letter-spacing: -0.06em;
        }

        .mg3 .mg3-hero__statement {
          max-width: 830px;
          margin-top: 1.2rem;
          font-family: var(--font-display);
          font-size: clamp(1.4rem, 2.8vw, 2.15rem);
          font-weight: 700;
          line-height: 1.04;
          letter-spacing: -0.035em;
        }

        .mg3 .mg3-hero__deck {
          max-width: 760px;
          margin-top: 0.85rem;
          color: var(--muted);
          font-size: 0.98rem;
          line-height: 1.45;
        }

        .mg3 .mg3-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 1.2rem;
        }

        .mg3 .mg3-actions a,
        .mg3 .mg3-footer-links a {
          padding: 0.62rem 0.76rem;
          border: 1px solid var(--rule-strong);
          background: var(--surface);
          font-family: var(--font-display);
          font-size: 0.34rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          transition:
            transform 170ms ease,
            border-color 170ms ease,
            background 170ms ease,
            color 170ms ease;
        }

        .mg3 .mg3-actions a:hover,
        .mg3 .mg3-footer-links a:hover {
          transform: translateY(-2px);
          border-color: var(--klein-blue);
        }

        .mg3 .mg3-actions a.is-primary {
          border-color: var(--klein-blue);
          background: var(--klein-blue);
          color: white;
        }

        .mg3 .mg3-hero__metrics {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          margin-top: 1.7rem;
          border-top: 1px solid var(--rule);
        }

        .mg3 .mg3-hero__metrics > div {
          min-width: 0;
          padding: 0.8rem 0.7rem 0 0;
        }

        .mg3 .mg3-hero__metrics dt {
          color: var(--muted);
          font-family: var(--font-display);
          font-size: 0.29rem;
          font-weight: 700;
          letter-spacing: 0.07em;
        }

        .mg3 .mg3-hero__metrics dd {
          margin-top: 0.22rem;
          font-family: var(--font-display);
          font-size: 1.25rem;
          font-weight: 700;
          letter-spacing: -0.035em;
        }

        .mg3 .mg3-hero__metrics small {
          display: block;
          margin-top: 0.12rem;
          color: var(--muted);
          font-size: 0.69rem;
          line-height: 1.2;
        }

        .mg3 .mg3-section {
          display: grid;
          grid-template-columns: 130px minmax(0, 1fr);
          gap: 2rem;
          padding: 2.8rem 0;
          border-bottom: 1px solid var(--rule);
        }

        .mg3 .mg3-section__label span {
          display: block;
          color: var(--klein-blue);
          font-family: var(--font-display);
          font-size: 0.31rem;
          font-weight: 700;
          letter-spacing: 0.08em;
        }

        .mg3 .mg3-section__label h2 {
          margin-top: 0.35rem;
          font-family: var(--font-display);
          font-size: 0.68rem;
          line-height: 1.05;
        }

        .mg3 .mg3-section__body {
          min-width: 0;
        }

        .mg3 .mg3-lead {
          max-width: 760px;
          font-size: 0.98rem;
          line-height: 1.47;
        }

        .mg3 .mg3-task-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          margin-top: 1.2rem;
          border: 1px solid var(--rule-strong);
          background: var(--surface);
        }

        .mg3 .mg3-task-grid article {
          min-width: 0;
          padding: 0.95rem;
        }

        .mg3 .mg3-task-grid article + article {
          border-left: 1px solid var(--rule);
        }

        .mg3 .mg3-task-grid span,
        .mg3 .mg3-results article > span,
        .mg3 .mg3-contracts span,
        .mg3 .mg3-caveat span {
          display: block;
          color: var(--klein-blue);
          font-family: var(--font-display);
          font-size: 0.29rem;
          font-weight: 700;
          letter-spacing: 0.065em;
        }

        .mg3 .mg3-task-grid strong {
          display: block;
          margin-top: 0.5rem;
          font-family: var(--font-display);
          font-size: 0.58rem;
          line-height: 1.08;
        }

        .mg3 .mg3-task-grid p {
          margin-top: 0.45rem;
          color: var(--muted);
          font-size: 0.79rem;
          line-height: 1.3;
        }

        .mg3 .mg3-data-strip {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
          margin-top: 0.7rem;
        }

        .mg3 .mg3-data-strip span {
          padding: 0.35rem 0.46rem;
          border: 1px solid var(--rule);
          color: var(--muted);
          font-family: var(--font-display);
          font-size: 0.28rem;
          font-weight: 700;
          letter-spacing: 0.045em;
        }

        .mg3 .mg3-process {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          margin-top: 1.2rem;
          border-top: 1px solid var(--rule-strong);
          border-left: 1px solid var(--rule-strong);
        }

        .mg3 .mg3-process article {
          min-width: 0;
          min-height: 142px;
          padding: 0.8rem;
          border-right: 1px solid var(--rule-strong);
          border-bottom: 1px solid var(--rule-strong);
          background: var(--surface);
        }

        .mg3 .mg3-process article > span,
        .mg3 .mg3-decisions article > span,
        .mg3 .mg3-lessons article > span {
          color: var(--klein-blue);
          font-family: var(--font-display);
          font-size: 0.28rem;
          font-weight: 700;
        }

        .mg3 .mg3-process h3,
        .mg3 .mg3-decisions h3,
        .mg3 .mg3-lessons h3 {
          margin-top: 0.55rem;
          font-family: var(--font-display);
          font-size: 0.47rem;
          line-height: 1.08;
        }

        .mg3 .mg3-process p,
        .mg3 .mg3-decisions p,
        .mg3 .mg3-lessons p {
          margin-top: 0.4rem;
          color: var(--muted);
          font-size: 0.76rem;
          line-height: 1.3;
        }

        .mg3 .mg3-eval-diagram,
        .mg3 .mg3-architecture {
          margin: 1rem 0 0;
          padding: 0.9rem;
          border: 1px solid var(--rule-strong);
          background: var(--surface);
        }

        .mg3 .mg3-eval-diagram > figcaption,
        .mg3 .mg3-architecture > figcaption {
          margin-bottom: 0.75rem;
          color: var(--muted);
          font-family: var(--font-display);
          font-size: 0.29rem;
          font-weight: 700;
          letter-spacing: 0.07em;
        }

        .mg3 .mg3-eval-diagram {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 1rem;
        }

        .mg3 .mg3-eval-diagram > figcaption {
          grid-column: 1 / -1;
        }

        .mg3 .mg3-eval-diagram__block {
          min-width: 0;
          padding-top: 0.75rem;
          border-top: 1px solid var(--rule);
        }

        .mg3 .mg3-eval-diagram__block > span {
          color: var(--klein-blue);
          font-family: var(--font-display);
          font-size: 0.3rem;
          font-weight: 700;
          letter-spacing: 0.06em;
        }

        .mg3 .mg3-eval-diagram__block > p {
          margin-top: 0.6rem;
          color: var(--muted);
          font-size: 0.76rem;
          line-height: 1.3;
        }

        .mg3 .mg3-time-axis {
          display: grid;
          grid-template-columns:
            auto 2.8fr 1fr 1fr auto;
          gap: 0.2rem;
          align-items: center;
          margin-top: 0.65rem;
          font-family: var(--font-display);
          font-size: 0.27rem;
          font-weight: 700;
        }

        .mg3 .mg3-time-axis small {
          color: var(--muted);
          font-size: 0.26rem;
        }

        .mg3 .mg3-time-axis > div {
          padding: 0.6rem 0.35rem;
          border: 1px solid var(--rule);
          text-align: center;
        }

        .mg3 .mg3-time-axis .is-test {
          border-color: var(--klein-blue);
          color: var(--klein-blue);
        }

        .mg3 .mg3-households {
          display: grid;
          grid-template-columns:
            repeat(3, 46px)
            auto
            minmax(0, 1fr);
          gap: 0.32rem;
          align-items: center;
          margin-top: 0.65rem;
        }

        .mg3 .mg3-households > div {
          padding: 0.55rem 0.25rem;
          border: 1px solid var(--rule);
          font-family: var(--font-display);
          font-size: 0.27rem;
          font-weight: 700;
          text-align: center;
        }

        .mg3 .mg3-households b {
          color: var(--klein-blue);
        }

        .mg3 .mg3-households strong {
          padding: 0.55rem 0.45rem;
          border: 1px solid var(--klein-blue);
          color: var(--klein-blue);
          font-family: var(--font-display);
          font-size: 0.28rem;
          line-height: 1.1;
          text-align: center;
        }

        .mg3 .mg3-decisions {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          margin-top: 0.8rem;
          border: 1px solid var(--rule-strong);
          background: var(--surface);
        }

        .mg3 .mg3-decisions article {
          min-width: 0;
          padding: 0.75rem;
          border-right: 1px solid var(--rule);
        }

        .mg3 .mg3-decisions article:last-child {
          border-right: 0;
        }

        .mg3 .mg3-models {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          border: 1px solid var(--rule-strong);
          background: var(--surface);
        }

        .mg3 .mg3-models article {
          min-width: 0;
          padding: 0.95rem;
        }

        .mg3 .mg3-models article + article {
          border-left: 1px solid var(--rule);
        }

        .mg3 .mg3-models article > span {
          color: var(--klein-blue);
          font-family: var(--font-display);
          font-size: 0.29rem;
          font-weight: 700;
          letter-spacing: 0.06em;
        }

        .mg3 .mg3-models h3 {
          margin-top: 0.55rem;
          font-family: var(--font-display);
          font-size: 0.9rem;
          line-height: 1;
          letter-spacing: -0.025em;
        }

        .mg3 .mg3-models dl {
          margin-top: 0.75rem;
          border-top: 1px solid var(--rule);
        }

        .mg3 .mg3-models dl > div {
          display: grid;
          grid-template-columns: 105px minmax(0, 1fr);
          gap: 0.75rem;
          padding: 0.38rem 0;
          border-bottom: 1px solid var(--rule);
        }

        .mg3 .mg3-models dt {
          color: var(--muted);
          font-size: 0.72rem;
        }

        .mg3 .mg3-models dd {
          font-family: var(--font-display);
          font-size: 0.36rem;
          font-weight: 700;
          line-height: 1.2;
        }

        .mg3 .mg3-models article > p {
          margin-top: 0.7rem;
          color: var(--muted);
          font-size: 0.78rem;
          line-height: 1.3;
        }

        .mg3 .mg3-results {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          border: 1px solid var(--rule-strong);
          background: var(--surface);
        }

        .mg3 .mg3-results article {
          min-width: 0;
          padding: 0.95rem;
        }

        .mg3 .mg3-results article + article {
          border-left: 1px solid var(--rule);
        }

        .mg3 .mg3-results article > strong {
          display: block;
          margin-top: 0.45rem;
          font-family: var(--font-display);
          font-size: clamp(2.1rem, 4.3vw, 3.6rem);
          line-height: 0.94;
          letter-spacing: -0.05em;
        }

        .mg3 .mg3-results__forecast > strong {
          color: var(--klein-blue);
        }

        .mg3 .mg3-results article > p {
          margin-top: 0.3rem;
          color: var(--muted);
          font-size: 0.77rem;
        }

        .mg3 .mg3-bars,
        .mg3 .mg3-prauc {
          display: grid;
          gap: 0.55rem;
          margin-top: 0.8rem;
        }

        .mg3 .mg3-bars small,
        .mg3 .mg3-prauc small,
        .mg3 .mg3-prauc em {
          color: var(--muted);
          font-family: var(--font-display);
          font-size: 0.27rem;
          font-style: normal;
          font-weight: 700;
        }

        .mg3 .mg3-bars i,
        .mg3 .mg3-prauc i {
          display: block;
          height: 5px;
          margin-top: 0.25rem;
          overflow: hidden;
          background: var(--rule);
        }

        .mg3 .mg3-bars b,
        .mg3 .mg3-prauc b {
          display: block;
          height: 100%;
          background: var(--text);
          transform-origin: left;
        }

        .mg3 .mg3-bars b.is-accent,
        .mg3 .mg3-prauc b {
          background: var(--klein-blue);
        }

        .mg3 .mg3-prauc > div {
          display: grid;
          grid-template-columns:
            34px
            minmax(0, 1fr)
            40px;
          gap: 0.5rem;
          align-items: center;
        }

        .mg3 .mg3-prauc i {
          margin-top: 0;
        }

        .mg3 .mg3-mini-metrics {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
          margin-top: 0.75rem;
        }

        .mg3 .mg3-mini-metrics span {
          padding: 0.3rem 0.4rem;
          border: 1px solid var(--rule);
          color: var(--muted);
          font-size: 0.68rem;
        }

        .mg3 .mg3-caveat {
          display: grid;
          grid-template-columns: 80px minmax(0, 1fr);
          gap: 1rem;
          margin-top: 0.75rem;
          padding: 0.8rem 0.9rem;
          border-left: 2px solid var(--klein-blue);
          background:
            color-mix(
              in srgb,
              var(--klein-blue) 4%,
              var(--surface)
            );
        }

        .mg3 .mg3-caveat p {
          font-size: 0.81rem;
          line-height: 1.35;
        }

        .mg3 .mg3-architecture {
          overflow-x: auto;
        }

        .mg3 .mg3-architecture svg {
          display: block;
          width: 100%;
          height: auto;
          min-width: 720px;
        }

        .mg3 .mg3-architecture__boundary {
          stroke: var(--rule-strong);
          stroke-width: 1;
          stroke-dasharray: 5 7;
        }

        .mg3 .mg3-architecture__lane {
          fill: var(--muted);
          font-family: var(--font-display);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.4px;
        }

        .mg3 .mg3-architecture__node rect {
          fill: var(--surface);
          stroke: var(--rule-strong);
          stroke-width: 1;
          vector-effect: non-scaling-stroke;
        }

        .mg3 .mg3-architecture__node.is-accent rect {
          stroke: var(--klein-blue);
          stroke-width: 1.5;
        }

        .mg3 .mg3-architecture__node text {
          fill: var(--muted);
          font-family: var(--font-display);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.8px;
        }

        .mg3 .mg3-architecture__node text.is-strong {
          fill: var(--text);
          font-size: 14px;
          letter-spacing: 0;
        }

        .mg3 .mg3-architecture__node.is-accent text.is-strong {
          fill: var(--klein-blue);
        }

        .mg3 .mg3-architecture__artifact rect {
          fill:
            color-mix(
              in srgb,
              var(--klein-blue) 6%,
              var(--surface)
            );
          stroke: var(--klein-blue);
          stroke-width: 1;
        }

        .mg3 .mg3-architecture__artifact text {
          fill: var(--klein-blue);
          font-family: var(--font-display);
          font-size: 10px;
          font-weight: 700;
        }

        .mg3 .mg3-architecture__flow {
          fill: none;
          stroke: var(--muted);
          stroke-width: 1.2;
          stroke-dasharray: 7 7;
          vector-effect: non-scaling-stroke;
        }

        .mg3 .mg3-architecture__flow.is-accent {
          stroke: var(--klein-blue);
        }

        .mg3 .mg3-architecture__arrow {
          fill: var(--muted);
        }

        .mg3 .mg3-contracts {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          margin-top: 0.75rem;
          border: 1px solid var(--rule);
        }

        .mg3 .mg3-contracts article {
          min-width: 0;
          padding: 0.75rem;
        }

        .mg3 .mg3-contracts article + article {
          border-left: 1px solid var(--rule);
        }

        .mg3 .mg3-contracts strong {
          display: block;
          margin-top: 0.3rem;
          font-family: var(--font-display);
          font-size: 1.4rem;
          line-height: 1;
        }

        .mg3 .mg3-contracts p {
          margin-top: 0.3rem;
          color: var(--muted);
          font-size: 0.74rem;
          line-height: 1.25;
        }

        .mg3 .mg3-lessons {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          margin-top: 0.8rem;
          border-top: 1px solid var(--rule-strong);
        }

        .mg3 .mg3-lessons article {
          min-width: 0;
          padding: 0.85rem 0.85rem 0 0;
        }

        .mg3 .mg3-lessons article + article {
          padding-left: 0.85rem;
          border-left: 1px solid var(--rule);
        }

        .mg3 .mg3-footer-links {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 1rem;
        }

        .mg3 .mg3-tech-stack {
          margin-top: 2.6rem;
        }

        .mg3 .mg3-footer {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          margin-top: 2rem;
          padding-top: 1.1rem;
          font-family: var(--font-display);
          font-size: 0.36rem;
          font-weight: 700;
        }

        @media (max-width: 940px) {
          .mg3 .mg3-decisions {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .mg3 .mg3-decisions article {
            border-bottom: 1px solid var(--rule);
          }

          .mg3 .mg3-decisions article:nth-child(2n) {
            border-right: 0;
          }

          .mg3 .mg3-decisions article:last-child {
            grid-column: 1 / -1;
            border-bottom: 0;
          }
        }

        @media (max-width: 800px) {
          .mg3 {
            width: min(calc(100% - 1.25rem), 1040px);
          }

          .mg3 .mg3-section {
            grid-template-columns: 1fr;
            gap: 0.9rem;
          }

          .mg3 .mg3-hero__metrics,
          .mg3 .mg3-process {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .mg3 .mg3-eval-diagram,
          .mg3 .mg3-task-grid,
          .mg3 .mg3-models,
          .mg3 .mg3-results,
          .mg3 .mg3-lessons {
            grid-template-columns: 1fr;
          }

          .mg3 .mg3-task-grid article + article,
          .mg3 .mg3-models article + article,
          .mg3 .mg3-results article + article,
          .mg3 .mg3-lessons article + article {
            border-top: 1px solid var(--rule);
            border-left: 0;
          }

          .mg3 .mg3-eval-diagram > figcaption {
            grid-column: auto;
          }

          .mg3 .mg3-contracts {
            grid-template-columns: 1fr;
          }

          .mg3 .mg3-contracts article + article {
            border-top: 1px solid var(--rule);
            border-left: 0;
          }

          .mg3 .mg3-footer {
            flex-direction: column;
          }
        }

        @media (max-width: 560px) {
          .mg3 .mg3-hero__metrics,
          .mg3 .mg3-process,
          .mg3 .mg3-decisions {
            grid-template-columns: 1fr;
          }

          .mg3 .mg3-decisions article,
          .mg3 .mg3-decisions article:last-child {
            grid-column: auto;
            border-right: 0;
            border-bottom: 1px solid var(--rule);
          }

          .mg3 .mg3-decisions article:last-child {
            border-bottom: 0;
          }

          .mg3 .mg3-caveat {
            grid-template-columns: 1fr;
          }

          .mg3 .mg3-time-axis {
            grid-template-columns: 1fr;
          }

          .mg3 .mg3-households {
            grid-template-columns: repeat(3, 1fr);
          }

          .mg3 .mg3-households b,
          .mg3 .mg3-households strong {
            grid-column: 1 / -1;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .mg3 [data-mg3-reveal] {
            opacity: 1 !important;
            transform: none !important;
            filter: none !important;
            transition: none !important;
          }

          .mg3 .mg3-section.is-visible .mg3-section__body > *,
          .mg3 .mg3-eval-diagram.is-visible .mg3-time-axis > div,
          .mg3 .mg3-eval-diagram.is-visible .mg3-households > div,
          .mg3 .mg3-eval-diagram.is-visible .mg3-households > strong {
            animation: none !important;
          }
        }
      `}</style>
    </article>
  );
}
