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
  map/          carte Leaflet (à venir)
  content/      contenus texte/audio par fresque (à venir)
  progress/     état de progression localStorage (à venir)
public/
  assets/
    models/     modèles 3D (fournis par le créa, pas produits ici)
    targets/    fichiers de tracking générés par @8thwall/image-target-cli
    audio/      pistes audio des légendes/contenus scientifiques
```

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

**Fait dans ce PoC** : modèle 3D (`public/assets/models/poc.glb`, export Blender, chargé via `GLTFLoader`) ancré en world tracking (SLAM seul, pas d'image target). Animation jouée via `THREE.AnimationMixer` si le `.glb` en contient une.

**Pas encore fait** : intégration de l'image target dans le pipeline (`XR8.XrController.configure({ imageTargetData: [...] })`) — le fichier de tracking est généré (`public/assets/targets/test-8th.json`), reste à le câbler dans `main.ts`. Procédure complète de génération et exigences sur l'image source : [docs/image-target.md](docs/image-target.md).

## Lancer en local

```bash
npm install
npm run dev
```

Accès caméra = contexte sécurisé obligatoire (HTTPS, `localhost` ou IP LAN via certificat). `vite.config.ts` embarque `@vitejs/plugin-basic-ssl` pour ça.

### 8th Wall Desktop (app)

[8th Wall Desktop](https://8thwall.org/downloads) — Mac et Windows uniquement, pas de Linux. Utile pour ce projet en **mode Non-Studio** (notre projet est un Vite/Three.js custom, pas un projet créé via leur Studio) :

- AR Simulator + Device Connect (test sans téléphone physique)
- Gestion d'assets et d'image targets en GUI

**Pas encore activé sur ce repo** : le mode Non-Studio exige une structure de dossier précise que nous ne suivons pas actuellement — `src/assets/` (nous : `public/assets/`), `image-targets/` à la racine sans sous-dossier (nous : `public/assets/targets/`), et un script `npm run serve` respectant `--port`/`$PORT` (nous : `npm run dev`, Vite direct). Tant que ce n'est pas restructuré, le flux de test reste celui ci-dessous (téléphone + `npm run dev`).

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
