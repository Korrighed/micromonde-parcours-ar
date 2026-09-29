// HUD : 4 boutons ronds ancres sur l'image (molecule/histoire/science) ou sur le
// modele (animation, bouton central). Positions calculees par src/ar/worldScene.ts
// (seul module qui touche Three.js/XR8) et transmises ici via setButtonPositionListener —
// hud.ts ne fait que deplacer des elements DOM, aucun acces direct a Three.js.
import { FRESQUE_CONTENT, type ContentKey } from '../content/fresques'
import { openPanel } from './panel'
import {
  hideActiveModel,
  setButtonPositionListener,
  triggerModelReveal,
  type ButtonPositions,
  type ScreenPosition,
} from '../ar/worldScene'

const CONTENT_KEYS: ContentKey[] = ['molecule', 'histoire', 'science']

let currentTarget: string | null = null
// Vrai une fois le modele 3D revele (bouton central presse) — tant que c'est le
// cas, .hud-btn--animation est cache (il se superposerait au modele) et
// #hud-close-3d prend le relai pour le refermer. Reinitialise a chaque nouvelle
// detection (showHudFor) / perte (hideHud).
let modelRevealed = false

export const initHud = () => {
  const hud = document.getElementById('hud')
  if (!hud) return

  const animationBtn = hud.querySelector<HTMLButtonElement>('.hud-btn--animation')
  const close3dBtn = document.getElementById('hud-close-3d') as HTMLButtonElement | null

  hud.querySelectorAll<HTMLButtonElement>('.hud-btn[data-key]').forEach((btn) => {
    const key = btn.dataset.key

    if (key === 'animation') {
      btn.addEventListener('click', () => {
        triggerModelReveal()
        setModelRevealed(true, animationBtn, close3dBtn)
      })
      return
    }

    btn.addEventListener('click', () => {
      if (!currentTarget || !isContentKey(key)) return
      openPanel(currentTarget, key)
    })
  })

  close3dBtn?.addEventListener('click', () => {
    hideActiveModel()
    setModelRevealed(false, animationBtn, close3dBtn)
  })

  setButtonPositionListener((positions: ButtonPositions) => {
    updateButtonPosition('molecule', positions.molecule)
    updateButtonPosition('histoire', positions.histoire)
    updateButtonPosition('science', positions.science)
    // Le bouton animation ne suit sa position ancree sur l'image que tant que le
    // modele n'est pas revele — une fois revele, il reste cache (voir
    // setModelRevealed) donc pas besoin de mettre a jour sa position.
    if (!modelRevealed) updateButtonPosition('animation', positions.animation)
  })
}

const setModelRevealed = (
  revealed: boolean,
  animationBtn: HTMLButtonElement | null,
  close3dBtn: HTMLButtonElement | null,
) => {
  modelRevealed = revealed
  if (revealed) {
    if (animationBtn) {
      animationBtn.style.opacity = '0'
      animationBtn.style.pointerEvents = 'none'
    }
    close3dBtn?.removeAttribute('hidden')
  } else {
    close3dBtn?.setAttribute('hidden', '')
  }
}

const isContentKey = (key: string | undefined): key is ContentKey =>
  CONTENT_KEYS.includes(key as ContentKey)

const updateButtonPosition = (key: keyof ButtonPositions, pos: ScreenPosition) => {
  const btn = document.querySelector<HTMLButtonElement>(`.hud-btn[data-key="${key}"]`)
  if (!btn) return
  btn.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%)`
  btn.style.opacity = pos.visible ? '1' : '0'
  btn.style.pointerEvents = pos.visible ? 'auto' : 'none'
}

// Appele par le pipeline module UI (main.ts) sur reality.imagefound.
// Ignore silencieusement les targets sans contenu (ex: futur target sans texte pret).
export const showHudFor = (targetName: string) => {
  if (!FRESQUE_CONTENT[targetName]) return
  currentTarget = targetName
  resetModelRevealState()
  document.getElementById('hud')?.removeAttribute('hidden')
}

// Appele par le pipeline module UI (main.ts) sur reality.imagelost.
export const hideHud = () => {
  currentTarget = null
  resetModelRevealState()
  document.getElementById('hud')?.setAttribute('hidden', '')
}

// Nouvelle detection ou perte de target = etat propre : le modele n'est plus
// revele (worldScene.ts le cache deja sur reality.imagelost), donc le bouton
// central redevient visible/pilote par updateButtonPosition, et la croix se
// cache.
const resetModelRevealState = () => {
  modelRevealed = false
  const animationBtn = document.querySelector<HTMLButtonElement>('.hud-btn--animation')
  if (animationBtn) {
    animationBtn.style.opacity = ''
    animationBtn.style.pointerEvents = ''
  }
  document.getElementById('hud-close-3d')?.setAttribute('hidden', '')
}
