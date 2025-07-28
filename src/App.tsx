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
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { NavBar } from "@atkingtornado/wpc-navbar-reactjs"

import { ThemeToggle } from "./features/ThemeToggle"
import { DataDisplay } from "./features/DataDisplay"
import { useTheme } from "./context/ThemeContext"


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
  const [helpMenuOpen, setHelpMenuOpen] = useState<boolean>(false)

  /**
    * Opens the help/about modal
  */
  const handleOpen = () => setHelpMenuOpen(true)

  /**
    * Closes the help/about modal
  */
  const handleClose = () => setHelpMenuOpen(false)

  /**
    * Toggles the comparison mode between single and side-by-side view
  */
  const handleToggleComparison = () => {
    setComparisonToggled(!comparisonToggled)
  }

  /**
    * Toggles between static image view and interactive map view
  */
  const handleDisplayTypeChange = (e, newValue) => {
    if(newValue !== null) {
      setDisplayType(newValue);
    }
  };

  return (
    <div className={`flex flex-col min-h-screen ${mode === "light" && "bg-[#f5fbff]"}`}>
      {/* Header section with navbar and alert */}
      <div className="z-30 flex-shrink-0 relative">
        <NavBar theme={mode} />
        <Alert className="z-0 relative flex justify-center" severity="error">
          ****THIS IS A PROTOTYPE WEBSITE****
        </Alert>
      </div>

      {/* container that takes remaining height */}
      <div className="flex-1 relative">
        <ThemeToggle />

        <div className="flex align-center justify-center mb-2 mt-2">
          <Typography variant="h5" component="h2" fontWeight="bold">
            WPC ERO Verification
          </Typography>

          <Tooltip title="About this product">
            <div className="text-[#03457f] rounded-full ml-[10px] text-[24px] cursor-pointer animate-glow">
              <InfoOutlineIcon  color="primary" />
            </div>
          </Tooltip>
        </div>

        <div className="w-full flex flex-col justify-center align-center">

          <div className="flex mb-2 gap-4 align-center justify-center">
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

          {comparisonToggled ? 
          <div className="flex flex-row">
            <div className="w-[50%]">
              <DataDisplay displayType={displayType}/>
            </div>
            <div className="w-[50%]">
              <DataDisplay displayType={displayType}/>
            </div>
          </div>
          :
            <div className="w-full">
              <DataDisplay displayType={displayType}/>
            </div>
          }
          

        </div>

      </div>

    </div>
  )
}

export default App
