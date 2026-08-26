export type LocalizedText = Readonly<{
  en: string;
  fr: string;
}>;

export type LocalizedParagraphs = Readonly<{
  en: readonly string[];
  fr: readonly string[];
}>;

export type ProjectCategory =
  | "RESEARCH"
  | "AI / ML"
  | "DISTRIBUTED SYSTEMS"
  | "DEVELOPER TOOLS"
  | "STATIC ANALYSIS"
  | "AI SAFETY"
  | "ENERGY SYSTEMS";

export type ProjectSection = Readonly<{
  label: LocalizedText;
  body: LocalizedText;
}>;

export type Project = Readonly<{
  number: string;
  slug: string;
  title: string;
  year: string;
  summary: LocalizedText;
  intro: LocalizedText;
  categories: readonly ProjectCategory[];
  tags: readonly string[];
  sections: readonly ProjectSection[];
  repository?: string;
}>;

export type Note = Readonly<{
  slug: string;
  date: string;
  displayDate: string;
  title: LocalizedText;
  excerpt: LocalizedText;
  body: LocalizedParagraphs;
}>;