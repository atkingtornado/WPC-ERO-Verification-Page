"use client"

/**
 * @fileoverview Main application component for WPC ERO Verification tool
 *
 * This component serves as the primary container for the WPC ERO Verification
 * application. It manages the display state (static vs interactive), comparison
 * mode, and view type (archive vs current).
 */
import { useState } from "react"
import { NavBar } from "@atkingtornado/wpc-navbar-reactjs"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleQuestion } from "@fortawesome/free-solid-svg-icons"
import Switch from "react-switch"

import Button from "@mui/material/Button"
import Tooltip from "@mui/material/Tooltip"
import Alert from "@mui/material/Alert"

import ImageDisplay from "./features/ImageDisplay"
import MapDisplay from "./features/MapDisplay"
import AboutModal from "./features/AboutModal"

import "./App.css"
import styles from "./app.module.css"

/**
 * Main application component that controls the display of ERO verification data.
 *
 * @returns {JSX.Element} The rendered App component
 */
function App() {
  // State for controlling comparison mode (single vs side-by-side view)
  const [comparisonToggled, setComparisonToggled] = useState(false)

  // State for controlling data source (archive or current data)
  const [archiveOrCurrent, setArchiveOrCurrent] = useState("current")

  // State for controlling display type (static image vs interactive map)
  const [displayType, setDisplayType] = useState("static")

  // State for map view (longitude, latitude, zoom level)
  const [mapViewState, setMapViewState] = useState({
    longitude: -98.4,
    latitude: 39.5,
    zoom: 3,
  })

  // State for controlling the help/about modal visibility
  const [helpMenuOpen, setHelpMenuOpen] = useState(false)

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
   * Handles switching between archive and current data sources
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event from the radio button
   */
  const handleArchiveOrCurrentSwitch = (e) => {
    setArchiveOrCurrent(e.target.value)
  }

  /**
   * Toggles between static image view and interactive map view
   */
  const handleDisplayTypeSwitch = () => {
    setDisplayType(displayType === "static" ? "interactive" : "static")
  }

  return (
    <div className="App">
      {/* WPC Navigation bar */}
      <div className={styles.NavBar}>
        <NavBar />
      </div>

      {/* Prototype warning banner */}
      <Alert sx={{ display: "flex", justifyContent: "center" }} severity="error">
        ****THIS IS A PROTOTYPE WEBSITE****
      </Alert>

      <div>
        {/* Title and about icon */}
        <div className={styles.TitleContainer}>
          <h2 className={styles.TitleHeader}>WPC ERO Verification</h2>
          <Tooltip title="About this product">
            <FontAwesomeIcon className={styles.AboutIcon} icon={faCircleQuestion} onClick={handleOpen} />
          </Tooltip>
        </div>

        {/* Display type toggle button */}
        <div className={styles.DisplayTypeButtonContainer}>
          <Button
            size="small"
            variant="contained"
            className={styles.DisplayTypeButton}
            onClick={handleDisplayTypeSwitch}
          >
            {displayType === "static" ? "Interactive View" : "Plot View"}
          </Button>
        </div>

        {/* Plot options container */}
        <div className={styles.PlotOptionsContainer}>
          {/* Archive/Current radio button group */}
          <div className={styles.PlotTypeRadioContainer}>
            <div>
              <input
                onChange={handleArchiveOrCurrentSwitch}
                type="radio"
                id="archive"
                name="type"
                value="archive"
                checked={archiveOrCurrent === "archive"}
              />
              <label htmlFor="archive">
                <b>Archive</b>
              </label>

              <input
                onChange={handleArchiveOrCurrentSwitch}
                type="radio"
                id="current"
                name="type"
                value="current"
                checked={archiveOrCurrent === "current"}
              />
              <label htmlFor="current">
                <b>Current</b>
              </label>
            </div>
          </div>

          {/* Comparison toggle switch */}
          <div className={styles.ComparisonToggleContainer}>
            <Switch
              className={styles.ComparisonToggleSwitch}
              onChange={handleToggleComparison}
              checked={comparisonToggled}
            />
            <p className={styles.ComparisonToggleLabel}>Compare</p>
          </div>
        </div>

        {/* Conditional rendering based on display type */}
        {displayType === "interactive" ? (
          // Interactive map view
          <>
            <div className={comparisonToggled ? styles.MultiPlotContainer : styles.SinglePlotContainer}>
              <MapDisplay
                mapID={"map1"}
                comparisonToggled={comparisonToggled}
                mapViewState={mapViewState}
                setMapViewState={setMapViewState}
                archiveOrCurrent={archiveOrCurrent}
              />
            </div>
            {/* Render second map if comparison is toggled */}
            {comparisonToggled && (
              <div className={styles.MultiPlotContainer}>
                <MapDisplay
                  mapID={"map2"}
                  comparisonToggled={comparisonToggled}
                  mapViewState={mapViewState}
                  setMapViewState={setMapViewState}
                  archiveOrCurrent={archiveOrCurrent}
                />
              </div>
            )}
          </>
        ) : (
          // Static image view
          <>
            <div className={comparisonToggled ? styles.MultiPlotContainer : styles.SinglePlotContainer}>
              <ImageDisplay archiveOrCurrent={archiveOrCurrent} />
            </div>
            {/* Render second image if comparison is toggled */}
            {comparisonToggled && (
              <div className={styles.MultiPlotContainer}>
                <ImageDisplay archiveOrCurrent={archiveOrCurrent} />
              </div>
            )}
          </>
        )}
      </div>

      {/* About modal */}
      <AboutModal onClose={handleClose} open={helpMenuOpen} />
    </div>
  )
}

export default App
