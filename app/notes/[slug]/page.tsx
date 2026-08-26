import type { Metadata } from "next";

import Link from "next/link";
import { notFound } from "next/navigation";

import { ArchiveRail } from "@/components/chrome/ArchiveRail";
import { notes } from "@/content/notes";

type NotePageProps = Readonly<{
  params: Promise<{
    slug: string;
  }>;
}>;

export function generateStaticParams() {
  return notes.map((note) => ({
    slug: note.slug,
  }));
}

export async function generateMetadata({
  params,
}: NotePageProps): Promise<Metadata> {
  const { slug } = await params;

  const note = notes.find(
    (item) => item.slug === slug,
  );

  if (!note) {
    return {};
  }

  return {
    title: note.title.en,
    description: note.excerpt.en,
  };
}

export default async function NotePage({
  params,
}: NotePageProps) {
  const { slug } = await params;

  const note = notes.find(
    (item) => item.slug === slug,
  );

  if (!note) {
    notFound();
  }

  return (
    <main
      id="main-content"
      className="archive-page"
    >
      <div className="archive-frame">
        <ArchiveRail current="notes" />

        <article className="note-article">
          <Link
            className="archive-back"
            href="/notes"
          >
            ← NOTES
          </Link>

          <header className="note-article__header">
            <time dateTime={note.date}>
              {note.displayDate}
            </time>

            <h1>
              <span className="copy-en">
                {note.title.en}
              </span>

              <span className="copy-fr">
                {note.title.fr}
              </span>
            </h1>
          </header>

          <div className="note-article__body copy-en">
            {note.body.en.map(
              (paragraph, index) => (
                <p key={index}>
                  {paragraph}
                </p>
              ),
            )}
          </div>

          <div className="note-article__body copy-fr">
            {note.body.fr.map(
              (paragraph, index) => (
                <p key={index}>
                  {paragraph}
                </p>
              ),
            )}
          </div>
        </article>
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
