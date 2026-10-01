export default function AboutPage() {
  const stack = [
    "PYTHON",
    "JAVA",
    "C++",
    "PYTORCH",
    "TYPESCRIPT",
    "REACT",
    "KAFKA",
    "REDIS",
    "POSTGRESQL",
    "DOCKER",
    "LINUX",
    "AWS",
  ];

  const experience = [
    {
      date: "2026 - NOW",
      company: "NOKIA",
      role: "software engineering · verification",
      detail: "50g pon · instrumentation · automation · system validation",
    },
    {
      date: "WINTER 2027",
      company: "KINAXIS",
      role: "incoming · ai innovation",
      detail: "ai quality · evaluation · reliability · security",
    },
    {
      date: "2025",
      company: "INOVEDIA",
      role: "machine learning engineering",
      detail: "pytorch · model evaluation · inference systems · data pipelines",
    },
    {
      date: "2024",
      company: "INOVEDIA",
      role: "software engineering",
      detail: "backend systems · cloud infrastructure · docker · linux",
    },
  ];

  return (
    <main id="main-content" className="about-page">
    <section className="about-contact">
      <p className="about-contact__text">
        think we&apos;d have an interesting conversation? say hi.
      </p>

      <div className="about-contact__links">
        <a
          href="https://github.com/cybr-wisp"
          target="_blank"
          rel="noreferrer"
        >
          github ↗
        </a>

        <a
          href="https://www.linkedin.com/in/maryamsindhu/"
          target="_blank"
          rel="noreferrer"
        >
          linkedin ↗
        </a>
      </div>
    </section>

      <header className="about-hero">
        <p className="about-hero__eyebrow">
          05 · ABOUT
        </p>

        <h1>about</h1>
      </header>

      <section
        className="about-profile"
        aria-labelledby="about-profile-title"
      >
        <div className="about-profile__bio">
          <p className="about-section-label">
            about me
          </p>

          <h2 id="about-profile-title">
            hi, i&apos;m marie. i study computer science
            + mathematics at uottawa.
          </h2>

          <p>
            i like understanding how things work,
            especially when the answer is not obvious
            right away.
          </p>

          <p>
            that&apos;s what pulled me toward software,
            machine learning, math, and research.
            i&apos;m happiest when i&apos;m building
            something, debugging something confusing,
            or trying to turn a vague question into an
            experiment i can actually test.
          </p>

          <p>
            a lot of my work ends up around reliability
            and uncertainty: noisy sensor data,
            distributed systems, changing APIs, model
            evaluation, and figuring out what happens
            when the assumptions stop holding.
          </p>
        </div>
      </section>

      <section
        className="about-tools"
        aria-label="Technical stack and current work"
      >
        <div className="about-stack">
          <p className="about-section-label">
            tech stack
          </p>

          <div className="about-stack__list">
            {stack.map((technology) => (
              <span key={technology}>
                {technology}
              </span>
            ))}
          </div>
        </div>

        <aside className="about-current">
          <p className="about-section-label">
            current
          </p>

          <dl>
            <div>
              <dt>location</dt>
              <dd>ottawa, canada</dd>
            </div>

            <div>
              <dt>studying</dt>
              <dd>
                computer science + mathematics
                <span>university of ottawa</span>
              </dd>
            </div>

            <div>
              <dt>working</dt>
              <dd>
                software engineering
                <span>nokia · 50g pon</span>
              </dd>
            </div>

            <div>
              <dt>next</dt>
              <dd>
                ai innovation
                <span>kinaxis · winter 2027</span>
              </dd>
            </div>

            <div>
              <dt>researching</dt>
              <dd>
                ai reliability
                <span>
                  tool failure · recovery · evaluation
                </span>
              </dd>
            </div>
          </dl>
        </aside>
      </section>

      <section
        className="about-experience"
        aria-labelledby="about-experience-title"
      >
        <p
          id="about-experience-title"
          className="about-section-label"
        >
          experience
        </p>

        <div className="about-experience__list">
          {experience.map((item) => (
            <article
              className="about-experience__row"
              key={`${item.company}-${item.date}`}
            >
              <div className="about-experience__date">
                {item.date}
              </div>

              <div className="about-experience__company">
                {item.company}
              </div>

              <div className="about-experience__main">
                <h2>{item.role}</h2>
                <p>{item.detail}</p>
              </div>

              <span
                className="about-experience__arrow"
                aria-hidden="true"
              >
                ↘
              </span>
            </article>
          ))}
        </div>
      </section>

      <p className="about-closing">
        interested in systems, uncertainty,
        reliability, and good questions.
      </p>
    </main>
  );
}

