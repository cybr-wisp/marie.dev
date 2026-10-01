import Link from "next/link";

export function Hero() {
  return (
    <nav
      className="landing-nav"
      aria-label="Primary navigation"
    >
      <Link href="/" className="is-active">
        home
      </Link>

      <Link href="/projects">
        projects
      </Link>

      <Link href="/about">
        about
      </Link>

      <Link href="/about#contact">
        contact
      </Link>
    </nav>
  );
}