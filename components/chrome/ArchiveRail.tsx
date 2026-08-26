import Link from "next/link";

type ArchiveRailProps = Readonly<{
  current:
    | "index"
    | "work"
    | "notes"
    | "about";
}>;

export function ArchiveRail({
  current,
}: ArchiveRailProps) {
  return (
    <aside className="archive-rail">
      <div className="archive-identity">
        <Link href="/">
          <strong>MARIE SINDHU.</strong>
        </Link>

        <span>PORTFOLIO · 2026</span>
      </div>

      <nav
        className="archive-nav"
        aria-label="Portfolio navigation"
      >
        <Link
          href="/"
          className={
            current === "index"
              ? "is-active"
              : undefined
          }
          aria-current={
            current === "index"
              ? "page"
              : undefined
          }
        >
          INDEX
        </Link>

        <Link
          href="/projects"
          className={
            current === "work"
              ? "is-active"
              : undefined
          }
          aria-current={
            current === "work"
              ? "page"
              : undefined
          }
        >
          <span className="copy-en">WORK</span>
          <span className="copy-fr">TRAVAUX</span>
        </Link>

        <Link
          href="/notes"
          className={
            current === "notes"
              ? "is-active"
              : undefined
          }
          aria-current={
            current === "notes"
              ? "page"
              : undefined
          }
        >
          NOTES
        </Link>

        <Link
          href="/about"
          className={
            current === "about"
              ? "is-active"
              : undefined
          }
          aria-current={
            current === "about"
              ? "page"
              : undefined
          }
        >
          <span className="copy-en">ABOUT</span>
          <span className="copy-fr">À PROPOS</span>
        </Link>
      </nav>

      <div className="archive-disciplines">
        <span className="archive-disciplines__label">
          FOCUS
        </span>

        <span className="archive-disciplines__item">
          RESEARCH · AI/ML + QUANT
        </span>

        <span className="archive-disciplines__item">
          SOFTWARE · DISTRIBUTED SYSTEMS
        </span>

        <span className="archive-disciplines__item">
          ROBOTICS (RECENTLY)
        </span>
      </div>
    </aside>
  );
}
