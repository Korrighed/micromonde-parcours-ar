// Credits affiches de la meme facon sur la carte et dans le widget de lecture.
// Une seule source : src/ui/credits.ts s'en sert pour le DOM.

export type Credit = {
  role: string
  name: string
}

export const CREDITS: Credit[] = [
  { role: 'Infrastructure du code', name: 'Alexis Boutin' },
  { role: 'Front et modèles 3D', name: 'Léandre Vigouroux' },
  { role: 'Carte Leaflet', name: 'Estelle Pochic' },
]
