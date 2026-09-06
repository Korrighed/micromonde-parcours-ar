import './ui/variables.css'
import './style.css'
import './ui/ui.css'
import * as THREE from 'three'
import { worldScenePipelineModule } from './ar/worldScene'
import { initHud, showHudFor, hideHud } from './ui/hud'
import { initPanel } from './ui/panel'
import imageTargetData from '../image-targets/poc-peruche.json'
import imageTargetImageUrl from '../image-targets/poc-peruche_luminance.png?url'
import imageTargetData2 from '../image-targets/poc-tortue.json'
import imageTargetImageUrl2 from '../image-targets/poc-tortue_luminance.png?url'

// XR8.Threejs.pipelineModule() lit window.THREE en global (pattern legacy
// script-tag) : verifie sur github.com/8thwall/threejs-world-effects-example
// (src/app.js) — sans ca, "window.THREE does not exist" au chargement.
window.THREE = THREE

// imagePath dans le JSON est un chemin relatif brut (image-targets/...) : le moteur le
// fetch tel quel au runtime, ce qui ne resout a rien avec notre bundler. On le remplace
// par l'URL bundlee par Vite (meme pattern que le .glb). Verifie sur le README officiel
// de @8thwall/image-target-cli : "The imagePath field ... will tell the engine where to
// load the tracked image" (pas de precision sur le format attendu, d'ou ce contournement).
imageTargetData.imagePath = imageTargetImageUrl
imageTargetData2.imagePath = imageTargetImageUrl2

// Module de test : logge la reconnaissance de chaque target — sert a verifier
// que plusieurs targets coexistent sans interference.
const targetLoggerPipelineModule = () => ({
  name: 'micromonde-target-logger',
  listeners: [
    {
      event: 'reality.imagefound',
      process: ({ detail }: { detail: { name: string } }) => {
        console.log(`[target-logger] ${detail.name} trouve`)
      },
    },
      {
      event: 'reality.imagelost',
      process: ({ detail }: { detail: { name: string } }) => {
        console.log(`[target-logger] ${detail.name} perdu`)
      },
    },
  ],
})

// Module UI : ecoute seule (aucun rendu Three.js, aucune modification du
// pipeline AR existant) — montre/cache le HUD selon le target reconnu.
// Meme principe que targetLoggerPipelineModule ci-dessus.
const uiPipelineModule = () => ({
  name: 'micromonde-ui',
  listeners: [
    {
      event: 'reality.imagefound',
      process: ({ detail }: { detail: { name: string } }) => {
        showHudFor(detail.name)
      },
    },
    {
      event: 'reality.imagelost',
      process: () => {
        hideHud()
      },
    },
  ],
})

// Pattern verifie sur github.com/8thwall/threejs-world-effects-example (src/app.js).
const onxrloaded = () => {
  XR8.XrController.configure({ imageTargetData: [imageTargetData, imageTargetData2] })

  XR8.addCameraPipelineModules([
    XR8.GlTextureRenderer.pipelineModule(),
    XR8.Threejs.pipelineModule(),
    XR8.XrController.pipelineModule(), // active le SLAM (world tracking).
    LandingPage.pipelineModule(),
    XRExtras.FullWindowCanvas.pipelineModule(),
    XRExtras.Loading.pipelineModule(),
    XRExtras.RuntimeError.pipelineModule(),
    worldScenePipelineModule(),
    targetLoggerPipelineModule(),
    uiPipelineModule(),
  ])

  initHud()
  initPanel()

  const canvas = document.getElementById('camerafeed') as HTMLCanvasElement
  XR8.run({ canvas })
}

window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)
