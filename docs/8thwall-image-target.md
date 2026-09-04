# Image Target 8th Wall — shooting & setup

Procédure native 8th Wall (`@8thwall/image-target-cli`), pas d'outil externe. Sources en bas de page.

## 0. 8th Wall Desktop (app) — mode Non-Studio

Pour un projet custom (Vite/Three.js, pas Studio), l'app Desktop attend un dossier `image-targets/` à la racine du repo — en place (`image-targets/`).

**Reconnu dans l'interface de l'app** : `test-8th` apparaît dans l'onglet **Objectifs** du panneau de gauche (à côté de l'onglet "Fichiers"), avec la photo — l'app reconnaît bien le contenu de `image-targets/` comme image target. Le tracking fonctionne en conditions réelles sur mobile via notre intégration manuelle (`XR8.XrController.configure({ imageTargetData })` dans `src/main.ts`, §5).

Exigence minimale vérifiée : `npm run serve -- --port <N>` démarre Vite sur `<N>` (script `serve` dans `package.json`, testé avec `--port 8888`).

**Inspecteur d'asset** : 8th Wall Desktop reconnaît `src/assets/models/poc.glb` dans son panneau "Actifs" et propose un inspecteur (section "Modifier le maillage") avec pivot, taille de texture, simplification du maillage, et un champ **Échelle**. Modifier l'échelle depuis l'app réécrit directement le fichier `.glb` sur disque — effet visible immédiatement au reload (`npm run dev`), sans republier. C'est le réglage natif à utiliser pour dimensionner le modèle par rapport à la page, pas de code custom.

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

**Angle, distance, éclairage de prise de vue** : aucune doc officielle 8th Wall trouvée sur ces points précis. *Inconnu, à vérifier empiriquement.* Recommandation de bon sens en attendant : shoot perpendiculaire au sujet (limite la distorsion de perspective de la référence) et lumière diffuse sans flash direct — non sourcé.

### Orientation EXIF

Le CLI respecte nativement l'orientation EXIF (testé sur une photo verticale, Galaxy S25+, EXIF `orientation=upper-right` : thumbnail généré droit et lisible) — pas de pré-traitement/rotation manuelle nécessaire.

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

Notre cas (page de livre illustrée) : géométrie **plate**. Aucune de ces options ne fournit de taille physique réelle pour une géométrie plate (les paramètres cylindre/cône sont explicitement "scale-free", n'affectent pas le tracking) — `detail.scale` reçu sur `reality.imagefound` n'est donc pas calibré sur la taille réelle de la page imprimée ; la taille affichée dépend de l'échelle du `.glb`, à régler via l'inspecteur 8th Wall Desktop (§0).

## 4. Sorties générées

Le CLI produit dans le dossier cible :

- Métadonnées JSON (`imageTargetData`)
- Image originale
- Image de géométrie (cônes uniquement)
- Image recadrée
- Miniature 263×350
- Image luminance niveaux de gris 480×640

## 5. Intégration dans le code

L'exemple officiel utilise `require()` (pattern webpack) :

```js
XR8.XrController.configure({
  imageTargetData: [
    require('../image-targets/target1.json'),
  ],
})
```

**Piège avec Vite** : le champ `imagePath` du JSON est un chemin relatif brut (`image-targets/test-8th_luminance.jpg`) — le moteur le `fetch()` tel quel au runtime comme une URL HTTP. Sous Vite (pas de `require()`, pas de résolution automatique de ce chemin), ça ne pointe vers rien de servi. Solution appliquée dans `src/main.ts` : importer l'image en ES6 (`?url`, même pattern que le `.glb`) et écraser `imagePath` avec l'URL bundlée avant de passer l'objet à `configure()` :

```ts
import imageTargetData from '../image-targets/test-8th.json'
import imageTargetImageUrl from '../image-targets/test-8th_luminance.jpg?url'

imageTargetData.imagePath = imageTargetImageUrl

XR8.XrController.configure({ imageTargetData: [imageTargetData] })
```

**Positionnement du modèle** — pattern vérifié sur la source réelle de `xrextras-named-image-target` (`github.com/8thwall/web`, `xrextras/src/aframe/components/target-components.ts`), pas seulement la doc : le moteur émet des évènements `reality.imagefound` / `reality.imageupdated` / `reality.imagelost` sur un pipeline module (`listeners: [{event, process}]`), avec `detail.name`, `detail.position` (Vector3), `detail.rotation` (Quaternion), `detail.scale` (nombre). Implémenté dans `src/ar/worldScene.ts` : pose fixée une fois sur `imagefound` (position/quaternion/scale copiés + `visible = true`), objet caché sur `imagelost`. Le SLAM (world tracking, déjà actif) prend le relai pour garder l'objet ancré pendant que la caméra se déplace, sans re-synchroniser sur `imageupdated`.

## État vérifié sur ce repo

- Reconnaissance de l'image target sur mobile : fonctionnelle (apparition uniquement sur la bonne page, disparition en changeant de page, pas de faux positif sur les pages voisines)
- Target `test-8th` reconnu dans l'onglet Objectifs de 8th Wall Desktop (§0)
- World tracking (SLAM) + animation (`THREE.AnimationMixer`) : fonctionnels
- Échelle du modèle : réglable nativement via 8th Wall Desktop (§0)
- Deux targets enregistrés simultanément (`test-8th`, `poc-test2`) : pas d'interférence entre eux côté code (confirmé), mais `poc-test2` ne trackait pas au premier test — cause probable reflets/ombres sur la photo source (papier glacé/verni, éclairage direct), cf. exigence "pas de surface réfléchissante" en §1. À reshooter avec lumière diffuse avant de re-régénérer le target.

## Sources

- [image-target-cli README — GitHub (8thwall/8thwall)](https://github.com/8thwall/8thwall/blob/main/apps/image-target-cli/README.md)
- [Image Targets — 8th Wall docs](https://www.8thwall.com/docs/guides/image-targets/)
- [Image target best practices — 8th Wall Forum](https://forum.8thwall.com/t/image-target-best-practices/80)
