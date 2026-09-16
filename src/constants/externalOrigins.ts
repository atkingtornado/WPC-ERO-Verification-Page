/**
 * @file Origins of the external hosts the map fetches from, routed through the
 * dev server's proxy while running locally (URRD-style).
 *
 * www.wpc.ncep.noaa.gov serves the basemap vector tiles, the boundary overlay
 * tiles and the verification GeoJSON, and sends no `Access-Control-Allow-Origin`
 * header — so a browser can only load them when the page is same-origin with
 * that host. That holds in production (the app deploys under wpc.ncep.noaa.gov)
 * but never on localhost, where the requests fail CORS and the map comes up
 * blank.
 *
 * On localhost these resolve to same-origin `/proxy/...` paths that the Vite
 * dev/preview server forwards upstream (see the proxy config in
 * vite.config.ts); everywhere else they resolve to the real origins and no
 * proxy is involved.
 */

/**
 * Same-origin dev-server prefix on localhost, the real origin elsewhere.
 *
 * The localhost value is fully qualified rather than a root-relative
 * "/proxy/..." path: maplibre loads vector tiles from a worker spawned off a
 * blob: URL, and a relative URL has no resolvable base there — every tile
 * request fails with "Failed to construct 'Request': Failed to parse URL".
 * Qualifying it against the page's own origin keeps the request same-origin
 * either way.
 */
const viaDevProxy = (proxyPath: string, origin: string): string => {
  const { hostname } = window.location
  const isLocal = hostname === 'localhost' || hostname === '127.0.0.1'
  return isLocal ? `${window.location.origin}${proxyPath}` : origin
}

/**
 * Basemap vector tiles, geographic boundary / road overlays and the
 * verification GeoJSON.
 */
export const WPC_ORIGIN = viaDevProxy('/proxy/wpc', 'https://www.wpc.ncep.noaa.gov')

/**
 * Font glyphs for the basemap styles' place labels. This host does send
 * permissive CORS headers, so it only needs the proxy so that every map
 * request in dev goes through one same-origin path (which also keeps the map
 * working in sandboxed browsers that block direct external requests).
 */
export const MAPTILER_ORIGIN = viaDevProxy('/proxy/maptiler', 'https://api.maptiler.com')
