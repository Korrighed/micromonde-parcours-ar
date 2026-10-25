# Design brief — MicroMonde

Statut : brouillon (à valider)
Sources : [DA.md](../DA.md) (source de vérité de la charte), `src/ui/variables.css`, `src/ui/ui.css`, `src/map/map.css`, `index.html`, captures et vidéos d'essai.

La charte (palette, typographie, règle « aucune couleur en dur ») est décrite dans [DA.md](../DA.md). Ce document ne la recopie pas : il la relie aux composants et mesure ce qui peut l'être.

Crédit : la direction artistique de l'interface, les classes CSS et les trois modèles 3D sont l'œuvre de Léandre Vigouroux.

## 1. Intention

Style bois et nature, en harmonie avec les fresques : tons olive, taupe et bois, texte clair sur fond sombre dans les panneaux. L'interface reste discrète : elle se superpose à la fresque et au modèle 3D sans les masquer. Elle sert une expérience visuelle, auditive et spatiale ; la technologie s'efface au profit de l'œuvre.

## 2. Références visuelles

| Référence | Ce qu'on en garde |
|---|---|
| Les fresques de Kuby Kolor | Couleurs vives de l'œuvre : l'interface adopte des tons neutres pour ne pas entrer en concurrence |
| Moodboard de [DA.md](../DA.md) | Palette bois / nature, deux polices |
| Maquettes Figma de la fiche projet | Points d'intérêt circulaires, panneau qui monte du bas |

## 3. Fondations

### Couleurs

Valeurs lues dans `src/ui/variables.css`. Contrastes calculés le 26/10/2026 (rapport de luminance WCAG) sur les couleurs **opaques** ; les fonds translucides du code (92 % et 96 %) donnent des valeurs proches, non mesurées.

| Token | Valeur | Usage | Contraste |
|---|---|---|---|
| `--color-deep-olive` | `#3f452f` | Fond du panneau et du popup de carte | Texte `--color-sand-beige` dessus : **7,67:1** |
| `--color-sand-beige` | `#e7e1d6` | Fonds clairs des boutons, texte sur fond sombre | Icône `--color-dark-wood` dessus : **8,74:1** |
| `--color-natural-wood` | `#7a5a3a` | Bouton lecture 3D, bouton « Scanner », marqueurs | Sable dessus : **4,82:1** |
| `--color-dark-wood` | `#4a3626` | Icônes sur fond clair, position de l'utilisateur | — |
| `--color-warm-taupe` | `#8e7f6b` | Couleur principale, peu utilisée dans l'interface | non mesuré |
| `--color-moss-green` | `#5b6147` | Secondaire | non mesuré |
| `--color-olive-gray` | `#8a8f6e` | Marqueur « bientôt » (inutilisé : les 3 fresques sont disponibles) | **2,59:1** sur sable : sous le seuil de 3:1 |

Tokens sémantiques (`--color-icon`, `--color-panel-bg`, `--color-map-pin`, etc.) : composés à partir de la palette, voir `variables.css`.

### Typographie

| Rôle | Police | Taille / graisse | Repli |
|---|---|---|---|
| Titres (panneau, popup de carte) | Fleur De Leah | — | `cursive` |
| Texte et interface | Quicksand, de préférence en light (300) sous un titre | — | `sans-serif` |

Chargement : Google Fonts, dans `index.html` et `map.html`. Variables `--font-heading` et `--font-body`. Voir [DA.md](../DA.md) pour le remplacement de « General Sans ».

### Textures, images, icônes

| Ressource | Format | Poids | Chemin |
|---|---|---|---|
| Icônes de l'interface | SVG en `currentColor` | léger | `src/ui/icons/` et SVG en ligne dans `index.html` |
| Modèle de la tortue | `.glb` (Draco) | 2,4 Mo | `src/assets/models/poc-turtlev2.glb` |
| Modèle du loriquet | `.glb` (Draco) | 6,4 Mo | `src/assets/models/poc-parrotv2.glb` |
| Modèle de l'hibiscus | `.glb` (Draco) | 1,0 Mo | `src/assets/models/Hibiscus_lowpoly.glb` |

## 4. Composants

| Composant | Rôle | Taille | Notes |
|---|---|---|---|
| Bouton de contenu du HUD (×3) | Ouvre molécule, histoire ou science | 56 px, icône 26 px | Ancré sur un point de l'image. Icônes : molécule, livre ouvert, feuille |
| Bouton lecture 3D | Fait apparaître l'animal | 64 px | Fond bois, au centre de l'image. Masqué quand le modèle est visible |
| Croix de fermeture 3D | Masque le modèle | 40 px | Haut droite de l'écran. Sous 44 px |
| Panneau de contenu | Titre, texte, mention IA, crédits | plein écran | Fond olive profond, texte sable. Défilement intérieur |
| Bouton audio | Lecture et arrêt | 56 px | À cheval sur le bord haut du panneau. État de lecture : opacité |
| Croix du panneau | Ferme le panneau | 32 px | Sous 44 px |
| Bouton carte (scan) | Ouvre `map.html` | 48 px | Masqué quand le panneau est ouvert |
| Marqueur de carte | Une fresque | 32 × 42 px | Épingle SVG classique. La fiche projet prévoit une croix de carte au trésor (V2) |
| Popup de carte | Nom + « Scanner » | — | Fond olive profond |
| Bouton « Scanner une fresque » | Ouvre le scan | — | Bas de la carte |
| Bouton de recentrage | Recentre sur la position | 48 px | Caché tant qu'aucune position n'est reçue |

États de survol, de focus et désactivé : non définis (interface tactile uniquement).

## 5. Mise en page et responsive

| Point de rupture | Comportement |
|---|---|
| Mobile (usage cible) | Viewport verrouillé (pas de zoom de la page). Zones sûres (`safe-area`) prises en compte pour la croix 3D |
| Desktop | Non conçu |

Hauteur du panneau : toute la hauteur de la fenêtre, avec le bouton audio à cheval sur son bord haut (`--panel-top-offset`).

## 6. Mouvement

- Modèles 3D animés : tortue (nage et lumière de l'eau), loriquet (vol), hibiscus (rotations et déplacements, sans la piste d'échelle).
- Aucune règle `prefers-reduced-motion` dans le code lu : à vérifier.

## 7. Accessibilité

- Contraste du texte du panneau : 7,67:1 (seuil 4,5:1 atteint). Marqueur « bientôt » sous 3:1, mais non utilisé.
- Éléments interactifs étiquetés (`aria-label`). Focus visible : non vérifié.
- Cibles tactiles sous 44 px : croix 3D (40 px), croix du panneau (32 px).
- Le texte accompagne toujours l'audio.

## 8. Questions ouvertes

- Faut-il agrandir les deux croix de fermeture à 44 px au moins ?
- Le marqueur en croix de carte au trésor est-il prévu pour la V2 ?
- Les figures du dossier (captures, stills) : les meilleures images arrivent, à insérer à ce moment.
