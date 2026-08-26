import type { Note } from "@/types/content";

export const notes = [
  {
    slug: "today-models-do-more",
    date: "2026-08-25",
    displayDate: "25.08.26",

    title: {
      en: "today, MODELS do more",
      fr: "aujourd'hui, les MODÈLES font plus",
    },

    excerpt: {
      en:
        "Visual reasoning is not necessarily harder than language reasoning. It may simply be structured differently.",
      fr:
        "Le raisonnement visuel n'est pas nécessairement plus difficile que le raisonnement linguistique. Il est peut-être simplement structuré autrement.",
    },

    body: {
      en: [
        "i keep coming back to this: visual reasoning is not necessarily harder than language reasoning. it may simply expose structure in a different way.",
        "language arrives already serialized. an image does not. relationships are spatial, simultaneous, and often implicit. the model has to decide what deserves sequence before it can reason about the sequence.",
        "the interesting systems will probably be the ones that stop treating images as attachments to text and start treating both as different views over the same underlying problem.",
      ],

      fr: [
        "je reviens souvent à cette idée : le raisonnement visuel n'est pas nécessairement plus difficile que le raisonnement linguistique. il expose peut-être simplement la structure d'une autre manière.",
        "le langage arrive déjà sérialisé. une image, non. les relations sont spatiales, simultanées et souvent implicites. le modèle doit décider ce qui mérite une séquence avant de pouvoir raisonner sur cette séquence.",
        "les systèmes les plus intéressants seront probablement ceux qui cesseront de traiter les images comme des pièces jointes au texte et considéreront les deux comme des vues différentes du même problème.",
      ],
    },
  },

  {
    slug: "failure-before-failure",
    date: "2026-08-18",
    displayDate: "18.08.26",

    title: {
      en: "failure before FAILURE",
      fr: "la panne avant la PANNE",
    },

    excerpt: {
      en:
        "A system becoming unhealthy is often more interesting than the instant at which it finally breaks.",
      fr:
        "Un système qui devient instable est souvent plus intéressant que l'instant précis où il finit par tomber en panne.",
    },

    body: {
      en: [
        "the instant a system fails is usually easy to label. what interests me more is the region immediately before it.",
        "signals drift. latency changes. confidence falls. distributions stop looking familiar. individually, none of those observations may constitute failure.",
        "early-warning systems live in that ambiguity. the problem is not detecting a broken system. it is deciding when a system is becoming different enough that the difference matters.",
      ],

      fr: [
        "l'instant où un système tombe en panne est généralement facile à étiqueter. ce qui m'intéresse davantage est la région juste avant.",
        "les signaux dérivent. la latence change. la confiance diminue. les distributions cessent de sembler familières. individuellement, aucune de ces observations ne constitue nécessairement une panne.",
        "les systèmes d'alerte précoce vivent dans cette ambiguïté. le problème n'est pas de détecter un système cassé, mais de décider quand il devient suffisamment différent pour que cette différence compte.",
      ],
    },
  },

  {
    slug: "the-interface-is-part-of-the-system",
    date: "2026-08-11",
    displayDate: "11.08.26",

    title: {
      en:
        "the INTERFACE is part of the system",
      fr:
        "l'INTERFACE fait partie du système",
    },

    excerpt: {
      en:
        "Interfaces are not decoration around engineering decisions. They are where those decisions become visible.",
      fr:
        "Les interfaces ne sont pas une décoration autour des décisions d'ingénierie. C'est là que ces décisions deviennent visibles.",
    },

    body: {
      en: [
        "an interface is where hidden system decisions become observable.",
        "latency, uncertainty, retries, ordering, state transitions, permissions — eventually all of them leak into what a person sees.",
        "good interface work is therefore not separate from systems work. it is one of the places where the system is forced to explain itself.",
      ],

      fr: [
        "une interface est l'endroit où les décisions cachées d'un système deviennent observables.",
        "latence, incertitude, nouvelles tentatives, ordre, transitions d'état, permissions — elles finissent toutes par apparaître dans ce qu'une personne voit.",
        "le travail d'interface n'est donc pas séparé du travail système. c'est l'un des endroits où le système est forcé de s'expliquer.",
      ],
    },
  },

  {
    slug: "le-code-est-une-langue",
    date: "2026-08-04",
    displayDate: "04.08.26",

    title: {
      en: "Le code est une LANGUE",
      fr: "Le code est une LANGUE",
    },

    excerpt: {
      en:
        "Good software has grammar, rhythm, omission, emphasis, and an idea of what does not need to be said.",
      fr:
        "Un bon logiciel possède une grammaire, un rythme, des omissions, des accents et une idée de ce qui n'a pas besoin d'être dit.",
    },

    body: {
      en: [
        "code has grammar, but more importantly it has emphasis.",
        "a useful abstraction tells the reader what matters. a bad one makes every detail equally loud.",
        "the code i like most feels edited. there are fewer things present, but the remaining things carry more meaning.",
      ],

      fr: [
        "le code possède une grammaire, mais surtout une notion d'accent.",
        "une abstraction utile indique au lecteur ce qui compte. une mauvaise abstraction rend chaque détail également bruyant.",
        "le code que je préfère semble édité. moins de choses sont présentes, mais celles qui restent portent davantage de sens.",
      ],
    },
  },
] satisfies readonly Note[];