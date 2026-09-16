/**
 * @file Geographic boundary overlay definitions, ported from wpc-urrd. The overlays
 * (https://www.wpc.ncep.noaa.gov/geographical_boundaries/) are served as
 * tippecanoe-generated vector tile pyramids (pbf, zoom 0-7; maplibre overzooms
 * past 7) and drawn above the verification data.
 *
 * Like the road overlay (see ./roadLayers) each boundary draws as a casing plus
 * a core rather than a single flat line, and in one fixed treatment rather than
 * one per theme. A flat line can only be tuned against a basemap you already
 * know — these used to be near-black over the light basemap and light grey over
 * the dark one, which was right for exactly those two and wrong over imagery,
 * the gray canvases and the rest of the catalog. A core inside a contrasting
 * casing carries its own contrast, so the line reads over any basemap and over
 * the data's colors without knowing what is underneath.
 */

import { WPC_ORIGIN } from "./externalOrigins"

export const BOUNDARY_TILES_ROOT = `${WPC_ORIGIN}/geographical_boundaries`

/**
 * The boundary line itself: near-black, so it reads as an authoritative line
 * rather than as more map furniture.
 */
const BOUNDARY_CORE_COLOR = "#1c1c1c"

/**
 * The casing under it: a near-white halo, which is what carries the line over a
 * dark basemap or a saturated stretch of the data. Deliberately the
 * inverse of the roads' light-core-on-dark-casing, so with both overlays on,
 * borders and highways stay tellable apart at a glance.
 */
const BOUNDARY_CASING_COLOR = "#f7f7f5"

/**
 * How much wider the casing runs than its core — enough that ~0.9px of halo
 * survives on each side, below which the pair collapses into one muddy stroke
 * (the same floor the road casings work to).
 */
const BOUNDARY_CASING_MARGIN = 1.8

interface BoundaryLayerDef {
  id: string
  label: string
  tooltip: string
  /** Directory name under BOUNDARY_TILES_ROOT */
  path: string
  /** Vector layer id inside the tiles, per each dataset's metadata.json */
  sourceLayer: string
  /** Core line width; the casing derives from it (see boundaryPaint) */
  width: number
  /**
   * Narrower halo than BOUNDARY_CASING_MARGIN, for a dataset dense enough that
   * the full one would read as haze rather than as outlined lines.
   */
  casingMargin?: number
  /**
   * Draws the pair back, for a dataset that should read as a hairline. This is
   * how a boundary gets lighter, NOT a sub-pixel `width`: a stroke narrower than
   * a pixel covers only part of each one it crosses, so its coverage — and with
   * it the color that lands on screen — changes from pixel to pixel and shifts
   * again on every pan and zoom. That is what makes a thin line bead, shimmer
   * and alias. Opacity fades the whole stroke evenly and stays stable, so the
   * widths below all stay at a pixel or more and lightness comes from here.
   */
  opacity?: number
  /** Hide the layer below this zoom (for dense datasets like counties) */
  minzoom?: number
}

// Overlays that start toggled on (all others default off). Merged beneath the
// persisted user choices, so turning one off sticks across visits.
export const DEFAULT_SHOWN_BOUNDARIES: Record<string, boolean> = { "state-bounds": true }

// One shared treatment, so weight is what tells overlapping overlays apart: the
// dense datasets draw as fine lines, the coarse ones as heavy ones. Below about
// a 1px core that has to come from `opacity` and a trimmed halo rather than from
// `width` — see the note on the opacity field above.
// Listed in the order the toggle chips appear, top to bottom
export const BOUNDARY_LAYERS: BoundaryLayerDef[] = [
  // The only overlay shown by default (DEFAULT_SHOWN_BOUNDARIES).
  // Shoreline-clipped US Census outlines (cb_2023_us_state_5m) — the basemap's
  // admin_level-4 lines carry maritime=0 even over open water, so they can't be
  // reused here; this is the same dataset wpc-urrd draws.
  {
    id: "state-bounds",
    label: "State Borders",
    tooltip: "State boundaries (US Census, shoreline-clipped)",
    path: "state_bounds",
    sourceLayer: "state_bounds",
    width: 1,
    // A fine line, but the only one left at full strength: this is the default
    // overlay and the reference the rest of the map is read against.
    casingMargin: 1.2,
  },
  {
    id: "fema-regions",
    label: "FEMA Regions",
    tooltip: "FEMA regions",
    path: "FEMA_regions",
    sourceLayer: "FEMA_Regions",
    width: 2.5,
  },
  {
    id: "cwa-bounds",
    label: "NWS CWAs",
    tooltip: "NWS County Warning Areas",
    path: "cwa_bounds",
    sourceLayer: "cwa_bounds",
    width: 1,
    casingMargin: 1,
    // Numerous enough to crowd the map at full strength, and read alongside the
    // state borders often enough that it should sit visibly below them
    opacity: 0.8,
  },
  {
    id: "rfc-bounds",
    label: "RFCs",
    tooltip: "River Forecast Center basins",
    path: "rfc_bounds",
    sourceLayer: "rfc_bounds",
    width: 2,
  },
  // Far and away the densest of these: at CONUS zoom the country is one mesh of
  // county lines. So it reads as a hairline — but through `opacity`, at a width
  // that still covers a whole pixel, and with a halo trimmed to match so that
  // thousands of them together don't turn the map milky.
  {
    id: "county-bounds",
    label: "Counties",
    tooltip: "County boundaries",
    path: "county_bounds",
    sourceLayer: "county_bounds",
    width: 1,
    casingMargin: 1,
    opacity: 0.6,
  },
]

interface BoundaryStroke {
  color: string
  width: number
  opacity: number
}

/** Casing / core paint for one boundary — one treatment, whatever is underneath */
export const boundaryPaint = (
  boundary: BoundaryLayerDef,
): { casing: BoundaryStroke; core: BoundaryStroke } => ({
  casing: {
    color: BOUNDARY_CASING_COLOR,
    width: boundary.width + (boundary.casingMargin ?? BOUNDARY_CASING_MARGIN),
    opacity: boundary.opacity ?? 1,
  },
  core: { color: BOUNDARY_CORE_COLOR, width: boundary.width, opacity: boundary.opacity ?? 1 },
})

/**
 * Every layer id these overlays add, bottom-up in draw order.
 */
export const BOUNDARY_LAYER_IDS: string[] = BOUNDARY_LAYERS.flatMap((b) => [`${b.id}-casing`, b.id])
