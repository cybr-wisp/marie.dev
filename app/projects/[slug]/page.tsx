import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { AuroraBorealisCaseStudy } from "@/components/projects/AuroraBorealisCaseStudy";
import { CanaryCaseStudy } from "@/components/projects/CanaryCaseStudy";
import { MicrogridCaseStudy } from "@/components/projects/MicrogridCaseStudy";
import { ParaTraceCaseStudy } from "@/components/projects/ParaTraceCaseStudy";
import { VanguardCaseStudy } from "@/components/projects/VanguardCaseStudy";
import { projects } from "@/content/projects";

type ProjectPageProps = Readonly<{
  params: Promise<{
    slug: string;
  }>;
}>;

export function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;

  const project = projects.find(
    (item) => item.slug === slug,
  );

  if (!project) {
    return {};
  }

  return {
    title: project.title,
    description: project.summary.en,
  };
}

export default async function ProjectPage({
  params,
}: ProjectPageProps) {
  const { slug } = await params;

  const project = projects.find(
    (item) => item.slug === slug,
  );

  if (!project) {
    notFound();
  }

  switch (project.slug) {
    case "paratrace":
      return <ParaTraceCaseStudy project={project} />;

    case "microgrid-ml":
      return <MicrogridCaseStudy project={project} />;

    case "vanguard-x":
      return <VanguardCaseStudy project={project} />;

    case "aurora-borealis":
      return <AuroraBorealisCaseStudy project={project} />;

    case "canary":
      return <CanaryCaseStudy project={project} />;

    default:
      if (project.repository) {
        redirect(project.repository);
      }

      notFound();
  }
}
