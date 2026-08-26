import { Hero } from "@/components/home/Hero";
import { ProjectIndex } from "@/components/home/ProjectIndex";

export default function HomePage() {
  return (
    <main
      id="main-content"
      className="index-page"
    >
      <div className="index-frame">
        <Hero />
        <ProjectIndex />
      </div>
    </main>
  );
}