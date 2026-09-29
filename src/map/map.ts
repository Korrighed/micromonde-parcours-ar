// Carte Leaflet des fresques (page map.html) : marqueurs par fresque, popup avec lien
// vers le scan AR (index.html), position de l'utilisateur. Aucun lien avec src/ar/ :
// la page AR est chargee a part, le moteur 8th Wall n'est jamais charge ici.
import 'leaflet/dist/leaflet.css'
import '../ui/variables.css'
import './map.css'
import * as L from 'leaflet'
import { FRESQUE_LOCATIONS, type FresqueLocation } from '../content/locations'

const SCAN_URL = './'

// Marqueur SVG en currentColor (couleur via CSS, voir map.css / variables.css) —
// evite aussi les icones par defaut de Leaflet, dont les chemins d'images cassent
// avec Vite.
const PIN_SVG = `
  <svg viewBox="0 0 32 42" aria-hidden="true">
    <path d="M16 1C7.7 1 1 7.7 1 16c0 11 15 25 15 25s15-14 15-25C31 7.7 24.3 1 16 1Z"
      fill="currentColor" />
    <circle cx="16" cy="16" r="6" class="map-pin__dot" />
  </svg>`

const createPinIcon = (available: boolean) =>
  L.divIcon({
    className: `map-pin ${available ? '' : 'map-pin--soon'}`,
    html: PIN_SVG,
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -38],
  })

const createPopupContent = (fresque: FresqueLocation) => {
  const container = document.createElement('div')
  container.className = 'map-popup'

  const title = document.createElement('h2')
  title.className = 'map-popup__title'
  title.textContent = fresque.name
  container.appendChild(title)

  if (fresque.available) {
    const link = document.createElement('a')
    link.className = 'map-popup__btn'
    link.href = SCAN_URL
    link.textContent = 'Scanner'
    container.appendChild(link)
  } else {
    const soon = document.createElement('p')
    soon.className = 'map-popup__soon'
    soon.textContent = 'Bientôt'
    container.appendChild(soon)
  }

  return container
}

// Position de l'utilisateur : point + cercle de precision, mis a jour en continu.
// Refus ou erreur de geolocalisation = carte utilisable sans le point ni le
// bouton de recentrage (#map-locate-btn reste cache).
const watchUserPosition = (map: L.Map) => {
  if (!('geolocation' in navigator)) return

  let dot: L.CircleMarker | null = null
  let accuracy: L.Circle | null = null

  const locateBtn = document.getElementById('map-locate-btn')
  locateBtn?.addEventListener('click', () => {
    if (dot) map.flyTo(dot.getLatLng(), Math.max(map.getZoom(), 18))
  })

  navigator.geolocation.watchPosition(
    ({ coords }) => {
      const latLng = L.latLng(coords.latitude, coords.longitude)
      if (!dot || !accuracy) {
        if (locateBtn) locateBtn.hidden = false
        accuracy = L.circle(latLng, {
          radius: coords.accuracy,
          className: 'map-user-accuracy',
          interactive: false,
        }).addTo(map)
        dot = L.circleMarker(latLng, {
          radius: 7,
          className: 'map-user-dot',
          interactive: false,
        }).addTo(map)
        return
      }
      dot.setLatLng(latLng)
      accuracy.setLatLng(latLng).setRadius(coords.accuracy)
    },
    (error) => {
      console.warn(`[map] geolocalisation indisponible : ${error.message}`)
    },
    { enableHighAccuracy: true },
  )
}

const initMap = () => {
  const container = document.getElementById('map')
  if (!container) return

  // Usage exclusivement mobile : zoom au pincement, pas de boutons +/-.
  const map = L.map(container, { zoomControl: false })

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map)

  const bounds = L.latLngBounds([])
  FRESQUE_LOCATIONS.forEach((fresque) => {
    const latLng = L.latLng(fresque.lat, fresque.lng)
    bounds.extend(latLng)
    L.marker(latLng, { icon: createPinIcon(fresque.available), title: fresque.name })
      .bindPopup(createPopupContent(fresque))
      .addTo(map)
  })

  // Cadre sur les fresques (quelques dizaines de metres d'ecart) : padding pour
  // ne pas coller les marqueurs aux bords, maxZoom pour rester lisible.
  map.fitBounds(bounds, { padding: [48, 48], maxZoom: 19 })

  watchUserPosition(map)
}

initMap()
