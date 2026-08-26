import type { LocalizedText } from "@/types/content";

type HomeCopy = Readonly<{
  heroEyebrow: LocalizedText;
  current: LocalizedText;
  projectsIntro: LocalizedText;
  notesIntro: LocalizedText;
}>;

export const homeCopy: HomeCopy = {
  heroEyebrow: {
    en: "SOFTWARE · SYSTEMS · MACHINE LEARNING",
    fr: "LOGICIEL · SYSTÈMES · APPRENTISSAGE MACHINE",
  },

  current: {
    en:
      "Right now: distributed systems, developer infrastructure, applied machine learning, and the boundary between software and the physical world.",
    fr:
      "En ce moment : systèmes distribués, infrastructure développeur, apprentissage automatique appliqué et frontière entre le logiciel et le monde physique.",
  },

  projectsIntro: {
    en:
      "Selected work across reliability, infrastructure, machine learning, networking, and research.",
    fr:
      "Une sélection de travaux en fiabilité, infrastructure, apprentissage automatique, réseaux et recherche.",
  },

  notesIntro: {
    en:
      "Working notes, small arguments, technical questions, and ideas worth keeping before they disappear.",
    fr:
      "Notes de travail, petits arguments, questions techniques et idées à conserver avant qu'elles ne disparaissent.",
  },
};
