/**
 * @file The map's basemap: the detailed MapLibre style shared with wpc-urrd and
 * wpc-wssi, drawn from the WPC-hosted OpenMapTiles vector tiles. Land, water,
 * administrative boundaries, major highways and city labels — and deliberately
 * no water-body labels — in a light and a dark variant so the basemap follows
 * the application theme.
 *
 * Two invisible anchor layers give the runtime layers a stable place in the
 * draw order without caring what order they mount in (react-map-gl inserts a
 * layer wherever its `beforeId` sits at mount time):
 *
 *   basemap … → data layers → DATA_ANCHOR_LAYER_ID → overlays → TOP_BASEMAP_LAYER_ID (city labels)
 */

import type { StyleSpecification } from 'maplibre-gl';

import { WPC_ORIGIN, MAPTILER_ORIGIN } from './externalOrigins';

/**
 * Id of the basemap's city-label layer — the "always on top" layer both styles
 * below end with. The boundary and road overlays pass it as their `beforeId`,
 * so city names stay legible above everything.
 */
const TOP_BASEMAP_LAYER_ID = "city-labels"

/**
 * Invisible layer sitting just below the overlays. The verification data layers
 * pass it as their `beforeId`, which lands them beneath every overlay however
 * the two groups were mounted.
 */
const DATA_ANCHOR_LAYER_ID = "data-anchor"

/**
 * Basemap vector tiles, shared by both styles below — the same pyramid
 * wpc-urrd and wpc-wssi draw from.
 */
const BASEMAP_TILE_URL = `${WPC_ORIGIN}/map-tiles/basemap/{z}/{x}/{y}.pbf`

/** Light-themed basemap style. */
const detailedLightStyle: StyleSpecification = {
  version: 8,
  glyphs: `${MAPTILER_ORIGIN}/fonts/{fontstack}/{range}.pbf?key=3g9gAaRe8ukSFBsBpU96`,
  sources: {
    boundaries: {
      type: "vector",
      tiles: [BASEMAP_TILE_URL],
      maxzoom: 10,
      attribution: "© OpenMapTiles",
    },
  },
  layers: [
    {
      id: "background",
      type: "background",
      paint: {
        "background-color": "#fafaf8",
      },
    },
    // Water areas - Filtered to primarily show oceans/large seas for coastlines
    {
      id: "water",
      type: "fill",
      source: "boundaries",
      "source-layer": "water",
      filter: ["in", "class", "ocean", "sea", "lake"],
      paint: {
        "fill-color": "#d4dadc",
        "fill-outline-color": "#333333", // Outline for the ocean fill, forms a basic coastline
      },
      minzoom: 0,
    },
    {
      id: "country-boundaries",
      type: "line",
      source: "boundaries",
      "source-layer": "boundary",
      filter: [
        "all",
        ["==", "admin_level", 2],
        ["!=", "maritime", 1],
      ],
      paint: {
        "line-color": "#333333",
        "line-width": 1.5,
      },
      minzoom: 0,
    },
    {
      id: "state-boundaries",
      type: "line",
      source: "boundaries",
      "source-layer": "boundary",
      filter: ["==", "admin_level", 4],
      paint: {
        "line-color": "#666666",
        "line-width": 1,
      },
      minzoom: 0,
    },
    {
      id: "state-boundaries-maritime",
      type: "line",
      source: "boundaries",
      "source-layer": "boundary",
      filter: [
        "all",
        ["==", "admin_level", 4],
        ["==", "maritime", 1]
      ],
      paint: {
        "line-color": "#666666",
        "line-width": 1,
        "line-dasharray": [2, 2]
      },
      minzoom: 0
    },
    // Coastlines traced from the ocean polygons' own edges
    {
      id: "coastline-explicit",
      type: "line",
      source: "boundaries",
      "source-layer": "water",
      filter: [
        "all",
        ["==", "$type", "LineString"],
        ["==", "class", "ocean"],
      ],
      paint: {
        "line-color": "#333333",
        "line-width": 1.5,
      },
      minzoom: 0,
    },
    {
      id: "highways",
      type: "line",
      source: "boundaries",
      "source-layer": "transportation",
      filter: [
        "all",
        ["==", "$type", "LineString"],
        ["in", "class", "motorway", "trunk"]
      ],
      paint: {
        "line-color": "#d0d0d0",
        "line-width": [
          "interpolate",
          ["linear"],
          ["zoom"],
          5, 1.5,
          10, 3,
          14, 6
        ],
        "line-opacity": 0.8
      },
      layout: {
        "line-cap": "round",
        "line-join": "round"
      },
      minzoom: 5
    },
    // Invisible: only here so the data layers have a fixed slot beneath the
    // overlays (see the file header).
    {
      id: DATA_ANCHOR_LAYER_ID,
      type: "background",
      paint: { "background-opacity": 0 },
    },
    {
      id: "city-labels",
      type: "symbol",
      source: "boundaries",
      "source-layer": "place",
      filter: [
        "all",
        ["==", "$type", "Point"],
        ["==", "class", "city"],
        ["!=", "capital", 2] // exclude minor capitals
      ],
      layout: {
        "text-field": ["get", "name"],
        "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
        "text-size": [
          "interpolate",
          ["linear"],
          ["zoom"],
          4, 10,
          8, 14,
          12, 18
        ],
        "text-anchor": "center",
        "text-max-width": 10
      },
      paint: {
        "text-color": "#fff",
        "text-halo-color": "#444",
        "text-halo-width": 0.75
      },
      minzoom: 4
    },
  ],
}

/** Dark-themed basemap style; layer-for-layer the light style with dark colors. */
const detailedDarkStyle: StyleSpecification = {
  version: 8,
  glyphs: `${MAPTILER_ORIGIN}/fonts/{fontstack}/{range}.pbf?key=3g9gAaRe8ukSFBsBpU96`,
  sources: {
    boundaries: {
      type: "vector",
      tiles: [BASEMAP_TILE_URL],
      maxzoom: 10,
      attribution: "© OpenMapTiles",
    },
  },
  layers: [
    {
      id: "background",
      type: "background",
      paint: {
        "background-color": "#0e0e0e",
      },
    },
    // Water areas - Filtered to primarily show oceans/large seas for coastlines
    {
      id: "water",
      type: "fill",
      source: "boundaries",
      "source-layer": "water",
      filter: ["in", "class", "ocean", "sea", "lake"],
      paint: {
        "fill-color": "#2c353c",
        "fill-outline-color": "#333333", // Outline for the ocean fill, forms a basic coastline
      },
      minzoom: 0,
    },
    {
      id: "country-boundaries",
      type: "line",
      source: "boundaries",
      "source-layer": "boundary",
      filter: [
        "all",
        ["==", "admin_level", 2],
        ["!=", "maritime", 1],
      ],
      paint: {
        "line-color": "#333333",
        "line-width": 1.5,
      },
      minzoom: 0,
    },
    {
      id: "state-boundaries",
      type: "line",
      source: "boundaries",
      "source-layer": "boundary",
      filter: ["==", "admin_level", 4],
      paint: {
        "line-color": "#666666",
        "line-width": 1,
      },
      minzoom: 0,
    },
    {
      id: "state-boundaries-maritime",
      type: "line",
      source: "boundaries",
      "source-layer": "boundary",
      filter: [
        "all",
        ["==", "admin_level", 4],
        ["==", "maritime", 1],
      ],
      paint: {
        "line-color": "#666666",
        "line-width": 1,
        "line-dasharray": [2, 2],
      },
      minzoom: 0,
    },
    // Coastlines traced from the ocean polygons' own edges
    {
      id: "coastline-explicit",
      type: "line",
      source: "boundaries",
      "source-layer": "water",
      filter: [
        "all",
        ["==", "$type", "LineString"],
        ["==", "class", "ocean"],
      ],
      paint: {
        "line-color": "#333333",
        "line-width": 1.5,
      },
      minzoom: 0,
    },
    {
      id: "highways",
      type: "line",
      source: "boundaries",
      "source-layer": "transportation",
      filter: [
        "all",
        ["==", "$type", "LineString"],
        ["in", "class", "motorway", "trunk"]
      ],
      paint: {
        "line-color": "#1e1e1e",
        "line-width": [
          "interpolate",
          ["linear"],
          ["zoom"],
          5, 1.5,
          10, 3,
          14, 6
        ],
        "line-opacity": 0.8
      },
      layout: {
        "line-cap": "round",
        "line-join": "round"
      },
      minzoom: 5
    },
    // Invisible: only here so the data layers have a fixed slot beneath the
    // overlays (see the file header).
    {
      id: DATA_ANCHOR_LAYER_ID,
      type: "background",
      paint: { "background-opacity": 0 },
    },
    {
      id: "city-labels",
      type: "symbol",
      source: "boundaries",
      "source-layer": "place",
      filter: [
        "all",
        ["==", "$type", "Point"],
        ["==", "class", "city"],
        ["!=", "capital", 2] // exclude minor capitals
      ],
      layout: {
        "text-field": ["get", "name"],
        "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
        "text-size": [
          "interpolate",
          ["linear"],
          ["zoom"],
          4, 10,
          8, 14,
          12, 18
        ],
        "text-anchor": "center",
        "text-max-width": 10
      },
      paint: {
        "text-color": "#444",
        "text-halo-color": "#fff",
        "text-halo-width": 0.75
      },
      minzoom: 4
    },
  ],
}

export { detailedLightStyle, detailedDarkStyle, TOP_BASEMAP_LAYER_ID, DATA_ANCHOR_LAYER_ID }
