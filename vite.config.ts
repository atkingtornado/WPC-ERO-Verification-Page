import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// www.wpc.ncep.noaa.gov (basemap vector tiles, boundary/road overlay tiles,
// verification GeoJSON) sends no CORS headers, so browser fetches are blocked
// cross-origin — fine in production (the site deploys under wpc.ncep.noaa.gov,
// same-origin), never on localhost. Proxying through the dev/preview server
// makes the requests same-origin in dev too; src/constants/externalOrigins.ts
// is what points the app at these paths, and only on localhost. (Same setup as
// wpc-urrd / wpc-wssi.)
const localProxy = {
  '/proxy/wpc': {
    target: 'https://www.wpc.ncep.noaa.gov',
    changeOrigin: true,
    rewrite: (path: string) => path.replace(/^\/proxy\/wpc/, ''),
  },
  '/proxy/maptiler': {
    target: 'https://api.maptiler.com',
    changeOrigin: true,
    rewrite: (path: string) => path.replace(/^\/proxy\/maptiler/, ''),
  },
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './',
  server: { proxy: localProxy },
  preview: { proxy: localProxy },
})
