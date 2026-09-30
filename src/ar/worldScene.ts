import * as THREE from 'three'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import parrotModelUrl from '../assets/models/poc-parrotv2.glb?url'
import turtleModelUrl from '../assets/models/poc-turtlev2.glb?url'
import hibiscusModelUrl from '../assets/models/Hibiscus_lowpoly.glb?url'
import { getOffsetsForTarget, type ButtonKey, type Offset } from '../content/buttonLayout'

const TARGET_MODELS: Record<string, string> = {
  'poc-peruche': parrotModelUrl,
  'poc-tortue': turtleModelUrl,
  'poc-hibiscus': hibiscusModelUrl,
}

const TURTLE_TARGET = 'poc-tortue'
const TURTLE_CLIPS = {
  swim: 'ArmatureAction',
  light: 'Animated Water Caustics LightAction',
} as const
const TURTLE_SWIM_SPEED = 0.5

const PARROT_TARGET = 'poc-peruche'
const PARROT_CLIPS = {
  fly: 'ArmatureAction',
} as const
const PARROT_FLY_SPEED = 1.25

const HIBISCUS_TARGET = 'poc-hibiscus'
// Le .glb est un export Blender. Le noeud racine s'appelle encore Sketchfab_model :
// c'est un reste du fichier d'origine, pas la preuve que l'export actuel est Sketchfab.
// Ce clip ne contient qu'une cle d'echelle sur ce noeud. La jouer ecrase l'echelle
// de la page posee par applyPose, et le modele sort du champ.
const HIBISCUS_SCALE_CLIP = 'Sketchfab_modelAction'
const HIBISCUS_CLIP = 'hibiscus'
// L'export Blender (mode Scene ou Active Actions merged) contient un seul clip.
// On en retire la piste d'echelle du noeud racine : elle ecraserait l'echelle
// de la page. Le reste (rotations, et translations s'il y en a) est joue tel quel,
// de la frame 0 a la frame 160 a 24 ips.
const HIBISCUS_FPS = 24
const HIBISCUS_END_FRAME = 160
// Taille max visee avant l'echelle de la page, proche de la tortue et du perroquet.
const HIBISCUS_FIT_SIZE = 0.75

const hibiscusClip = (clips: THREE.AnimationClip[]) => {
  const endTime = HIBISCUS_END_FRAME / HIBISCUS_FPS
  const tracks: THREE.KeyframeTrack[] = []

  for (const clip of clips) {
    if (clip.name === HIBISCUS_SCALE_CLIP) continue
    for (const source of clip.tracks) {
      const isRotation = source.name.endsWith('.quaternion')
      const isTranslation = source.name.endsWith('.position')
      if (!isRotation && !isTranslation) continue
      const size = source.getValueSize()
      const times: number[] = []
      const values: number[] = []
      for (let i = 0; i < source.times.length; i++) {
        const time = source.times[i]
        if (time < 0 || time > endTime + 1e-3) continue
        times.push(time)
        for (let k = 0; k < size; k++) values.push(source.values[i * size + k])
      }
      if (times.length === 0) continue
      tracks.push(
        isRotation
          ? new THREE.QuaternionKeyframeTrack(source.name, times, values)
          : new THREE.VectorKeyframeTrack(source.name, times, values),
      )
    }
  }

  return new THREE.AnimationClip(HIBISCUS_CLIP, endTime, tracks)
}

const playLoop = (
  mixer: THREE.AnimationMixer,
  clips: THREE.AnimationClip[],
  name: string,
  timeScale = 1,
) => {
  const clip = clips.find((c) => c.name === name)
  if (!clip) {
    console.warn(`[worldScene] clip introuvable : ${name}`)
    return
  }
  const action = mixer.clipAction(clip)
  action.setLoop(THREE.LoopRepeat, Infinity)
  action.timeScale = timeScale
  action.play()
}

type ImagePose = { position: THREE.Vector3; rotation: THREE.Quaternion; scale: number }

export type ScreenPosition = { x: number; y: number; visible: boolean }
export type ButtonPositions = Record<ButtonKey, ScreenPosition>
type ButtonPositionListener = (positions: ButtonPositions) => void

// Seul point de couplage UI -> AR, dans ce sens uniquement : worldScene.ts ne
// connait rien du DOM (src/ui/hud.ts l'appelle), et n'importe jamais depuis src/ui/.
let buttonPositionListener: ButtonPositionListener | null = null
export const setButtonPositionListener = (listener: ButtonPositionListener) => {
  buttonPositionListener = listener
}

// Le modele reste cache a la detection (voir applyPose) tant que l'utilisateur n'a
// pas appuye sur le bouton central du HUD — cette fonction agit sur le target
// actuellement reconnu, sans que l'appelant (hud.ts) ait besoin de connaitre son nom.
let revealActiveModel: (() => void) | null = null
export const triggerModelReveal = () => {
  revealActiveModel?.()
}

// Symetrique de triggerModelReveal : masque le modele du target actif (croix de
// fermeture #hud-close-3d, voir src/ui/hud.ts) — le bouton central du HUD peut
// alors reapparaitre sans se superposer au modele.
let hideActiveModelFn: (() => void) | null = null
export const hideActiveModel = () => {
  hideActiveModelFn?.()
}

// Transforme un offset local (repere de l'image, avant rotation/scale/position)
// en point 3D monde — meme transformation que celle appliquee au modele lui-meme
// (applyPose ci-dessous), reutilisee pour ancrer les boutons sur l'image.
const localOffsetToWorld = (offset: Offset, pose: ImagePose): THREE.Vector3 =>
  new THREE.Vector3(offset.x, offset.y, 0)
    .applyQuaternion(pose.rotation)
    .multiplyScalar(pose.scale)
    .add(pose.position)

// Projection standard Three.js monde -> ecran (NDC puis pixels). "visible" a false
// si le point est derriere la camera ou hors du frustum (z NDC hors [-1, 1]) — le
// HUD (hud.ts) s'en sert pour masquer un bouton dont le point d'ancrage sort du champ.
const worldToScreen = (worldPos: THREE.Vector3, camera: THREE.Camera): ScreenPosition => {
  const projected = worldPos.clone().project(camera)
  return {
    x: (projected.x * 0.5 + 0.5) * window.innerWidth,
    y: (-projected.y * 0.5 + 0.5) * window.innerHeight,
    visible: projected.z > -1 && projected.z < 1,
  }
}

// Pattern verifie sur github.com/8thwall/threejs-world-effects-example (src/threejs-scene-init.js)
// et sur la logique reelle de xrextras-named-image-target (github.com/8thwall/web,
// xrextras/src/aframe/components/target-components.ts) pour le mapping evenement -> pose.
//
// XR8.Threejs.pipelineModule() cree deja camera + scene + renderer ; on recupere ces objets
// via XR8.Threejs.xrScene() dans onStart, on n'instancie pas notre propre renderer/camera.
//
// Le modele est cache tant que la page (image target) n'est pas detectee, ET tant que
// le bouton central du HUD n'a pas ete presse une fois detectee (triggerModelReveal).
// Une fois revele, le SLAM (world tracking, deja actif) garde l'objet ancre pendant que
// la camera se deplace.
export const worldScenePipelineModule = () => {
  const models: Record<string, THREE.Object3D> = {}
  const mixers: THREE.AnimationMixer[] = []
  const clock = new THREE.Clock()

  let camera: THREE.Camera | undefined
  let activeTarget: string | null = null
  let activePose: ImagePose | null = null
  // Le GLB hibiscus est lourd : le clic play peut arriver avant la fin du
  // chargement. On retient la demande pour l'appliquer quand le modele existe.
  let revealRequested = false

  const applyPose = (name: string, pose: ImagePose) => {
    const model = models[name]
    if (!model) return
    model.position.copy(pose.position)
    model.quaternion.copy(pose.rotation)
    model.scale.setScalar(pose.scale)
    // Visibilite geree par triggerModelReveal (bouton central du HUD), pas ici.
  }

  // Un seul target a la fois affiche : on ne compte pas sur "imagelost" du
  // target precedent (pas toujours fiable en changeant rapidement de page).
  const hideAllExcept = (name: string) => {
    for (const [targetName, model] of Object.entries(models)) {
      if (targetName !== name) model.visible = false
    }
  }

  revealActiveModel = () => {
    revealRequested = true
    if (!activeTarget) return
    const model = models[activeTarget]
    if (model) model.visible = true
  }

  hideActiveModelFn = () => {
    revealRequested = false
    if (!activeTarget) return
    const model = models[activeTarget]
    if (model) model.visible = false
  }

  // L'hibiscus Sketchfab est decale et bien plus grand que la page. On le
  // recentre et on le ramene a HIBISCUS_FIT_SIZE dans un groupe enfant, pour
  // que applyPose puisse poser l'echelle de la page sur le parent sans ecraser
  // l'echelle interne de l'export.
  const fitHibiscus = (object: THREE.Object3D) => {
    object.updateMatrixWorld(true)
    const box = new THREE.Box3().setFromObject(object)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)
    const fitted = new THREE.Group()
    if (maxDim > 0) {
      object.position.sub(center)
      fitted.scale.setScalar(HIBISCUS_FIT_SIZE / maxDim)
    }
    fitted.add(object)
    const poseRoot = new THREE.Group()
    poseRoot.add(fitted)
    return poseRoot
  }

  return {
    name: 'micromonde-world-scene',

    onStart: ({ canvas }: { canvas: HTMLCanvasElement }) => {
      const xrScene = XR8.Threejs.xrScene()
      const { scene, renderer } = xrScene
      camera = xrScene.camera

      renderer.outputColorSpace = THREE.SRGBColorSpace

      const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2)
      scene.add(light)

      const loader = new GLTFLoader()
      const dracoLoader = new DRACOLoader()
      // Decodeur local (public/draco), pas un CDN : le telephone charge le modele
      // depuis le PC sur le reseau local.
      dracoLoader.setDecoderPath('/draco/')
      loader.setDRACOLoader(dracoLoader)

      for (const [name, url] of Object.entries(TARGET_MODELS)) {
        loader.load(url, (gltf) => {
          const content = gltf.scene
          const model = name === HIBISCUS_TARGET ? fitHibiscus(content) : content
          model.visible = false // cache tant que la page n'est pas scannee et revelee.
          scene.add(model)
          models[name] = model

          if (activeTarget === name && activePose) applyPose(name, activePose)
          if (activeTarget === name && revealRequested) model.visible = true

          if (gltf.animations.length > 0) {
            const mixer = new THREE.AnimationMixer(content)
            if (name === TURTLE_TARGET) {
              playLoop(mixer, gltf.animations, TURTLE_CLIPS.swim, TURTLE_SWIM_SPEED)
              playLoop(mixer, gltf.animations, TURTLE_CLIPS.light)
            } else if (name === PARROT_TARGET) {
              playLoop(mixer, gltf.animations, PARROT_CLIPS.fly, PARROT_FLY_SPEED)
            } else if (name === HIBISCUS_TARGET) {
              const clip = hibiscusClip(gltf.animations)
              playLoop(mixer, [clip], HIBISCUS_CLIP)
            } else {
              mixer.clipAction(gltf.animations[0]).play()
            }
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

      if (activeTarget && activePose && camera && buttonPositionListener) {
        const offsets = getOffsetsForTarget(activeTarget)
        const pose = activePose
        const cam = camera
        buttonPositionListener({
          molecule: worldToScreen(localOffsetToWorld(offsets.molecule, pose), cam),
          histoire: worldToScreen(localOffsetToWorld(offsets.histoire, pose), cam),
          science: worldToScreen(localOffsetToWorld(offsets.science, pose), cam),
          animation: worldToScreen(localOffsetToWorld(offsets.animation, pose), cam),
        })
      }
    },

    listeners: [
      {
        event: 'reality.imagefound',
        process: ({ detail }: { detail: { name: string } & ImagePose }) => {
          hideAllExcept(detail.name)
          revealRequested = false
          activeTarget = detail.name
          activePose = { position: detail.position, rotation: detail.rotation, scale: detail.scale }
          applyPose(detail.name, activePose)
        },
      },
      {
        event: 'reality.imagelost',
        process: ({ detail }: { detail: { name: string } }) => {
          const model = models[detail.name]
          if (model) model.visible = false
          if (activeTarget === detail.name) {
            revealRequested = false
            activeTarget = null
            activePose = null
          }
        },
      },
    ],
  }
}
