/**
  * @fileoverview Main application component for WPC ERO Verification tool
  *
  * This component serves as the primary container for the WPC ERO Verification
  * application. It manages the display state (static vs interactive), comparison
  * mode, etc.
*/

import { useState } from 'react'

import Alert from "@mui/material/Alert"
import Tooltip from "@mui/material/Tooltip"
import ToggleButton from "@mui/material/ToggleButton"
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from "@mui/material/Typography"
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import HelpIcon from '@mui/icons-material/Help';

import { NavBar } from "@atkingtornado/wpc-navbar-reactjs"

import { ThemeToggle } from "./features/ThemeToggle"
import { DataDisplay } from "./features/DataDisplay"
import { useShownOverlays } from "./hooks/useShownOverlays"
import { AboutModal } from "./features/AboutModal"
import { useTheme } from "./context/ThemeContext"

import type { MapViewState } from "./types"

import 'react-medium-image-zoom/dist/styles.css';

import './App.css'

/**
  * Main application component that controls the display of ERO verification data.
  *
  * @returns {JSX.Element} The rendered App component
*/
function App() {
  const { mode } = useTheme()

  // State for controlling comparison mode (single vs side-by-side view)
  const [comparisonToggled, setComparisonToggled] = useState<boolean>(false)

  // State for controlling display type (static image vs interactive map)
  const [displayType, setDisplayType] = useState<"static"|"interactive">("static")

  // State for controlling the help/about modal visibility
  const [aboutModalOpen, setAboutModalOpen] = useState<boolean>(false)

  // Prototype banner: dismissible for the current visit, back on the next one
  // (the same convention as wpc-urrd / wpc-wssi)
  const [showPrototypeAlert, setShowPrototypeAlert] = useState<boolean>(true)

  // Boundary / road overlay toggles (persisted) - at the App level so both compared maps share them
  const [shownOverlays, setShownOverlays] = useShownOverlays()

  // State for controlling the interactive map view - at the App level to facilitate sync when comparing
  const [mapViewState, setMapViewState] = useState<MapViewState>({
    longitude: -98.4,
    latitude: 39.5,
    zoom: 3
  });

  /**
    * Opens the help/about modal
  */
  const handleOpen = () => setAboutModalOpen(true)

  /**
    * Closes the help/about modal
  */
  const handleClose = () => setAboutModalOpen(false)

  /**
    * Toggles the comparison mode between single and side-by-side view
  */
  const handleToggleComparison = () => {
    setComparisonToggled(!comparisonToggled)
  }

  /**
    * Toggles between static image view and interactive map view
  */
  const handleDisplayTypeChange = (_e: React.MouseEvent<HTMLElement>, newValue: "static" | "interactive" | null) => {
    if(newValue !== null) {
      setDisplayType(newValue);
    }
  };

  return (
    <div className={`flex flex-col min-h-screen ${mode === "light" && "bg-[#f5fbff]"}`}>
      {/* Header section with navbar and alert */}
      <div className="z-30 flex-shrink-0 relative">
        <NavBar theme={mode} />
        {showPrototypeAlert && (
          <Alert
            className="z-0 relative flex justify-center"
            severity="error"
            onClose={() => setShowPrototypeAlert(false)}
          >
            ****THIS IS A PROTOTYPE WEBSITE****
          </Alert>
        )}
      </div>

      {/* container that takes remaining height */}
      <div className="flex-1 relative">
        <ThemeToggle />

        <div className="flex items-center text-center justify-center mb-2 mt-2">
          <Typography variant="h5" component="h2" fontWeight="bold">
            WPC ERO Verification
          </Typography>

          <div className="ml-1 cursor-pointer">
            <Tooltip title="About this product">
              <HelpIcon color="primary" onClick={handleOpen} />
            </Tooltip>
          </div>
        </div>

        <div className="w-full flex flex-col justify-center align-center">

          <div className="flex z-10 mb-2 gap-4 align-center justify-center">
            <div>
              <ToggleButtonGroup
                color="primary"
                value={displayType}
                exclusive
                onChange={handleDisplayTypeChange}
                aria-label="display mode"
                size="small"
              >
                <ToggleButton value="static">Static</ToggleButton>
                <ToggleButton value="interactive">Interactive</ToggleButton>
              </ToggleButtonGroup>
            </div>
            <div>
              <FormControlLabel control={<Switch value={comparisonToggled} onChange={handleToggleComparison} />} label="Compare" />
            </div>
          </div>

          <div className={`flex ${comparisonToggled ? 'flex-row' : ''}`}>
            <div className={comparisonToggled ? 'w-[50%]' : 'w-full'}>
              <DataDisplay mapViewState={mapViewState} setMapViewState={setMapViewState} displayType={displayType} shownOverlays={shownOverlays} setShownOverlays={setShownOverlays} />
            </div>

            {comparisonToggled && (
              <div className="w-[50%]">
                <DataDisplay mapViewState={mapViewState} setMapViewState={setMapViewState} displayType={displayType} shownOverlays={shownOverlays} setShownOverlays={setShownOverlays} />
              </div>
            )}
          </div>
          

        </div>

      </div>

      {/* About modal */}
      <AboutModal onClose={handleClose} open={aboutModalOpen} />

    </div>
  )
}

export default App
