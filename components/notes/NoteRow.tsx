import Link from "next/link";

import type { Note } from "@/types/content";

type NoteRowProps = Readonly<{
  note: Note;
  index?: number;
}>;

export function NoteRow({
  note,
  index,
}: NoteRowProps) {
  /*
    The homepage does not pass an index, so it keeps the compact
    legacy row. The Notes page passes an index and gets a graph node.
  */
  if (index === undefined) {
    return (
      <Link
        className="note-row"
        href={`/notes/${note.slug}`}
        aria-label={`Read ${note.title.en}`}
      >
        <time
          className="note-date"
          dateTime={note.date}
        >
          {note.displayDate}
        </time>

        <h3 className="note-title">
          <span className="copy-en">
            {note.title.en}
          </span>

          <span className="copy-fr">
            {note.title.fr}
          </span>
        </h3>

        <span className="note-open">
          <span className="copy-en">
            READ →
          </span>

          <span className="copy-fr">
            LIRE →
          </span>
        </span>
      </Link>
    );
  }

  const nodeNumber =
    String(index + 1).padStart(2, "0");

  return (
    <Link
      className={`note-node note-node--${index + 1}`}
      href={`/notes/${note.slug}`}
      aria-label={`Read ${note.title.en}`}
    >
      <span
        className="note-node__dot"
        aria-hidden="true"
      />

      <span
        className="note-node__satellites"
        aria-hidden="true"
      >
        <span />
        <span />
        <span />
      </span>

      <div className="note-node__meta">
        <span className="note-node__number">
          {nodeNumber}
        </span>

        <time
          className="note-node__date"
          dateTime={note.date}
        >
          {note.displayDate}
        </time>
      </div>

      <h2 className="note-node__title">
        <span className="copy-en">
          {note.title.en}
        </span>

        <span className="copy-fr">
          {note.title.fr}
        </span>
      </h2>

      <p className="note-node__excerpt copy-en">
        {note.excerpt.en}
      </p>

      <p className="note-node__excerpt copy-fr">
        {note.excerpt.fr}
      </p>

      <span className="note-node__open">
        ↗
      </span>
    </Link>
  );
}
