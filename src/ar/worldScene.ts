import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const MODEL_URL = '/assets/models/poc.glb'

// Pattern verifie sur github.com/8thwall/threejs-world-effects-example (src/threejs-scene-init.js).
// XR8.Threejs.pipelineModule() cree deja camera + scene + renderer ; on recupere ces objets
// via XR8.Threejs.xrScene() dans onStart, on n'instancie pas notre propre renderer/camera.
export const worldScenePipelineModule = () => {
  let model: THREE.Object3D | undefined
  let mixer: THREE.AnimationMixer | undefined
  const clock = new THREE.Clock()

  const placeInFrontOfCamera = (object: THREE.Object3D, camera: THREE.Camera) => {
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion)
    object.position.copy(camera.position).addScaledVector(forward, 1.2)
  }

  return {
    name: 'micromonde-world-scene',

    onStart: ({ canvas }: { canvas: HTMLCanvasElement }) => {
      const { scene, camera, renderer } = XR8.Threejs.xrScene()

      renderer.outputColorSpace = THREE.SRGBColorSpace

      const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2)
      scene.add(light)

      // Modele 3D (poc.glb, export Blender) ancre en world tracking (SLAM).
      // But du test : verifier que l'objet reste ancre dans l'espace pendant
      // que l'utilisateur se deplace autour avec le telephone.
      new GLTFLoader().load(MODEL_URL, (gltf) => {
        model = gltf.scene
        placeInFrontOfCamera(model, camera)
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
  }
}
