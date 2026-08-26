"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { CaseStudyTechStack } from "@/components/projects/CaseStudyTechStack";
import type { Project } from "@/types/content";

type MicrogridCaseStudyProps = Readonly<{
  project: Project;
}>;

const techGroups = [
  {
    label: "MODELING",
    items: [
      { name: "Python", detail: "training + inference", icon: "python" },
      { name: "PyTorch", detail: "LSTM forecaster", icon: "pytorch" },
      { name: "scikit-learn", detail: "Random Forest + metrics", icon: "scikitlearn" },
      { name: "NumPy", detail: "feature arrays", icon: "numpy" },
      { name: "Joblib", detail: "fault-model artifact", mark: "JL" },
    ],
  },
  {
    label: "DATA / ANALYSIS",
    items: [
      { name: "pandas", detail: "IESO + household preprocessing", icon: "pandas" },
      { name: "Plotly", detail: "exploratory visualization", icon: "plotly" },
      { name: "IESO", detail: "Ontario hourly consumption", mark: "ON" },
      { name: "Streamlit", detail: "legacy research UI", icon: "streamlit" },
    ],
  },
  {
    label: "API / QUALITY",
    items: [
      { name: "FastAPI", detail: "forecast + fault endpoints", icon: "fastapi" },
      { name: "Pydantic", detail: "temporal request contracts", icon: "pydantic" },
      { name: "Uvicorn", detail: "ASGI serving", mark: "ASGI" },
      { name: "HTTPX", detail: "API test client", mark: "HTTP" },
      { name: "Pytest", detail: "integration coverage", icon: "pytest" },
    ],
  },
] as const;

const faultFeatures = [
  ["delta_1", "one-step absolute change"],
  ["drop_from_4", "drop from 4-step mean"],
  ["drop_from_12", "drop from 12-step mean"],
  ["relative_delta_1", "proportional one-step change"],
  ["relative_drop_4", "relative 4-step drop"],
  ["relative_drop_12", "relative 12-step drop"],
  ["z_drop_4", "variance-normalized short drop"],
  ["z_drop_12", "variance-normalized long drop"],
] as const;

const designDecisions = [
  [
    "CHRONOLOGICAL SPLITTING",
    "24-hour windows overlap heavily. Random splitting would leak nearly identical temporal context across train and test.",
  ],
  [
    "TRAIN-ONLY SCALING",
    "Normalization statistics are fit on the training period only, then frozen for validation and test.",
  ],
  [
    "PER-PREMISE TARGET",
    "Consumption is normalized by premise count so the model learns demand intensity instead of geographic population size.",
  ],
  [
    "HOUSEHOLD HOLDOUT",
    "Each faulty household is removed entirely during its evaluation round, preventing identity leakage.",
  ],
  [
    "OOB THRESHOLD",
    "The alert cutoff is the 99th percentile of normal out-of-bag scores rather than an arbitrary 0.50 threshold.",
  ],
] as const;

function makeDemoSeries() {
  return Array.from({ length: 64 }, (_, index) => {
    if (index < 34) {
      return 4.15 + Math.sin(index / 5) * 0.45 + Math.sin(index * 1.7) * 0.08;
    }

    if (index < 50) {
      const progress = (index - 34) / 16;
      return 4.1 - progress * 2.2 + Math.sin(index / 4) * 0.18;
    }

    return 0.45 + Math.sin(index * 1.4) * 0.08;
  });
}

function illustrativeRisk(series: readonly number[], index: number) {
  if (index < 12) return 0.02;

  const window = series.slice(index - 12, index);
  const mean =
    window.reduce((sum, value) => sum + value, 0) /
    window.length;
  const variance =
    window.reduce(
      (sum, value) => sum + (value - mean) ** 2,
      0,
    ) / window.length;
  const std = Math.sqrt(variance) || 0.01;
  const zDrop = (mean - series[index]) / std;

  return Math.max(
    0.01,
    Math.min(
      0.98,
      1 / (1 + Math.exp(-1.25 * (zDrop - 1.4))),
    ),
  );
}

function MicrogridArchitectureDiagram() {
  return (
    <figure
      className="mgv2-system-diagram"
      aria-labelledby="mgv2-system-diagram-title"
    >
      <figcaption id="mgv2-system-diagram-title">
        TRAIN OFFLINE · SERVE ONLINE
      </figcaption>

      <svg
        viewBox="0 0 960 430"
        role="img"
        aria-label="Training data flows through preprocessing into an LSTM and Random Forest, which are persisted as artifacts and loaded by FastAPI for forecast and fault-risk inference."
      >
        <defs>
          <marker
            id="mgv2-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path
              d="M 0 0 L 10 5 L 0 10 z"
              className="mgv2-system-diagram__arrow"
            />
          </marker>
        </defs>

        <line
          x1="480"
          y1="32"
          x2="480"
          y2="398"
          className="mgv2-system-diagram__boundary"
        />

        <text
          x="34"
          y="35"
          className="mgv2-system-diagram__lane"
        >
          OFFLINE TRAINING
        </text>
        <text
          x="510"
          y="35"
          className="mgv2-system-diagram__lane"
        >
          ONLINE INFERENCE
        </text>

        <g className="mgv2-system-diagram__node">
          <rect x="34" y="74" width="168" height="78" rx="2" />
          <text x="50" y="101">DATA</text>
          <text x="50" y="126" className="is-strong">
            IESO + household
          </text>
          <text x="50" y="143" className="is-small">
            hourly / 15 min series
          </text>
        </g>

        <g className="mgv2-system-diagram__node">
          <rect x="264" y="74" width="168" height="78" rx="2" />
          <text x="280" y="101">PREPROCESS</text>
          <text x="280" y="126" className="is-strong">
            temporal features
          </text>
          <text x="280" y="143" className="is-small">
            split · scale · window
          </text>
        </g>

        <path
          d="M202 113 H264"
          className="mgv2-system-diagram__flow"
          markerEnd="url(#mgv2-arrow)"
        />

        <g className="mgv2-system-diagram__node">
          <rect x="34" y="220" width="168" height="92" rx="2" />
          <text x="50" y="247">FORECAST</text>
          <text x="50" y="274" className="is-strong">
            PyTorch LSTM
          </text>
          <text x="50" y="294" className="is-small">
            24 × 5 → t + 1
          </text>
        </g>

        <g className="mgv2-system-diagram__node">
          <rect x="264" y="220" width="168" height="92" rx="2" />
          <text x="280" y="247">FAULT RISK</text>
          <text x="280" y="274" className="is-strong">
            Random Forest
          </text>
          <text x="280" y="294" className="is-small">
            13 readings → risk
          </text>
        </g>

        <path
          d="M348 152 V184 H118 V220"
          className="mgv2-system-diagram__flow"
          markerEnd="url(#mgv2-arrow)"
        />
        <path
          d="M348 152 V220"
          className="mgv2-system-diagram__flow"
          markerEnd="url(#mgv2-arrow)"
        />

        <g className="mgv2-system-diagram__artifact">
          <rect x="149" y="352" width="168" height="48" rx="24" />
          <text x="233" y="381" textAnchor="middle">
            SAVED ARTIFACTS
          </text>
        </g>

        <path
          d="M118 312 V332 H233 V352"
          className="mgv2-system-diagram__flow"
          markerEnd="url(#mgv2-arrow)"
        />
        <path
          d="M348 312 V332 H233 V352"
          className="mgv2-system-diagram__flow"
        />

        <g className="mgv2-system-diagram__node">
          <rect x="528" y="74" width="168" height="78" rx="2" />
          <text x="544" y="101">REQUEST</text>
          <text x="544" y="126" className="is-strong">
            validated JSON
          </text>
          <text x="544" y="143" className="is-small">
            exact temporal contract
          </text>
        </g>

        <g className="mgv2-system-diagram__node is-accent">
          <rect x="758" y="74" width="168" height="78" rx="2" />
          <text x="774" y="101">API BOUNDARY</text>
          <text x="774" y="126" className="is-strong">
            FastAPI + Pydantic
          </text>
          <text x="774" y="143" className="is-small">
            /forecast · /fault
          </text>
        </g>

        <path
          d="M696 113 H758"
          className="mgv2-system-diagram__flow"
          markerEnd="url(#mgv2-arrow)"
        />

        <g className="mgv2-system-diagram__node">
          <rect x="528" y="220" width="168" height="92" rx="2" />
          <text x="544" y="247">LOAD</text>
          <text x="544" y="274" className="is-strong">
            model + scaler
          </text>
          <text x="544" y="294" className="is-small">
            threshold + config
          </text>
        </g>

        <g className="mgv2-system-diagram__node is-accent">
          <rect x="758" y="220" width="168" height="92" rx="2" />
          <text x="774" y="247">RESPONSE</text>
          <text x="774" y="274" className="is-strong">
            forecast / risk
          </text>
          <text x="774" y="294" className="is-small">
            deterministic inference
          </text>
        </g>

        <path
          d="M842 152 V190 H612 V220"
          className="mgv2-system-diagram__flow"
          markerEnd="url(#mgv2-arrow)"
        />
        <path
          d="M696 266 H758"
          className="mgv2-system-diagram__flow"
          markerEnd="url(#mgv2-arrow)"
        />

        <path
          d="M317 376 H454 V266 H528"
          className="mgv2-system-diagram__flow is-cross-boundary"
          markerEnd="url(#mgv2-arrow)"
        />

        <circle
          cx="233"
          cy="376"
          r="5"
          className="mgv2-system-diagram__pulse"
        />
        <circle
          cx="842"
          cy="266"
          r="5"
          className="mgv2-system-diagram__pulse is-late"
        />
      </svg>

      <div className="mgv2-system-diagram__legend">
        <span>training path</span>
        <span>artifact boundary</span>
        <span>serving path</span>
      </div>
    </figure>
  );
}

export function MicrogridCaseStudy({
  project,
}: MicrogridCaseStudyProps) {
  const articleRef = useRef<HTMLElement>(null);
  const repository =
    project.repository ??
    "https://github.com/cybr-wisp/microgrid-ml-cym2025";

  const demoSeries = useMemo(
    () => makeDemoSeries(),
    [],
  );

  const [demoStep, setDemoStep] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;

    const timer = window.setTimeout(() => {
      const nextStep = Math.min(
        demoStep + 1,
        demoSeries.length,
      );

      setDemoStep(nextStep);

      if (nextStep >= demoSeries.length) {
        setRunning(false);
      }
    }, 95);

    return () => window.clearTimeout(timer);
  }, [demoSeries.length, demoStep, running]);

  useEffect(() => {
    const root = articleRef.current;

    if (!root) return;

    const targets = Array.from(
      root.querySelectorAll<HTMLElement>(
        "[data-mg-reveal]",
      ),
    );

    const reducedMotion =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

    if (reducedMotion) {
      targets.forEach((target) =>
        target.classList.add("is-visible"),
      );
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add(
            "is-visible",
          );

          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -8% 0px",
      },
    );

    targets.forEach((target) =>
      observer.observe(target),
    );

    return () => observer.disconnect();
  }, []);

  const currentIndex = Math.max(
    0,
    demoStep - 1,
  );

  const currentRisk =
    demoStep === 0
      ? 0
      : illustrativeRisk(
          demoSeries,
          currentIndex,
        );

  const proxyAlert = currentRisk >= 0.6;

  return (
    <article
      ref={articleRef}
      className="case-study mgv2"
    >
      <Link
        href="/projects"
        className="archive-back mgv2__back"
      >
        ← PROJECTS
      </Link>

      <header
        className="mgv2-cover"
        data-mg-reveal
      >
        <span className="mgv2-kicker">
          03 · PROJECT / FIELD NOTES
        </span>

        <h1>
          <strong>Microgrid ML</strong>
          <br />
          Forecasting consumption.
          <br />
          Detecting faults.
        </h1>

        <p className="mgv2-cover__deck copy-en">
          A machine-learning system for
          next-hour electricity-consumption
          forecasting and temporal fault-risk
          detection in community energy networks
          — rebuilt around reproducible evaluation,
          saved artifacts, and production inference
          contracts.
        </p>

        <p className="mgv2-cover__deck copy-fr">
          Un système d&apos;apprentissage
          automatique pour prévoir la consommation
          électrique à une heure et estimer le
          risque temporel de panne dans des
          micro-réseaux communautaires, reconstruit
          autour d&apos;une évaluation reproductible,
          d&apos;artefacts sauvegardés et de contrats
          d&apos;inférence explicites.
        </p>

        <dl className="mgv2-cover__meta">
          <div>
            <dt>ML</dt>
            <dd>
              PyTorch · scikit-learn
            </dd>
          </div>

          <div>
            <dt>BACKEND</dt>
            <dd>FastAPI · Pydantic</dd>
          </div>

          <div>
            <dt>DATA</dt>
            <dd>IESO Ontario</dd>
          </div>

          <div>
            <dt>RAW RECORDS</dt>
            <dd>1.46M+</dd>
          </div>

          <div>
            <dt>YEAR</dt>
            <dd>2025 · REBUILT 2026</dd>
          </div>
        </dl>

        <div
          className="mgv2-cover-signal"
          aria-hidden="true"
        >
          <div className="mgv2-cover-signal__head">
            <span>
              COMMUNITY SIGNAL · LIVE TRACE
            </span>
            <small>
              LOAD / GENERATION
            </small>
          </div>

          <div className="mgv2-cover-signal__plot">
            {demoSeries
              .slice(0, 46)
              .map((value, index) => (
                <i
                  key={index}
                  style={{
                    height: `${
                      18 +
                      (value / 5) * 70
                    }%`,
                    animationDelay: `${
                      index * 18
                    }ms`,
                  }}
                />
              ))}

            <span className="mgv2-cover-signal__scan" />
          </div>
        </div>
      </header>

      <CaseStudyTechStack
        groups={techGroups}
      />

      <section
        className="mgv2-entry"
        data-mg-reveal
      >
        <div className="mgv2-entry__head">
          <span>ENTRY 01</span>
          <h2>Why this matters</h2>
        </div>

        <div className="mgv2-entry__body">
          <p className="copy-en">
            Built as a uOttawa student research
            project for CYM 2025, Microgrid ML
            connects machine learning to a local
            infrastructure problem: community-scale
            energy systems still need short-horizon
            demand planning and early visibility
            into degrading generation assets, even
            when they do not have utility-scale
            operational tooling. The project asks
            two practical questions: can Ontario
            public data support a useful next-hour
            forecast, and can recent generation
            behaviour expose degradation without
            using household identity as a shortcut?
          </p>

          <p className="copy-fr">
            Conçu comme projet de recherche étudiant
            à uOttawa pour CYM 2025, Microgrid ML
            relie l&apos;apprentissage automatique à
            un problème d&apos;infrastructure local :
            les micro-réseaux communautaires doivent
            prévoir la demande à court terme et
            repérer tôt la dégradation des actifs,
            même sans les outils opérationnels des
            grands réseaux. Le projet pose deux
            questions : les données publiques de
            l&apos;Ontario permettent-elles une
            prévision utile à une heure, et le signal
            récent peut-il révéler une dégradation
            sans utiliser l&apos;identité du ménage
            comme raccourci ?
          </p>

          <div className="mgv2-question-grid">
            <article>
              <span>
                01 · FORECAST
              </span>
              <strong>
                24 HOURS → t + 1
              </strong>
              <p>
                Global LSTM for consumption per
                premise.
              </p>
            </article>

            <article>
              <span>02 · RISK</span>
              <strong>
                13 × 15 MIN → SCORE
              </strong>
              <p>
                Random Forest over
                household-relative degradation
                features.
              </p>
            </article>
          </div>

          <aside className="mgv2-uottawa-note">
            <span>UOTTAWA · CYM 2025</span>
            <strong>
              LOCAL RESEARCH QUESTION → PRODUCTION-SHAPED ML SYSTEM
            </strong>
            <p className="copy-en">
              The project began in a university research setting,
              then was rebuilt around stricter evaluation, saved
              artifacts, explicit inference contracts, and a
              deployable API boundary.
            </p>
            <p className="copy-fr">
              Le projet a commencé dans un contexte de recherche
              universitaire, puis a été reconstruit autour d&apos;une
              évaluation plus rigoureuse, d&apos;artefacts sauvegardés,
              de contrats d&apos;inférence explicites et d&apos;une
              frontière API déployable.
            </p>
          </aside>
        </div>
      </section>

      <section
        className="mgv2-entry"
        data-mg-reveal
      >
        <div className="mgv2-entry__head">
          <span>ENTRY 02</span>
          <h2>The data</h2>
        </div>

        <div className="mgv2-entry__body">
          <h3>
            Forecasting · IESO hourly residential
            consumption
          </h3>

          <p className="copy-en">
            The raw monthly dataset contains more
            than 1.46 million records. The pipeline
            filters residential customers,
            aggregates price plans by Forward
            Sortation Area and hour, removes
            incomplete series, normalizes by premise
            count, and creates cyclical time
            features before windowing.
          </p>

          <p className="copy-fr">
            Le jeu mensuel brut contient plus de
            1,46 million d&apos;enregistrements. Le
            pipeline filtre les clients
            résidentiels, agrège les plans
            tarifaires par FSA et heure, retire les
            séries incomplètes, normalise par nombre
            de locaux et crée des variables
            temporelles cycliques avant le
            fenêtrage.
          </p>

          <div className="mgv2-stats">
            <div>
              <strong>534</strong>
              <span>COMPLETE SERIES</span>
            </div>
            <div>
              <strong>744</strong>
              <span>HOURLY TIMESTAMPS</span>
            </div>
            <div>
              <strong>
                397,296
              </strong>
              <span>OBSERVATIONS</span>
            </div>
            <div>
              <strong>
                384,480
              </strong>
              <span>
                FORECAST WINDOWS
              </span>
            </div>
          </div>

          <h3>
            Fault risk · household generation
          </h3>

          <p className="copy-en">
            The synthetic fault dataset is
            extremely imbalanced: 63 labeled fault
            observations across 9,650 rows,
            concentrated in only three households.
            That scarcity drives the evaluation
            design and the conservative thresholding
            strategy.
          </p>

          <p className="copy-fr">
            Le jeu de pannes synthétique est
            fortement déséquilibré : 63 observations
            de panne sur 9 650 lignes, concentrées
            dans seulement trois ménages. Cette
            rareté détermine le protocole
            d&apos;évaluation et le seuil
            conservateur.
          </p>

          <div className="mgv2-stats">
            <div>
              <strong>50</strong>
              <span>HOUSEHOLDS</span>
            </div>
            <div>
              <strong>9,650</strong>
              <span>OBSERVATIONS</span>
            </div>
            <div>
              <strong>63</strong>
              <span>FAULT LABELS</span>
            </div>
            <div>
              <strong>0.65%</strong>
              <span>FAULT RATE</span>
            </div>
          </div>
        </div>
      </section>

      <section
        className="mgv2-entry"
        data-mg-reveal
      >
        <div className="mgv2-entry__head">
          <span>ENTRY 03</span>
          <h2>Design decisions</h2>
        </div>

        <div className="mgv2-entry__body">
          <div className="mgv2-decisions">
            {designDecisions.map(
              ([title, copy], index) => (
                <article key={title}>
                  <span>
                    {String(
                      index + 1,
                    ).padStart(
                      2,
                      "0",
                    )}
                  </span>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </article>
              ),
            )}
          </div>

          <div
            className="mgv2-split"
            aria-label="Chronological train validation test split"
          >
            <span>PAST</span>
            <div className="is-train">
              TRAIN
            </div>
            <div className="is-val">
              VALIDATION
            </div>
            <div className="is-test">
              TEST · HELD OUT
            </div>
            <span>FUTURE →</span>
          </div>
        </div>
      </section>

      <section
        className="mgv2-entry"
        data-mg-reveal
      >
        <div className="mgv2-entry__head">
          <span>ENTRY 04</span>
          <h2>Under the hood</h2>
        </div>

        <div className="mgv2-entry__body">
          <div className="mgv2-model-grid">
            <article>
              <span>FORECASTER</span>
              <h3>PyTorch LSTM</h3>

              <dl>
                <div>
                  <dt>Input</dt>
                  <dd>24 × 5</dd>
                </div>
                <div>
                  <dt>Features</dt>
                  <dd>
                    consumption + hour sin/cos +
                    DOW sin/cos
                  </dd>
                </div>
                <div>
                  <dt>Hidden size</dt>
                  <dd>64</dd>
                </div>
                <div>
                  <dt>Head</dt>
                  <dd>
                    Linear → ReLU → Linear
                  </dd>
                </div>
                <div>
                  <dt>Optimization</dt>
                  <dd>
                    Adam · MSE · early stopping
                  </dd>
                </div>
                <div>
                  <dt>Parameters</dt>
                  <dd>≈20K</dd>
                </div>
              </dl>
            </article>

            <article>
              <span>
                FAULT DETECTOR
              </span>
              <h3>Random Forest</h3>

              <dl>
                <div>
                  <dt>Trees</dt>
                  <dd>500</dd>
                </div>
                <div>
                  <dt>
                    Class weighting
                  </dt>
                  <dd>
                    balanced_subsample
                  </dd>
                </div>
                <div>
                  <dt>Min leaf</dt>
                  <dd>2</dd>
                </div>
                <div>
                  <dt>Bootstrap</dt>
                  <dd>enabled</dd>
                </div>
                <div>
                  <dt>
                    OOB predictions
                  </dt>
                  <dd>enabled</dd>
                </div>
                <div>
                  <dt>
                    Alert threshold
                  </dt>
                  <dd>
                    P99 normal OOB scores · 0.1658
                  </dd>
                </div>
              </dl>
            </article>
          </div>

          <div className="mgv2-feature-grid">
            {faultFeatures.map(
              ([feature, detail]) => (
                <div key={feature}>
                  <code>{feature}</code>
                  <span>{detail}</span>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      <section
        className="mgv2-entry"
        data-mg-reveal
      >
        <div className="mgv2-entry__head">
          <span>ENTRY 05</span>
          <h2>Results</h2>
        </div>

        <div className="mgv2-entry__body">
          <h3>
            Forecasting · LSTM vs persistence
          </h3>

          <div className="mgv2-forecast-result">
            <div className="mgv2-big-number">
              <strong>85.44%</strong>
              <span>
                NORMALIZED MSE REDUCTION
              </span>
            </div>

            <div className="mgv2-bars">
              <div>
                <span>
                  PERSISTENCE · 0.057425
                </span>
                <i>
                  <b
                    style={{
                      width: "100%",
                    }}
                  />
                </i>
              </div>

              <div>
                <span>
                  LSTM · 0.008363
                </span>
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
          </div>

          <div className="mgv2-result-metrics">
            <div>
              <strong>
                0.014958
              </strong>
              <span>
                MAE · kWh / premise
              </span>
            </div>
            <div>
              <strong>
                0.024860
              </strong>
              <span>
                RMSE · kWh / premise
              </span>
            </div>
            <div>
              <strong>
                0.008363
              </strong>
              <span>
                TEST NORMALIZED MSE
              </span>
            </div>
          </div>

          <h3>
            Fault risk · held-out household PR-AUC
          </h3>

          <p className="copy-en">
            Precision-recall AUC is used because
            positive faults are rare. Each faulty
            household is completely absent from
            training during its evaluation round.
          </p>

          <p className="copy-fr">
            La PR-AUC est utilisée parce que les
            pannes positives sont rares. Chaque
            ménage défaillant est entièrement absent
            de l&apos;entraînement pendant son
            évaluation.
          </p>

          <div className="mgv2-prauc">
            {[
              ["HOUSE 01", 0.619],
              ["HOUSE 07", 0.991],
              ["HOUSE 13", 0.799],
            ].map(
              ([label, score]) => (
                <div
                  key={String(
                    label,
                  )}
                >
                  <span>
                    {label}
                  </span>
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
                  <strong>
                    {Number(
                      score,
                    ).toFixed(3)}
                  </strong>
                </div>
              ),
            )}

            <div className="mgv2-prauc__mean">
              <span>MEAN</span>
              <strong>0.803</strong>
            </div>
          </div>
        </div>
      </section>

      <section
        className="mgv2-entry"
        data-mg-reveal
      >
        <div className="mgv2-entry__head">
          <span>ENTRY 06</span>
          <h2>System architecture</h2>
        </div>

        <div className="mgv2-entry__body">
          <p className="copy-en">
            Training and serving are decoupled
            through saved artifacts. FastAPI
            enforces the temporal contracts at the
            boundary, then loads the appropriate
            model, scaler, threshold, and metadata
            for deterministic inference.
          </p>

          <p className="copy-fr">
            L&apos;entraînement et le service sont
            découplés par des artefacts sauvegardés.
            FastAPI impose les contrats temporels à
            la frontière puis charge le modèle, le
            scaler, le seuil et les métadonnées
            appropriés.
          </p>

          <MicrogridArchitectureDiagram />

          <div
            className="mgv2-architecture"
            aria-label="Microgrid ML serving architecture"
          >
            <div className="mgv2-architecture__api">
              <span>API BOUNDARY</span>
              <strong>
                FastAPI + Pydantic
              </strong>
              <code>
                GET /health · POST /forecast ·
                POST /fault
              </code>
            </div>

            <span className="mgv2-architecture__down">
              ↓
            </span>

            <div className="mgv2-architecture__branches">
              <article>
                <span>FORECAST</span>
                <strong>
                  PyTorch LSTM
                </strong>
                <small>
                  24 hourly observations → t + 1
                </small>
                <code>
                  model.pt · scaler.json ·
                  config.json · metrics.json
                </code>
              </article>

              <article>
                <span>FAULT</span>
                <strong>
                  Random Forest
                </strong>
                <small>
                  13 readings → temporal risk
                </small>
                <code>
                  model.joblib · config.json
                </code>
              </article>
            </div>
          </div>

          <div className="mgv2-contracts">
            <div>
              <span>
                POST /forecast
              </span>
              <strong>24</strong>
              <p>
                chronological observations ·
                exactly 1h apart
              </p>
            </div>

            <div>
              <span>POST /fault</span>
              <strong>13</strong>
              <p>
                12 history + current · exactly
                15m apart
              </p>
            </div>

            <div>
              <span>TEST SUITE</span>
              <strong>7</strong>
              <p>
                API + validation paths passing
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        className="mgv2-entry"
        data-mg-reveal
      >
        <div className="mgv2-entry__head">
          <span>ENTRY 07</span>
          <h2>Fault trace demo</h2>
        </div>

        <div className="mgv2-entry__body">
          <p className="copy-en">
            This client-side trace illustrates the
            shape of a degradation event and a risk
            response. It is intentionally a UI
            simulation, not the serialized Random
            Forest running in the browser;
            production risk comes from POST /fault.
          </p>

          <p className="copy-fr">
            Cette trace côté client illustre la
            forme d&apos;une dégradation et la
            réponse d&apos;un score de risque. Il
            s&apos;agit volontairement d&apos;une
            simulation d&apos;interface, et non de
            la forêt aléatoire sérialisée dans le
            navigateur ; le score de production
            provient de POST /fault.
          </p>

          <div className="mgv2-demo">
            <div className="mgv2-demo__head">
              <span>
                HOUSEHOLD GENERATION · 15 MIN
                INTERVALS
              </span>

              <div>
                <button
                  type="button"
                  onClick={() =>
                    setRunning(true)
                  }
                  disabled={
                    running ||
                    demoStep >=
                      demoSeries.length
                  }
                >
                  RUN
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRunning(false);
                    setDemoStep(0);
                  }}
                >
                  RESET
                </button>
              </div>
            </div>

            <div
              className="mgv2-demo__plot"
              aria-label="Illustrative generation degradation trace"
            >
              {demoSeries.map(
                (
                  value,
                  index,
                ) => (
                  <span
                    key={index}
                    className={
                      index <
                      demoStep
                        ? index >= 42
                          ? "is-risk"
                          : "is-visible"
                        : ""
                    }
                    style={{
                      height: `${
                        (value / 5) *
                        100
                      }%`,
                    }}
                  />
                ),
              )}
            </div>

            <div className="mgv2-demo__risk">
              <div>
                <span>
                  ILLUSTRATIVE RISK PROXY
                </span>
                <strong>
                  {currentRisk.toFixed(
                    3,
                  )}
                </strong>
              </div>

              <i>
                <b
                  className={
                    proxyAlert
                      ? "is-alert"
                      : ""
                  }
                  style={{
                    width: `${
                      currentRisk *
                      100
                    }%`,
                  }}
                />
              </i>

              <small>
                {proxyAlert
                  ? "DEGRADATION PATTERN VISIBLE"
                  : "NORMAL / EARLY TRACE"}
              </small>
            </div>
          </div>
        </div>
      </section>

      <section
        className="mgv2-entry"
        data-mg-reveal
      >
        <div className="mgv2-entry__head">
          <span>ENTRY 08</span>
          <h2>Known limitations</h2>
        </div>

        <div className="mgv2-entry__body">
          <div className="mgv2-limits">
            <article>
              <strong>01 MONTH</strong>
              <p>
                Forecasting coverage lacks annual
                seasonality, weather, holidays, and
                price context.
              </p>
            </article>

            <article>
              <strong>63 FAULTS</strong>
              <p>
                The fault dataset is small,
                synthetic, and concentrated in
                three households.
              </p>
            </article>

            <article>
              <strong>
                RISK MODEL
              </strong>
              <p>
                The detector is a temporal
                fault-risk ranking prototype, not a
                validated equipment-failure
                classifier.
              </p>
            </article>
          </div>
        </div>
      </section>

      <footer className="mgv2-footer">
        <span>
          MICROGRID ML / FIELD NOTES / 2026
        </span>

        <div>
          <a
            href={repository}
            target="_blank"
            rel="noreferrer"
          >
            SOURCE ON GITHUB ↗
          </a>

          <Link href="/projects/canary">
            NEXT · CANARY →
          </Link>
        </div>
      </footer>

      <style>{`
        .mgv2 [data-mg-reveal] {
          opacity: 0;
          transform: translateY(18px);
          transition:
            opacity 620ms var(--ease, cubic-bezier(.22,1,.36,1)),
            transform 760ms var(--ease, cubic-bezier(.22,1,.36,1));
        }

        .mgv2 [data-mg-reveal].is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .mgv2-cover-signal {
          position: relative;
          margin-top: 2rem;
          padding: 0.75rem 0 0;
          overflow: hidden;
          border-top: 1px solid var(--rule);
          border-bottom: 1px solid var(--rule);
        }

        .mgv2-cover-signal__head {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          padding-bottom: 0.55rem;
          color: var(--muted);
          font-family: var(--font-display);
          font-size: 0.31rem;
          font-weight: 700;
          letter-spacing: 0.07em;
        }

        .mgv2-cover-signal__plot {
          position: relative;
          display: flex;
          align-items: flex-end;
          gap: 3px;
          height: 96px;
          overflow: hidden;
          background:
            repeating-linear-gradient(
              to bottom,
              transparent 0,
              transparent 23px,
              var(--rule) 24px
            );
        }

        .mgv2-cover-signal__plot i {
          flex: 1;
          min-width: 2px;
          background: var(--muted);
          opacity: 0.42;
          transform: scaleY(0);
          transform-origin: bottom;
          animation:
            mgv2-cover-bar-in
            700ms
            var(--ease, cubic-bezier(.22,1,.36,1))
            forwards;
        }

        .mgv2-cover-signal__plot i:nth-child(5n) {
          background: var(--klein-blue);
          opacity: 0.72;
        }

        .mgv2-cover-signal__scan {
          position: absolute;
          inset: 0 auto 0 -18%;
          width: 18%;
          border-right: 1px solid var(--klein-blue);
          background:
            linear-gradient(
              to right,
              transparent,
              color-mix(
                in srgb,
                var(--klein-blue) 10%,
                transparent
              )
            );
          animation:
            mgv2-scan
            5.6s
            linear
            infinite;
          pointer-events: none;
        }

        .mgv2-uottawa-note {
          display: grid;
          grid-template-columns: 150px minmax(0, 1fr);
          gap: 0.55rem 1rem;
          margin-top: 1rem;
          padding: 0.9rem 1rem;
          border-left: 2px solid var(--klein-blue);
          background:
            color-mix(
              in srgb,
              var(--klein-blue) 4%,
              var(--surface)
            );
        }

        .mgv2-uottawa-note > span {
          grid-row: 1 / span 2;
          color: var(--klein-blue);
          font-family: var(--font-display);
          font-size: 0.33rem;
          font-weight: 700;
          letter-spacing: 0.075em;
        }

        .mgv2-uottawa-note > strong {
          font-family: var(--font-display);
          font-size: 0.58rem;
          line-height: 1.08;
        }

        .mgv2-uottawa-note > p {
          grid-column: 2;
          max-width: 680px;
          color: var(--muted);
          font-size: 0.84rem;
          line-height: 1.3;
        }

        /* Result layout: keep the headline metric from colliding
           with the comparison bars at desktop widths. */
        .mgv2 .mgv2-forecast-result {
          grid-template-columns:
            minmax(280px, 0.78fr)
            minmax(0, 1.7fr);
          gap: 2rem;
          align-items: end;
        }

        .mgv2 .mgv2-big-number {
          min-width: 0;
        }

        .mgv2 .mgv2-big-number strong {
          white-space: nowrap;
          font-size: clamp(2.9rem, 5.3vw, 4.7rem);
          line-height: 0.86;
        }

        .mgv2 .mgv2-bars {
          min-width: 0;
          padding-bottom: 0.2rem;
        }

        .mgv2 .mgv2-bars span {
          margin-bottom: 0.38rem;
          font-size: 0.39rem;
          line-height: 1.15;
        }

        .mgv2 .mgv2-result-metrics > div {
          min-width: 0;
        }

        .mgv2 .mgv2-result-metrics strong {
          overflow-wrap: anywhere;
          font-size: clamp(1rem, 2vw, 1.35rem);
        }

        .mgv2 .mgv2-prauc > div:not(.mgv2-prauc__mean) {
          grid-template-columns:
            minmax(84px, 0.25fr)
            minmax(0, 1fr)
            52px;
        }

        .mgv2-entry.is-visible .mgv2-decisions article,
        .mgv2-entry.is-visible .mgv2-question-grid article,
        .mgv2-entry.is-visible .mgv2-model-grid article,
        .mgv2-entry.is-visible .mgv2-feature-grid > div,
        .mgv2-entry.is-visible .mgv2-limits article {
          animation:
            mgv2-card-in
            560ms
            var(--ease, cubic-bezier(.22,1,.36,1))
            both;
        }

        .mgv2-entry.is-visible .mgv2-decisions article:nth-child(2),
        .mgv2-entry.is-visible .mgv2-question-grid article:nth-child(2),
        .mgv2-entry.is-visible .mgv2-model-grid article:nth-child(2),
        .mgv2-entry.is-visible .mgv2-feature-grid > div:nth-child(2),
        .mgv2-entry.is-visible .mgv2-limits article:nth-child(2) {
          animation-delay: 70ms;
        }

        .mgv2-entry.is-visible .mgv2-decisions article:nth-child(3),
        .mgv2-entry.is-visible .mgv2-feature-grid > div:nth-child(3),
        .mgv2-entry.is-visible .mgv2-limits article:nth-child(3) {
          animation-delay: 140ms;
        }

        .mgv2-entry.is-visible .mgv2-decisions article:nth-child(4),
        .mgv2-entry.is-visible .mgv2-feature-grid > div:nth-child(4) {
          animation-delay: 210ms;
        }

        .mgv2-entry.is-visible .mgv2-decisions article:nth-child(5) {
          animation-delay: 280ms;
        }

        .mgv2-entry.is-visible .mgv2-bars b,
        .mgv2-entry.is-visible .mgv2-prauc b {
          transform-origin: left;
          animation:
            mgv2-bar-grow
            950ms
            var(--ease, cubic-bezier(.22,1,.36,1))
            both;
        }

        .mgv2-entry.is-visible .mgv2-prauc > div:nth-child(2) b {
          animation-delay: 100ms;
        }

        .mgv2-entry.is-visible .mgv2-prauc > div:nth-child(3) b {
          animation-delay: 200ms;
        }

        .mgv2-split > div {
          position: relative;
          overflow: hidden;
        }

        .mgv2-split > div::after {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              90deg,
              transparent,
              color-mix(
                in srgb,
                var(--klein-blue) 8%,
                transparent
              ),
              transparent
            );
          transform: translateX(-110%);
        }

        .mgv2-entry.is-visible .mgv2-split > div::after {
          animation:
            mgv2-split-sweep
            1100ms
            var(--ease, cubic-bezier(.22,1,.36,1))
            forwards;
        }

        .mgv2-system-diagram {
          margin: 2rem 0 1rem;
          padding: 1rem;
          overflow: hidden;
          border: 1px solid var(--rule-strong);
          background: var(--surface);
        }

        .mgv2-system-diagram figcaption {
          margin-bottom: 0.7rem;
          color: var(--muted);
          font-family: var(--font-display);
          font-size: 0.34rem;
          font-weight: 700;
          letter-spacing: 0.08em;
        }

        .mgv2-system-diagram svg {
          display: block;
          width: 100%;
          height: auto;
          overflow: visible;
        }

        .mgv2-system-diagram__boundary {
          stroke: var(--rule-strong);
          stroke-width: 1;
          stroke-dasharray: 5 7;
        }

        .mgv2-system-diagram__lane {
          fill: var(--muted);
          font-family: var(--font-display);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1.6px;
        }

        .mgv2-system-diagram__node rect {
          fill: var(--surface);
          stroke: var(--rule-strong);
          stroke-width: 1;
          vector-effect: non-scaling-stroke;
        }

        .mgv2-system-diagram__node.is-accent rect {
          stroke: var(--klein-blue);
          stroke-width: 1.5;
        }

        .mgv2-system-diagram__node text {
          fill: var(--muted);
          font-family: var(--font-display);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
        }

        .mgv2-system-diagram__node text.is-strong {
          fill: var(--text);
          font-size: 15px;
          letter-spacing: 0;
        }

        .mgv2-system-diagram__node.is-accent text.is-strong {
          fill: var(--klein-blue);
        }

        .mgv2-system-diagram__node text.is-small {
          fill: var(--muted);
          font-family: var(--font-body);
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 0;
        }

        .mgv2-system-diagram__artifact rect {
          fill:
            color-mix(
              in srgb,
              var(--klein-blue) 6%,
              var(--surface)
            );
          stroke: var(--klein-blue);
          stroke-width: 1;
        }

        .mgv2-system-diagram__artifact text {
          fill: var(--klein-blue);
          font-family: var(--font-display);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
        }

        .mgv2-system-diagram__flow {
          fill: none;
          stroke: var(--muted);
          stroke-width: 1.25;
          stroke-dasharray: 7 7;
          vector-effect: non-scaling-stroke;
        }

        .mgv2-entry.is-visible .mgv2-system-diagram__flow {
          animation:
            mgv2-flow
            10s
            linear
            infinite;
        }

        .mgv2-system-diagram__flow.is-cross-boundary {
          stroke: var(--klein-blue);
        }

        .mgv2-system-diagram__arrow {
          fill: var(--muted);
        }

        .mgv2-system-diagram__pulse {
          fill: var(--klein-blue);
          transform-box: fill-box;
          transform-origin: center;
          animation:
            mgv2-pulse
            1.8s
            ease-in-out
            infinite;
        }

        .mgv2-system-diagram__pulse.is-late {
          animation-delay: 700ms;
        }

        .mgv2-system-diagram__legend {
          display: flex;
          flex-wrap: wrap;
          gap: 0.45rem 1rem;
          margin-top: 0.75rem;
          padding-top: 0.65rem;
          border-top: 1px solid var(--rule);
          color: var(--muted);
          font-family: var(--font-display);
          font-size: 0.31rem;
          font-weight: 700;
          letter-spacing: 0.055em;
        }

        .mgv2-system-diagram__legend span {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
        }

        .mgv2-system-diagram__legend span::before {
          content: "";
          width: 18px;
          height: 1px;
          background: var(--muted);
        }

        .mgv2-system-diagram__legend span:nth-child(2)::before {
          background: var(--klein-blue);
        }

        .mgv2-demo__plot span.is-visible {
          animation:
            mgv2-demo-pop
            220ms
            var(--ease, cubic-bezier(.22,1,.36,1))
            both;
        }

        .mgv2-demo__plot span.is-risk {
          animation:
            mgv2-demo-risk-pop
            260ms
            var(--ease, cubic-bezier(.22,1,.36,1))
            both;
        }

        @keyframes mgv2-cover-bar-in {
          from {
            opacity: 0;
            transform: scaleY(0);
          }

          to {
            opacity: 0.55;
            transform: scaleY(1);
          }
        }

        @keyframes mgv2-scan {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(660%);
          }
        }

        @keyframes mgv2-card-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes mgv2-bar-grow {
          from {
            transform: scaleX(0);
          }

          to {
            transform: scaleX(1);
          }
        }

        @keyframes mgv2-split-sweep {
          from {
            transform: translateX(-110%);
          }

          to {
            transform: translateX(110%);
          }
        }

        @keyframes mgv2-flow {
          from {
            stroke-dashoffset: 0;
          }

          to {
            stroke-dashoffset: -140;
          }
        }

        @keyframes mgv2-pulse {
          0%,
          100% {
            opacity: 0.35;
            transform: scale(0.75);
          }

          50% {
            opacity: 1;
            transform: scale(1.35);
          }
        }

        @keyframes mgv2-demo-pop {
          from {
            opacity: 0;
            transform: scaleY(0.65);
            transform-origin: bottom;
          }

          to {
            opacity: 1;
            transform: scaleY(1);
            transform-origin: bottom;
          }
        }

        @keyframes mgv2-demo-risk-pop {
          from {
            opacity: 0;
            transform: scaleY(0.5);
            transform-origin: bottom;
          }

          to {
            opacity: 1;
            transform: scaleY(1);
            transform-origin: bottom;
          }
        }

        @media (max-width: 900px) {
          .mgv2 .mgv2-forecast-result {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .mgv2 .mgv2-big-number strong {
            font-size: clamp(3rem, 12vw, 5rem);
          }

          .mgv2-uottawa-note {
            grid-template-columns: 1fr;
          }

          .mgv2-uottawa-note > span,
          .mgv2-uottawa-note > p {
            grid-column: 1;
            grid-row: auto;
          }
        }

        @media (max-width: 760px) {
          .mgv2-system-diagram {
            overflow-x: auto;
          }

          .mgv2-system-diagram svg {
            min-width: 720px;
          }

          .mgv2-cover-signal__head {
            align-items: flex-start;
            flex-direction: column;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .mgv2 [data-mg-reveal] {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }

          .mgv2-cover-signal__plot i,
          .mgv2-cover-signal__scan,
          .mgv2-entry.is-visible .mgv2-decisions article,
          .mgv2-entry.is-visible .mgv2-question-grid article,
          .mgv2-entry.is-visible .mgv2-model-grid article,
          .mgv2-entry.is-visible .mgv2-feature-grid > div,
          .mgv2-entry.is-visible .mgv2-limits article,
          .mgv2-entry.is-visible .mgv2-bars b,
          .mgv2-entry.is-visible .mgv2-prauc b,
          .mgv2-entry.is-visible .mgv2-split > div::after,
          .mgv2-entry.is-visible .mgv2-system-diagram__flow,
          .mgv2-system-diagram__pulse,
          .mgv2-demo__plot span.is-visible,
          .mgv2-demo__plot span.is-risk {
            animation: none !important;
          }

          .mgv2-cover-signal__plot i {
            opacity: 0.55;
            transform: scaleY(1);
          }
        }
      `}</style>
    </article>
  );
}
