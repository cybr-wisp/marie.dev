"use client";

import Link from "next/link";

import type { Project } from "@/types/content";

type VanguardCaseStudyProps = Readonly<{
  project: Project;
}>;

const technologies = [
  "Java 21",
  "Spring Boot",
  "Kafka",
  "Redis",
  "Netty",
  "Protobuf",
  "EKF",
  "JUnit",
  "Testcontainers",
  "React",
  "TypeScript",
  "MapLibre",
  "Prometheus",
  "Grafana",
  "Docker",
] as const;

export function VanguardCaseStudy({
  project,
}: VanguardCaseStudyProps) {
  const repository =
    project.repository ??
    "https://github.com/cybr-wisp/vanguard-x";

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
            Distributed systems · tracking · reliability · 2026
          </p>

          <h1>Vanguard-X</h1>

          <p className="pcs__statement">
            Turn disagreement, packet loss, and replay into one coherent track
            picture.
          </p>

          <p className="pcs__deck">
            Vanguard-X is a distributed real-time tracking system that ingests
            asynchronous sensor observations, associates measurements with
            targets, estimates state under uncertainty, persists current track
            state, and exercises recovery across packet loss, consumer restarts,
            replay, and temporary missed detections.
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
          aria-label="Vanguard-X benchmark highlights"
        >
          <article className="pcs__metric">
            <strong>21,348</strong>
            <span>reports / second · 200 targets</span>
          </article>

          <article className="pcs__metric">
            <strong>18.45 ms</strong>
            <span>p95 tracking latency</span>
          </article>

          <article className="pcs__metric">
            <strong>63.0%</strong>
            <span>RMSE reduction after fusion</span>
          </article>

          <article className="pcs__metric">
            <strong>100%</strong>
            <span>association · 0 false tracks</span>
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
                Sensors disagree, arrive asynchronously, and sometimes disappear
                entirely.
              </h3>

              <p>
                Vanguard-X starts with a deliberately messy systems problem:
                multiple sensors observe the same moving targets with different
                noise characteristics, timestamps, transport delays, packet
                loss, jitter, and message reordering.
              </p>

              <p>
                Individual measurements are not useful tracks. The system must
                continuously infer which reports belong to which target,
                estimate position and velocity, maintain uncertainty, preserve
                identity through missed detections, and prevent replayed data
                from corrupting current state.
              </p>

              <div className="pcs__highlight">
                The real engineering problem was not “implement an EKF.” It was
                making ingestion, streaming, association, estimation, lifecycle
                state, persistence, replay, and APIs agree on what a track means.
              </div>
            </div>
          </section>

          <section className="pcs__section">
            <header className="pcs__label">
              <span>02</span>
              <h2>System constraints</h2>
            </header>

            <div className="pcs__copy">
              <h3>
                Real-time throughput could not come at the expense of recovery
                semantics.
              </h3>

              <ul>
                <li>
                  Reports arrive concurrently and cannot depend on one global
                  synchronous request path.
                </li>

                <li>
                  Packet loss must not immediately destroy an otherwise healthy
                  track.
                </li>

                <li>
                  Delayed or replayed reports cannot create duplicate tracks or
                  duplicate spatial events.
                </li>

                <li>
                  Kafka consumer restarts must resume from durable stream state.
                </li>

                <li>
                  Current track state needs to remain queryable without replaying
                  the entire event history.
                </li>

                <li>
                  The same synthetic scenario must be replayable deterministically
                  for debugging and verification.
                </li>
              </ul>
            </div>
          </section>

          <section className="pcs__section">
            <header className="pcs__label">
              <span>03</span>
              <h2>Architecture</h2>
            </header>

            <div className="pcs__copy">
              <h3>
                Split the system at explicit boundaries so failures remain
                understandable.
              </h3>

              <div className="pcs__decision-grid">
                <article className="pcs__decision">
                  <span>01</span>

                  <strong>NETTY + PROTOBUF</strong>

                  <p>
                    Validate and decode typed sensor telemetry at the ingestion
                    boundary before it enters the rest of the system.
                  </p>
                </article>

                <article className="pcs__decision">
                  <span>02</span>

                  <strong>KAFKA</strong>

                  <p>
                    Create durable replayable boundaries between ingestion,
                    tracking, and downstream event processing.
                  </p>
                </article>

                <article className="pcs__decision">
                  <span>03</span>

                  <strong>REDIS</strong>

                  <p>
                    Maintain current track state independently from the durable
                    event-stream history.
                  </p>
                </article>
              </div>

              <p>
                Spring Boot exposes REST and WebSocket interfaces above the
                tracker. That keeps visualization and API concerns outside the
                core estimation path.
              </p>

              <p>
                The resulting architecture lets transport, state estimation,
                persistence, and presentation evolve independently while sharing
                explicit Protobuf contracts.
              </p>
            </div>
          </section>

          <section className="pcs__section">
            <header className="pcs__label">
              <span>04</span>
              <h2>Association + estimation</h2>
            </header>

            <div className="pcs__copy">
              <h3>
                Association has to reject implausible measurements before the
                estimator can make a sensible update.
              </h3>

              <p>
                Candidate measurements are filtered using Mahalanobis gating,
                which evaluates the innovation relative to predicted covariance
                rather than relying on a fixed Euclidean-distance threshold.
              </p>

              <p>
                Accepted observations feed nonlinear range/bearing EKF updates.
                Covariance updates use Joseph form to reduce numerical issues and
                preserve a valid covariance matrix under repeated updates.
              </p>

              <p>
                This matters because the tracker needs more than a position
                estimate. It needs a calibrated estimate of uncertainty so that
                future association decisions remain meaningful.
              </p>
            </div>
          </section>

          <section className="pcs__section">
            <header className="pcs__label">
              <span>05</span>
              <h2>Track lifecycle</h2>
            </header>

            <div className="pcs__copy">
              <h3>
                Identity is a lifecycle problem, not just a nearest-neighbour
                problem.
              </h3>

              <p>
                Tracks move explicitly through:
              </p>

              <ul>
                <li>
                  <strong>TENTATIVE</strong> — insufficient evidence to commit
                  to a persistent track.
                </li>

                <li>
                  <strong>CONFIRMED</strong> — enough consistent observations
                  exist to promote the identity.
                </li>

                <li>
                  <strong>COASTING</strong> — observations are temporarily
                  missing, so uncertainty expands while identity remains alive.
                </li>

                <li>
                  <strong>DROPPED</strong> — the track exceeded the allowed
                  absence window and is retired.
                </li>
              </ul>

              <p>
                Coasting prevents a brief outage from immediately destroying
                identity. If a compatible measurement returns while the track is
                still recoverable, the system reacquires the same canonical
                identity rather than spawning a replacement.
              </p>
            </div>
          </section>

          <section className="pcs__section">
            <header className="pcs__label">
              <span>06</span>
              <h2>Failure recovery</h2>
            </header>

            <div className="pcs__copy">
              <h3>
                Reliability had to be demonstrated with executable failure
                paths, not architectural diagrams.
              </h3>

              <p>
                I added integration tests around scenarios that could corrupt or
                fragment distributed state:
              </p>

              <ul>
                <li>Kafka consumer restart and committed-offset recovery;</li>
                <li>packet loss and temporary missed detections;</li>
                <li>covariance growth while tracks coast;</li>
                <li>identity-preserving reacquisition;</li>
                <li>Redis persistence and state reconstruction;</li>
                <li>duplicate event suppression;</li>
                <li>deterministic replay from seeded simulations.</li>
              </ul>

              <p>
                A useful recovery test has to verify more than “the service came
                back.” It must verify that the recovered system state is
                consistent with what would have happened without the failure.
              </p>

              <div className="pcs__highlight">
                Deterministic replay turned failure investigation from “can I
                reproduce this?” into “which state transition first diverged?”
              </div>
            </div>
          </section>

          <section className="pcs__section">
            <header className="pcs__label">
              <span>07</span>
              <h2>Result</h2>
            </header>

            <div className="pcs__copy">
              <h3>
                Fusion improved accuracy while the tracker remained fast enough
                for live state updates.
              </h3>

              <p>
                Raw observation RMSE was <strong>29.24 m</strong>. After
                association and fusion, position RMSE was{" "}
                <strong>10.82 m</strong>, a{" "}
                <strong>63.0% reduction</strong>.
              </p>

              <p>
                At 200 concurrent targets, the frozen benchmark sustained{" "}
                <strong>21,348 reports/s</strong> with{" "}
                <strong>18.45 ms p95</strong> in-process tracking latency.
              </p>

              <p>
                Association accuracy was <strong>100%</strong> with{" "}
                <strong>0 false tracks</strong> on that benchmark workload.
              </p>

              <p>
                Deterministic replay produced no estimator divergence on the
                committed replay test, and repeated BREACH inputs were
                de-duplicated rather than emitted as repeated spatial events.
              </p>

              <p className="pcs__note">
                These numbers describe the repository&apos;s controlled
                synthetic benchmark campaign. They are engineering benchmarks,
                not claims about certified real-world radar performance.
              </p>
            </div>
          </section>

          <section className="pcs__section">
            <header className="pcs__label">
              <span>08</span>
              <h2>What I learned</h2>
            </header>

            <div className="pcs__copy">
              <h3>
                Distributed correctness is mostly about defining what must remain
                true across boundaries.
              </h3>

              <p>
                The project started as a tracking system, but the hardest
                engineering questions ended up being about invariants:
              </p>

              <ul>
                <li>
                  one physical target should not silently become several track
                  identities;
                </li>

                <li>
                  replay should reproduce history rather than create new
                  history;
                </li>

                <li>
                  temporary sensor failure should increase uncertainty instead
                  of manufacturing certainty;
                </li>

                <li>
                  recovery should restore state, not merely restart processes.
                </li>
              </ul>

              <p>
                Those constraints shaped the architecture more than any
                individual framework choice.
              </p>
            </div>
          </section>

          <section className="pcs__section">
            <header className="pcs__label">
              <span>09</span>
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
          Vanguard-X / distributed systems / 2026
        </span>

        <Link href="/projects/aurora-borealis">
          next · aurora borealis →
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