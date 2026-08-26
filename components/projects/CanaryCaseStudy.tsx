"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { CaseStudyTechStack } from "@/components/projects/CaseStudyTechStack";
import type { Project } from "@/types/content";

type CanaryCaseStudyProps = Readonly<{
  project: Project;
}>;

const techGroups = [
  {
    label: "ANALYSIS",
    items: [
      { name: "Python", detail: "3.11+ analysis engine", icon: "python" },
      { name: "AST", detail: "semantic interface analysis", mark: "AST" },
      { name: "Repository index", detail: "symbols + call sites", mark: "IDX" },
      { name: "Static binding", detail: "argument-aware validation", mark: "BIND" },
    ],
  },
  {
    label: "GITHUB / API",
    items: [
      { name: "FastAPI", detail: "webhook service", icon: "fastapi" },
      { name: "GitHub Apps", detail: "installation auth", icon: "github" },
      { name: "Checks API", detail: "PR findings + annotations", mark: "✓" },
      { name: "HTTPX", detail: "GitHub REST client", mark: "HTTP" },
    ],
  },
  {
    label: "CLI / QUALITY",
    items: [
      { name: "Typer", detail: "canary inspect CLI", mark: "CLI" },
      { name: "Rich", detail: "terminal presentation", mark: "R" },
      { name: "Pydantic", detail: "configuration", icon: "pydantic" },
      { name: "Pytest", detail: "unit + integration suite", icon: "pytest" },
      { name: "GitHub Actions", detail: "CI + release", icon: "githubactions" },
    ],
  },
] as const;

const rules = [
  ["PUBLIC_API_REMOVED", "A public function or method disappears."],
  ["REQUIRED_PARAMETER_ADDED", "A new required argument changes the calling contract."],
  ["PARAMETER_REMOVED", "An existing argument is no longer accepted."],
  ["PARAMETER_REORDERED", "Positional callers may now bind differently."],
  ["PARAMETER_DEFAULT_REMOVED", "An optional argument becomes required."],
  ["RETURN_TYPE_CHANGED", "The declared return contract changes."],
  ["ASYNC_BEHAVIOR_CHANGED", "A sync callable becomes async, or vice versa."],
] as const;

const scenarios = [
  {
    label: "MISSING REQUIRED",
    before: 'authenticate("demo-token")',
    after: "authenticate(token, strict)",
    verdict: "BREAKS",
    detail:
      "The call was valid before the API change but is missing the newly required `strict` argument.",
  },
  {
    label: "EXPLICITLY UPDATED",
    before: 'authenticate("demo-token", strict=True)',
    after: "authenticate(token, strict)",
    verdict: "UNAFFECTED",
    detail:
      "The existing caller already satisfies the new signature, so Canary does not promote the API change into a confirmed repository breakage.",
  },
  {
    label: "DYNAMIC CALL",
    before: "authenticate(*args, **kwargs)",
    after: "authenticate(token, strict)",
    verdict: "UNKNOWN",
    detail:
      "When static information is insufficient, Canary keeps the result uncertain instead of inventing confidence.",
  },
] as const;

function CanaryArchitectureDiagram() {
  const stages = [
    ["01", "PR EVENT", "Webhook or CLI"],
    ["02", "BASE / HEAD", "Resolve repository state"],
    ["03", "PYTHON AST", "Extract callable contracts"],
    ["04", "COMPATIBILITY", "Detect semantic changes"],
    ["05", "REPO INDEX", "Find symbols + call sites"],
    ["06", "CALL BINDING", "Validate actual callers"],
    ["07", "RESULT", "Breaks / safe / unknown"],
  ] as const;

  return (
    <div
      className="cv3-pipeline"
      role="img"
      aria-label="Canary analysis pipeline from pull request event through AST compatibility analysis, repository indexing, call binding, and final result."
    >
      {stages.map(([number, title, detail], index) => (
        <div className="cv3-pipeline__stage" key={title}>
          <span>{number}</span>
          <strong>{title}</strong>
          <small>{detail}</small>
          {index < stages.length - 1 ? (
            <i aria-hidden="true">
              <b />
            </i>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export function CanaryCaseStudy({
  project,
}: CanaryCaseStudyProps) {
  const articleRef = useRef<HTMLElement>(null);
  const [activeScenario, setActiveScenario] = useState(0);

  const repository =
    project.repository ?? "https://github.com/cybr-wisp/canary";

  useEffect(() => {
    const root = articleRef.current;

    if (!root) return;

    const targets = Array.from(
      root.querySelectorAll<HTMLElement>("[data-cv-reveal]"),
    );

    const reducedMotion = window.matchMedia(
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

          entry.target.classList.add("is-visible");
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

  const scenario = scenarios[activeScenario];

  return (
    <article
      ref={articleRef}
      className="case-study cv2 cv3"
    >
      <Link
        href="/projects"
        className="archive-back cv2__back"
      >
        ← PROJECTS
      </Link>

      <header
        className="cv3-cover"
        data-cv-reveal
      >
        <span className="cv3-kicker">
          01 · PROJECT / STATIC ANALYSIS
        </span>

        <div className="cv3-cover__title">
          <h1>Canary</h1>
          <span>v2.0.0</span>
        </div>

        <p className="cv3-cover__question copy-en">
          What existing code could this change break?
        </p>

        <p className="cv3-cover__question copy-fr">
          Quel code existant cette modification pourrait-elle casser ?
        </p>

        <p className="cv3-cover__deck copy-en">
          Repository-aware semantic regression detection for GitHub pull
          requests. Canary compares Python interfaces across BASE and HEAD,
          traces changed symbols through repository call sites, validates
          those callers against the new API, and reports confirmed
          incompatibilities through GitHub Checks or the CLI.
        </p>

        <p className="cv3-cover__deck copy-fr">
          Détection de régressions sémantiques à l&apos;échelle du dépôt
          pour les pull requests GitHub. Canary compare les interfaces
          Python entre BASE et HEAD, suit les symboles modifiés jusqu&apos;aux
          sites d&apos;appel du dépôt, valide ces appelants par rapport à la
          nouvelle API et signale les incompatibilités confirmées via
          GitHub Checks ou la CLI.
        </p>

        <dl className="cv3-meta">
          <div>
            <dt>ENGINE</dt>
            <dd>DETERMINISTIC</dd>
          </div>
          <div>
            <dt>LANGUAGE</dt>
            <dd>PYTHON 3.11+</dd>
          </div>
          <div>
            <dt>SURFACES</dt>
            <dd>GITHUB APP · CLI</dd>
          </div>
          <div>
            <dt>ANALYSIS</dt>
            <dd>AST · REPOSITORY AWARE</dd>
          </div>
          <div>
            <dt>VERSION</dt>
            <dd>2.0.0</dd>
          </div>
        </dl>

        <div
          className="cv3-cover-signal"
          aria-hidden="true"
        >
          <span>BASE</span>
          <i />
          <strong>API CONTRACT</strong>
          <i />
          <span>HEAD</span>
          <b />
          <em>CALL SITES</em>
          <b />
          <strong>BREAKAGE?</strong>
        </div>
      </header>

      <CaseStudyTechStack groups={techGroups} />

      <section
        className="cv3-entry"
        data-cv-reveal
      >
        <div className="cv3-entry__head">
          <span>ENTRY 01</span>
          <h2>Why Canary exists</h2>
        </div>

        <div className="cv3-entry__body">
          <p className="copy-en">
            A pull request can remain valid Python while still changing an
            interface in a way that breaks code elsewhere in the repository.
            Syntax checks reason about files. Canary reasons about the
            relationship between a changed API and the callers that already
            depend on it.
          </p>

          <p className="copy-fr">
            Une pull request peut rester du Python valide tout en modifiant
            une interface d&apos;une manière qui casse du code ailleurs dans
            le dépôt. Les vérifications syntaxiques raisonnent sur des
            fichiers. Canary raisonne sur la relation entre une API modifiée
            et les appelants qui en dépendent déjà.
          </p>

          <div className="cv3-problem-grid">
            <article>
              <span>LOCAL VIEW</span>
              <strong>THE DEFINITION STILL PARSES</strong>
              <code>def authenticate(token, strict): ...</code>
            </article>

            <article>
              <span>REPOSITORY VIEW</span>
              <strong>THE OLD CALLER MAY NOW BREAK</strong>
              <code>authenticate(&quot;demo-token&quot;)</code>
            </article>
          </div>

          <aside className="cv3-thesis">
            <span>CANARY&apos;S QUESTION</span>
            <strong>
              DON&apos;T STOP AT “THE API CHANGED.” TRACE THE BLAST RADIUS.
            </strong>
          </aside>
        </div>
      </section>

      <section
        className="cv3-entry"
        data-cv-reveal
      >
        <div className="cv3-entry__head">
          <span>ENTRY 02</span>
          <h2>A concrete regression</h2>
        </div>

        <div className="cv3-entry__body">
          <div className="cv3-breakage-demo">
            <div className="cv3-diff">
              <span>AUTH.PY · API CHANGE</span>
              <code>
                <b className="is-removed">
                  - def authenticate(token):
                </b>
                <b className="is-added">
                  + def authenticate(token, strict):
                </b>
                <b>      ...</b>
              </code>
            </div>

            <div className="cv3-breakage-demo__link">
              <span />
              <strong>TRACE SYMBOL</strong>
              <span />
            </div>

            <div className="cv3-caller">
              <span>CALLER.PY · EXISTING CODE</span>
              <code>
                <b>from auth import authenticate</b>
                <b />
                <b>def login():</b>
                <b>    return authenticate(&quot;demo-token&quot;)</b>
              </code>
            </div>
          </div>

          <div className="cv3-finding">
            <div>
              <span>FINDING</span>
              <strong>REQUIRED_PARAMETER_ADDED</strong>
            </div>

            <div>
              <span>CALL SITE</span>
              <strong>caller.py:5</strong>
            </div>

            <div className="is-danger">
              <span>VERDICT</span>
              <strong>CONFIRMED BREAKAGE</strong>
            </div>
          </div>
        </div>
      </section>

      <section
        className="cv3-entry"
        data-cv-reveal
      >
        <div className="cv3-entry__head">
          <span>ENTRY 03</span>
          <h2>Semantic rules</h2>
        </div>

        <div className="cv3-entry__body">
          <p className="copy-en">
            Canary v2 extracts Python callable contracts from ASTs and
            compares BASE with HEAD using explicit compatibility rules.
            Public APIs are treated as higher risk than private helpers.
          </p>

          <p className="copy-fr">
            Canary v2 extrait les contrats d&apos;appel Python à partir des
            AST et compare BASE à HEAD selon des règles de compatibilité
            explicites. Les API publiques sont considérées comme plus
            risquées que les fonctions auxiliaires privées.
          </p>

          <div className="cv3-rule-grid">
            {rules.map(([title, detail], index) => (
              <article key={title}>
                <span>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <strong>{title}</strong>
                <p>{detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="cv3-entry"
        data-cv-reveal
      >
        <div className="cv3-entry__head">
          <span>ENTRY 04</span>
          <h2>Repository-aware analysis</h2>
        </div>

        <div className="cv3-entry__body">
          <p className="copy-en">
            Detecting a changed signature is only the first stage. Canary
            loads the HEAD Python repository, builds a lightweight symbol
            and call-site index, associates changed APIs with their callers,
            estimates impact, then performs argument-aware validation.
          </p>

          <p className="copy-fr">
            Détecter une signature modifiée n&apos;est que la première étape.
            Canary charge le dépôt Python à HEAD, construit un index léger
            des symboles et des sites d&apos;appel, relie les API modifiées
            à leurs appelants, estime l&apos;impact puis effectue une
            validation tenant compte des arguments.
          </p>

          <CanaryArchitectureDiagram />

          <div className="cv3-verdicts">
            <article>
              <span>BREAKS</span>
              <strong>STATICALLY CONFIRMED</strong>
              <p>The existing call is incompatible with the new signature.</p>
            </article>

            <article>
              <span>UNAFFECTED</span>
              <strong>STILL COMPATIBLE</strong>
              <p>The caller already satisfies the changed interface.</p>
            </article>

            <article>
              <span>UNKNOWN</span>
              <strong>DO NOT OVERCLAIM</strong>
              <p>Static information is insufficient for a safe verdict.</p>
            </article>
          </div>
        </div>
      </section>

      <section
        className="cv3-entry"
        data-cv-reveal
      >
        <div className="cv3-entry__head">
          <span>ENTRY 05</span>
          <h2>Call binding</h2>
        </div>

        <div className="cv3-entry__body">
          <p className="copy-en">
            The validator models positional and keyword arguments, required
            and optional parameters, positional-only and keyword-only
            parameters, duplicate binding, extra arguments, <code>*args</code>,
            <code> **kwargs</code>, and awaited versus non-awaited calls.
          </p>

          <p className="copy-fr">
            Le validateur modélise les arguments positionnels et nommés, les
            paramètres obligatoires et optionnels, les paramètres
            positionnels uniquement ou nommés uniquement, les liaisons
            dupliquées, les arguments excédentaires, <code>*args</code>,
            <code> **kwargs</code> et les appels attendus ou non attendus.
          </p>

          <div className="cv3-scenario">
            <div
              className="cv3-scenario__tabs"
              role="tablist"
              aria-label="Canary call validation examples"
            >
              {scenarios.map((item, index) => (
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeScenario === index}
                  className={
                    activeScenario === index
                      ? "is-active"
                      : ""
                  }
                  key={item.label}
                  onClick={() =>
                    setActiveScenario(index)
                  }
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="cv3-scenario__body">
              <div>
                <span>CALL SITE</span>
                <code>{scenario.before}</code>
              </div>

              <i aria-hidden="true">
                →
              </i>

              <div>
                <span>HEAD SIGNATURE</span>
                <code>{scenario.after}</code>
              </div>

              <div
                className={`cv3-scenario__verdict is-${scenario.verdict.toLowerCase()}`}
              >
                <span>CANARY</span>
                <strong>{scenario.verdict}</strong>
                <p>{scenario.detail}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="cv3-entry"
        data-cv-reveal
      >
        <div className="cv3-entry__head">
          <span>ENTRY 06</span>
          <h2>System architecture</h2>
        </div>

        <div className="cv3-entry__body">
          <p className="copy-en">
            The GitHub App and Typer CLI share the same analysis service.
            That keeps detection deterministic while allowing the same
            result to surface as a GitHub Check or as terminal output.
          </p>

          <p className="copy-fr">
            La GitHub App et la CLI Typer partagent le même service
            d&apos;analyse. La détection reste ainsi déterministe, tandis
            que le même résultat peut apparaître sous forme de GitHub Check
            ou de sortie terminal.
          </p>

          <div
            className="cv3-system"
            role="img"
            aria-label="GitHub pull request and Canary CLI feed the shared PR analysis service, which performs AST, compatibility, repository impact, and call validation before publishing GitHub Checks or terminal output."
          >
            <div className="cv3-system__inputs">
              <article>
                <span>GITHUB</span>
                <strong>Pull request webhook</strong>
                <small>
                  opened · synchronize · reopened · ready_for_review
                </small>
              </article>

              <article>
                <span>CLI</span>
                <strong>canary inspect</strong>
                <small>
                  same deterministic engine
                </small>
              </article>
            </div>

            <div className="cv3-system__connector">
              <i />
              <b>↓</b>
              <i />
            </div>

            <article className="cv3-system__core">
              <span>SHARED CORE</span>
              <strong>PR Analysis Service</strong>
              <small>
                BASE + HEAD → AST → compatibility → repository index →
                impact → call validation
              </small>
            </article>

            <div className="cv3-system__connector">
              <i />
              <b>↓</b>
              <i />
            </div>

            <div className="cv3-system__outputs">
              <article className="is-accent">
                <span>CHECKS API</span>
                <strong>PR status + inline annotations</strong>
              </article>

              <article>
                <span>TERMINAL</span>
                <strong>Rich CLI output</strong>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section
        className="cv3-entry"
        data-cv-reveal
      >
        <div className="cv3-entry__head">
          <span>ENTRY 07</span>
          <h2>GitHub workflow</h2>
        </div>

        <div className="cv3-entry__body">
          <div className="cv3-workflow-grid">
            <article>
              <span>01 · AUTHENTICATE</span>
              <strong>VERIFY X-HUB-SIGNATURE-256</strong>
              <p>
                Webhook payloads are rejected when the configured secret
                cannot validate the GitHub signature.
              </p>
            </article>

            <article>
              <span>02 · ANALYZE</span>
              <strong>RESOLVE BASE + HEAD</strong>
              <p>
                Canary fetches changed files and repository state before
                semantic comparison.
              </p>
            </article>

            <article>
              <span>03 · REPORT</span>
              <strong>CREATE GITHUB CHECK</strong>
              <p>
                High-risk findings fail the Check and affected source lines
                can receive inline annotations.
              </p>
            </article>
          </div>

          <div className="cv3-check-preview">
            <div className="cv3-check-preview__head">
              <span>🐤 CANARY</span>
              <strong>HIGH RISK</strong>
            </div>

            <div className="cv3-check-preview__metrics">
              <div>
                <strong>1</strong>
                <span>CALL SITE ANALYZED</span>
              </div>
              <div>
                <strong>1</strong>
                <span>CONFIRMED BREAKING</span>
              </div>
              <div>
                <strong>0</strong>
                <span>ALREADY COMPATIBLE</span>
              </div>
              <div>
                <strong>0</strong>
                <span>REQUIRES REVIEW</span>
              </div>
            </div>

            <code>
              REQUIRED_PARAMETER_ADDED · caller.py:5
            </code>
          </div>
        </div>
      </section>

      <section
        className="cv3-entry"
        data-cv-reveal
      >
        <div className="cv3-entry__head">
          <span>ENTRY 08</span>
          <h2>Engineering choices</h2>
        </div>

        <div className="cv3-entry__body">
          <div className="cv3-engineering-grid">
            <article>
              <span>DETERMINISTIC</span>
              <strong>NO LLM IN THE ANALYSIS LOOP</strong>
              <p>
                The same repository state and pull request produce the same
                semantic findings.
              </p>
            </article>

            <article>
              <span>DEGRADATION PATH</span>
              <strong>AST FAILURE DOES NOT KILL THE RUN</strong>
              <p>
                If a changed Python file cannot be parsed semantically,
                Canary can fall back to its diff-based analyzer for that
                file.
              </p>
            </article>

            <article>
              <span>TESTING</span>
              <strong>UNIT + INTEGRATION COVERAGE</strong>
              <p>
                The repository separates unit tests for analysis,
                presentation, CLI, checks and webhook authentication from a
                webhook integration test.
              </p>
            </article>
          </div>
        </div>
      </section>

      <footer className="cv3-footer">
        <span>CANARY / STATIC ANALYSIS / 2026</span>

        <div>
          <a
            href={repository}
            target="_blank"
            rel="noreferrer"
          >
            SOURCE ON GITHUB ↗
          </a>

          <Link href="/projects/paratrace">
            NEXT · PARATRACE →
          </Link>
        </div>
      </footer>

      <style>{`
        .cv3 {
          --cv3-danger: #c62828;
        }

        .cv3 [data-cv-reveal] {
          opacity: 0;
          transform: translateY(16px);
          transition:
            opacity 560ms var(--ease, cubic-bezier(.22,1,.36,1)),
            transform 720ms var(--ease, cubic-bezier(.22,1,.36,1));
        }

        .cv3 [data-cv-reveal].is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .cv3-cover {
          padding-bottom: 2.5rem;
          border-bottom: 1px solid var(--rule-strong);
        }

        .cv3-kicker {
          display: block;
          margin-bottom: 1rem;
          color: var(--muted);
          font-family: var(--font-display);
          font-size: 0.4rem;
          font-weight: 700;
          letter-spacing: 0.09em;
        }

        .cv3-cover__title {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
        }

        .cv3-cover__title h1 {
          font-family: var(--font-display);
          font-size: clamp(4.5rem, 11vw, 9rem);
          font-weight: 700;
          line-height: 0.78;
          letter-spacing: -0.075em;
        }

        .cv3-cover__title > span {
          margin-top: 0.7rem;
          padding: 0.35rem 0.48rem;
          border: 1px solid var(--rule-strong);
          color: var(--klein-blue);
          font-family: var(--font-display);
          font-size: 0.35rem;
          font-weight: 700;
          letter-spacing: 0.08em;
        }

        .cv3-cover__question {
          max-width: 850px;
          margin-top: 1.7rem;
          font-family: var(--font-display);
          font-size: clamp(1.7rem, 3.5vw, 3.1rem);
          font-weight: 700;
          line-height: 0.98;
          letter-spacing: -0.045em;
        }

        .cv3-cover__deck {
          max-width: 740px;
          margin-top: 1.1rem;
          color: var(--muted);
          font-size: 1.02rem;
          line-height: 1.42;
        }

        .cv3-meta {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          margin-top: 2rem;
          border-top: 1px solid var(--rule);
        }

        .cv3-meta > div {
          min-width: 0;
          padding: 0.8rem 0.6rem 0 0;
        }

        .cv3-meta dt {
          color: var(--muted);
          font-family: var(--font-display);
          font-size: 0.31rem;
          font-weight: 700;
          letter-spacing: 0.08em;
        }

        .cv3-meta dd {
          margin-top: 0.22rem;
          font-family: var(--font-display);
          font-size: 0.44rem;
          font-weight: 700;
        }

        .cv3-cover-signal {
          display: grid;
          grid-template-columns:
            auto minmax(30px, 1fr)
            auto minmax(30px, 1fr)
            auto minmax(30px, 1fr)
            auto minmax(30px, 1fr)
            auto;
          align-items: center;
          gap: 0.45rem;
          margin-top: 1.6rem;
          padding: 0.8rem 0;
          border-top: 1px solid var(--rule);
          border-bottom: 1px solid var(--rule);
          color: var(--muted);
          font-family: var(--font-display);
          font-size: 0.32rem;
          font-weight: 700;
          letter-spacing: 0.06em;
        }

        .cv3-cover-signal i,
        .cv3-cover-signal b {
          position: relative;
          display: block;
          height: 1px;
          overflow: hidden;
          background: var(--rule-strong);
        }

        .cv3-cover-signal i::after,
        .cv3-cover-signal b::after {
          content: "";
          position: absolute;
          inset: 0;
          background: var(--klein-blue);
          transform: translateX(-110%);
          animation:
            cv3-signal-run
            2.4s
            linear
            infinite;
        }

        .cv3-cover-signal b::after {
          animation-delay: 0.8s;
        }

        .cv3-cover-signal strong,
        .cv3-cover-signal em {
          color: var(--text);
          font-style: normal;
        }

        .cv3-entry {
          display: grid;
          grid-template-columns: 150px minmax(0, 1fr);
          gap: 2rem;
          padding: 3.2rem 0;
          border-top: 1px solid var(--rule);
        }

        .cv3-entry__head > span {
          display: block;
          color: var(--klein-blue);
          font-family: var(--font-display);
          font-size: 0.34rem;
          font-weight: 700;
          letter-spacing: 0.08em;
        }

        .cv3-entry__head h2 {
          margin-top: 0.4rem;
          font-size: 0.78rem;
          line-height: 1.05;
        }

        .cv3-entry__body {
          min-width: 0;
        }

        .cv3-entry__body > p {
          max-width: 760px;
          font-size: 1rem;
          line-height: 1.43;
        }

        .cv3-problem-grid,
        .cv3-rule-grid,
        .cv3-verdicts,
        .cv3-workflow-grid,
        .cv3-engineering-grid {
          display: grid;
          gap: 0.55rem;
          margin-top: 1.35rem;
        }

        .cv3-problem-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .cv3-problem-grid article,
        .cv3-rule-grid article,
        .cv3-verdicts article,
        .cv3-workflow-grid article,
        .cv3-engineering-grid article {
          min-width: 0;
          padding: 0.95rem;
          border: 1px solid var(--rule);
          background: var(--surface);
        }

        .cv3-problem-grid span,
        .cv3-rule-grid span,
        .cv3-verdicts span,
        .cv3-workflow-grid span,
        .cv3-engineering-grid span {
          color: var(--klein-blue);
          font-family: var(--font-display);
          font-size: 0.32rem;
          font-weight: 700;
          letter-spacing: 0.07em;
        }

        .cv3-problem-grid strong,
        .cv3-rule-grid strong,
        .cv3-verdicts strong,
        .cv3-workflow-grid strong,
        .cv3-engineering-grid strong {
          display: block;
          margin-top: 0.4rem;
          font-family: var(--font-display);
          font-size: 0.55rem;
          line-height: 1.08;
        }

        .cv3-problem-grid code {
          display: block;
          margin-top: 0.75rem;
          padding: 0.65rem;
          overflow-x: auto;
          border-top: 1px solid var(--rule);
          font-size: 0.68rem;
          white-space: nowrap;
        }

        .cv3-thesis {
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

        .cv3-thesis span {
          color: var(--klein-blue);
          font-family: var(--font-display);
          font-size: 0.32rem;
          font-weight: 700;
          letter-spacing: 0.07em;
        }

        .cv3-thesis strong {
          font-family: var(--font-display);
          font-size: 0.7rem;
          line-height: 1.08;
        }

        .cv3-breakage-demo {
          display: grid;
          grid-template-columns:
            minmax(0, 1fr)
            90px
            minmax(0, 1fr);
          gap: 0.55rem;
          align-items: stretch;
        }

        .cv3-diff,
        .cv3-caller {
          min-width: 0;
          padding: 1rem;
          border: 1px solid var(--rule-strong);
          background: var(--surface);
        }

        .cv3-diff > span,
        .cv3-caller > span {
          color: var(--muted);
          font-family: var(--font-display);
          font-size: 0.32rem;
          font-weight: 700;
          letter-spacing: 0.07em;
        }

        .cv3-diff code,
        .cv3-caller code {
          display: grid;
          gap: 0.35rem;
          margin-top: 1rem;
          overflow-x: auto;
          font-size: 0.72rem;
          line-height: 1.25;
          white-space: pre;
        }

        .cv3-diff code b,
        .cv3-caller code b {
          min-height: 1em;
          font-weight: 500;
        }

        .cv3-diff .is-removed {
          color: var(--muted);
          text-decoration: line-through;
        }

        .cv3-diff .is-added {
          color: var(--klein-blue);
        }

        .cv3-breakage-demo__link {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.45rem;
          color: var(--muted);
          font-family: var(--font-display);
          font-size: 0.3rem;
          font-weight: 700;
          text-align: center;
        }

        .cv3-breakage-demo__link span {
          position: relative;
          width: 1px;
          height: 42px;
          overflow: hidden;
          background: var(--rule-strong);
        }

        .cv3-breakage-demo__link span::after {
          content: "";
          position: absolute;
          inset: 0;
          background: var(--klein-blue);
          transform: translateY(-110%);
          animation:
            cv3-vertical-trace
            1.8s
            ease-in-out
            infinite;
        }

        .cv3-finding {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          margin-top: 0.75rem;
          border: 1px solid var(--rule);
        }

        .cv3-finding > div {
          min-width: 0;
          padding: 0.8rem;
          border-right: 1px solid var(--rule);
        }

        .cv3-finding > div:last-child {
          border-right: 0;
        }

        .cv3-finding span {
          display: block;
          color: var(--muted);
          font-family: var(--font-display);
          font-size: 0.31rem;
          font-weight: 700;
          letter-spacing: 0.07em;
        }

        .cv3-finding strong {
          display: block;
          margin-top: 0.3rem;
          overflow-wrap: anywhere;
          font-family: var(--font-display);
          font-size: 0.58rem;
        }

        .cv3-finding .is-danger strong {
          color: var(--cv3-danger);
        }

        .cv3-rule-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .cv3-rule-grid p,
        .cv3-verdicts p,
        .cv3-workflow-grid p,
        .cv3-engineering-grid p {
          margin-top: 0.45rem;
          color: var(--muted);
          font-size: 0.82rem;
          line-height: 1.25;
        }

        .cv3-pipeline {
          display: grid;
          grid-template-columns: repeat(7, minmax(0, 1fr));
          margin-top: 1.4rem;
          border: 1px solid var(--rule-strong);
        }

        .cv3-pipeline__stage {
          position: relative;
          min-width: 0;
          min-height: 145px;
          padding: 0.75rem;
          border-right: 1px solid var(--rule);
        }

        .cv3-pipeline__stage:last-child {
          border-right: 0;
        }

        .cv3-pipeline__stage > span {
          color: var(--klein-blue);
          font-family: var(--font-display);
          font-size: 0.3rem;
          font-weight: 700;
        }

        .cv3-pipeline__stage > strong {
          display: block;
          margin-top: 1.7rem;
          font-family: var(--font-display);
          font-size: 0.48rem;
          line-height: 1.05;
        }

        .cv3-pipeline__stage > small {
          display: block;
          margin-top: 0.35rem;
          color: var(--muted);
          font-size: 0.7rem;
          line-height: 1.12;
        }

        .cv3-pipeline__stage > i {
          position: absolute;
          right: -10px;
          top: 50%;
          z-index: 2;
          width: 20px;
          height: 1px;
          overflow: hidden;
          background: var(--rule-strong);
        }

        .cv3-pipeline__stage > i b {
          display: block;
          width: 100%;
          height: 100%;
          background: var(--klein-blue);
          transform: translateX(-100%);
          animation:
            cv3-pipeline-flow
            1.5s
            linear
            infinite;
        }

        .cv3-verdicts {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .cv3-scenario {
          margin-top: 1.35rem;
          border: 1px solid var(--rule-strong);
        }

        .cv3-scenario__tabs {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          border-bottom: 1px solid var(--rule-strong);
        }

        .cv3-scenario__tabs button {
          min-height: 44px;
          padding: 0.55rem;
          border: 0;
          border-right: 1px solid var(--rule);
          background: transparent;
          color: var(--text);
          cursor: none;
          font-family: var(--font-display);
          font-size: 0.32rem;
          font-weight: 700;
          letter-spacing: 0.055em;
        }

        .cv3-scenario__tabs button:last-child {
          border-right: 0;
        }

        .cv3-scenario__tabs button.is-active {
          background: var(--klein-blue);
          color: white;
        }

        .cv3-scenario__body {
          display: grid;
          grid-template-columns:
            minmax(0, 1fr)
            34px
            minmax(0, 1fr)
            minmax(190px, 0.8fr);
          gap: 0.65rem;
          align-items: center;
          padding: 1rem;
        }

        .cv3-scenario__body > div:not(.cv3-scenario__verdict) {
          min-width: 0;
          padding: 0.8rem;
          border: 1px solid var(--rule);
        }

        .cv3-scenario__body > div > span {
          display: block;
          color: var(--muted);
          font-family: var(--font-display);
          font-size: 0.3rem;
          font-weight: 700;
          letter-spacing: 0.07em;
        }

        .cv3-scenario__body code {
          display: block;
          margin-top: 0.5rem;
          overflow-x: auto;
          font-size: 0.7rem;
          white-space: nowrap;
        }

        .cv3-scenario__body > i {
          color: var(--klein-blue);
          font-style: normal;
          text-align: center;
        }

        .cv3-scenario__verdict {
          min-width: 0;
          padding: 0.8rem;
          border-left: 2px solid var(--klein-blue);
          background:
            color-mix(
              in srgb,
              var(--klein-blue) 4%,
              var(--surface)
            );
        }

        .cv3-scenario__verdict strong {
          display: block;
          margin-top: 0.25rem;
          font-family: var(--font-display);
          font-size: 0.85rem;
        }

        .cv3-scenario__verdict p {
          margin-top: 0.4rem;
          color: var(--muted);
          font-size: 0.76rem;
          line-height: 1.2;
        }

        .cv3-scenario__verdict.is-breaks {
          border-left-color: var(--cv3-danger);
        }

        .cv3-scenario__verdict.is-breaks strong {
          color: var(--cv3-danger);
        }

        .cv3-system {
          margin-top: 1.4rem;
          padding: 1rem;
          border: 1px solid var(--rule-strong);
        }

        .cv3-system__inputs,
        .cv3-system__outputs {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0.55rem;
        }

        .cv3-system article {
          min-width: 0;
          padding: 0.85rem;
          border: 1px solid var(--rule);
        }

        .cv3-system article > span {
          color: var(--muted);
          font-family: var(--font-display);
          font-size: 0.31rem;
          font-weight: 700;
          letter-spacing: 0.07em;
        }

        .cv3-system article > strong {
          display: block;
          margin-top: 0.35rem;
          font-family: var(--font-display);
          font-size: 0.62rem;
        }

        .cv3-system article > small {
          display: block;
          margin-top: 0.35rem;
          color: var(--muted);
          font-size: 0.73rem;
          line-height: 1.15;
        }

        .cv3-system__core {
          max-width: 620px;
          margin-inline: auto;
          border-color: var(--klein-blue) !important;
          text-align: center;
        }

        .cv3-system__core > strong {
          color: var(--klein-blue);
        }

        .cv3-system__connector {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 0.6rem;
          align-items: center;
          margin: 0.55rem 0;
          color: var(--klein-blue);
        }

        .cv3-system__connector i {
          position: relative;
          height: 1px;
          overflow: hidden;
          background: var(--rule);
        }

        .cv3-system__connector i::after {
          content: "";
          position: absolute;
          inset: 0;
          background: var(--klein-blue);
          transform: translateX(-100%);
          animation:
            cv3-system-flow
            2s
            linear
            infinite;
        }

        .cv3-system__outputs .is-accent {
          border-color: var(--klein-blue);
        }

        .cv3-workflow-grid,
        .cv3-engineering-grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .cv3-check-preview {
          margin-top: 0.8rem;
          border: 1px solid var(--rule-strong);
          background: var(--surface);
        }

        .cv3-check-preview__head {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          padding: 0.75rem;
          border-bottom: 1px solid var(--rule);
          font-family: var(--font-display);
          font-size: 0.45rem;
          font-weight: 700;
        }

        .cv3-check-preview__head strong {
          color: var(--cv3-danger);
        }

        .cv3-check-preview__metrics {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }

        .cv3-check-preview__metrics > div {
          min-width: 0;
          padding: 0.8rem;
          border-right: 1px solid var(--rule);
        }

        .cv3-check-preview__metrics > div:last-child {
          border-right: 0;
        }

        .cv3-check-preview__metrics strong {
          display: block;
          font-family: var(--font-display);
          font-size: 1.25rem;
        }

        .cv3-check-preview__metrics span {
          display: block;
          margin-top: 0.18rem;
          color: var(--muted);
          font-family: var(--font-display);
          font-size: 0.29rem;
          font-weight: 700;
          letter-spacing: 0.05em;
        }

        .cv3-check-preview > code {
          display: block;
          padding: 0.7rem;
          border-top: 1px solid var(--rule);
          color: var(--klein-blue);
          font-size: 0.65rem;
        }

        .cv3-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--rule-strong);
          font-family: var(--font-display);
          font-size: 0.42rem;
          font-weight: 700;
        }

        .cv3-footer > div {
          display: flex;
          gap: 1.2rem;
        }

        .cv3-entry.is-visible .cv3-problem-grid article,
        .cv3-entry.is-visible .cv3-rule-grid article,
        .cv3-entry.is-visible .cv3-verdicts article,
        .cv3-entry.is-visible .cv3-workflow-grid article,
        .cv3-entry.is-visible .cv3-engineering-grid article {
          animation:
            cv3-card-in
            520ms
            var(--ease, cubic-bezier(.22,1,.36,1))
            both;
        }

        .cv3-entry.is-visible article:nth-child(2) {
          animation-delay: 70ms;
        }

        .cv3-entry.is-visible article:nth-child(3) {
          animation-delay: 140ms;
        }

        .cv3-entry.is-visible article:nth-child(4) {
          animation-delay: 210ms;
        }

        @keyframes cv3-signal-run {
          from {
            transform: translateX(-110%);
          }

          to {
            transform: translateX(110%);
          }
        }

        @keyframes cv3-vertical-trace {
          0% {
            transform: translateY(-110%);
          }

          70%,
          100% {
            transform: translateY(110%);
          }
        }

        @keyframes cv3-pipeline-flow {
          from {
            transform: translateX(-100%);
          }

          to {
            transform: translateX(100%);
          }
        }

        @keyframes cv3-system-flow {
          from {
            transform: translateX(-100%);
          }

          to {
            transform: translateX(100%);
          }
        }

        @keyframes cv3-card-in {
          from {
            opacity: 0;
            transform: translateY(8px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 980px) {
          .cv3-meta {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .cv3-pipeline {
            grid-template-columns: 1fr;
          }

          .cv3-pipeline__stage {
            min-height: 0;
            border-right: 0;
            border-bottom: 1px solid var(--rule);
          }

          .cv3-pipeline__stage:last-child {
            border-bottom: 0;
          }

          .cv3-pipeline__stage > strong {
            margin-top: 0.6rem;
          }

          .cv3-pipeline__stage > i {
            right: auto;
            top: auto;
            bottom: -10px;
            left: 50%;
            width: 1px;
            height: 20px;
          }

          .cv3-pipeline__stage > i b {
            transform: translateY(-100%);
          }

          .cv3-scenario__body {
            grid-template-columns: 1fr;
          }

          .cv3-scenario__body > i {
            transform: rotate(90deg);
          }
        }

        @media (max-width: 800px) {
          .cv3-entry {
            grid-template-columns: 1fr;
          }

          .cv3-problem-grid,
          .cv3-rule-grid,
          .cv3-verdicts,
          .cv3-workflow-grid,
          .cv3-engineering-grid,
          .cv3-system__inputs,
          .cv3-system__outputs {
            grid-template-columns: 1fr;
          }

          .cv3-breakage-demo {
            grid-template-columns: 1fr;
          }

          .cv3-breakage-demo__link {
            flex-direction: row;
          }

          .cv3-breakage-demo__link span {
            width: 42px;
            height: 1px;
          }

          .cv3-finding {
            grid-template-columns: 1fr;
          }

          .cv3-finding > div {
            border-right: 0;
            border-bottom: 1px solid var(--rule);
          }

          .cv3-finding > div:last-child {
            border-bottom: 0;
          }

          .cv3-thesis {
            grid-template-columns: 1fr;
          }

          .cv3-check-preview__metrics {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .cv3-footer {
            align-items: flex-start;
            flex-direction: column;
          }
        }

        @media (max-width: 560px) {
          .cv3-cover__title {
            flex-direction: column;
          }

          .cv3-meta,
          .cv3-check-preview__metrics,
          .cv3-scenario__tabs {
            grid-template-columns: 1fr;
          }

          .cv3-scenario__tabs button {
            border-right: 0;
            border-bottom: 1px solid var(--rule);
          }

          .cv3-scenario__tabs button:last-child {
            border-bottom: 0;
          }

          .cv3-cover-signal {
            grid-template-columns: 1fr;
          }

          .cv3-cover-signal i,
          .cv3-cover-signal b {
            width: 1px;
            height: 20px;
            justify-self: center;
          }

          .cv3-footer > div {
            flex-direction: column;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .cv3 [data-cv-reveal] {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }

          .cv3-cover-signal i::after,
          .cv3-cover-signal b::after,
          .cv3-breakage-demo__link span::after,
          .cv3-pipeline__stage > i b,
          .cv3-system__connector i::after,
          .cv3-entry.is-visible .cv3-problem-grid article,
          .cv3-entry.is-visible .cv3-rule-grid article,
          .cv3-entry.is-visible .cv3-verdicts article,
          .cv3-entry.is-visible .cv3-workflow-grid article,
          .cv3-entry.is-visible .cv3-engineering-grid article {
            animation: none !important;
          }
        }
      `}</style>
    </article>
  );
}
