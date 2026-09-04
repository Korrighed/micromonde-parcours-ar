import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import parrotModelUrl from '../assets/models/poc-parrot.glb?url'
import turtleModelUrl from '../assets/models/poc-turtle.glb?url'

const TARGET_MODELS: Record<string, string> = {
  'poc-peruche': parrotModelUrl,
  'poc-tortue': turtleModelUrl,
}

// Pattern verifie sur github.com/8thwall/threejs-world-effects-example (src/threejs-scene-init.js)
// et sur la logique reelle de xrextras-named-image-target (github.com/8thwall/web,
// xrextras/src/aframe/components/target-components.ts) pour le mapping evenement -> pose.
//
// XR8.Threejs.pipelineModule() cree deja camera + scene + renderer ; on recupere ces objets
// via XR8.Threejs.xrScene() dans onStart, on n'instancie pas notre propre renderer/camera.
//
// Le modele est cache tant que la page (image target) n'est pas detectee. A la detection,
// sa pose est fixee une fois sur les donnees de l'evenement, puis le world tracking (SLAM)
// prend le relai pour le garder ancre pendant que la camera se deplace.
export const worldScenePipelineModule = () => {
  const models: Record<string, THREE.Object3D> = {}
  const mixers: THREE.AnimationMixer[] = []
  const clock = new THREE.Clock()

  const applyPose = (name: string, detail: { position: THREE.Vector3; rotation: THREE.Quaternion; scale: number }) => {
    const model = models[name]
    if (!model) return
    model.position.copy(detail.position)
    model.quaternion.copy(detail.rotation)
    model.scale.setScalar(detail.scale)
    model.visible = true
  }

  // Un seul target a la fois affiche : on ne compte pas sur "imagelost" du
  // target precedent (pas toujours fiable en changeant rapidement de page).
  const hideAllExcept = (name: string) => {
    for (const [targetName, model] of Object.entries(models)) {
      if (targetName !== name) model.visible = false
    }
  }

  return {
    name: 'micromonde-world-scene',

    onStart: ({ canvas }: { canvas: HTMLCanvasElement }) => {
      const { scene, renderer } = XR8.Threejs.xrScene()

      renderer.outputColorSpace = THREE.SRGBColorSpace

      const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2)
      scene.add(light)

      for (const [name, url] of Object.entries(TARGET_MODELS)) {
        new GLTFLoader().load(url, (gltf) => {
          const model = gltf.scene
          model.visible = false // cache tant que la page n'est pas scannee.
          scene.add(model)
          models[name] = model

          if (gltf.animations.length > 0) {
            const mixer = new THREE.AnimationMixer(model)
            mixer.clipAction(gltf.animations[0]).play()
            mixers.push(mixer)
          }
        })
      }

      canvas.addEventListener(
        'touchstart',
        (event) => {
          event.preventDefault()
        },
        { passive: false },
      )
    },

    onUpdate: () => {
      const delta = clock.getDelta()
      mixers.forEach((mixer) => mixer.update(delta))
    },

    listeners: [
      {
        event: 'reality.imagefound',
        process: ({ detail }: { detail: { name: string; position: THREE.Vector3; rotation: THREE.Quaternion; scale: number } }) => {
          hideAllExcept(detail.name)
          applyPose(detail.name, detail)
        },
      },
      {
        event: 'reality.imagelost',
        process: ({ detail }: { detail: { name: string } }) => {
          const model = models[detail.name]
          if (model) model.visible = false
        },
      },
    ],
  }
}
