# Image Target 8th Wall — shooting & setup

Procédure native 8th Wall (`@8thwall/image-target-cli`), pas d'outil externe. Sources en bas de page.

## 0. 8th Wall Desktop (app) — mode Non-Studio

Pour un projet custom (Vite/Three.js, pas Studio), l'app Desktop attend un dossier `image-targets/` à la racine du repo — fait sur ce repo (déplacé depuis `public/assets/targets/`). **Non documenté** : est-ce qu'on y dépose la photo source brute (l'app génère elle-même le tracking) ou les fichiers déjà produits par `image-target-cli` (json, cropped, luminance, thumbnail) ? Recherché sur la doc officielle et les exemples GitHub du projet, sans réponse trouvée. *Inconnu, à vérifier à l'installation réelle de l'app* — en attendant, les deux (photo source `test-8th.jpg` + sortie complète du CLI) sont dans `image-targets/`, à trier une fois l'app testée.

Exigence minimale confirmée et vérifiée sur ce repo : `npm run serve -- --port <N>` doit démarrer Vite sur `<N>` (script `serve` ajouté dans `package.json`, testé OK avec `--port 8888`).

## 1. Exigences sur l'image source

Vérifiées sur la doc 8th Wall officielle :

- Format : `.jpg`, `.jpeg` ou `.png`
- Dimensions : min 480×640 px, max 2048 px sur le plus grand côté — au-delà, le CLI redimensionne automatiquement en conservant le ratio (pas de resize manuel nécessaire)
- Pas de surface réfléchissante (les reflets cassent le suivi)
- Contraste élevé, détail riche et **non répétitif** (pas de page de texte pur, pas de motif qui se répète)
- Espace blanc minimal
- Préférer une vraie photo/illustration à un logo ou du vectoriel
- Limiter le texte — il perturbe le traitement des features
- Géométrie supportée : plate, cylindrique, conique (voir §3)

**Angle, distance, éclairage de prise de vue** : aucune doc officielle 8th Wall trouvée sur ces points précis (recherchée sur `8thwall.com/docs`, forum, blog — articles historiques dépubliés suite à la migration `8thwall.org`). *Inconnu, à vérifier empiriquement.* Recommandation de bon sens en attendant : shoot perpendiculaire au sujet (limite la distorsion de perspective de la référence) et lumière diffuse sans flash direct — non sourcé, à confirmer au premier test réel.

### Orientation EXIF

**Résolu empiriquement (2026-09-04)** : testé sur `image-targets/test-8th.jpg` (photo verticale, Galaxy S25+, EXIF `orientation=upper-right`). Le thumbnail généré (`test-8th_thumbnail.jpg`) est droit, lisible, orientation portrait correcte. Le CLI respecte nativement l'orientation EXIF — pas de pré-traitement/rotation manuelle nécessaire.

## 2. Utilisation du CLI

```bash
npx @8thwall/image-target-cli@latest
```

Le CLI enchaîne 3 prompts interactifs :

1. Chemin de l'image source (ex: `image-targets/test-8th.jpg`)
2. Type de crop — centré automatique, ou personnalisé (offsets `top`/`left` + dimensions `width`/`height`)
3. Dossier de destination + nom du target

## 3. Options de géométrie

| Géométrie | Paramètres requis |
|---|---|
| Plate (défaut) | Crop centré ou manuel |
| Cylindrique | Circonférence du cylindre + largeur de la cible (unité mm/pouces indifférente, n'affecte pas le tracking) |
| Conique | Rayon externe, rayon interne, angle couvert, sens (plus large en haut/bas) — crop appliqué sur l'image aplatie |

Notre cas (page de livre illustrée) : géométrie **plate**.

## 4. Sorties générées

Le CLI produit dans le dossier cible :

- Métadonnées JSON (`imageTargetData`)
- Image originale
- Image de géométrie (cônes uniquement)
- Image recadrée
- Miniature 263×350
- Image luminance niveaux de gris 480×640

## 5. Intégration dans le code

```js
XR8.XrController.configure({
  imageTargetData: [
    require('../image-targets/target1.json'),
  ],
})
```

Le champ `imagePath` du JSON pointe vers l'image utilisée par le moteur pour l'extraction des features au runtime.

## Sources

- [image-target-cli README — GitHub (8thwall/8thwall)](https://github.com/8thwall/8thwall/blob/main/apps/image-target-cli/README.md)
- [Image Targets — 8th Wall docs](https://www.8thwall.com/docs/guides/image-targets/)
- [Image target best practices — 8th Wall Forum](https://forum.8thwall.com/t/image-target-best-practices/80)
