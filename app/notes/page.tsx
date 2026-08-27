import type { Metadata } from "next";

import { ArchiveRail } from "@/components/chrome/ArchiveRail";

export const metadata: Metadata = {
  title: "Notes",
  description:
    "Technical notes, working ideas, and small arguments.",
};

export default function NotesPage() {
  return (
    <main
      id="main-content"
      className="archive-page"
    >
      <div className="archive-frame">
        <ArchiveRail current="notes" />

        <section className="archive-content archive-content--notes">
          <header className="archive-header fade-up" style={{ animationDelay: "0.1s" }}>
            <div>
              <span className="archive-kicker">
                03 · NOTES
              </span>

              <h1 className="archive-title">
                <span className="copy-en">
                  notes
                </span>

                <span className="copy-fr">
                  notes
                </span>
              </h1>
            </div>
          </header>

          <div className="notes-coming-soon fade-up" style={{ animationDelay: "0.3s" }}>
            <p>coming soon...</p>
          </div>
        </section>
      </div>
    </main>
  );
}
