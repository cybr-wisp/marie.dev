import type { Project } from "@/types/content";

export const projects = [
  {
    number: "01",
    slug: "canary",
    title: "Canary",
    year: "2026",

    categories: [
      "DEVELOPER TOOLS",
    ],

    summary: {
      en:
        "A GitHub App that turns pull-request diffs into structured, testable review checks.",
      fr:
        "Une GitHub App qui transforme les diffs de pull request en vérifications de revue structurées et testables.",
    },

    intro: {
      en:
        "Canary treats code review as an infrastructure problem: receive a pull-request event, verify it, inspect the change, and return useful feedback through the same interface where the change was proposed.",
      fr:
        "Canary traite la revue de code comme un problème d'infrastructure : recevoir un événement de pull request, le vérifier, inspecter le changement et retourner un retour utile dans la même interface où le changement a été proposé.",
    },

    tags: [
      "PYTHON",
      "FASTAPI",
      "GITHUB API",
      "PYTEST",
    ],

    sections: [
      {
        label: {
          en: "PROBLEM",
          fr: "PROBLÈME",
        },

        body: {
          en:
            "Pull-request automation becomes unreliable when webhook verification, event parsing, review logic, and GitHub feedback are tightly coupled. Canary separates those responsibilities so each stage can be tested independently.",
          fr:
            "L'automatisation des pull requests devient fragile lorsque la vérification des webhooks, l'analyse des événements, la logique de revue et le retour GitHub sont étroitement couplés. Canary sépare ces responsabilités afin que chaque étape puisse être testée indépendamment.",
        },
      },

      {
        label: {
          en: "SYSTEM",
          fr: "SYSTÈME",
        },

        body: {
          en:
            "GitHub sends signed webhook events to a FastAPI service. Canary authenticates the payload, identifies supported pull-request events, retrieves the relevant diff, runs review checks, and publishes the result back through GitHub.",
          fr:
            "GitHub envoie des événements webhook signés à un service FastAPI. Canary authentifie la charge utile, identifie les événements de pull request pris en charge, récupère le diff pertinent, exécute les vérifications et publie le résultat dans GitHub.",
        },
      },

      {
        label: {
          en: "DESIGN",
          fr: "CONCEPTION",
        },

        body: {
          en:
            "The project is deliberately backend-first. Authentication, event handling, review logic, and external API calls live behind small boundaries so failures are easier to reproduce and reason about.",
          fr:
            "Le projet est volontairement centré sur le backend. L'authentification, la gestion des événements, la logique de revue et les appels API externes sont séparés par de petites frontières afin de rendre les défaillances plus faciles à reproduire et à comprendre.",
        },
      },
    ],

    repository:
      "https://github.com/cybr-wisp/canary",
  },

  {
    number: "02",
    slug: "paratrace",
    title: "ParaTrace",
    year: "2026",

    categories: [
      "RESEARCH",
      "AI / ML",
    ],

    summary: {
      en:
        "A research pipeline measuring what happens to dementia-linked linguistic signals when language models rewrite speech.",
      fr:
        "Un pipeline de recherche qui mesure ce que deviennent les signaux linguistiques liés à la démence lorsque des modèles de langage réécrivent la parole.",
    },

    intro: {
      en:
        "ParaTrace asks whether making clinical language cleaner can also make it less informative.",
      fr:
        "ParaTrace demande si rendre le langage clinique plus propre peut également le rendre moins informatif.",
    },

    tags: [
      "PYTHON",
      "NLP",
      "LLM EVAL",
      "LINGUISTIC FEATURES",
    ],

    sections: [
      {
        label: {
          en: "QUESTION",
          fr: "QUESTION",
        },

        body: {
          en:
            "Language models are increasingly used to rewrite and summarize human speech. The research asks whether that normalization removes linguistic patterns that may carry clinically useful information.",
          fr:
            "Les modèles de langage sont de plus en plus utilisés pour réécrire et résumer la parole humaine. La recherche demande si cette normalisation supprime des motifs linguistiques pouvant contenir de l'information cliniquement utile.",
        },
      },

      {
        label: {
          en: "METHOD",
          fr: "MÉTHODE",
        },

        body: {
          en:
            "The pipeline compares original speech with progressively rewritten versions and measures how lexical, syntactic, and fluency-related features change.",
          fr:
            "Le pipeline compare la parole originale à des versions progressivement réécrites et mesure l'évolution des caractéristiques lexicales, syntaxiques et liées à la fluidité.",
        },
      },
    ],
  },

  {
    number: "03",
    slug: "grid-signal",
    title: "GridSignal",
    year: "2025",

    categories: [
      "RESEARCH",
      "AI / ML",
    ],

    summary: {
      en:
        "A CYM 2025 research project forecasting near-term microgrid demand and tracing fault risk from recent generation behaviour.",
      fr:
        "Un projet de recherche CYM 2025 qui prévoit la demande à court terme d'un micro-réseau et suit le risque de panne à partir du comportement récent de la production.",
    },

    intro: {
      en:
        "GridSignal asks two linked questions: what will the microgrid need next, and does the recent signal already contain evidence that a fault is emerging?",
      fr:
        "GridSignal étudie deux questions liées : de quoi le micro-réseau aura-t-il besoin ensuite, et le signal récent contient-il déjà des indices qu'une défaillance est en train d'apparaître ?",
    },

    tags: [
      "PYTHON",
      "LSTM",
      "RANDOM FOREST",
      "TIME SERIES",
    ],

    sections: [
      {
        label: {
          en: "FORECASTING",
          fr: "PRÉVISION",
        },

        body: {
          en:
            "Recent consumption observations are transformed into a fixed temporal window used to estimate near-term electricity demand.",
          fr:
            "Les observations récentes de consommation sont transformées en une fenêtre temporelle fixe utilisée pour estimer la demande électrique à court terme.",
        },
      },

      {
        label: {
          en: "FAULT RISK",
          fr: "RISQUE DE PANNE",
        },

        body: {
          en:
            "Rather than asking only whether a fault exists now, the second model follows how risk evolves in the observations preceding failure.",
          fr:
            "Plutôt que de demander uniquement si une panne existe maintenant, le second modèle suit l'évolution du risque dans les observations précédant la défaillance.",
        },
      },
    ],
  },
] satisfies readonly Project[];
