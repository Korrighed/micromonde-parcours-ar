// XR8, XRExtras et LandingPage sont charges en <script> CDN dans index.html (pas d'import npm) :
// c'est le pattern reel constate sur github.com/8thwall/threejs-world-effects-example.
// Pas de types officiels publics pour ces globals -> declares en `any` assume, a affiner si besoin.
export {}

declare global {
  const XR8: any
  const XRExtras: any
  const LandingPage: any

  interface Window {
    XR8: any
    THREE: any
  }
}
