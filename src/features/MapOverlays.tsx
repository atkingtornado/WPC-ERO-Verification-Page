/**
 * @file The geographic boundary and major-road overlays as declarative
 * react-map-gl layers (which of them are shown is owned by
 * ../hooks/useShownOverlays). wpc-wssi adds the same layers imperatively; here react-map-gl's
 * Source/Layer components do the add/remove bookkeeping (including after the
 * map is re-created), and every layer passes TOP_BASEMAP_LAYER_ID as its
 * `beforeId` so it lands above the verification data (which anchors beneath
 * DATA_ANCHOR_LAYER_ID) and below the city labels.
 *
 * The roads mount before the boundaries so they draw beneath them: they are
 * the denser, less important reference of the two, and a state border crossed
 * by an interstate should read as continuous.
 */

import { Source, Layer } from "react-map-gl/maplibre"

import { BOUNDARY_LAYERS, BOUNDARY_TILES_ROOT, boundaryPaint } from "../constants/boundaryLayers"
import { TOP_BASEMAP_LAYER_ID } from "../constants/mapStyles"
import {
  ROAD_ATTRIBUTION,
  ROAD_CLASSES,
  ROAD_OVERLAY_ID,
  ROAD_SOURCE_ID,
  ROAD_SOURCE_LAYER,
  ROAD_TILE_MAXZOOM,
  ROAD_TILE_URL,
  roadFilter,
  roadPaint,
} from "../constants/roadLayers"

/** One boundary dataset: its vector source plus a casing and a core line. */
const BoundaryOverlay = ({ boundary }: { boundary: (typeof BOUNDARY_LAYERS)[number] }) => {
  const paint = boundaryPaint(boundary)
  const common = {
    type: "line" as const,
    "source-layer": boundary.sourceLayer,
    minzoom: boundary.minzoom ?? 0,
    layout: { "line-join": "round" as const },
    beforeId: TOP_BASEMAP_LAYER_ID,
  }
  return (
    <Source
      id={`${boundary.id}-source`}
      type="vector"
      tiles={[`${BOUNDARY_TILES_ROOT}/${boundary.path}/{z}/{x}/{y}.pbf`]}
      minzoom={0}
      maxzoom={7}
    >
      <Layer
        {...common}
        id={`${boundary.id}-casing`}
        paint={{
          "line-color": paint.casing.color,
          "line-width": paint.casing.width,
          "line-opacity": paint.casing.opacity,
        }}
      />
      <Layer
        {...common}
        id={boundary.id}
        paint={{
          "line-color": paint.core.color,
          "line-width": paint.core.width,
          "line-opacity": paint.core.opacity,
        }}
      />
    </Source>
  )
}

/** The major-roads overlay: one source, a casing and a core per road class, colored per theme. */
const RoadOverlay = ({ mode }: { mode: "light" | "dark" }) => (
  <Source
    id={ROAD_SOURCE_ID}
    type="vector"
    tiles={[ROAD_TILE_URL]}
    minzoom={0}
    maxzoom={ROAD_TILE_MAXZOOM}
    attribution={ROAD_ATTRIBUTION}
  >
    {ROAD_CLASSES.map((road) => {
      const paint = roadPaint(road, mode)
      const common = {
        type: "line" as const,
        "source-layer": ROAD_SOURCE_LAYER,
        filter: roadFilter(road),
        layout: { "line-join": "round" as const, "line-cap": "round" as const },
        beforeId: TOP_BASEMAP_LAYER_ID,
      }
      return [
        <Layer
          key={`${road.id}-casing`}
          {...common}
          id={`${road.id}-casing`}
          paint={{ "line-color": paint.casing.color, "line-width": paint.casing.width }}
        />,
        <Layer
          key={road.id}
          {...common}
          id={road.id}
          paint={{ "line-color": paint.core.color, "line-width": paint.core.width }}
        />,
      ]
    })}
  </Source>
)

interface MapOverlaysProps {
  /** Overlay toggles (see useShownOverlays) */
  shownOverlays: Record<string, boolean>
  /** Active theme; decides the road colors */
  mode: "light" | "dark"
}

/** Every overlay whose toggle is on. Render inside a react-map-gl <Map>. */
export const MapOverlays = ({ shownOverlays, mode }: MapOverlaysProps) => (
  <>
    {shownOverlays[ROAD_OVERLAY_ID] && <RoadOverlay mode={mode} />}
    {BOUNDARY_LAYERS.filter((b) => shownOverlays[b.id]).map((boundary) => (
      <BoundaryOverlay key={boundary.id} boundary={boundary} />
    ))}
  </>
)
