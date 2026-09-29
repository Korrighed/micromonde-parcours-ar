// Source de verite unique pour les textes/audio affiches dans le widget UI (src/ui/panel.ts).
// Cles alignees sur les noms de target 8th Wall utilises dans src/ar/worldScene.ts
// (TARGET_MODELS) : 'poc-tortue', 'poc-peruche' — un seul vocabulaire dans tout le projet.
//
// Textes ci-dessous = PLACEHOLDER, a valider/remplacer par l'equipe contenu scientifique
// avant la Nuit de la Science. Fichiers audio a fournir par le crea dans
// public/assets/audio/ (non presents sur ce repo pour l'instant).

export type ContentKey = 'molecule' | 'histoire' | 'science'

// Titre affiche au-dessus du texte dans le widget (src/ui/panel.ts), en Fleur De
// Leah (voir DA.md). Un seul mapping par type de contenu — identique pour toutes
// les fresques (pas de duplication dans FRESQUE_CONTENT ci-dessous).
export const CONTENT_TITLES: Record<ContentKey, string> = {
  molecule: 'Molécule',
  histoire: 'Histoire traditionnelle',
  science: 'Fait scientifique',
}

export type ContentBlock = {
  text: string
  audioUrl: string
}

export type FrescueContent = Record<ContentKey, ContentBlock>

export const FRESQUE_CONTENT: Record<string, FrescueContent> = {
  'poc-tortue': {
    molecule: {
      text: 'PLACEHOLDER — composition moleculaire en lien avec la tortue (ex: kerabatine de la carapace). A valider par l\'equipe contenu.',
      audioUrl: '/assets/audio/poc-tortue-molecule.mp3',
    },
    histoire: {
      text: 'PLACEHOLDER — histoire traditionnelle kanak/caledonienne en lien avec la tortue. A valider par l\'equipe contenu.',
      audioUrl: '/assets/audio/poc-tortue-histoire.mp3',
    },
    science: {
      text: 'PLACEHOLDER — fait scientifique sur la faune (tortue marine, especes locales). A valider par l\'equipe contenu.',
      audioUrl: '/assets/audio/poc-tortue-science.mp3',
    },
  },
  'poc-peruche': {
    molecule: {
      text: 'PLACEHOLDER — composition moleculaire en lien avec la peruche (ex: pigments des plumes). A valider par l\'equipe contenu.',
      audioUrl: '/assets/audio/poc-peruche-molecule.mp3',
    },
    histoire: {
      text: 'PLACEHOLDER — histoire traditionnelle en lien avec la peruche. A valider par l\'equipe contenu.',
      audioUrl: '/assets/audio/poc-peruche-histoire.mp3',
    },
    science: {
      text: 'PLACEHOLDER — fait scientifique sur la faune/flore locale (peruche, especes endemiques). A valider par l\'equipe contenu.',
      audioUrl: '/assets/audio/poc-peruche-science.mp3',
    },
  },
}
