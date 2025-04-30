/**
 * @fileoverview MapDisplay component for the WPC ERO Verification tool
 *
 * This component renders an interactive map that displays various weather-related
 * data layers. It allows users to select multiple layers, toggle between current
 * and archive data, and navigate through different forecast days.
 */
import { useState, useEffect, useRef } from "react"
import Select from "react-select"
import Map, { Source, Layer, MapProvider, FullscreenControl, useControl } from "react-map-gl"
import maplibregl from "maplibre-gl"
import DatePicker from "react-datepicker"
import LegendControl from "mapboxgl-legend"
import axios from "axios"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight, faArrowLeft, faSpinner } from "@fortawesome/free-solid-svg-icons"
import Tippy from "@tippyjs/react"
import moment from "moment"

import Button from "@mui/material/Button"
import ButtonGroup from "@mui/material/ButtonGroup"

import { layerConf } from "./mapConf"

import styles from "./MapDisplay.module.css"

import "mapboxgl-legend/dist/style.css"
import "maplibre-gl/dist/maplibre-gl.css"
import "tippy.js/dist/tippy.css"

/**
 * Available map layer options for the dropdown menu
 */
const menuOptions = [
  {
    value: "ALL_ERO",
    label: "ERO",
  },
  {
    value: "ALL_ST4gFFG",
    label: "ST4 > FFG",
  },
  {
    value: "ALL_ST4gARI",
    label: "ST4 > ARI",
  },
  {
    value: "ALL_LSRFLASH",
    label: "LSR Flash",
  },
  {
    value: "ALL_LSRREG",
    label: "LSR Regular",
  },
  {
    value: "ALL_USGS",
    label: "USGS",
  },
  {
    value: "ALL_PP",
    label: "Practically Perfect",
  },
  {
    value: "ALL_CSUopv2020",
    label: "CSUopv2020",
  },
  {
    value: "ALL_CSUopv2022",
    label: "CSUopv2022",
  },
  {
    value: "ALL_CSUopUFVSv2022",
    label: "CSUopUFVSv2020",
  },
]

/**
 * Component for displaying an interactive map with weather data layers
 *
 * @param {Object} props - Component props
 * @param {string} props.archiveOrCurrent - Controls whether to display current or archive data
 * @param {string} props.mapID - Unique identifier for the map instance
 * @param {boolean} props.comparisonToggled - Whether comparison mode is active
 * @param {Object} props.mapViewState - Current map view state (longitude, latitude, zoom)
 * @param {Function} props.setMapViewState - Function to update map view state
 * @returns {JSX.Element} The rendered MapDisplay component
 */
const MapDisplay = (props) => {
  // Default date for archive view (7 days ago)
  const defDate = new Date()
  defDate.setDate(defDate.getDate() - 7)

  // State for user selections and UI
  const [selectedArchiveDate, setSelectedArchiveDate] = useState(defDate)
  const [allLayerData, setAllLayerData] = useState([])
  const [selectedDay, setSelectedDay] = useState(1)
  const [selectedProducts, setSelectedProducts] = useState(null)
  const [errArr, setErrArr] = useState([])
  const [dateLabel, setDateLabel] = useState("")
  const [noContourLabel, setNoContourLabel] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Reference to the map instance
  const mapRef = useRef()

  // Base URL for fetching GeoJSON data
  const baseURL = window.location.origin + "/verification/ero_verif/geojsons/"

  // Initialize legend control
  const legend = new LegendControl({
    layers: Object.keys(layerConf),
    toggler: true,
  })

  /**
   * Updates the no contour label when ERO data has no features
   */
  const updateNoContourLabel = () => {
    let tmpLabel = ""
    for (const d of allLayerData) {
      if (d.label === "ERO") {
        if (d.data[selectedDay - 1] !== null && d.data[selectedDay - 1].features.length === 0) {
          tmpLabel = "The probablility of rainfall\nexceeding flash flood guidance\nis less than 5 percent"
        }
      }
    }
    setNoContourLabel(tmpLabel)
  }

  /**
   * Updates the date label based on ERO data
   */
  const updateDateLabel = () => {
    let tmpLabel = ""
    for (const d of allLayerData) {
      if (d.label === "ERO") {
        if (d.data[0] !== null && "label" in d.data[0]) {
          tmpLabel = d.data[0]["label"]
        }
      }
    }
    setDateLabel(tmpLabel)
  }

  /**
   * Constructs the GeoJSON URL based on layer name, day, and current/archive mode
   *
   * @param {string} layerName - Name of the layer
   * @param {string} day - Forecast day (1-5)
   * @returns {string} The constructed URL
   */
  const constructGeojsonURL = (layerName, day) => {
    let url = baseURL
    if (props.archiveOrCurrent === "current") {
      // URL for current data
      url += layerName + "_last_vday" + day + ".geojson"
    } else {
      // URL for archive data
      const tmpvhr = "12"
      const tmpStartDate = new Date(selectedArchiveDate)
      const tmpEndDate = new Date(selectedArchiveDate)
      tmpEndDate.setDate(tmpEndDate.getDate() + 1)

      const startDateStr = tmpStartDate.toISOString().split("T")[0].replaceAll("-", "")
      const endDateStr = tmpEndDate.toISOString().split("T")[0].replaceAll("-", "")

      url +=
        "daybyday/" +
        layerName +
        "_" +
        startDateStr +
        "12_to_" +
        endDateStr +
        "12_vday" +
        day +
        "_vhr" +
        tmpvhr +
        ".geojson"
    }

    return url
  }

  /**
   * Fetches GeoJSON data for all forecast days for a given layer
   *
   * @param {string} layerName - Name of the layer to fetch
   * @returns {Promise} Promise that resolves with the fetched data
   */
  const fetchGeojsonData = async (layerName) => {
    const requests = []
    for (let i = 1; i < 6; i++) {
      const url = constructGeojsonURL(layerName, i.toString())
      requests.push(axios.get(url))
    }

    const response = await Promise.allSettled(requests)
    return response
  }

  /**
   * Adds a layer to the map 
   *
   * @param {string} layerName - Name of the layer to add
   * @param {string} layerLabel - Display label for the layer
   */
  const addLayerToMap = (layerName, layerLabel) => {
    const geojsonDataArr = []
    const tmpAllLayerData = [...allLayerData]
    const tmpErrArr = []

    setIsLoading(true)

    fetchGeojsonData(layerName)
      .then((resultArr) => {
        let i = 0
        for (const res of resultArr) {
          if (res.status === "fulfilled") {
            geojsonDataArr.push(res.value.data)
          } else {
            geojsonDataArr.push(null)
            tmpErrArr.push(i + 1)
          }
          i++
        }
        tmpAllLayerData.push({
          layer_id: layerName + props.mapID,
          layer_name: layerName,
          label: layerLabel,
          data: geojsonDataArr,
        })

        setErrArr(tmpErrArr)
        setAllLayerData(tmpAllLayerData)

        setTimeout(() => {
          setIsLoading(false)
        }, 200)
      })
      .catch((e) => {
        console.log(e)
        setTimeout(() => {
          setIsLoading(false)
        }, 200)
      })
  }

  /**
   * Removes legend entries for specified layers
   *
   * @param {Array<string>} layers - Array of layer IDs to remove from legend
   */
  const removeLegendEntries = (layers) => {
    for (const n of layers) {
      const s = document.querySelector(`.mapboxgl-ctrl-legend-pane--${n}`)
      s && s.remove()
    }
  }

  /**
   * Handles changes to the layer selection dropdown
   *
   * @param {Array} layersArr - Array of selected layer objects
   * @param {Object} actionObj - Action object from react-select
   */
  const handleLayerChange = (layersArr, actionObj) => {
    if (!isLoading) {
      setSelectedProducts(layersArr)
      if (actionObj.action === "select-option") {
        // Add new layer
        addLayerToMap(actionObj.option.value, actionObj.option.label)
      } else if (actionObj.action === "remove-value") {
        // Remove layer
        const tmpAllLayerData = [...allLayerData]
        const removedIndex = tmpAllLayerData.findIndex(({ layer_name }) => layer_name == actionObj.removedValue.value)
        removeLegendEntries([tmpAllLayerData[removedIndex].layer_id])
        tmpAllLayerData.splice(removedIndex, 1)
        setAllLayerData(tmpAllLayerData)
      } else if (actionObj.action === "clear") {
        // Clear all layers
        const ids = allLayerData.map((el) => el.layer_id)
        removeLegendEntries(ids)
        setAllLayerData([])
        setSelectedProducts(null)
      }
    }
  }

  /**
   * Handles day selection button clicks
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - Change event from button
   */
  const handleDayChange = (e) => {
    setSelectedDay(Number.parseInt(e.target.value))
  }

  /**
   * Handles date picker changes for archive mode
   *
   * @param {Date} date - Selected date
   */
  const handleDateChange = (date) => {
    setAllLayerData([])
    setSelectedArchiveDate(date)
  }

  /**
   * Increments the selected archive date by one day
   */
  const incrementDate = () => {
    const tempDate = moment(selectedArchiveDate).add(1, "days")
    setSelectedArchiveDate(tempDate.toDate())
  }

  /**
   * Decrements the selected archive date by one day
   */
  const decrementDate = () => {
    const tempDate = moment(selectedArchiveDate).subtract(1, "days")
    setSelectedArchiveDate(tempDate.toDate())
  }

  // Refetch data when archive date changes
  useEffect(() => {
    if (selectedProducts !== null) {
      const requests = []
      for (const product of selectedProducts) {
        requests.push(fetchGeojsonData(product.value))
      }
      const tmpAllLayerData = []
      Promise.allSettled(requests).then((resultArr) => {
        for (let i = 0; i < resultArr.length; i++) {
          const res = resultArr[i]
          let geojsonDataArr = []
          let tmpErrArr = []

          if (res.status === "fulfilled") {
            let j = 0
            for (const pRes of res.value) {
              if (pRes.status === "fulfilled") {
                geojsonDataArr.push(pRes.value.data)
              } else {
                geojsonDataArr.push(null)
                tmpErrArr.push(j + 1)
              }
              j++
            }
          } else {
            geojsonDataArr = [null, null, null, null, null]
            tmpErrArr = [1, 2, 3, 4, 5]
          }
          setErrArr(tmpErrArr)
          tmpAllLayerData.push({
            layer_id: selectedProducts[i].value + props.mapID,
            layer_name: selectedProducts[i].value,
            label: selectedProducts[i].label,
            data: geojsonDataArr,
          })
        }
        setAllLayerData(tmpAllLayerData)
      })
    }
  }, [selectedArchiveDate])

  // Resize map when comparison mode changes
  useEffect(() => {
    if (mapRef.current !== null) {
      mapRef.current.resize()
    }
  }, [props.comparisonToggled])

  // Reset layers when switching between current and archive mode
  useEffect(() => {
    if (mapRef.current !== null) {
      mapRef.current.resize()
    }
    const ids = allLayerData.map((el) => el.layer_id)
    removeLegendEntries(ids)
    setAllLayerData([])
    setSelectedProducts(null)
  }, [props.archiveOrCurrent])

  // Update labels when layer data changes
  useEffect(() => {
    updateNoContourLabel()
    updateDateLabel()
    if (allLayerData.length === 0) {
      setErrArr([])
    }
  }, [allLayerData])

  // Update labels when selected day changes
  useEffect(() => {
    updateNoContourLabel()
    updateDateLabel()
  }, [selectedDay])

  return (
    <div
      className={`${styles.MapDisplayContainer} ${
        props.archiveOrCurrent === "current" ? styles.MapDisplayContainerShort : styles.MapDisplayContainerTall
      }`}
    >
      {/* Layer selection dropdown */}
      <div className={styles.ProductSelectContainer}>
        <Select
          value={selectedProducts}
          options={menuOptions}
          onChange={handleLayerChange}
          isMulti
          closeMenuOnSelect={false}
          placeholder={"Select layers to add to map..."}
          isLoading={isLoading}
        />
      </div>

      {/* Date picker for archive mode */}
      {props.archiveOrCurrent === "archive" ? (
        <div className={styles.ArchiveDatePickerContainer}>
          <Tippy placement="top" content="Previous Day">
            <FontAwesomeIcon onClick={decrementDate} className={styles.ArchiveDatePickerArrowLeft} icon={faArrowLeft} />
          </Tippy>
          <Tippy placement="top" content="Valid Date">
            <div style={{ width: "100%" }}>
              <DatePicker
                className={styles.ArchiveDatePicker}
                selected={selectedArchiveDate}
                onChange={handleDateChange}
              />
            </div>
          </Tippy>
          <Tippy placement="top" content="Next Day">
            <FontAwesomeIcon
              onClick={incrementDate}
              className={styles.ArchiveDatePickerArrowRight}
              icon={faArrowRight}
            />
          </Tippy>
        </div>
      ) : null}

      {/* Day selection buttons */}
      <div className={styles.DaySelectContainer}>
        <ButtonGroup disableRipple fullWidth variant="outlined" aria-label="outlined primary button group">
          <Button
            className={`${styles.DaySelectButton} ${selectedDay === 1 ? styles.selected : ""}`}
            onClick={handleDayChange}
            value={1}
          >
            Day 1
          </Button>
          <Button
            className={`${styles.DaySelectButton} ${selectedDay === 2 ? styles.selected : ""}`}
            onClick={handleDayChange}
            value={2}
          >
            Day 2
          </Button>
          <Button
            className={`${styles.DaySelectButton} ${selectedDay === 3 ? styles.selected : ""}`}
            onClick={handleDayChange}
            value={3}
          >
            Day 3
          </Button>
          <Button
            className={`${styles.DaySelectButton} ${selectedDay === 4 ? styles.selected : ""}`}
            onClick={handleDayChange}
            value={4}
          >
            Day 4
          </Button>
          <Button
            className={`${styles.DaySelectButton} ${selectedDay === 5 ? styles.selected : ""}`}
            onClick={handleDayChange}
            value={5}
          >
            Day 5
          </Button>
        </ButtonGroup>
      </div>

      {/* Map container */}
      <div className={styles.MapContainer}>
        {/* Loading overlay */}
        {isLoading ? (
          <div className={styles.LoadingOverlayContainer}>
            <FontAwesomeIcon className={"fa-spin"} icon={faSpinner} />
          </div>
        ) : null}

        {/* Date label */}
        <div className={styles.DateLabelContainer}>
          {selectedProducts !== null && dateLabel !== "" ? <p>{"ERO " + dateLabel}</p> : null}
        </div>

        {/* No contour label */}
        <div className={styles.NoContourLabelContainer}>{noContourLabel !== "" ? <p>{noContourLabel}</p> : null}</div>

        {/* Map component */}
        <MapProvider>
          <Map
            {...props.mapViewState}
            ref={mapRef}
            onMove={(evt) => props.setMapViewState(evt.viewState)}
            id="map"
            mapLib={maplibregl}
            style={{ width: "100%", height: "100%" }}
            mapStyle="https://api.maptiler.com/maps/188347a4-71db-46bf-837f-52a4188b469d/style.json?key=3g9gAaRe8ukSFBsBpU96"
          >
            {/* Legend control */}
            <LegendControlElement legend={legend} />

            {/* Map layers */}
            {allLayerData.map((layer) => {
              const idObj = { id: layer.layer_id }
              const keyVal =
                props.archiveOrCurrent === "current"
                  ? layer.layer_id
                  : layer.layer_id + selectedArchiveDate.toISOString().split("T")[0].replaceAll("-", "")

              return (
                <Source key={keyVal} id={layer.layer_id} type="geojson" data={layer.data[selectedDay - 1]}>
                  <Layer
                    {...{ ...idObj, ...layerConf[layer.layer_name] }}
                    metadata={{ name: layer.label, labels: { other: false } }}
                  />
                </Source>
              )
            })}
            <FullscreenControl />
          </Map>
        </MapProvider>
      </div>

      {/* Error message */}
      {errArr.length > 0 ? (
        <div className={styles.ErrorMsgContainer}>
          <p>{"Error loading map data for days: " + errArr.toString()} </p>
        </div>
      ) : null}
    </div>
  )
}

/**
 * Custom control element for the map legend
 *
 * @param {Object} props - Component props
 * @param {Object} props.legend - Legend control instance
 * @returns {null} This component doesn't render any visible elements
 */
const LegendControlElement = (props) => {
  useControl(() => props.legend, {
    position: "bottom-left",
    onRemove: () => {
      console.log("remove")
    },
    onAdd: () => {
      console.log("add")
    },
    onCreate: () => {
      console.log("create")
    },
  })

  return null
}

export default MapDisplay
