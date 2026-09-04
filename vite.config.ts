import { defineConfig } from 'vite'
import basicSsl from '@vitejs/plugin-basic-ssl'

// HTTPS local requis : getUserMedia (camera) refuse l'acces hors contexte securise,
// et l'IP LAN du telephone n'est pas consideree "localhost". Certificat auto-signe,
// a accepter manuellement une fois sur le telephone (avertissement navigateur normal).
export default defineConfig({
  plugins: [basicSsl()],
  server: {
    host: true, // bind 0.0.0.0, accessible depuis le telephone sur le meme reseau
  },
})
