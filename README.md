# MicroMonde — Parcours AR fresques UNC

PoC technique du parcours AR sur les fresques du campus UNC (Nouvelle-Calédonie), pour la Nuit de la Science, **7 octobre 2026**.

## Objectif du PoC

Valider qu'un modèle 3D (la tortue, avec animations) peut apparaître au scan d'une fresque et rester **ancré dans l'espace réel** pendant que l'utilisateur tourne autour avec son téléphone — sans application à installer, dans le navigateur.

## Stack

| Brique | Choix | Pourquoi |
|---|---|---|
| Bundler | Vite | Sortie statique, compatible hébergement Netlify direct |
| Langage | TypeScript | Projet amené à grossir (3 fresques, logique de progression) |
| Moteur AR | **8th Wall Engine** | Image target + SLAM/world tracking en navigateur, gratuit et self-hosted depuis la fermeture de la plateforme payante le 28/02/2026 |
| Rendu 3D | Three.js | Intégré nativement au pipeline 8th Wall |
| Carte | Leaflet | Posée en dépendance, pas encore intégrée (parcours entre fresques) |
| Hébergement | Netlify | Site statique, HTTPS automatique (requis pour l'accès caméra) |
| CI | GitHub Actions | Build sur PR/push vers `main`/`dev` |

### Pourquoi pas MindAR ni Vuforia

- **MindAR** (choix initial) : tracking image-plane pur, pas de SLAM. Le modèle décroche si le marker sort du champ caméra — incompatible avec l'interaction "faire le tour" demandée.
- **Vuforia** (piste créa) : plugin Unity natif. Pas de WebGL fonctionnel avec accès caméra (vérifié — la caméra ne s'active pas en export WebGL). Casse la contrainte "pas d'appli à installer".
- **8th Wall** : seule option qui combine image target + SLAM directement dans le navigateur, sans app native.

## Architecture

```
src/
  ar/           logique AR (pipeline modules XR8 + Three.js)
  ui/           HUD (4 boutons ronds ancrés sur l'image) + widget bottom-sheet + variables.css (couleurs/typo, source unique — voir DA.md)
  map/          carte Leaflet (à venir)
  content/      textes par fresque (molecule/histoire/science) + positions des boutons, cle = nom de target 8th Wall
  progress/     état de progression localStorage (à venir)
  assets/
    models/     modèles 3D (fournis par le créa), importés en ES6 (`?url`), bundlés/hashés au build
image-targets/   photo source + fichiers générés par @8thwall/image-target-cli, à la racine (exigence 8th Wall Desktop, mode Non-Studio)
public/
  assets/
    audio/      pistes audio des légendes/contenus scientifiques (fichiers à fournir par le créa, structure en place)
```

Direction artistique (palette, typographie, règle "pas de couleur en dur hors `variables.css`") : voir [DA.md](DA.md).

**Widget contenu (molécule / histoire / science)** : sur reconnaissance d'un target, un HUD de 4 boutons ronds apparaît (`src/ui/hud.ts`) : 3 boutons ancrés sur des points de l'image (molécule systématiquement en bas-droite, histoire/science positionnés différemment par fresque via `src/content/buttonLayout.ts`), chacun ouvrant un widget plein écran (titre + texte + lecture audio optionnelle, `src/ui/panel.ts`) qui occupe toute la hauteur de la fenêtre (le bouton audio, à cheval sur son bord haut, atteint le haut de l'écran — voir `--panel-top-offset` dans `src/ui/variables.css`). Le 4e bouton, au centre (sur le modèle), révèle manuellement le modèle 3D — celui-ci reste caché à la détection tant qu'il n'a pas été pressé. Une fois révélé, ce bouton se cache (il se superposerait au modèle) et une croix fixe en haut à droite de l'écran (`#hud-close-3d`) permet de le refermer.

Positions calculées par projection 3D → écran (`Vector3.project(camera)`, caméra exposée par `XR8.Threejs.xrScene()`) dans `src/ar/worldScene.ts`, transmises au HUD via un callback (`setButtonPositionListener`) — seul point de couplage `ui/` → `ar/`, dans ce sens uniquement. Données textuelles/audio/positions centralisées dans `src/content/` (clé = nom de target, ex. `poc-tortue`) — textes et offsets actuellement en placeholder, à valider/ajuster par l'équipe contenu et en testant sur la page imprimée.

Pas de backend : progression stockée en `localStorage`, tout le reste est statique.

## Intégration 8th Wall — ce qui a été vérifié

Le moteur se charge en **script CDN**, pas en import npm (pattern confirmé sur le code source réel de `github.com/8thwall/threejs-world-effects-example`, pas seulement la doc) :

```html
<script src="https://cdn.jsdelivr.net/npm/@8thwall/engine-binary@1/dist/xr.js" async crossorigin="anonymous" data-preload-chunks="slam"></script>
<script src="https://cdn.jsdelivr.net/npm/@8thwall/xrextras@1/dist/xrextras.js" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/@8thwall/landing-page@1/dist/landing-page.js" crossorigin="anonymous"></script>
```

Aucun compte, aucune clé d'app requise (modèle gratuit post-28/02/2026).

Pipeline : `XR8.addCameraPipelineModules([...])` avec `XR8.Threejs.pipelineModule()` + `XR8.XrController.pipelineModule()` (active le SLAM) + notre module `worldScenePipelineModule` (`src/ar/worldScene.ts`), lancé via `XR8.run({canvas})`.

**Fait dans ce PoC** : modèle 3D (`src/assets/models/poc.glb`, export Blender, importé en ES6 et chargé via `GLTFLoader`) ancré en world tracking (SLAM) + image target. Le modèle reste caché (`visible = false`) tant que la page `image-targets/test-8th.jpg` n'est pas scannée ; `XR8.XrController.configure({ imageTargetData: [...] })` câblé dans `main.ts`, pose fixée une fois sur l'évènement `reality.imagefound` puis le SLAM prend le relai pour l'ancrage. Animation jouée via `THREE.AnimationMixer` si le `.glb` en contient une.

**Validé sur téléphone (Android/Chrome)** : world tracking, animation, et reconnaissance de l'image target fonctionnels — le modèle apparaît uniquement sur la bonne page, disparaît en changeant de page, aucun faux positif sur les pages voisines. L'échelle du modèle se règle nativement via l'inspecteur d'asset de 8th Wall Desktop (§ ci-dessous), pas de code custom. Détail complet : [docs/8thwall-image-target.md](docs/8thwall-image-target.md).

**Pas encore fait** : un seul target (`test-8th`) est enregistré — comportement avec plusieurs pages/targets simultanés non testé.

## Lancer en local

```bash
npm install
npm run dev -- --port 8888
```

Port `8888` requis pour la reconnaissance du projet par 8th Wall Desktop (voir section ci-dessous et [docs/8thwall-image-target.md](docs/8thwall-image-target.md) §0).

Accès caméra = contexte sécurisé obligatoire (HTTPS, `localhost` ou IP LAN via certificat). `vite.config.ts` embarque `@vitejs/plugin-basic-ssl` pour ça.

### 8th Wall Desktop (app)

[8th Wall Desktop](https://8thwall.org/downloads) — Mac et Windows uniquement, pas de Linux. Utile pour ce projet en **mode Non-Studio** (notre projet est un Vite/Three.js custom, pas un projet créé via leur Studio) :

- AR Simulator + Device Connect (test sans téléphone physique)
- Gestion d'assets en GUI — inspecteur de mesh (`src/assets/models/poc.glb`) avec pivot, taille de texture, simplification, **échelle** : modifie le fichier `.glb` directement, effet immédiat au reload

**Structure alignée sur les exigences Non-Studio** : `src/assets/` pour les modèles, `image-targets/` à la racine sans sous-dossier, script `npm run serve -- --port <N>`. **Non documenté officiellement** : le contenu exact attendu dans `image-targets/` (photo source brute vs fichiers déjà générés par `image-target-cli`) — les deux (source + sortie du CLI) y sont en attendant clarification. Détail complet : [docs/8thwall-image-target.md](docs/8thwall-image-target.md).

### Tester sur téléphone

1. Téléphone et PC sur le même réseau (même wifi, ou PC en hotspot avec le téléphone connecté dessus).
2. `npm run dev` affiche une URL réseau du type `https://<IP-LAN>:5173/` — utiliser l'interface Wi-Fi, pas les `vEthernet` (WSL/Hyper-V, non joignables depuis l'extérieur).
3. Ouvrir cette URL sur le téléphone. Certificat auto-signé → accepter l'avertissement navigateur.
4. Autoriser l'accès caméra.
5. Test : le cube doit rester ancré dans l'espace en se déplaçant/tournant autour, pas collé à l'écran.

Si la page ne charge pas depuis le téléphone : vérifier que le pare-feu Windows autorise Node.js sur réseau privé.

## Risque calendaire

Planning initial (29/07) prévoyait 10 semaines. État réel au 01/09 : ~5 semaines restantes, PoC en cours de validation. Détail dans `reflexion/dates-planning.md` (repo de réflexion projet, hors de ce dépôt de code).

## CI/CD

- **CI** (`.github/workflows/ci.yml`) : `npm run build` sur PR et push vers `main`/`dev`.
- **CD** : Netlify, déploiement git natif. `dev` → preview, `main` → prod. Pas encore connecté.
- Git flow : `feature/*` → merge `--no-ff` sur `dev` (validation manuelle avant merge) → `dev` → `main`.
