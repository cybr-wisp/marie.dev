import type { Project } from "@/types/content";

export const projects = [
  {
    number: "01",
    slug: "canary",
    title: "Canary",
    year: "2026",
    categories: [
      "DEVELOPER TOOLS",
      "STATIC ANALYSIS",
    ],
    summary: {
      en:
        "Repository-aware semantic regression detection for GitHub pull requests.",
      fr:
        "Détection de régressions sémantiques, consciente du dépôt, pour les pull requests GitHub.",
    },
    intro: {
      en:
        "Canary asks a stricter question than whether a pull request is syntactically valid: what existing code could this change break? It compares Python interfaces across BASE and HEAD, indexes repository call sites, validates callers against the changed API, and reports confirmed incompatibilities through GitHub Checks or the CLI.",
      fr:
        "Canary pose une question plus exigeante que la simple validité syntaxique d'une pull request : quel code existant ce changement peut-il casser ? Il compare les interfaces Python entre BASE et HEAD, indexe les sites d'appel du dépôt, valide les appelants par rapport à l'API modifiée et signale les incompatibilités confirmées via GitHub Checks ou la CLI.",
    },
    tags: [
      "PYTHON",
      "AST",
      "FASTAPI",
      "GITHUB",
    ],
    sections: [
      {
        label: {
          en: "PROBLEM",
          fr: "PROBLÈME",
        },
        body: {
          en:
            "A function definition and a call site can each remain valid Python while becoming incompatible with one another after an interface change. Canary treats that repository-level relationship as the object of analysis.",
          fr:
            "Une définition de fonction et un site d'appel peuvent chacun rester du Python valide tout en devenant incompatibles après une modification d'interface. Canary traite cette relation à l'échelle du dépôt comme l'objet de l'analyse.",
        },
      },
      {
        label: {
          en: "SYSTEM",
          fr: "SYSTÈME",
        },
        body: {
          en:
            "Canary resolves BASE and HEAD, parses changed Python APIs into ASTs, produces semantic compatibility findings, builds a repository-wide symbol and call-site index, then performs argument-aware validation to distinguish confirmed breakages from unaffected or unknown callers.",
          fr:
            "Canary résout BASE et HEAD, analyse les API Python modifiées sous forme d'AST, produit des constats de compatibilité sémantique, construit un index des symboles et des sites d'appel à l'échelle du dépôt, puis valide les arguments afin de distinguer les ruptures confirmées des appelants non affectés ou indéterminés.",
        },
      },
      {
        label: {
          en: "ENGINEERING",
          fr: "INGÉNIERIE",
        },
        body: {
          en:
            "The GitHub App and Typer CLI share the same deterministic analysis engine. FastAPI handles webhook delivery, GitHub App authentication and Checks API integration sit behind dedicated boundaries, and the test suite exercises semantic rules, call validation, webhook behavior, and integration paths.",
          fr:
            "La GitHub App et la CLI Typer partagent le même moteur d'analyse déterministe. FastAPI gère les webhooks, l'authentification GitHub App et l'intégration Checks API sont isolées derrière des frontières dédiées, et la suite de tests couvre les règles sémantiques, la validation des appels, les webhooks et les chemins d'intégration.",
        },
      },
    ],
    repository: "https://github.com/cybr-wisp/canary",
  },
  {
    number: "02",
    slug: "paratrace",
    title: "ParaTrace",
    year: "2026",
    categories: [
      "RESEARCH",
      "AI SAFETY",
    ],
    summary: {
      en:
        "An AI-safety study showing how LLM rewriting can preserve semantic meaning while eroding dementia-linked linguistic signal.",
      fr:
        "Une étude de sûreté de l'IA montrant que la réécriture par LLM peut préserver le sens tout en érodant le signal linguistique lié à la démence.",
    },
    intro: {
      en:
        "ParaTrace audits a hidden interaction between AI clinical scribes and speech-based cognitive screening: the rewritten note can remain semantically faithful while the linguistic form carrying diagnostic signal moves toward chance-level classification.",
      fr:
        "ParaTrace audite une interaction cachée entre les scribes cliniques d'IA et le dépistage cognitif fondé sur la parole : la note réécrite peut rester sémantiquement fidèle tandis que la forme linguistique portant le signal diagnostique se rapproche d'une classification au niveau du hasard.",
    },
    tags: [
      "PYTHON",
      "NLP",
      "SCIKIT-LEARN",
      "LLM EVAL",
    ],
    sections: [
      {
        label: {
          en: "QUESTION",
          fr: "QUESTION",
        },
        body: {
          en:
            "Clinical AI scribes are designed to normalize speech, while computational cognitive screening relies on linguistic patterns such as coherence, lexical choice, syntactic structure, repetitions, and disfluencies. ParaTrace measures whether those objectives conflict.",
          fr:
            "Les scribes cliniques d'IA sont conçus pour normaliser la parole, tandis que le dépistage cognitif computationnel s'appuie sur des motifs linguistiques comme la cohérence, le choix lexical, la structure syntaxique, les répétitions et les disfluences. ParaTrace mesure si ces objectifs entrent en conflit.",
        },
      },
      {
        label: {
          en: "METHOD",
          fr: "MÉTHODE",
        },
        body: {
          en:
            "The pipeline compares clinically labeled source transcripts with progressively rewritten versions across multiple LLM backends, then measures how linguistic biomarkers and downstream diagnostic classification change.",
          fr:
            "Le pipeline compare des transcriptions sources étiquetées cliniquement à des versions progressivement réécrites sur plusieurs backends LLM, puis mesure l'évolution des biomarqueurs linguistiques et de la classification diagnostique en aval.",
        },
      },
    ],
    repository: "https://github.com/cybr-wisp/paratrace-cym2026",
  },
  {
    number: "03",
    slug: "microgrid-ml",
    title: "MicroGrid ML",
    year: "2025 · REBUILT 2026",
    categories: [
      "AI / ML",
      "ENERGY SYSTEMS",
    ],
    summary: {
      en:
        "Machine learning for next-hour electricity forecasting and temporal microgrid fault-risk detection.",
      fr:
        "Apprentissage automatique pour la prévision électrique à une heure et la détection temporelle du risque de panne dans un micro-réseau.",
    },
    intro: {
      en:
        "MicroGrid ML asks two linked questions: what will residential electricity consumption look like in the next hour, and does the recent generation signal already contain evidence that a fault is emerging?",
      fr:
        "MicroGrid ML pose deux questions liées : à quoi ressemblera la consommation électrique résidentielle dans la prochaine heure, et le signal de production récent contient-il déjà des indices qu'une défaillance est en train d'apparaître ?",
    },
    tags: [
      "PYTORCH",
      "LSTM",
      "RANDOM FOREST",
      "FASTAPI",
    ],
    sections: [
      {
        label: {
          en: "FORECASTING",
          fr: "PRÉVISION",
        },
        body: {
          en:
            "A global PyTorch LSTM consumes 24 hours of normalized residential consumption and cyclical calendar features to predict next-hour electricity use, evaluated chronologically against a persistence baseline.",
          fr:
            "Un LSTM PyTorch global consomme 24 heures de consommation résidentielle normalisée et de variables calendaires cycliques afin de prévoir l'utilisation électrique de l'heure suivante, avec une évaluation chronologique contre une baseline de persistance.",
        },
      },
      {
        label: {
          en: "FAULT RISK",
          fr: "RISQUE DE PANNE",
        },
        body: {
          en:
            "A class-balanced Random Forest scores temporal degradation features derived from recent generation behavior. Evaluation holds out entire faulty households to test whether risk ranking generalizes beyond the households seen during training.",
          fr:
            "Une forêt aléatoire équilibrée par classe attribue un score à des caractéristiques de dégradation temporelle dérivées du comportement récent de la production. L'évaluation exclut des ménages défaillants entiers afin de tester si le classement du risque se généralise au-delà des ménages observés à l'entraînement.",
        },
      },
    ],
    repository: "https://github.com/cybr-wisp/microgrid-ml-cym2025",
  },
] satisfies readonly Project[];
