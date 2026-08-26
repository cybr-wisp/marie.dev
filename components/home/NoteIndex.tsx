import { SectionLabel } from "@/components/editorial/SectionLabel";
import { NoteRow } from "@/components/notes/NoteRow";
import { homeCopy } from "@/content/copy";
import { notes } from "@/content/notes";

export function NoteIndex() {
  return (
    <section
      className="site-shell editorial-section"
      id="notes"
      aria-labelledby="notes-title"
    >
      <SectionLabel
        number="02"
        labelEn="TECHNICAL DIARY"
        labelFr="JOURNAL TECHNIQUE"
        meta="2026"
      />

      <div className="section-heading-row">
        <h2
          className="section-title"
          id="notes-title"
        >
          <span className="copy-en">
            NOTES
          </span>

          <span className="copy-fr">
            NOTES
          </span>
        </h2>

        <p className="section-intro">
          <span className="copy-en">
            {homeCopy.notesIntro.en}
          </span>

          <span className="copy-fr">
            {homeCopy.notesIntro.fr}
          </span>
        </p>
      </div>

      <div className="note-list">
        {notes.map((note) => (
          <NoteRow
            key={note.slug}
            note={note}
          />
        ))}
      </div>
    </section>
  );
}
