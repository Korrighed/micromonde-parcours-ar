// Widget bottom-sheet declenche par les boutons du HUD (src/ui/hud.ts).
// Un seul <audio> HTML reutilise pour les 3 contenus (pas de lecteurs multiples,
// pas de conflit de lecture simultanee) — suffisant pour de la narration, pas
// besoin de la Web Audio API ici (KISS).
import { CONTENT_TITLES, FRESQUE_CONTENT, type ContentKey } from '../content/fresques'

const audio = new Audio()

let panelEl: HTMLElement | null = null
let titleEl: HTMLElement | null = null
let textEl: HTMLElement | null = null
let audioBtn: HTMLButtonElement | null = null

export const initPanel = () => {
  panelEl = document.getElementById('panel')
  titleEl = document.getElementById('panel-title')
  textEl = document.getElementById('panel-text')
  audioBtn = document.getElementById('panel-audio-btn') as HTMLButtonElement | null
  const closeBtn = document.getElementById('panel-close')

  closeBtn?.addEventListener('click', closePanel)
  audioBtn?.addEventListener('click', toggleAudio)
  audio.addEventListener('ended', () => setAudioIcon(false))
}

export const openPanel = (targetName: string, key: ContentKey) => {
  const block = FRESQUE_CONTENT[targetName]?.[key]
  if (!block || !panelEl || !textEl) return

  if (titleEl) titleEl.textContent = CONTENT_TITLES[key]
  textEl.textContent = block.text

  audio.pause()
  audio.currentTime = 0
  audio.src = block.audioUrl
  setAudioIcon(false)

  panelEl.classList.add('open')
}

const closePanel = () => {
  panelEl?.classList.remove('open')
  audio.pause()
  setAudioIcon(false)
}

const toggleAudio = () => {
  if (audio.paused) {
    // Fichier audio pas encore fourni par le crea (public/assets/audio/) tant que
    // le contenu n'est pas valide : on capture le rejet pour eviter une erreur
    // console bruyante, sans bloquer le reste de l'UI.
    audio.play().catch(() => {
      console.warn('[panel] lecture audio impossible — fichier manquant ou format invalide')
    })
    setAudioIcon(true)
  } else {
    audio.pause()
    setAudioIcon(false)
  }
}

// Pas d'icone pause dediee pour l'instant (voir src/ui/icons/ — charte graphique
// a venir) : l'icone SVG (index.html) reste fixe, seul un etat visuel (opacite,
// voir ui.css) indique la lecture en cours.
const setAudioIcon = (playing: boolean) => {
  audioBtn?.classList.toggle('is-playing', playing)
}
