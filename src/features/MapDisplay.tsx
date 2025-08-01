/**
 * @fileoverview MapDisplay component for the WPC ERO Verification tool
 *
 * This component renders an interactive map that displays various verification-related
 * data layers. 
 */

import { useState, useEffect, useRef } from 'react'
import axios from "axios"
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

import { Map, Source, Layer, useControl, FullscreenControl } from 'react-map-gl/maplibre';
import LegendControl from "mapboxgl-legend"
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';

import { mapLayerConf, mapLayerPlotConf, mapLayerLabelConf } from "../constants/mapConf"
import type { MenuSelection, MapViewState } from "./types"

import "mapboxgl-legend/dist/style.css"
import "maplibre-gl/dist/maplibre-gl.css";

dayjs.extend(utc)


const baseURL = window.location.origin.includes("localhost") ? "http://localhost:3001/" : "https://www.wpc.ncep.noaa.gov/verification/ero_verif_updated/geojsons/"

interface MapDisplayProps {
  selection: MenuSelection;
  mapViewState: MapViewState;
  setMapViewState: React.Dispatch<React.SetStateAction<MapViewState>>;
}
export const MapDisplay = ({ selection, mapViewState, setMapViewState }: MapDisplayProps) => {

  // State for GeoJSON data to be displayed on the map
  const [geojsonData, setGeojsonData] = useState<any>(null)

  // State for ERO GeoJSON data to be displayed on the map
  const [geojsonsAreLoading, setGeojsonsAreLoading] = useState<boolean>(false)

  // State for ERO GeoJSON data to be displayed on the map
  const [mapRenderKey, setMapRenderKey] = useState<number>(0)

  // Ref to hold last selection for comparing against new selection
  const lastSelection = useRef(selection)


  // Effect to handle fetching new geojson as selection changes
  useEffect(() => {

    fetchAllGeojsons()
    
    // force map re-render when layers change to update legend
    if(lastSelection.current.selectedPlot !== selection.selectedPlot) {
      setMapRenderKey(mapRenderKey+1)
    }

    lastSelection.current = selection
  },[selection])


  const constructGeojsonURL = (layerName:string) => {
    let formattedDate = dayjs.utc(selection.selectedDate).format("YYYYMMDDHH")
    let tmpURL = baseURL+`${formattedDate}/${layerName}_`
    
    if (layerName === "wpcero"){
      let formattedEroDate = dayjs.utc(selection.selectedDate).subtract(selection.fHour, "hour").format("YYYYMMDDHH")
      tmpURL+=`${formattedEroDate}f${selection.fHour.toString().padStart(3, '0')}.geojson`
    } else {
      let formattedStartDate = dayjs.utc(selection.selectedDate).subtract(1, "day").format("YYYYMMDDHH")
      tmpURL+=`s${formattedStartDate}_e${formattedDate}.geojson`
    }

    return tmpURL
  }

  const fetchAllGeojsons = async () => {
    setGeojsonsAreLoading(true)
    setGeojsonData(null)

    const currentMapLayers = mapLayerPlotConf[selection.selectedPlot]
    let tmpGeojsonData = {} 

    const requests = []
    currentMapLayers.forEach((layerName) => {
      const url = constructGeojsonURL(layerName)
      requests.push(axios.get(url))
    })

    const response = await Promise.allSettled(requests)
    response.forEach((res, i) => {
      if(res.status === "fulfilled") {
        tmpGeojsonData[currentMapLayers[i]] = res.value.data
      } else {
        tmpGeojsonData[currentMapLayers[i]] = null
      }
    })

    setGeojsonData(tmpGeojsonData)
    setGeojsonsAreLoading(false)
  }


  // Initialize legend control
  const legend = new LegendControl({
    layers: mapLayerPlotConf[selection.selectedPlot],
    toggler: true,
  })

  return (
    <div className="flex align-center justify-center m-4">
    <Paper className="p-2 relative flex items-center justify-center w-full h-[calc(100vh-280px)]">
      { geojsonsAreLoading &&
        <div className="absolute inset-0 flex items-center justify-center">
          <CircularProgress />
        </div>
      }
      <Map
        {...mapViewState}
        key={`map${mapRenderKey}`}
        onMove={evt => setMapViewState(evt.viewState)}
        style={{width: "100%", height:"100%"}}
        mapStyle="https://api.maptiler.com/maps/188347a4-71db-46bf-837f-52a4188b469d/style.json?key=3g9gAaRe8ukSFBsBpU96"
      >
        <FullscreenControl position="top-right" />
        <LegendControlElement legend={legend} />
        { !geojsonsAreLoading && geojsonData !== null &&
          mapLayerPlotConf[selection.selectedPlot].map((layerName) => {

            return (
                <Source key={layerName+"source"} id={layerName+"source"} type="geojson" data={geojsonData[layerName]}>
                  <Layer 
                    id={layerName} 
                    metadata={mapLayerLabelConf[layerName]} 
                    {...mapLayerConf[layerName]}
                  />
                  { layerName === "wpcero" &&
                    <Layer 
                      {...mapLayerConf[layerName+"_line"]}
                      id={layerName+"_line"} 
                    />
                  }
                </Source>
            )
          })
        }


      </Map>
    </Paper>
    </div>
  )
}

/**
 * Custom control element for the map legend
 *
 * @param {Object} props - Component props
 * @param {Object} props.legend - Legend control instance
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
