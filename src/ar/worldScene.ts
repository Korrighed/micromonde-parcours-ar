import * as THREE from 'three'

// Pattern verifie sur github.com/8thwall/threejs-world-effects-example (src/threejs-scene-init.js).
// XR8.Threejs.pipelineModule() cree deja camera + scene + renderer ; on recupere ces objets
// via XR8.Threejs.xrScene() dans onStart, on n'instancie pas notre propre renderer/camera.
export const worldScenePipelineModule = () => {
  let placeholder: THREE.Mesh | undefined

  const placePlaceholderInFrontOfCamera = (camera: THREE.Camera) => {
    if (!placeholder) return
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion)
    placeholder.position.copy(camera.position).addScaledVector(forward, 1.2)
  }

  return {
    name: 'micromonde-world-scene',

    onStart: ({ canvas }: { canvas: HTMLCanvasElement }) => {
      const { scene, camera, renderer } = XR8.Threejs.xrScene()

      renderer.outputColorSpace = THREE.SRGBColorSpace

      const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2)
      scene.add(light)

      // Cube placeholder : remplace le modele 3D tortue tant qu'il n'est pas livre.
      // But du test : verifier que l'objet reste ancre dans l'espace (world tracking / SLAM)
      // pendant que l'utilisateur se deplace autour avec le telephone.
      placeholder = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 0.2, 0.2),
        new THREE.MeshStandardMaterial({ color: 0x2ecc71 }),
      )
      placePlaceholderInFrontOfCamera(camera)
      scene.add(placeholder)

      canvas.addEventListener(
        'touchstart',
        (event) => {
          event.preventDefault()
        },
        { passive: false },
      )
    },

    onUpdate: () => {
      if (placeholder) {
        placeholder.rotation.y += 0.01
      }
    },
  }
}
