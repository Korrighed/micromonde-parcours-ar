# Direction artistique — MicroMonde

Charte graphique du projet : palette, typographie, et règle d'implémentation. Sert
de référence commune (dev / créa) — toute évolution de la DA se fait ici, puis dans
[`src/ui/variables.css`](src/ui/variables.css) (voir § Règle d'implémentation).

## Palette

Style bois / nature. Trois couleurs principales, le reste en usage secondaire/accent.

| Nom | Hex | Usage |
|---|---|---|
| **Deep Olive** | `#3F452F` | Principale — fonds sombres (widget, overlays) |
| **Warm Taupe** | `#8E7F6B` | Principale |
| **Natural Wood** | `#7A5A3A` | Principale — accents (ex. bouton d'action) |
| Sand Beige | `#E7E1D6` | Secondaire — fonds clairs, texte sur fond sombre |
| Olive Gray | `#8A8F6E` | Secondaire |
| Moss Green | `#5B6147` | Secondaire |
| Dark Wood | `#4A3626` | Secondaire — texte/icônes sur fond clair |

## Typographie

Deux polices Google Fonts, chargées dans [`index.html`](index.html) :

- **Titres** : [Fleur De Leah](https://fonts.google.com/specimen/Fleur+De+Leah) (manuscrite).
- **Texte / UI** : [Quicksand](https://fonts.google.com/specimen/Quicksand) — de préférence en **light (300)** quand le texte est sous un titre.

> Note : la demande initiale mentionnait "General Sans", qui n'est en réalité pas
> une Google Font (distribuée par Fontshare, licence excluant l'auto-hébergement
> sans accord écrit). Quicksand la remplace : même usage, vraie Google Font.

## Règle d'implémentation : une seule source de couleurs

**Aucune couleur ne doit être écrite en dur** dans le CSS ou le HTML du projet, à
l'exception d'un seul fichier : [`src/ui/variables.css`](src/ui/variables.css).

- Toute couleur de la palette ci-dessus y est déclarée en variable CSS (`--color-...`).
- Tout le reste du projet (`ui.css`, icônes SVG inline dans `index.html`, futurs
  composants) référence ces variables (`var(--color-...)`), jamais un code hex direct.
- Les icônes SVG utilisent `stroke="currentColor"` / `fill="currentColor"` : la
  couleur vient du CSS (`color: var(--color-...)` sur le bouton parent).
- Les polices suivent le même principe (`--font-heading`, `--font-body`).

Objectif : changer la charte graphique (couleurs ou typo) ne demande de modifier
qu'un seul fichier.
