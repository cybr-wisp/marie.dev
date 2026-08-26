import type { Metadata } from "next";

import { ArchiveRail } from "@/components/chrome/ArchiveRail";
import { NoteRow } from "@/components/notes/NoteRow";
import { notes } from "@/content/notes";

export const metadata: Metadata = {
  title: "Notes",
  description:
    "Technical notes, working ideas, and small arguments.",
};

export default function NotesPage() {
  const visibleNotes = notes.slice(0, 4);

  return (
    <main
      id="main-content"
      className="archive-page"
    >
      <div className="archive-frame">
        <ArchiveRail current="notes" />

        <section className="archive-content archive-content--notes">
          <header className="archive-header notes-header">
            <div>
              <span className="archive-kicker">
                03 · NOTES
              </span>

              <h1 className="archive-title notes-title">
                <span className="copy-en">
                  notes
                </span>

                <span className="copy-fr">
                  notes
                </span>
              </h1>
            </div>

            <span className="archive-count">
              {String(visibleNotes.length).padStart(2, "0")}
            </span>
          </header>

          <div className="notes-map">
            <div
              className="notes-map__flow"
              aria-hidden="true"
            >
              <span>FRAGMENTS</span>
              <span>CONNECTIONS</span>
              <span>WORKING NOTES</span>
            </div>

            <div
              className="notes-map__fragments"
              aria-hidden="true"
            >
              <span className="fragment fragment--1" />
              <span className="fragment fragment--2" />
              <span className="fragment fragment--3" />
              <span className="fragment fragment--4" />
              <span className="fragment fragment--5" />
              <span className="fragment fragment--6" />
              <span className="fragment fragment--7" />
              <span className="fragment fragment--8" />
              <span className="fragment fragment--9" />
              <span className="fragment fragment--10" />
              <span className="fragment fragment--11" />
              <span className="fragment fragment--12" />
            </div>

            <svg
              className="notes-map__connections"
              viewBox="0 0 1200 640"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                className="notes-map__path notes-map__path--fragment"
                d="M95 248 C205 250 330 276 449 288"
              />
              <path
                className="notes-map__path notes-map__path--fragment"
                d="M138 414 C255 404 350 350 449 300"
              />
              <path
                className="notes-map__path notes-map__path--fragment"
                d="M186 333 C285 316 365 305 449 294"
              />

              <path
                className="notes-map__path notes-map__path--trunk"
                d="M306 294 C355 293 405 293 449 293"
              />

              <path
                className="notes-map__path notes-map__path--primary"
                d="M474 285 C500 218 520 135 539 80"
              />
              <path
                className="notes-map__path notes-map__path--primary"
                d="M478 296 C565 282 648 270 731 266"
              />
              <path
                className="notes-map__path notes-map__path--primary"
                d="M474 284 C625 184 787 92 959 75"
              />
              <path
                className="notes-map__path notes-map__path--primary"
                d="M469 306 C500 384 542 452 587 492"
              />

              <path
                className="notes-map__path notes-map__path--secondary"
                d="M545 80 C682 34 824 35 959 75"
              />
              <path
                className="notes-map__path notes-map__path--secondary"
                d="M737 266 C705 356 655 438 590 492"
              />

              <circle
                className="notes-map__bridge"
                cx="306"
                cy="294"
                r="4"
              />
              <circle
                className="notes-map__bridge"
                cx="356"
                cy="293"
                r="3"
              />
              <circle
                className="notes-map__bridge"
                cx="410"
                cy="293"
                r="4"
              />
            </svg>

            <div
              className="notes-core"
              aria-hidden="true"
            >
              <span className="notes-core__eyebrow">
                CORE
              </span>

              <span className="notes-core__dot" />

              <span className="notes-core__caption">
                systems · reasoning
              </span>
            </div>

            {visibleNotes.map((note, index) => (
              <NoteRow
                key={note.slug}
                note={note}
                index={index}
              />
            ))}
          </div>
        </section>
      </div>

      <div className="field-notes-footer">
        <a
          href="https://github.com/cybr-wisp/marie.dev"
          target="_blank"
          rel="noreferrer"
        >
          <span className="copy-en">
            ACCESS FIELD NOTES →
          </span>
          <span className="copy-fr">
            ACCÉDER AUX NOTES DE TERRAIN →
          </span>
        </a>
      </div>
    </main>
  );
}
