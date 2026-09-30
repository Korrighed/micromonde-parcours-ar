import { CREDITS } from '../content/credits'
import './credits.css'

// Remplit un conteneur deja present dans la page (carte ou panneau).
// Espace insecable avant le deux-points, usage typographique francais.
export const mountCredits = (root: HTMLElement) => {
  root.replaceChildren(
    ...CREDITS.map((credit) => {
      const line = document.createElement('p')
      line.textContent = `${credit.role}\u00A0: ${credit.name}`
      return line
    }),
  )
}
