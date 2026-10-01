"use client";

import Link from "next/link";

import type { Project } from "@/types/content";

type AuroraBorealisCaseStudyProps = Readonly<{
  project: Project;
}>;

const technologies = [
  "Python",
  "C++20",
  "EKF",
  "UKF",
  "IMM",
  "Eigen",
  "NumPy",
  "Protobuf",
  "FreeRTOS",
  "ESP32-S3",
  "Next.js",
  "D3",
  "WebSocket",
  "pytest",
  "GoogleTest",
  "GitHub Actions",
] as const;

export function AuroraBorealisCaseStudy({
  project,
}: AuroraBorealisCaseStudyProps) {
  const repository =
    project.repository ??
    "https://github.com/cybr-wisp/aurora-borealis";

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
            Research · sensor fusion · state estimation · 2026
          </p>

          <h1>Aurora Borealis</h1>

          <p className="pcs__statement">
            Accuracy is not enough. The uncertainty has to be
            credible too.
          </p>

          <p className="pcs__deck">
            Aurora Borealis is a multi-sensor tracking
            research system for studying estimator behavior
            under missed detections, packet loss, nonlinear
            radar measurements, target maneuvers, and
            real-time ingestion constraints.
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
          aria-label="Aurora Borealis benchmark highlights"
        >
          <article className="pcs__metric">
            <strong>98 / 100</strong>
            <span>held-out runs below 5 m RMSE</span>
          </article>

          <article className="pcs__metric">
            <strong>4.411 m</strong>
            <span>mean coordinated-turn RMSE</span>
          </article>

          <article className="pcs__metric">
            <strong>7.89M</strong>
            <span>in-process messages / second</span>
          </article>

          <article className="pcs__metric">
            <strong>38.573 μs</strong>
            <span>p99 association · 100 tracks</span>
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
                A tracker can achieve low position error and
                still be dangerously overconfident.
              </h3>

              <p>
                Aurora studies tracking when sensors miss
                detections, packets disappear, observations
                are noisy, radar measurements are nonlinear,
                and targets abruptly change motion.
              </p>

              <p>
                In that environment, RMSE alone is
                insufficient. An estimator may produce a
                visually accurate trajectory while reporting
                covariance that is far too small.
              </p>

              <div className="pcs__highlight">
                RMSE answers “how far was the estimate from
                truth?” NEES and NIS ask whether the
                estimator&apos;s own uncertainty was
                statistically believable.
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
                Estimator comparisons are meaningless if the
                stochastic experiment changes underneath
                them.
              </h3>

              <ul>
                <li>
                  Sensor noise must remain reproducible across
                  repeated experiments.
                </li>

                <li>
                  Adding one sensor cannot accidentally change
                  another sensor&apos;s random sequence.
                </li>

                <li>
                  Measurements should remain in native
                  range / azimuth / elevation form until the
                  nonlinear update.
                </li>

                <li>
                  Maneuver recovery cannot be solved simply by
                  inflating process noise everywhere.
                </li>

                <li>
                  Development seeds and final Monte Carlo
                  seeds must remain separated.
                </li>

                <li>
                  Native ingestion performance should be
                  evaluated separately from estimator quality.
                </li>
              </ul>
            </div>
          </section>

          <section className="pcs__section">
            <header className="pcs__label">
              <span>03</span>
              <h2>Reproducibility</h2>
            </header>

            <div className="pcs__copy">
              <h3>
                Make stochastic reproducibility a systems
                property, not an afterthought.
              </h3>

              <p>
                Each simulated radar owns an independent
                pseudo-random stream derived from the scenario
                seed and sensor identity.
              </p>

              <p>
                That prevents a common simulation problem:
                changing the number or order of sensors should
                not silently alter the noise sequence seen by
                every other sensor.
              </p>

              <div className="pcs__highlight">
                With independent random streams, estimator A
                and estimator B can be compared against the
                same underlying sensing realization.
              </div>

              <p>
                This made debugging much easier because a
                failed run could be reconstructed exactly
                rather than approximated with another random
                sample.
              </p>
            </div>
          </section>

          <section className="pcs__section">
            <header className="pcs__label">
              <span>04</span>
              <h2>Measurement model</h2>
            </header>

            <div className="pcs__copy">
              <h3>
                Keep radar observations nonlinear instead of
                hiding geometry error in preprocessing.
              </h3>

              <p>
                Radar sensors observe targets in spherical
                coordinates rather than directly in Cartesian
                position.
              </p>

              <p>
                Converting noisy spherical observations to
                Cartesian coordinates before filtering can
                distort the noise model.
              </p>

              <p>
                Aurora therefore keeps measurements in native
                range, azimuth, and elevation form through the
                nonlinear update and evaluates the observation
                using the appropriate measurement function and
                Jacobian.
              </p>

              <p>
                That preserves the geometry of the sensor
                model inside the estimator instead of treating
                transformed measurements as if they had
                simple Gaussian Cartesian noise.
              </p>
            </div>
          </section>

          <section className="pcs__section">
            <header className="pcs__label">
              <span>05</span>
              <h2>Estimator design</h2>
            </header>

            <div className="pcs__copy">
              <h3>
                One motion model could not handle both steady
                tracking and abrupt maneuvers well.
              </h3>

              <div className="pcs__decision-grid">
                <article className="pcs__decision">
                  <span>01</span>

                  <strong>EKF</strong>

                  <p>
                    Nonlinear measurement updates with an
                    explicit covariance estimate.
                  </p>
                </article>

                <article className="pcs__decision">
                  <span>02</span>

                  <strong>UKF COMPARISON</strong>

                  <p>
                    Evaluate sigma-point propagation as an
                    alternative nonlinear estimator.
                  </p>
                </article>

                <article className="pcs__decision">
                  <span>03</span>

                  <strong>IMM</strong>

                  <p>
                    Allow smooth-motion and maneuver models to
                    coexist rather than forcing one process
                    model everywhere.
                  </p>
                </article>
              </div>

              <p>
                The interacting multiple-model approach lets
                the tracker maintain probability over several
                motion hypotheses and shift weight toward a
                maneuver model when observations stop matching
                constant-velocity assumptions.
              </p>

              <p>
                That is preferable to globally increasing
                process noise, which may improve maneuver
                recovery but unnecessarily degrade covariance
                quality during ordinary motion.
              </p>
            </div>
          </section>

          <section className="pcs__section">
            <header className="pcs__label">
              <span>06</span>
              <h2>Association</h2>
            </header>

            <div className="pcs__copy">
              <h3>
                Measurement association had to scale without
                turning uncertainty into a fixed-distance
                heuristic.
              </h3>

              <p>
                Candidate observations are compared to
                predicted tracks using uncertainty-aware
                gating rather than a single Cartesian radius.
              </p>

              <p>
                This allows a track with larger covariance to
                admit a wider plausible measurement region,
                while a highly certain track rejects
                observations that would be implausible
                relative to its predicted uncertainty.
              </p>

              <p>
                Association performance was benchmarked
                independently from estimator accuracy so
                scaling behavior could be measured as track
                count increased.
              </p>
            </div>
          </section>

          <section className="pcs__section">
            <header className="pcs__label">
              <span>07</span>
              <h2>Validation</h2>
            </header>

            <div className="pcs__copy">
              <h3>
                Freeze the estimator before evaluating on
                untouched Monte Carlo seeds.
              </h3>

              <p>
                Development and tuning used one seed range.
                Final evaluation used 50 previously unseen
                seeds for each trajectory regime.
              </p>

              <p>
                The estimator configuration was frozen before
                those final runs.
              </p>

              <p>
                The final campaign evaluated both position
                error and statistical consistency rather than
                selecting configurations only by RMSE.
              </p>

              <p>
                One result deliberately remained imperfect:
                abrupt-maneuver empirical NEES coverage
                reached <strong>91.25%</strong>, below the
                nominal 95% target.
              </p>

              <div className="pcs__highlight">
                I kept the miss rather than retuning on the
                final seeds. Once final evaluation becomes
                another tuning set, the held-out result stops
                being meaningful.
              </div>
            </div>
          </section>

          <section className="pcs__section">
            <header className="pcs__label">
              <span>08</span>
              <h2>Native system</h2>
            </header>

            <div className="pcs__copy">
              <h3>
                Separate estimator research from the
                performance-sensitive ingestion path.
              </h3>

              <p>
                The simulation and analysis environment uses
                Python for rapid experimentation and Monte
                Carlo evaluation.
              </p>

              <p>
                The native system uses C++20, Protobuf, and a
                low-overhead ingestion path to measure parsing,
                enqueueing, and association independently from
                Python research tooling.
              </p>

              <p>
                The architecture also includes embedded and
                visualization layers so the same observation
                contract can move between simulated sensors,
                embedded devices, the native engine, and the
                browser-facing visualization.
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
                Held-out tracking remained accurate while the
                native pipeline stayed extremely fast.
              </h3>

              <p>
                <strong>98 of 100</strong> held-out
                scenario-runs remained below{" "}
                <strong>5 m RMSE</strong>.
              </p>

              <p>
                Mean held-out RMSE measured{" "}
                <strong>4.411 m</strong> for coordinated-turn
                trajectories and <strong>4.490 m</strong> for
                abrupt-maneuver trajectories.
              </p>

              <p>
                In the native Linux Release benchmark,
                in-process Protobuf parse + enqueue reached{" "}
                <strong>7,891,090 messages/s</strong>.
              </p>

              <p>
                At <strong>100 tracks</strong>, association
                p99 measured <strong>38.573 μs</strong>.
              </p>

              <div className="pcs__highlight">
                Aurora treats estimator accuracy, statistical
                consistency, and systems performance as
                separate questions. Improving one does not
                automatically prove the others.
              </div>

              <p className="pcs__note">
                The 7.89M messages/s result is an in-process
                parsing + enqueue benchmark, not end-to-end
                UDP network throughput.
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
                A good estimator has to explain its
                uncertainty, not just produce a plausible
                trajectory.
              </h3>

              <p>
                Aurora changed the way I evaluate tracking
                algorithms.
              </p>

              <p>
                Optimizing only for RMSE makes it easy to
                produce a model that appears accurate while
                systematically understating uncertainty.
              </p>

              <p>
                Once uncertainty becomes part of the
                requirement, design decisions around motion
                models, association gates, dropout handling,
                and final validation become much more
                disciplined.
              </p>

              <p>
                The same lesson extends beyond tracking:
                confidence is part of the output of a
                probabilistic system and should be evaluated
                like any other prediction.
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
          Aurora Borealis / state estimation / 2026
        </span>

        <Link href="/projects/canary">
          next · canary →
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