// Source de verite unique pour les textes/audio affiches dans le widget UI (src/ui/panel.ts).
// Cles alignees sur les noms de target 8th Wall utilises dans src/ar/worldScene.ts
// (TARGET_MODELS) : 'poc-tortue', 'poc-loriquet' — un seul vocabulaire dans tout le projet.
//
// Textes ci-dessous = contenus provisoires generes par IA a partir de sources (voir
// docs/CONTES-INSPIRATION.md) ; la mention "genere par IA" s'affiche sous chaque texte
// (CONTENT_NOTICE). A remplacer apres recherche de contenu (V2). Les "histoires" sont des
// contes inventes, pas des recits traditionnels kanak.
// Longueur : le panneau (src/ui/ui.css) doit afficher titre, texte, mention et credits
// sans defiler sur un petit telephone (360x640). Mesure du 26/10/2026 dans Chrome :
// jusqu'a environ 450 caracteres pour une histoire, 330 pour les autres.
// Fichiers audio a fournir par le crea dans public/assets/audio/ (non presents sur
// ce repo pour l'instant).

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
      text: 'La fresque montre la kératine, une protéine. C\'est elle qui forme les écailles de corne, appelées écussons, qui recouvrent la carapace de la tortue. Solide et légère, elle protège l\'animal comme une armure. C\'est la même famille de molécules que celle de nos ongles et de nos cheveux.',
      audioUrl: '/assets/audio/poc-tortue-molecule.mp3',
    },
    histoire: {
      text: 'Il y a longtemps, longtemps, une petite tortue sortit de son œuf, sur une plage éclairée par la lune. Devant elle, l\'océan semblait sans fin. « Où vas-tu ? » demanda un crabe. « Là où mes nageoires me porteront. » Elle traversa les courants, les récifs et les nuits sans étoiles. Des années plus tard, elle revint sur la même plage, guidée par une mémoire plus ancienne qu\'elle. « Le voyage ne s\'arrête jamais, dit-elle au crabe. Il se transmet. »',
      audioUrl: '/assets/audio/poc-tortue-histoire.mp3',
    },
    science: {
      text: 'Dans la culture kanak, la tortue marine est un animal totémique, lié aux ancêtres. Aux îles Loyauté, la province a reconnu la tortue marine et le requin comme sujets de droit. Côté biologie, la tortue verte adulte se nourrit surtout d\'herbiers et d\'algues, et les femelles reviennent pondre sur les plages où elles sont nées.',
      audioUrl: '/assets/audio/poc-tortue-science.mp3',
    },
  },
  'poc-loriquet': {
    molecule: {
      text: 'La fresque montre les molécules qui colorent le plumage. La mélanine donne les teintes sombres. Pour le rouge et le jaune, l\'artiste évoque les caroténoïdes ; chez les perroquets, les études décrivent plutôt des pigments propres, les psittacofulvines. Le bleu, lui, vient de la structure même de la plume.',
      audioUrl: '/assets/audio/poc-loriquet-molecule.mp3',
    },
    histoire: {
      text: 'Un matin, dans la forêt, tous les oiseaux se réveillèrent gris : la nuit avait emporté leurs couleurs. Le petit loriquet ne s\'inquiéta pas. Il vola de fleur en fleur et goûta le nectar de l\'hibiscus rouge. À chaque gorgée, une plume reprenait vie : la tête bleue, la poitrine orange, les ailes vertes. Puis il chanta si fort que tous les oiseaux l\'entendirent : les couleurs se partagent. Chacun retrouva une plume brillante.',
      audioUrl: '/assets/audio/poc-loriquet-histoire.mp3',
    },
    science: {
      text: 'Le loriquet à tête bleue vit en Nouvelle-Calédonie et aux îles Loyauté. Il appartient à la sous-espèce deplanchii, décrite en 1860. Sa langue en forme de pinceau lui permet de récolter le nectar et le pollen des fleurs, comme celles de l\'hibiscus.',
      audioUrl: '/assets/audio/poc-loriquet-science.mp3',
    },
  },
  'poc-hibiscus': {
    molecule: {
      text: 'La fresque montre la cyanidine, un pigment de la famille des anthocyanes. Cette molécule donne leurs teintes rouges, roses et pourpres à de nombreuses fleurs tropicales. Sa couleur change avec l\'acidité : plus rouge en milieu acide, plus bleue en milieu basique.',
      audioUrl: '/assets/audio/poc-hibiscus-molecule.mp3',
    },
    histoire: {
      text: 'Dans les jardins et le long des chemins de Nouvelle-Calédonie, l\'hibiscus rouge ouvre sa corolle comme un signe d\'accueil. Cette fleur, proche du bourao des rivages, appartient à une même famille que les Kanak connaissent par l\'usage autant que par le regard. Le bourao fournit en effet une écorce fibreuse, que l\'on tord en liens pour la case, la pêche et les assemblages de bois. La fleur d\'hibiscus, elle, vient orner les cheveux et les cérémonies, lorsque l\'on veut honorer un hôte ou marquer un moment de coutume. C\'est pourquoi elle circule de main en main, légère et pourtant chargée de sens. Elle rappelle que, dans ce pays, la beauté d\'une plante ne se sépare pas du geste qui la cueille, ni de la parole qui l\'accompagne.',
      audioUrl: '/assets/audio/poc-hibiscus-histoire.mp3',
    },
    science: {
      text: 'Le bourao (Hibiscus tiliaceus) est un hibiscus des rivages. En pays kanak, son écorce fibreuse sert à fabriquer des jupes de danse et des filets de pêche. Son nom vient d\'un mot kanak, purau.',
      audioUrl: '/assets/audio/poc-hibiscus-science.mp3',
    },
  },
}
