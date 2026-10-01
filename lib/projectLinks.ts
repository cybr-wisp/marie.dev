export const CASE_STUDY_SLUGS = new Set([
  "paratrace",
  "microgrid-ml",
  "vanguard-x",
  "aurora-borealis",
  "canary",
]);

export const PROJECT_ABSTRACTS: Readonly<Record<string, string>> = {
  paratrace: "/docs/paratrace-abstract.pdf",
  "microgrid-ml": "/docs/microgrid-ml-abstract.pdf",
};

export function hasCaseStudy(slug: string) {
  return CASE_STUDY_SLUGS.has(slug);
}

export function caseStudyHref(slug: string) {
  return `/projects/${slug}`;
}

export function abstractHref(slug: string) {
  return PROJECT_ABSTRACTS[slug];
}
