import './style.css'
import * as THREE from 'three'
import { worldScenePipelineModule } from './ar/worldScene'
import imageTargetData from '../image-targets/test-8th.json'
import imageTargetImageUrl from '../image-targets/test-8th_luminance.jpg?url'
import imageTargetData2 from '../image-targets/poc-test2.json'
import imageTargetImageUrl2 from '../image-targets/poc-test2_luminance.jpg?url'

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

// Module de test : logge la reconnaissance de poc-test2 (2e target, page "Rodeur")
// sans afficher de modele — sert a verifier que plusieurs targets coexistent.
const targetLoggerPipelineModule = () => ({
  name: 'micromonde-target-logger',
  listeners: [
    {
      event: 'reality.imagefound',
      process: ({ detail }: { detail: { name: string } }) => {
        if (detail.name === 'poc-test2') console.log('[target-logger] poc-test2 trouve')
      },
    },
    {
      event: 'reality.imagelost',
      process: ({ detail }: { detail: { name: string } }) => {
        if (detail.name === 'poc-test2') console.log('[target-logger] poc-test2 perdu')
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
  ])

  const canvas = document.getElementById('camerafeed') as HTMLCanvasElement
  XR8.run({ canvas })
}

window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)
