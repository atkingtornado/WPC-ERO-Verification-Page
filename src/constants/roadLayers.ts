/**
 * @file The "Major Roads" map overlay — interstates and the other principal
 * arterials, drawn above the verification data so it can be read against the
 * road network. Ported from wpc-wssi.
 *
 * Kept separate from ../constants/boundaryLayers (whose datasets are all
 * administrative polygons sharing one flat line style) because roads need a
 * different treatment: a casing under a light core so the line stays legible
 * over both basemap themes AND over the data's full color range, zoom-scaled widths,
 * and two feature classes drawn at different weights.
 *
 * The tiles are built and published by scripts/build-road-tiles.sh — a
 * tippecanoe pyramid from the Census TIGER/Line primary-roads national file,
 * hosted next to the boundary overlays under /geographical_boundaries.
 * ROAD_TILE_MAXZOOM must match the maxzoom that script tiles to.
 *
 * The layers set no minzoom: the overlay draws at every zoom the map reaches.
 * What is visible far out is still decided by the data, though — the tiling
 * script omits the non-interstate class below its HIGHWAY_MINZOOM (z6), where
 * the full primary network degenerates into unreadable hatching, so zooming out
 * past that thins the overlay to the interstate system on its own.
 */

import type { ExpressionSpecification } from "maplibre-gl"

import { WPC_ORIGIN } from "./externalOrigins"

/** Toggle id — the key this overlay uses in the shown-overlays record */
export const ROAD_OVERLAY_ID = "major-roads"
export const ROAD_OVERLAY_LABEL = "Major Roads"
export const ROAD_OVERLAY_TOOLTIP = "Interstates and other primary highways"

export const ROAD_SOURCE_ID = "major-roads-source"
export const ROAD_TILE_URL = `${WPC_ORIGIN}/geographical_boundaries/major_roads/{z}/{x}/{y}.pbf`
/** Vector layer id inside the tiles (see the pyramid's metadata.json) */
export const ROAD_SOURCE_LAYER = "major_roads"
/**
 * Deepest zoom the pyramid holds; maplibre overzooms past it. Deeper than the
 * boundary pyramids' 7 because road geometry frozen at z7 detail reads as
 * visibly angular at city scale.
 */
export const ROAD_TILE_MAXZOOM = 9

/** Line core, per theme. Near-white in both — paired with the casing below it
    reads as a road ribbon over anything: the dark basemaps, the light ones, and
    every color in the data. */
const ROAD_CORE_COLOR: Record<"light" | "dark", string> = {
  light: "#ffffff",
  dark: "#efece6",
}

/** Casing drawn beneath the core. Unlike the boundary overlays' dark-mode-only
    casing this is present in both themes — it is what gives the line its shape
    over a light basemap, where a white core alone would vanish. */
const ROAD_CASING_COLOR: Record<"light" | "dark", string> = {
  light: "#3a3733",
  dark: "#0a0a0a",
}

/** Builds a `line-width` zoom ramp from [zoom, width] stops */
const widthRamp = (stops: [number, number][]): ExpressionSpecification =>
  ["interpolate", ["linear"], ["zoom"], ...stops.flat()] as ExpressionSpecification

interface RoadClassDef {
  /** Layer id for the core line; the casing appends "-casing" */
  id: string
  /** Value of the tiles' `class` attribute this pair draws */
  featureClass: "interstate" | "highway"
  core: [number, number][]
  casing: [number, number][]
}

/**
 * The two road classes, listed bottom-up: the thinner non-interstate highways
 * draw first so interstates sit on top of them at junctions.
 *
 * The casing runs wider than the core by enough that at least half a pixel of
 * it survives on each side — below that the pair collapses into one muddy
 * stroke and the road stops reading as a road. That margin is what sets the
 * floor on how thin these can go, and the low-zoom stops sit right on it.
 *
 * Both ramps carry a z0 stop so the lines keep thinning as the map zooms out
 * (interpolate clamps to the first stop, so without one they would hold their
 * z4/z6 weight all the way to the world view).
 */
export const ROAD_CLASSES: RoadClassDef[] = [
  {
    // US and state routes and other principal arterials. The tiles carry these
    // only from z6 up (see the file header), so the low stops here just govern
    // how they fade in around that threshold.
    id: "major-roads-highway",
    featureClass: "highway",
    core: [[0, 0.35], [6, 0.45], [10, 0.95], [14, 1.8]],
    casing: [[0, 1.35], [6, 1.45], [10, 2.0], [14, 3.1]],
  },
  {
    // Interstates — the only class present at continental zoom, and the heavier
    // of the two everywhere.
    id: "major-roads-interstate",
    featureClass: "interstate",
    core: [[0, 0.4], [4, 0.6], [8, 1.3], [12, 2.4]],
    casing: [[0, 1.4], [4, 1.6], [8, 2.4], [12, 3.9]],
  },
]

/**
 * Every layer id this overlay adds, bottom-up in draw order.
 */
export const ROAD_LAYER_IDS: string[] = ROAD_CLASSES.flatMap((c) => [`${c.id}-casing`, c.id])

/** Paint for one class's casing / core at the active theme */
export const roadPaint = (
  road: RoadClassDef,
  mode: "light" | "dark",
): { casing: { color: string; width: ExpressionSpecification }; core: { color: string; width: ExpressionSpecification } } => ({
  casing: { color: ROAD_CASING_COLOR[mode], width: widthRamp(road.casing) },
  core: { color: ROAD_CORE_COLOR[mode], width: widthRamp(road.core) },
})

/** Filter selecting one class's features out of the shared source layer */
export const roadFilter = (road: RoadClassDef): ExpressionSpecification =>
  ["==", ["get", "class"], road.featureClass]

export const ROAD_ATTRIBUTION =
  'Roads: <a href="https://www.census.gov/geographies/mapping-files/time-series/geo/tiger-line-file.html" target="_blank">US Census TIGER/Line</a>'
