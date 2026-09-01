import './style.css'
import { worldScenePipelineModule } from './ar/worldScene'

// Pattern verifie sur github.com/8thwall/threejs-world-effects-example (src/app.js).
const onxrloaded = () => {
  XR8.addCameraPipelineModules([
    XR8.GlTextureRenderer.pipelineModule(),
    XR8.Threejs.pipelineModule(),
    XR8.XrController.pipelineModule(), // active le SLAM (world tracking).
    LandingPage.pipelineModule(),
    XRExtras.FullWindowCanvas.pipelineModule(),
    XRExtras.Loading.pipelineModule(),
    XRExtras.RuntimeError.pipelineModule(),
    worldScenePipelineModule(),
  ])

  const canvas = document.getElementById('camerafeed') as HTMLCanvasElement
  XR8.run({ canvas })
}

window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)
