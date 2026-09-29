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

// Mention affichee sous chaque texte du widget (src/ui/panel.ts). Une seule
// formule pour toutes les fresques et tous les types de contenu.
export const CONTENT_NOTICE =
  'Ce contenu est généré à l\'aide de l\'IA et pourrait contenir des erreurs ou des imprécisions.'

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
  'poc-hibiscus': {
    molecule: {
      text: 'PLACEHOLDER — composition moleculaire en lien avec l\'hibiscus (ex: pigments/anthocyanes des petales). A valider par l\'equipe contenu.',
      audioUrl: '/assets/audio/poc-hibiscus-molecule.mp3',
    },
    histoire: {
      text: 'Dans les jardins et le long des chemins de Nouvelle-Calédonie, l\'hibiscus rouge ouvre sa corolle comme un signe d\'accueil. Cette fleur, proche du bourao des rivages, appartient à une même famille que les Kanak connaissent par l\'usage autant que par le regard. Le bourao fournit en effet une écorce fibreuse, que l\'on tord en liens pour la case, la pêche et les assemblages de bois. La fleur d\'hibiscus, elle, vient orner les cheveux et les cérémonies, lorsque l\'on veut honorer un hôte ou marquer un moment de coutume. C\'est pourquoi elle circule de main en main, légère et pourtant chargée de sens. Elle rappelle que, dans ce pays, la beauté d\'une plante ne se sépare pas du geste qui la cueille, ni de la parole qui l\'accompagne.',
      audioUrl: '/assets/audio/poc-hibiscus-histoire.mp3',
    },
    science: {
      text: 'PLACEHOLDER — fait scientifique sur la flore locale (hibiscus, especes endemiques). A valider par l\'equipe contenu.',
      audioUrl: '/assets/audio/poc-hibiscus-science.mp3',
    },
  },
}
