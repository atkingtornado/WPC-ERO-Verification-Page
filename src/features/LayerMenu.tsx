/**
 * @file Floating map layers menu, ported from wpc-urrd / wpc-wssi so the apps
 * read the same way: a circular layers button pinned to the map's right edge,
 * which expands a panel of toggle buttons to its left in captioned groups
 * (Boundaries: the overlay lines; Transportation: major roads).
 *
 * The toggles are full-width buttons on an elevated paper panel rather than
 * bare chips floating over the map, so they line up and stay legible against
 * the basemap, and the panel scrolls internally when the map is shorter than
 * the full list. Toggling one leaves the panel up, so several overlays can be
 * flipped without re-opening anything; clicking anywhere else closes it.
 */

import { useState, type ReactNode } from "react"

import Button from "@mui/material/Button"
import ClickAwayListener from "@mui/material/ClickAwayListener"
import IconButton from "@mui/material/IconButton"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import LayersIcon from "@mui/icons-material/Layers"

import { TouchTooltip as Tooltip } from "./TouchTooltip"
import { BOUNDARY_LAYERS } from "../constants/boundaryLayers"
import { ROAD_OVERLAY_ID, ROAD_OVERLAY_LABEL, ROAD_OVERLAY_TOOLTIP } from "../constants/roadLayers"

/** Width of the overlay panel; every toggle stretches to fill it */
const PANEL_WIDTH = 168

/**
 * Small caption heading each group of toggles. Plain text, so it reads as an
 * annotation rather than a control. `topGap` adds the extra breathing room
 * above a later group.
 */
const LayerMenuCaption = ({ children, topGap = false }: { children: ReactNode; topGap?: boolean }) => (
  <Typography
    variant="caption"
    component="div"
    sx={{
      pl: 0.5,
      color: "text.secondary",
      fontWeight: 700,
      letterSpacing: 0.8,
      textTransform: "uppercase",
      fontSize: "0.65rem",
      ...(topGap && { mt: 1 }),
    }}
  >
    {children}
  </Typography>
)

/**
 * One overlay toggle: a full-width button so every row in the panel lines up.
 * Filled when the overlay is shown, outlined when hidden.
 */
const OverlayToggle = ({
  label,
  tooltip,
  shown,
  onToggle,
}: {
  label: string
  tooltip: string
  shown: boolean
  onToggle: () => void
}) => (
  <Tooltip
    title={tooltip}
    disableInteractive
    TransitionProps={{ timeout: { enter: 225, exit: 0 } }}
  >
    <Button
      fullWidth
      size="small"
      disableElevation
      variant={shown ? "contained" : "outlined"}
      onClick={onToggle}
      aria-pressed={shown}
      sx={{ textTransform: "none", borderRadius: 4, whiteSpace: "nowrap" }}
    >
      {label}
    </Button>
  </Tooltip>
)

interface LayerMenuProps {
  /** Overlay toggles, keyed by BOUNDARY_LAYERS id plus ROAD_OVERLAY_ID */
  shownOverlays: Record<string, boolean>
  setShownOverlays: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
  /**
   * Offset from the container's top edge (px). Default 8; the map passes a
   * larger offset to sit the button below maplibre's fullscreen control.
   */
  top?: number
  /** Offset from the container's right edge (px). Default 8. */
  right?: number
}

/**
 * Layers button plus its expanding panel of overlay toggle buttons. Positions
 * itself at the right edge of the nearest positioned ancestor (the map's
 * container), `top` px down from its top edge, and spans down to its bottom so
 * the panel's scroll limit follows the map's own height.
 * @component
 */
export const LayerMenu = ({ shownOverlays, setShownOverlays, top = 8, right = 8 }: LayerMenuProps) => {
  const [expanded, setExpanded] = useState(false)
  const toggle = (id: string) => setShownOverlays((prev) => ({ ...prev, [id]: !prev[id] }))

  return (
    // Guarded so the listener (mounted even while collapsed) only acts on an open panel.
    <ClickAwayListener onClickAway={() => { if (expanded) setExpanded(false) }}>
      {/* The wrapper spans the map's height only so the panel can cap its own
          height against it. Pointer events are off on the wrapper and re-enabled
          on the papers, so clicks in the empty space it spans fall through to
          the map. */}
      <div className="pointer-events-none absolute bottom-2 z-10 flex items-start gap-2" style={{ top, right }}>
        {expanded && (
          // Elevated panel behind the toggles so they read over the basemap;
          // scrolls internally on short maps/windows instead of overflowing them
          <Paper
            elevation={4}
            className="pointer-events-auto opacity-95"
            sx={{ width: PANEL_WIDTH, maxHeight: "min(100%, 520px)", overflowY: "auto", borderRadius: 1.5, p: 1 }}
          >
            <div className="flex flex-col items-stretch gap-1.5">
              <LayerMenuCaption>Boundaries</LayerMenuCaption>
              {BOUNDARY_LAYERS.map((boundary) => (
                <OverlayToggle
                  key={boundary.id}
                  label={boundary.label}
                  tooltip={boundary.tooltip}
                  shown={!!shownOverlays[boundary.id]}
                  onToggle={() => toggle(boundary.id)}
                />
              ))}
              <LayerMenuCaption topGap>Transportation</LayerMenuCaption>
              <OverlayToggle
                label={ROAD_OVERLAY_LABEL}
                tooltip={ROAD_OVERLAY_TOOLTIP}
                shown={!!shownOverlays[ROAD_OVERLAY_ID]}
                onToggle={() => toggle(ROAD_OVERLAY_ID)}
              />
            </div>
          </Paper>
        )}
        <Paper sx={{ borderRadius: "50%" }} className="pointer-events-auto p-0 opacity-90 shrink-0">
          <Tooltip
            title="Map layers"
            disableInteractive
            TransitionProps={{ timeout: { enter: 225, exit: 0 } }}
          >
            <IconButton
              size="small"
              onClick={() => setExpanded((prev) => !prev)}
              color={expanded ? "primary" : "default"}
              aria-label="Toggle map layers"
              aria-expanded={expanded}
            >
              <LayersIcon />
            </IconButton>
          </Tooltip>
        </Paper>
      </div>
    </ClickAwayListener>
  )
}
