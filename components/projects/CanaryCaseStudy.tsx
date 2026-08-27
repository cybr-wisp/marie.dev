"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

import type { Project } from "@/types/content";

type CanaryCaseStudyProps = Readonly<{
  project: Project;
}>;

const stack = [
  "PYTHON",
  "AST",
  "FASTAPI",
  "GITHUB APPS",
  "CHECKS API",
] as const;

const flowStages = [
  {
    number: "01",
    label: "BASE / HEAD",
    detail: "Resolve the repository before and after the pull request.",
  },
  {
    number: "02",
    label: "AST CONTRACTS",
    detail: "Extract callable signatures and behavioral interface changes.",
  },
  {
    number: "03",
    label: "API DIFF",
    detail: "Classify compatibility risks such as required parameters or async changes.",
  },
  {
    number: "04",
    label: "CALL SITES",
    detail: "Index repository callers connected to the changed symbol.",
  },
  {
    number: "05",
    label: "BIND",
    detail: "Validate real positional and keyword arguments against the new signature.",
  },
  {
    number: "06",
    label: "REPORT",
    detail: "Return BREAKS, UNAFFECTED, or UNKNOWN with source locations.",
  },
] as const;

const decisions = [
  {
    title: "ANALYZE CONTRACTS, NOT TEXT",
    detail:
      "The AST gives Canary structured callable interfaces, so formatting noise does not become a regression signal.",
  },
  {
    title: "TRACE THE BLAST RADIUS",
    detail:
      "A breaking API change matters only when existing repository callers depend on the old contract.",
  },
  {
    title: "BIND REAL ARGUMENTS",
    detail:
      "Potential risk becomes confirmed breakage only after the existing call is checked against the new signature.",
  },
  {
    title: "KEEP AN UNKNOWN STATE",
    detail:
      "When static information is insufficient, Canary reports uncertainty rather than manufacturing confidence.",
  },
] as const;

export function CanaryCaseStudy({
  project,
}: CanaryCaseStudyProps) {
  const articleRef = useRef<HTMLElement>(null);

  const repository =
    project.repository ??
    "https://github.com/cybr-wisp/canary";

  useEffect(() => {
    const root = articleRef.current;
    if (!root) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const reveals = Array.from(
      root.querySelectorAll<HTMLElement>(
        "[data-reveal]",
      ),
    );

    if (reducedMotion) {
      reveals.forEach((node) =>
        node.classList.add("is-visible"),
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
        threshold: 0.13,
        rootMargin: "0px 0px -8% 0px",
      },
    );

    reveals.forEach((node) =>
      observer.observe(node),
    );

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const root = articleRef.current;
    if (!root) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const diagrams = Array.from(
      root.querySelectorAll<HTMLElement>(
        "[data-scroll-diagram]",
      ),
    );

    if (!diagrams.length) return;

    const clamp = (value: number) =>
      Math.min(Math.max(value, 0), 1);

    const progressFor = (
      element: HTMLElement,
    ) => {
      const rect =
        element.getBoundingClientRect();
      const viewport = window.innerHeight;
      const start = viewport * 0.9;
      const end = viewport * 0.22;

      return clamp(
        (start - rect.top) /
          (start - end),
      );
    };

    const prepared = diagrams.map(
      (diagram) => {
        const path =
          diagram.querySelector<SVGPathElement>(
            "[data-progress-path]",
          );

        const nodes = Array.from(
          diagram.querySelectorAll<HTMLElement>(
            "[data-stage-node]",
          ),
        );

        const caption =
          diagram.querySelector<HTMLElement>(
            "[data-stage-caption]",
          );

        let length = 0;

        if (path) {
          length = path.getTotalLength();
          path.style.strokeDasharray =
            String(length);
          path.style.strokeDashoffset =
            reducedMotion
              ? "0"
              : String(length);
        }

        const setStage = (index: number) => {
          const safeIndex = Math.min(
            Math.max(index, 0),
            nodes.length - 1,
          );

          nodes.forEach(
            (node, nodeIndex) => {
              node.classList.toggle(
                "is-complete",
                nodeIndex <= safeIndex,
              );
              node.classList.toggle(
                "is-current",
                nodeIndex === safeIndex,
              );
            },
          );

          const current =
            nodes[safeIndex];

          if (caption && current) {
            caption.textContent =
              current.dataset.detail ?? "";
          }
        };

        nodes.forEach((node, index) => {
          node.addEventListener(
            "click",
            () => setStage(index),
          );
        });

        if (
          reducedMotion &&
          nodes.length
        ) {
          setStage(nodes.length - 1);
        }

        return {
          diagram,
          path,
          nodes,
          length,
          setStage,
        };
      },
    );

    if (reducedMotion) return;

    let frame = 0;

    const update = () => {
      frame = 0;

      prepared.forEach(
        ({
          diagram,
          path,
          nodes,
          length,
          setStage,
        }) => {
          const progress =
            progressFor(diagram);

          diagram.style.setProperty(
            "--diagram-progress",
            progress.toFixed(3),
          );

          if (path && length) {
            path.style.strokeDashoffset =
              String(
                length *
                  (1 - progress),
              );
          }

          if (nodes.length) {
            const stage = Math.min(
              nodes.length - 1,
              Math.floor(
                progress *
                  nodes.length,
              ),
            );

            setStage(stage);
          }
        },
      );
    };

    const requestUpdate = () => {
      if (frame) return;
      frame =
        window.requestAnimationFrame(
          update,
        );
    };

    update();

    window.addEventListener(
      "scroll",
      requestUpdate,
      { passive: true },
    );
    window.addEventListener(
      "resize",
      requestUpdate,
    );

    return () => {
      if (frame) {
        window.cancelAnimationFrame(
          frame,
        );
      }

      window.removeEventListener(
        "scroll",
        requestUpdate,
      );
      window.removeEventListener(
        "resize",
        requestUpdate,
      );
    };
  }, []);

  return (
    <article
      ref={articleRef}
      className="case-study canary3"
    >
      <Link
        href="/projects"
        className="archive-back canary3__back"
      >
        ← PROJECTS
      </Link>

      <header
        className="canary3-hero"
        data-reveal
      >
        <div className="canary3-hero__meta">
          <span>
            01 · STATIC ANALYSIS /
            DEVELOPER TOOLS
          </span>
          <span>PYTHON</span>
        </div>

        <h1>Canary</h1>

        <p className="canary3-hero__question copy-en">
          What existing code could this
          change break?
        </p>

        <p className="canary3-hero__question copy-fr">
          Quel code existant cette
          modification pourrait-elle casser ?
        </p>

        <p className="canary3-hero__deck copy-en">
          A deterministic GitHub App that
          compares Python API contracts,
          traces changed symbols to repository
          callers, and confirms semantic
          breakage before merge.
        </p>

        <p className="canary3-hero__deck copy-fr">
          Une GitHub App déterministe qui
          compare les contrats d&apos;API
          Python, suit les symboles modifiés
          jusqu&apos;aux appelants du dépôt et
          confirme les ruptures avant la
          fusion.
        </p>

        <div className="canary3-actions">
          <a
            href={repository}
            target="_blank"
            rel="noreferrer"
            className="is-primary"
          >
            SOURCE ON GITHUB ↗
          </a>
        </div>

        <div
          className="canary3-stack"
          aria-label="Primary technology stack"
        >
          {stack.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </header>

      <section
        className="canary3-section"
        data-reveal
      >
        <header className="canary3-section__label">
          <span>01</span>
          <h2>The failure mode</h2>
        </header>

        <div className="canary3-section__body">
          <p className="canary3-lead copy-en">
            Syntax can remain valid while the
            repository becomes semantically
            incompatible. The useful question
            is not just “did the signature
            change?” but “which current callers
            can no longer satisfy it?”
          </p>

          <p className="canary3-lead copy-fr">
            La syntaxe peut rester valide alors
            que le dépôt devient
            sémantiquement incompatible. La
            vraie question est de savoir quels
            appelants ne respectent plus le
            nouveau contrat.
          </p>

          <figure
            className="canary3-regression"
            data-scroll-diagram
          >
            <figcaption>
              DIAGRAM 01 · FROM API CHANGE TO
              CONFIRMED BREAKAGE
            </figcaption>

            <div className="canary3-regression__row">
              <div className="canary3-code">
                <span>
                  AUTH.PY · CHANGED API
                </span>
                <code>
                  <b>
                    - def
                    authenticate(token):
                  </b>
                  <strong>
                    + def
                    authenticate(token,
                    strict):
                  </strong>
                </code>
              </div>

              <div
                className="canary3-trace"
                aria-hidden="true"
              >
                <span>TRACE SYMBOL</span>
                <i />
              </div>

              <div className="canary3-code">
                <span>
                  CALLER.PY · EXISTING CALL
                </span>
                <code>
                  <b>def login():</b>
                  <strong>
                    {'    return authenticate("demo-token")'}
                  </strong>
                </code>
              </div>
            </div>

            <div className="canary3-regression__result">
              <span>STATIC BINDING</span>
              <strong>
                CONFIRMED BREAKAGE
              </strong>
              <code>
                REQUIRED_PARAMETER_ADDED ·
                caller.py:5
              </code>
            </div>
          </figure>
        </div>
      </section>

      <section
        className="canary3-section"
        data-reveal
      >
        <header className="canary3-section__label">
          <span>02</span>
          <h2>Engineering process</h2>
        </header>

        <div className="canary3-section__body">
          <p className="canary3-lead copy-en">
            I separated detection from impact
            analysis: first identify the
            interface change, then ask whether
            real repository calls still bind
            correctly to the new contract.
          </p>

          <p className="canary3-lead copy-fr">
            J&apos;ai séparé la détection du
            changement de l&apos;analyse de son
            impact : identifier le nouveau
            contrat, puis vérifier les appels
            réels du dépôt.
          </p>

          <figure
            className="canary3-flow"
            data-scroll-diagram
            aria-label="Canary semantic regression analysis pipeline"
          >
            <figcaption>
              DIAGRAM 02 · ANALYSIS PIPELINE
            </figcaption>

            <svg
              className="canary3-flow__svg"
              viewBox="0 0 1000 320"
              role="img"
              aria-label="Repository analysis from base and head revisions through AST extraction, API change detection, call-site tracing, argument binding, and reporting."
            >
              <path
                className="canary3-flow__track"
                d="M 72 98 H 505 C 625 98 702 122 702 176 C 702 236 625 256 505 256 H 72"
              />
              <path
                className="canary3-flow__progress"
                data-progress-path
                d="M 72 98 H 505 C 625 98 702 122 702 176 C 702 236 625 256 505 256 H 72"
              />
            </svg>

            {flowStages.map(
              (stage, index) => (
                <button
                  type="button"
                  key={stage.number}
                  className={`canary3-flow__node canary3-flow__node--${
                    index + 1
                  }`}
                  data-stage-node
                  data-detail={stage.detail}
                  aria-label={`${stage.number} ${stage.label}: ${stage.detail}`}
                >
                  <span>
                    {stage.number}
                  </span>
                  <i aria-hidden="true" />
                  <strong>
                    {stage.label}
                  </strong>
                </button>
              ),
            )}

            <div className="canary3-flow__caption">
              <span>ACTIVE STEP</span>
              <p data-stage-caption>
                {flowStages[0].detail}
              </p>
            </div>
          </figure>

          <div
            className="canary3-decisions"
            data-reveal
          >
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
        className="canary3-section"
        data-reveal
      >
        <header className="canary3-section__label">
          <span>03</span>
          <h2>What ships</h2>
        </header>

        <div className="canary3-section__body">
          <div className="canary3-signal">
            <article>
              <span>DETERMINISTIC</span>
              <strong>
                No LLM in the analysis loop
              </strong>
              <p>
                Same repository state and pull
                request produce the same
                finding.
              </p>
            </article>

            <article>
              <span>REPOSITORY AWARE</span>
              <strong>
                Callers, not just diffs
              </strong>
              <p>
                Findings are tied back to
                existing source locations and
                actual usage.
              </p>
            </article>

            <article>
              <span>CONSERVATIVE</span>
              <strong>
                BREAKS · UNAFFECTED · UNKNOWN
              </strong>
              <p>
                Unresolvable static cases stay
                uncertain instead of being
                labeled as facts.
              </p>
            </article>
          </div>

          <div className="canary3-check">
            <div>
              <span>GITHUB CHECK</span>
              <strong>HIGH RISK</strong>
            </div>

            <code>
              REQUIRED_PARAMETER_ADDED ·
              caller.py:5
            </code>

            <small>
              GitHub App + Checks API · same
              analysis engine also exposed via
              CLI
            </small>
          </div>

          <p className="canary3-thesis">
            <span>CORE IDEA</span>
            <strong>
              Don&apos;t stop at “the API
              changed.” Trace the blast radius
              and prove whether current callers
              still satisfy the contract.
            </strong>
          </p>
        </div>
      </section>

      <footer className="canary3-footer">
        <span>
          CANARY / STATIC ANALYSIS / 2026
        </span>
        <Link href="/projects/paratrace">
          NEXT · PARATRACE →
        </Link>
      </footer>

      <style>{`
        .canary3 {
          --canary-danger: #b42318;
          width: min(calc(100% - 2rem), 1040px);
          margin-inline: auto;
          padding: 2.2rem 0 5rem;
        }

        body:has(.canary3) .site-rule {
          display: none !important;
        }

        .canary3 [data-reveal] {
          opacity: 0;
          transform: translate3d(0, 18px, 0);
          filter: blur(3px);
          will-change: opacity, transform, filter;
          transition:
            opacity 680ms var(--ease, cubic-bezier(.22,1,.36,1)),
            transform 760ms var(--ease, cubic-bezier(.22,1,.36,1)),
            filter 680ms ease;
        }

        .canary3 [data-reveal].is-visible {
          opacity: 1;
          transform: translate3d(0, 0, 0);
          filter: blur(0);
        }

        .canary3 .canary3-section.is-visible .canary3-section__body > * {
          animation: canary3-content-in 620ms var(--ease, cubic-bezier(.22,1,.36,1)) both;
        }

        .canary3 .canary3-section.is-visible .canary3-section__body > *:nth-child(2) {
          animation-delay: 70ms;
        }

        .canary3 .canary3-section.is-visible .canary3-section__body > *:nth-child(3) {
          animation-delay: 140ms;
        }

        .canary3 .canary3-section.is-visible .canary3-section__body > *:nth-child(4) {
          animation-delay: 210ms;
        }

        @keyframes canary3-content-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .canary3 .canary3__back {
          display: inline-block;
          margin-bottom: 2.5rem;
        }

        .canary3 .canary3-hero {
          padding-bottom: 2.3rem;
          border-bottom: 1px solid var(--rule-strong);
        }

        .canary3 .canary3-hero__meta {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          color: var(--muted);
          font-family: var(--font-display);
          font-size: 0.34rem;
          font-weight: 700;
          letter-spacing: 0.08em;
        }

        .canary3 .canary3-hero__meta span:last-child {
          color: var(--klein-blue);
        }

        .canary3 .canary3-hero h1 {
          margin-top: 0.9rem;
          font-family: var(--font-display);
          font-size: clamp(3.4rem, 7vw, 5.8rem);
          font-weight: 700;
          line-height: 0.88;
          letter-spacing: -0.065em;
        }

        .canary3 .canary3-hero__question {
          max-width: 820px;
          margin-top: 1.25rem;
          font-family: var(--font-display);
          font-size: clamp(1.45rem, 2.8vw, 2.2rem);
          font-weight: 700;
          line-height: 1.03;
          letter-spacing: -0.035em;
        }

        .canary3 .canary3-hero__deck {
          max-width: 720px;
          margin-top: 0.85rem;
          color: var(--muted);
          font-size: 0.98rem;
          line-height: 1.45;
        }

        .canary3 .canary3-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 1.25rem;
        }

        .canary3 .canary3-actions a {
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

        .canary3 .canary3-actions a:hover {
          transform: translateY(-2px);
          border-color: var(--klein-blue);
        }

        .canary3 .canary3-actions a.is-primary {
          border-color: var(--klein-blue);
          background: var(--klein-blue);
          color: white;
        }

        .canary3 .canary3-stack {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
          margin-top: 1rem;
        }

        .canary3 .canary3-stack span {
          padding: 0.32rem 0.45rem;
          border: 1px solid var(--rule);
          border-radius: 999px;
          color: var(--muted);
          font-family: var(--font-display);
          font-size: 0.28rem;
          font-weight: 700;
          letter-spacing: 0.05em;
        }

        .canary3 .canary3-section {
          display: grid;
          grid-template-columns: 130px minmax(0, 1fr);
          gap: 2rem;
          padding: 2.8rem 0;
          border-bottom: 1px solid var(--rule);
        }

        .canary3 .canary3-section__label span {
          display: block;
          color: var(--klein-blue);
          font-family: var(--font-display);
          font-size: 0.31rem;
          font-weight: 700;
          letter-spacing: 0.08em;
        }

        .canary3 .canary3-section__label h2 {
          margin-top: 0.35rem;
          font-family: var(--font-display);
          font-size: 0.68rem;
          line-height: 1.05;
        }

        .canary3 .canary3-section__body {
          min-width: 0;
        }

        .canary3 .canary3-lead {
          max-width: 740px;
          font-size: 0.98rem;
          line-height: 1.46;
        }

        .canary3 figure {
          margin: 1.2rem 0 0;
        }

        .canary3 figure > figcaption {
          margin-bottom: 0.7rem;
          color: var(--muted);
          font-family: var(--font-display);
          font-size: 0.29rem;
          font-weight: 700;
          letter-spacing: 0.07em;
        }

        .canary3 .canary3-regression {
          --diagram-progress: 0;
          padding: 0.9rem;
          border: 1px solid var(--rule-strong);
          background: var(--surface);
        }

        .canary3 .canary3-regression__row {
          display: grid;
          grid-template-columns:
            minmax(0, 1fr)
            82px
            minmax(0, 1fr);
          gap: 0.75rem;
          align-items: center;
        }

        .canary3 .canary3-code {
          min-width: 0;
          padding: 0.75rem 0;
          border-top: 1px solid var(--rule);
          border-bottom: 1px solid var(--rule);
        }

        .canary3 .canary3-code > span,
        .canary3 .canary3-regression__result > span,
        .canary3 .canary3-flow__caption > span,
        .canary3 .canary3-signal span,
        .canary3 .canary3-check span {
          display: block;
          color: var(--muted);
          font-family: var(--font-display);
          font-size: 0.29rem;
          font-weight: 700;
          letter-spacing: 0.065em;
        }

        .canary3 .canary3-code code {
          display: grid;
          gap: 0.34rem;
          margin-top: 0.7rem;
          overflow-x: auto;
          font-size: 0.7rem;
          white-space: nowrap;
        }

        .canary3 .canary3-code code b {
          color: var(--muted);
          font-weight: 500;
          text-decoration: line-through;
        }

        .canary3 .canary3-code code strong {
          color: var(--klein-blue);
          font-weight: 600;
        }

        .canary3 .canary3-code:last-child code strong {
          color: var(--text);
        }

        .canary3 .canary3-trace {
          display: grid;
          place-items: center;
          gap: 0.4rem;
          color: var(--muted);
          font-family: var(--font-display);
          font-size: 0.26rem;
          font-weight: 700;
          letter-spacing: 0.05em;
        }

        .canary3 .canary3-trace i {
          position: relative;
          display: block;
          width: 100%;
          height: 1px;
          overflow: hidden;
          background: var(--rule-strong);
        }

        .canary3 .canary3-trace i::after {
          content: "";
          position: absolute;
          inset: 0;
          background: var(--klein-blue);
          transform: scaleX(var(--diagram-progress));
          transform-origin: left;
        }

        .canary3 .canary3-regression__result {
          display: grid;
          grid-template-columns:
            120px
            minmax(180px, 0.65fr)
            minmax(0, 1fr);
          gap: 1rem;
          align-items: center;
          margin-top: 0.65rem;
          padding: 0.75rem 0 0.1rem;
          border-top: 1px solid var(--rule);
          opacity: calc(0.2 + (var(--diagram-progress) * 0.8));
          transform: translateY(calc((1 - var(--diagram-progress)) * 6px));
        }

        .canary3 .canary3-regression__result strong {
          color: var(--canary-danger);
          font-family: var(--font-display);
          font-size: 0.56rem;
        }

        .canary3 .canary3-regression__result code {
          color: var(--muted);
          font-size: 0.67rem;
        }

        .canary3 .canary3-flow {
          --diagram-progress: 0;
          position: relative;
          min-height: 320px;
          padding-top: 1.8rem;
        }

        .canary3 .canary3-flow__svg {
          position: absolute;
          inset: 1.8rem 0 0;
          width: 100%;
          height: calc(100% - 1.8rem);
          overflow: visible;
          pointer-events: none;
        }

        .canary3 .canary3-flow__track,
        .canary3 .canary3-flow__progress {
          fill: none;
          stroke-width: 1.3;
          vector-effect: non-scaling-stroke;
        }

        .canary3 .canary3-flow__track {
          stroke: var(--rule-strong);
        }

        .canary3 .canary3-flow__progress {
          stroke: var(--klein-blue);
          transition: stroke-dashoffset 60ms linear;
        }

        .canary3 .canary3-flow__node {
          position: absolute;
          display: grid;
          grid-template-columns: auto auto;
          gap: 0.32rem 0.5rem;
          align-items: center;
          width: 125px;
          padding: 0;
          border: 0;
          background: transparent;
          color: var(--text);
          cursor: pointer;
          text-align: left;
          transform: translate(-50%, -50%);
        }

        .canary3 .canary3-flow__node > span {
          color: var(--muted);
          font-family: var(--font-display);
          font-size: 0.28rem;
          font-weight: 700;
        }

        .canary3 .canary3-flow__node > i {
          grid-column: 1;
          grid-row: 2;
          width: 9px;
          height: 9px;
          border: 1px solid var(--rule-strong);
          border-radius: 50%;
          background: var(--surface);
          transition:
            transform 250ms ease,
            background 250ms ease,
            border-color 250ms ease,
            box-shadow 250ms ease;
        }

        .canary3 .canary3-flow__node > strong {
          grid-column: 2;
          grid-row: 2;
          font-family: var(--font-display);
          font-size: 0.42rem;
          line-height: 1.05;
          opacity: 0.38;
          transition:
            opacity 220ms ease,
            color 220ms ease;
        }

        .canary3 .canary3-flow__node.is-complete > i {
          border-color: var(--klein-blue);
          background: var(--klein-blue);
        }

        .canary3 .canary3-flow__node.is-complete > strong {
          opacity: 0.75;
        }

        .canary3 .canary3-flow__node.is-current > span,
        .canary3 .canary3-flow__node.is-current > strong {
          color: var(--klein-blue);
        }

        .canary3 .canary3-flow__node.is-current > strong {
          opacity: 1;
        }

        .canary3 .canary3-flow__node.is-current > i {
          transform: scale(1.3);
          box-shadow:
            0 0 0 5px
            color-mix(
              in srgb,
              var(--klein-blue) 10%,
              transparent
            );
        }

        .canary3 .canary3-flow__node--1 {
          left: 7.2%;
          top: 34%;
        }

        .canary3 .canary3-flow__node--2 {
          left: 28.5%;
          top: 34%;
        }

        .canary3 .canary3-flow__node--3 {
          left: 50.5%;
          top: 34%;
        }

        .canary3 .canary3-flow__node--4 {
          left: 70%;
          top: 58%;
        }

        .canary3 .canary3-flow__node--5 {
          left: 48%;
          top: 82%;
        }

        .canary3 .canary3-flow__node--6 {
          left: 7.2%;
          top: 82%;
        }

        .canary3 .canary3-flow__caption {
          position: absolute;
          right: 0;
          bottom: 0;
          width: min(330px, 42%);
          padding-top: 0.65rem;
          border-top: 1px solid var(--rule);
        }

        .canary3 .canary3-flow__caption p {
          margin-top: 0.3rem;
          color: var(--muted);
          font-size: 0.78rem;
          line-height: 1.3;
        }

        .canary3 .canary3-decisions {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          margin-top: 0.95rem;
          border: 1px solid var(--rule-strong);
          background: var(--surface);
        }

        .canary3 .canary3-decisions article {
          min-width: 0;
          padding: 0.85rem;
          border-right: 1px solid var(--rule);
          border-bottom: 1px solid var(--rule);
        }

        .canary3 .canary3-decisions article:nth-child(2n) {
          border-right: 0;
        }

        .canary3 .canary3-decisions article:nth-last-child(-n + 2) {
          border-bottom: 0;
        }

        .canary3 .canary3-decisions article > span {
          color: var(--klein-blue);
          font-family: var(--font-display);
          font-size: 0.28rem;
          font-weight: 700;
        }

        .canary3 .canary3-decisions h3 {
          margin-top: 0.55rem;
          font-family: var(--font-display);
          font-size: 0.47rem;
          line-height: 1.08;
        }

        .canary3 .canary3-decisions p {
          margin-top: 0.4rem;
          color: var(--muted);
          font-size: 0.77rem;
          line-height: 1.3;
        }

        .canary3 .canary3-signal {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          border-top: 1px solid var(--rule-strong);
        }

        .canary3 .canary3-signal article {
          min-width: 0;
          padding: 0.9rem 0.9rem 0.9rem 0;
        }

        .canary3 .canary3-signal article + article {
          padding-left: 0.9rem;
          border-left: 1px solid var(--rule);
        }

        .canary3 .canary3-signal article > span {
          color: var(--klein-blue);
        }

        .canary3 .canary3-signal strong {
          display: block;
          margin-top: 0.45rem;
          font-family: var(--font-display);
          font-size: 0.53rem;
          line-height: 1.08;
        }

        .canary3 .canary3-signal p {
          margin-top: 0.4rem;
          color: var(--muted);
          font-size: 0.78rem;
          line-height: 1.3;
        }

        .canary3 .canary3-check {
          display: grid;
          grid-template-columns:
            minmax(170px, 0.45fr)
            minmax(0, 1fr)
            minmax(180px, 0.6fr);
          gap: 1rem;
          align-items: center;
          margin-top: 1.1rem;
          padding: 0.8rem 0;
          border-top: 1px solid var(--rule);
          border-bottom: 1px solid var(--rule);
        }

        .canary3 .canary3-check > div {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
        }

        .canary3 .canary3-check strong {
          color: var(--canary-danger);
          font-family: var(--font-display);
          font-size: 0.46rem;
        }

        .canary3 .canary3-check code {
          color: var(--klein-blue);
          font-size: 0.66rem;
        }

        .canary3 .canary3-check small {
          color: var(--muted);
          font-size: 0.72rem;
          line-height: 1.25;
        }

        .canary3 .canary3-thesis {
          display: grid;
          grid-template-columns: 105px minmax(0, 1fr);
          gap: 1rem;
          margin-top: 0.85rem;
        }

        .canary3 .canary3-thesis span {
          color: var(--klein-blue);
          font-family: var(--font-display);
          font-size: 0.29rem;
          font-weight: 700;
          letter-spacing: 0.06em;
        }

        .canary3 .canary3-thesis strong {
          max-width: 720px;
          font-size: 0.94rem;
          line-height: 1.35;
        }

        .canary3 .canary3-footer {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          margin-top: 2rem;
          padding-top: 1.1rem;
          font-family: var(--font-display);
          font-size: 0.36rem;
          font-weight: 700;
        }

        @media (max-width: 800px) {
          .canary3 {
            width: min(calc(100% - 1.25rem), 1040px);
          }

          .canary3 .canary3-section {
            grid-template-columns: 1fr;
            gap: 0.9rem;
          }

          .canary3 .canary3-regression__row,
          .canary3 .canary3-signal,
          .canary3 .canary3-check {
            grid-template-columns: 1fr;
          }

          .canary3 .canary3-trace {
            min-height: 36px;
          }

          .canary3 .canary3-trace i {
            width: 70px;
          }

          .canary3 .canary3-signal article + article {
            padding-left: 0;
            border-top: 1px solid var(--rule);
            border-left: 0;
          }

          .canary3 .canary3-flow {
            overflow-x: auto;
          }

          .canary3 .canary3-flow {
            min-width: 720px;
          }

          .canary3 .canary3-decisions {
            grid-template-columns: 1fr;
          }

          .canary3 .canary3-decisions article {
            border-right: 0;
            border-bottom: 1px solid var(--rule);
          }

          .canary3 .canary3-decisions article:nth-last-child(-n + 2) {
            border-bottom: 1px solid var(--rule);
          }

          .canary3 .canary3-decisions article:last-child {
            border-bottom: 0;
          }

          .canary3 .canary3-footer {
            flex-direction: column;
          }
        }

        @media (max-width: 560px) {
          .canary3 .canary3-hero__meta {
            flex-direction: column;
          }

          .canary3 .canary3-thesis,
          .canary3 .canary3-regression__result {
            grid-template-columns: 1fr;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .canary3 [data-reveal] {
            opacity: 1 !important;
            transform: none !important;
            filter: none !important;
            transition: none !important;
          }

          .canary3 .canary3-section.is-visible .canary3-section__body > * {
            animation: none !important;
          }
        }
      `}</style>
    </article>
  );
}
