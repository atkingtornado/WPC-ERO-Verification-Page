/**
 * @file Owns (and persists) which map overlays are shown — the toggles the
 * floating layers menu flips and MapOverlays draws.
 */

import { useEffect, useState } from "react"

import { DEFAULT_SHOWN_BOUNDARIES } from "../constants/boundaryLayers"

/** localStorage key for the overlay toggles, so a visitor's choices stick across visits */
const OVERLAYS_STORAGE_KEY = "ero-verif-map-overlays"

/** Narrows a persisted overlay-toggle record to its boolean entries */
const loadShownOverlays = (): Record<string, boolean> => {
  try {
    const raw = localStorage.getItem(OVERLAYS_STORAGE_KEY)
    const parsed: unknown = raw ? JSON.parse(raw) : null
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return {}
    return Object.fromEntries(
      Object.entries(parsed as Record<string, unknown>).filter(([, on]) => typeof on === "boolean"),
    ) as Record<string, boolean>
  } catch {
    return {}
  }
}

/**
 * Which overlays are on, keyed by BOUNDARY_LAYERS id plus ROAD_OVERLAY_ID.
 * DEFAULT_SHOWN_BOUNDARIES supplies the defaults, with the persisted choices
 * layered on top; every change is written back. Owned once (in App) so both
 * maps in comparison mode share the same toggles.
 */
export const useShownOverlays = (): [Record<string, boolean>, React.Dispatch<React.SetStateAction<Record<string, boolean>>>] => {
  const [shownOverlays, setShownOverlays] = useState<Record<string, boolean>>(
    () => ({ ...DEFAULT_SHOWN_BOUNDARIES, ...loadShownOverlays() }),
  )
  useEffect(() => {
    try {
      localStorage.setItem(OVERLAYS_STORAGE_KEY, JSON.stringify(shownOverlays))
    } catch { /* storage unavailable */ }
  }, [shownOverlays])
  return [shownOverlays, setShownOverlays]
}

