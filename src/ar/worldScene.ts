import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import modelUrl from '../assets/models/poc.glb?url'

const TARGET_NAME = 'test-8th'

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
  let model: THREE.Object3D | undefined
  let mixer: THREE.AnimationMixer | undefined
  const clock = new THREE.Clock()

  const applyPose = (detail: { position: THREE.Vector3; rotation: THREE.Quaternion; scale: number }) => {
    if (!model) return
    model.position.copy(detail.position)
    model.quaternion.copy(detail.rotation)
    model.scale.setScalar(detail.scale)
    model.visible = true
  }

  return {
    name: 'micromonde-world-scene',

    onStart: ({ canvas }: { canvas: HTMLCanvasElement }) => {
      const { scene, renderer } = XR8.Threejs.xrScene()

      renderer.outputColorSpace = THREE.SRGBColorSpace

      const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2)
      scene.add(light)

      new GLTFLoader().load(modelUrl, (gltf) => {
        model = gltf.scene
        model.visible = false // cache tant que la page n'est pas scannee.
        scene.add(model)

        if (gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(model)
          mixer.clipAction(gltf.animations[0]).play()
        }
      })

      canvas.addEventListener(
        'touchstart',
        (event) => {
          event.preventDefault()
        },
        { passive: false },
      )
    },

    onUpdate: () => {
      mixer?.update(clock.getDelta())
    },

    listeners: [
      {
        event: 'reality.imagefound',
        process: ({ detail }: { detail: { name: string; position: THREE.Vector3; rotation: THREE.Quaternion; scale: number } }) => {
          if (detail.name === TARGET_NAME) {
            applyPose(detail)
          } else if (model) {
            // Un autre target a ete trouve : on ne compte pas sur "imagelost" de
            // TARGET_NAME (pas toujours fiable en changeant rapidement de page).
            model.visible = false
          }
        },
      },
      {
        event: 'reality.imagelost',
        process: ({ detail }: { detail: { name: string } }) => {
          if (detail.name !== TARGET_NAME || !model) return
          model.visible = false
        },
      },
    ],
  }
}
