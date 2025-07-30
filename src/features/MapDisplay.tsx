/**
 * @fileoverview MapDisplay component for the WPC ERO Verification tool
 *
 * This component renders an interactive map that displays various verification-related
 * data layers. 
 */

import { useState, useEffect, useRef } from 'react'

import { Map } from 'react-map-gl/maplibre';
import Paper from '@mui/material/Paper';

import type { MenuSelection, MapViewState } from "./types"

import 'maplibre-gl/dist/maplibre-gl.css';


interface MapDisplayProps {
  selection: MenuSelection;
  mapViewState: MapViewState;
  setMapViewState: React.Dispatch<React.SetStateAction<MapViewState>>;
}
export const MapDisplay = ({ selection, mapViewState, setMapViewState }: MapDisplayProps) => {

  // State for UFVS GeoJSON data to be displayed on the map
  const [ufvsGeojsonData, setUfvsGeojsonData] = useState<any>(null)

  // State for ERO GeoJSON data to be displayed on the map
  const [eroGeojsonData, setEroGeojsonData] = useState<any>(null)

  // State for ERO GeoJSON data to be displayed on the map
  const [geojsonsAreLoading, setGeojsonsAreLoading] = useState<boolean>(false)

  // Ref to hold last selection for comparing against new selection
  const lastSelection = useRef(selection)


  // Effect to handle fetching new geojson as selection changes
  useEffect(() => {

    fetchAllGeojsons()

    lastSelection.current = selection
  },[selection])

  const fetchAllGeojsons = async () =>{
    if(lastSelection.current.selectedDate !== selection.selectedDate) {
      await fetchUfvsGeojsons()
    }
    await fetchEroGeojson()
  }

  const fetchUfvsGeojsons = async () =>{
    console.log("fetchUfvsGeojsons")
  }

  const fetchEroGeojson = async () =>{
    console.log("fetchEroGeojson")
  }


  return (
    <div className="flex align-center justify-center m-4">
    <Paper className="p-2 relative flex items-center justify-center w-full h-[calc(100vh-280px)]">
      <Map
        {...mapViewState}
        onMove={evt => setMapViewState(evt.viewState)}
        style={{width: "100%", height:"100%"}}
        mapStyle="https://api.maptiler.com/maps/188347a4-71db-46bf-837f-52a4188b469d/style.json?key=3g9gAaRe8ukSFBsBpU96"
      />
    </Paper>
    </div>
  )
}