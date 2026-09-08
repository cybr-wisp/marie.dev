import Link from "next/link";

import { LanguageToggle } from "@/components/controls/LanguageToggle";
import { ThemeToggle } from "@/components/controls/ThemeToggle";

export function Header() {
  return (
    <header className="portfolio-header-v2">
      <nav
        className="portfolio-header-v2__primary"
        aria-label="Primary navigation"
      >
        <Link href="/">
          (home)
        </Link>

        <Link href="/projects">
          (projects)
        </Link>

        <Link href="/notes">
          (writing)
        </Link>

        <Link href="/projects?category=research">
          (research)
        </Link>

        <Link href="/about">
          <span className="copy-en">
            (about me)
          </span>

          <span className="copy-fr">
            ({"\u00e0"} propos)
          </span>
        </Link>
      </nav>

      <nav
        className="portfolio-header-v2__controls"
        aria-label="Site controls"
      >
        <a
          href="https://www.linkedin.com/in/maryamsindhu/"
          target="_blank"
          rel="noreferrer"
        >
          (linkedin)
        </a>

        <LanguageToggle />
        <ThemeToggle />
      </nav>
    </header>
  );
}

