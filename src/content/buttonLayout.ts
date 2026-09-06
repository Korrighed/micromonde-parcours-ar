// Positions des boutons HUD sur l'image, exprimees en offsets locaux (memes unites
// que la pose recue sur reality.imagefound : appliques via rotation/scale/position
// du target, voir src/ar/worldScene.ts). A ajuster a l'oeil en testant sur la page
// imprimee — meme logique que le pivot/echelle des .glb regle via l'inspecteur
// 8th Wall Desktop (docs/8thwall-image-target.md §0).

export type Offset = { x: number; y: number }

export type ButtonKey = 'molecule' | 'histoire' | 'science' | 'animation'

// Identiques pour toutes les fresques (exigence produit).
export const MOLECULE_OFFSET: Offset = { x: 0.4, y: -0.4 } // bas-droite de l'image
export const ANIMATION_OFFSET: Offset = { x: 0, y: 0 } // centre, sur le modele

// Propres a chaque fresque : positions par defaut si non renseignees ci-dessous.
const DEFAULT_HISTOIRE_OFFSET: Offset = { x: -0.3, y: 0 }
const DEFAULT_SCIENCE_OFFSET: Offset = { x: 0.3, y: 0 }

const CUSTOM_OFFSETS: Record<string, { histoire: Offset; science: Offset }> = {
  'poc-tortue': {
    histoire: { x: -0.3, y: 0.2 },
    science: { x: 0.3, y: 0.35 },
  },
  'poc-peruche': {
    histoire: { x: -0.25, y: -0.1 },
    science: { x: 0.2, y: 0.3 },
  },
}

export const getOffsetsForTarget = (targetName: string): Record<ButtonKey, Offset> => {
  const custom = CUSTOM_OFFSETS[targetName]
  return {
    molecule: MOLECULE_OFFSET,
    animation: ANIMATION_OFFSET,
    histoire: custom?.histoire ?? DEFAULT_HISTOIRE_OFFSET,
    science: custom?.science ?? DEFAULT_SCIENCE_OFFSET,
  }
}
