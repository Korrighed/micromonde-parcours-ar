// Localisation GPS des fresques sur le campus UNC, affichees sur la carte (src/map/map.ts).
// Cles alignees sur les noms de target 8th Wall (voir fresques.ts / buttonLayout.ts) —
// un seul vocabulaire dans tout le projet.

export type FresqueLocation = {
  key: string
  name: string
  lat: number
  lng: number
  // false = fresque pas encore scannable (pas de target/contenu) : marqueur grise,
  // pas de lien vers le scan AR.
  available: boolean
}

export const FRESQUE_LOCATIONS: FresqueLocation[] = [
  { key: 'poc-hibiscus', name: 'Hibiscus', lat: -22.263152, lng: 166.403967, available: true },
  { key: 'poc-peruche', name: 'Perruche', lat: -22.263086, lng: 166.404496, available: true },
  { key: 'poc-tortue', name: 'Tortue', lat: -22.262283, lng: 166.405464, available: true },
]
