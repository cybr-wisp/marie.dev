import Link from "next/link";

import { SpotlightProjects } from "@/components/home/SpotlightProjects";
import { TypingHero } from "@/components/home/TypingHero";

export default function HomePage() {
  return (
    <main id="main-content" className="home-v3">
      <section className="home-v3__hero" aria-labelledby="home-title">
        <p className="home-v3__intro copy-en">
          marie sindhu {"\u00b7"} cs + math @ uOttawa {"\u00b7"} ottawa, canada
        </p>

        <p className="home-v3__intro copy-fr">
          marie sindhu {"\u00b7"} info + maths @ uOttawa {"\u00b7"} ottawa, canada
        </p>

        <h1 id="home-title" className="home-v3__title">
          <span className="copy-en"><TypingHero /></span>
          <span className="copy-fr">
            je construis des logiciels pour<br />des syst{"\u00e8"}mes intelligents
          </span>
        </h1>

        <Link href="#featured-work" className="home-v3__explore">
          <span className="copy-en">explore my work</span>
          <span className="copy-fr">voir mon travail</span>
          <span className="home-v3__explore-arrow" aria-hidden="true">{"\u2193"}</span>
        </Link>
      </section>

      <SpotlightProjects />

      <p className="home-v3__current copy-en">
        currently: swe @{" "}
        <a href="https://www.nokia.com/careers/our-locations/canada/" target="_blank" rel="noreferrer" className="home-v3__current-link">nokia</a>
        {" \u00b7 "}
        incoming ml @{" "}
        <a href="https://www.kinaxis.com/" target="_blank" rel="noreferrer" className="home-v3__current-link">kinaxis</a>
        {" (winter) \u00b7 "}
        researching <span className="home-v3__current-link">tool failure + recovery in ai agents</span>
      </p>

      <p className="home-v3__current copy-fr">
        actuellement : swe @{" "}
        <a href="https://www.nokia.com/careers/our-locations/canada/" target="_blank" rel="noreferrer" className="home-v3__current-link">nokia</a>
        {" \u00b7 "}
        prochain stage ml @{" "}
        <a href="https://www.kinaxis.com/" target="_blank" rel="noreferrer" className="home-v3__current-link">kinaxis</a>
        {" (hiver) \u00b7 "}
        recherche sur <span className="home-v3__current-link">les défaillances d&apos;outils + la récupération des agents ia</span>
      </p>

      <footer className="home-v3__footer">
        <a href="https://github.com/cybr-wisp/marie.dev" target="_blank" rel="noreferrer">
          <span className="copy-en">(access field notes {"\u2192"})</span>
          <span className="copy-fr">(notes {"\u2192"})</span>
        </a>
        <Link href="/projects">
          <span className="copy-en">(all projects {"\u2192"})</span>
          <span className="copy-fr">(tous les projets {"\u2192"})</span>
        </Link>
      </footer>
    </main>
  );
}
