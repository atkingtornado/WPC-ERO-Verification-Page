/**
 * @file Collapsible map attribution control, ported from wpc-urrd / wpc-wssi.
 */

import { useControl } from "react-map-gl/maplibre"
import { AttributionControl as MaplibreAttributionControl } from "maplibre-gl"

/**
 * Map attribution in maplibre's compact mode — a small "i" button that expands
 * on click, so the credits stay out of the way instead of running along the
 * bottom of the map.
 *
 * The compact control mounts *expanded* (maplibre only minimizes it on the first
 * map drag). Collapsing it after the fact paints an expanded frame first, so
 * instead wrap the control's own _updateCompact to strip the expanded state
 * synchronously in the same call that adds it — until the user clicks the
 * control, after which it's theirs to open and close.
 * @component
 */
export const CollapsibleAttribution = () => {
  useControl(
    () => {
      const attribution = new MaplibreAttributionControl({ compact: true })

      const attrib = attribution as unknown as { _container?: HTMLElement; _updateCompact: () => void }
      let userInteracted = false
      let listenerAttached = false
      const originalUpdateCompact = attrib._updateCompact // arrow property, already bound
      attrib._updateCompact = () => {
        originalUpdateCompact()
        // _container only exists once the control has been added to the map,
        // which is also the first time this runs
        const container = attrib._container
        if (!container) return
        if (!listenerAttached) {
          listenerAttached = true
          container.addEventListener("click", () => { userInteracted = true }, { once: true })
        }
        if (!userInteracted) container.classList.remove("maplibregl-compact-show")
      }

      return attribution
    },
    { position: "bottom-right" },
  )

  return null
}
