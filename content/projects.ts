import type { Project } from "@/types/content";

export const projects: readonly Project[] = [
  {
    number: "01",
    slug: "paratrace",
    title: "ParaTrace",
    year: "2026",
    categories: ["RESEARCH", "AI / ML", "AI SAFETY"],
    summary: {
      en: "Researching how LLM rewriting can preserve meaning while eroding dementia-linked linguistic signal.",
      fr: "Étude de la façon dont la réécriture par LLM peut préserver le sens tout en érodant le signal linguistique lié à la démence.",
    },
    intro: {
      en: "An AI-safety study of linguistic biomarker preservation under progressive LLM rewriting.",
      fr: "Une étude de sûreté de l’IA sur la préservation des biomarqueurs linguistiques sous réécriture progressive par LLM.",
    },
    tags: ["PYTHON", "NLP", "LLM EVAL", "SCIKIT-LEARN"],
    sections: [],
    repository:
      "https://github.com/cybr-wisp/paratrace-cym2026",
  },

  {
    number: "02",
    slug: "vanguard-x",
    title: "Vanguard-X",
    year: "2026",
    categories: ["DISTRIBUTED SYSTEMS"],
    summary: {
      en: "A real-time geospatial tracking pipeline built around sensor ingestion, state estimation, streaming, and spatial events.",
      fr: "Un pipeline géospatial temps réel combinant ingestion de capteurs, estimation d’état, streaming et événements spatiaux.",
    },
    intro: {
      en: "A distributed tracking system for ingesting, fusing, and serving live geospatial state.",
      fr: "Un système distribué de suivi pour ingérer, fusionner et servir un état géospatial en direct.",
    },
    tags: ["JAVA", "KAFKA", "REDIS", "PROTOBUF"],
    sections: [],
    repository:
      "https://github.com/cybr-wisp/vanguard-x",
  },

  {
    number: "03",
    slug: "aurora-borealis",
    title: "Aurora Borealis",
    year: "2026",
    categories: ["RESEARCH"],
    summary: {
      en: "A tracking and estimation lab exploring EKF/UKF behavior, adaptive process noise, and degraded sensing.",
      fr: "Un laboratoire de suivi et d’estimation explorant EKF/UKF, le bruit de processus adaptatif et la détection dégradée.",
    },
    intro: {
      en: "A radar tracking sandbox for state estimation, maneuver recovery, and Monte Carlo validation.",
      fr: "Un banc d’essai radar pour l’estimation d’état, la récupération après manœuvre et la validation Monte Carlo.",
    },
    tags: ["PYTHON", "C++", "EKF", "UKF"],
    sections: [],
    repository:
      "https://github.com/cybr-wisp/aurora-borealis",
  },

  {
    number: "04",
    slug: "canary",
    title: "Canary",
    year: "2026",
    categories: ["DEVELOPER TOOLS", "STATIC ANALYSIS"],
    summary: {
      en: "Repository-aware semantic regression detection for GitHub pull requests.",
      fr: "Détection de régressions sémantiques à l’échelle du dépôt pour les pull requests GitHub.",
    },
    intro: {
      en: "Static analysis for detecting incompatible Python API changes before merge.",
      fr: "Analyse statique pour détecter les modifications incompatibles d’API Python avant fusion.",
    },
    tags: ["PYTHON", "AST", "FASTAPI", "GITHUB"],
    sections: [],
    repository:
      "https://github.com/cybr-wisp/canary",
  },

  {
    number: "05",
    slug: "microgrid-ml",
    title: "MicroGrid ML",
    year: "2025",
    categories: ["AI / ML", "ENERGY SYSTEMS"],
    summary: {
      en: "Machine learning for next-hour electricity forecasting and temporal microgrid fault-risk detection.",
      fr: "Apprentissage automatique pour la prévision électrique à une heure et la détection temporelle du risque de panne.",
    },
    intro: {
      en: "Forecasting and fault detection for residential microgrid time series.",
      fr: "Prévision et détection de pannes pour des séries temporelles de micro-réseaux résidentiels.",
    },
    tags: ["PYTORCH", "LSTM", "FASTAPI", "TIME SERIES"],
    sections: [],
    repository:
      "https://github.com/cybr-wisp/microgrid-ml-cym2025",
  },

  {
    number: "06",
    slug: "helios",
    title: "Helios",
    year: "2026",
    categories: ["AI / ML", "RESEARCH"],
    summary: {
      en: "An Earth-observation ML project exploring multimodal geospatial foundation models for remote-sensing analysis.",
      fr: "Un projet ML d’observation de la Terre explorant des modèles fondamentaux géospatiaux multimodaux pour la télédétection.",
    },
    intro: {
      en: "Applied Earth-observation machine learning built around multimodal satellite data.",
      fr: "Apprentissage automatique appliqué à l’observation de la Terre à partir de données satellitaires multimodales.",
    },
    tags: ["PYTHON", "PYTORCH", "GEOSPATIAL", "EO"],
    sections: [],
  },

  {
    number: "07",
    slug: "tracellm",
    title: "TraceLLM",
    year: "2026",
    categories: ["RESEARCH", "AI / ML", "AI SAFETY"],
    summary: {
      en: "Studying how tool-using language-model agents propagate and recover from silently corrupted observations.",
      fr: "Étude de la propagation et de la récupération des erreurs chez les agents de langage utilisant des outils face à des observations silencieusement corrompues.",
    },
    intro: {
      en: "A reliability benchmark for measuring whether tool-using agents truly recover after incorporating plausible but incorrect tool observations.",
      fr: "Un benchmark de fiabilité visant à mesurer si les agents utilisant des outils récupèrent réellement après avoir intégré des observations plausibles mais incorrectes.",
    },
    tags: ["AGENTS", "RELIABILITY", "LLM EVAL", "AI SAFETY"],
    sections: [],
  },
];