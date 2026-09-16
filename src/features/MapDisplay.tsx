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
import type { IControl } from 'maplibre-gl';
import type { AxiosResponse } from 'axios';
import LegendControl from "mapboxgl-legend"
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';

import { mapLayerConf, mapLayerPlotConf, mapLayerLabelConf } from "../constants/mapConf"
import { WPC_ORIGIN } from "../constants/externalOrigins"
import { detailedLightStyle, detailedDarkStyle, DATA_ANCHOR_LAYER_ID } from "../constants/mapStyles"
import { useTheme } from "../context/ThemeContext"
import { CollapsibleAttribution } from "./CollapsibleAttribution"
import { LayerMenu } from "./LayerMenu"
import { MapOverlays } from "./MapOverlays"
import type { MenuSelection, MapViewState } from "../types"

import "mapboxgl-legend/dist/style.css"
import "maplibre-gl/dist/maplibre-gl.css";

dayjs.extend(utc)


// Verification GeoJSON on www.wpc.ncep.noaa.gov. In production the site is
// same-origin with it; on localhost WPC_ORIGIN resolves to the Vite dev-server
// proxy (WPC sends no CORS headers) — the same pattern as wpc-urrd / wpc-wssi.
const baseURL = `${WPC_ORIGIN}/verification/ero_verif_updated/geojson/`

interface MapDisplayProps {
  selection: MenuSelection;
  mapViewState: MapViewState;
  setMapViewState: React.Dispatch<React.SetStateAction<MapViewState>>;
  /** Boundary / road overlay toggles, shared by both maps in comparison mode */
  shownOverlays: Record<string, boolean>;
  setShownOverlays: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}
export const MapDisplay = ({ selection, mapViewState, setMapViewState, shownOverlays, setShownOverlays }: MapDisplayProps) => {
  const { mode } = useTheme()

  // State for GeoJSON data to be displayed on the map
  const [geojsonData, setGeojsonData] = useState<Record<string, GeoJSON.GeoJSON | null> | null>(null)

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
    const formattedDate = dayjs.utc(selection.selectedDate).format("YYYYMMDDHH")
    let tmpURL = baseURL+`${formattedDate}/${layerName}_`
    
    if (layerName === "wpcero"){
      const formattedEroDate = dayjs.utc(selection.selectedDate).subtract(selection.fHour, "hour").format("YYYYMMDDHH")
      tmpURL+=`${formattedEroDate}f${selection.fHour.toString().padStart(3, '0')}.geojson`
    } else {
      const formattedStartDate = dayjs.utc(selection.selectedDate).subtract(1, "day").format("YYYYMMDDHH")
      tmpURL+=`s${formattedStartDate}_e${formattedDate}.geojson`
    }

    return tmpURL
  }

  const fetchAllGeojsons = async () => {
    setGeojsonsAreLoading(true)
    setGeojsonData(null)

    const currentMapLayers = mapLayerPlotConf[selection.selectedPlot]
    const tmpGeojsonData: Record<string, GeoJSON.GeoJSON | null> = {}

    const requests: Promise<AxiosResponse<GeoJSON.GeoJSON>>[] = []
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
        mapStyle={mode === "dark" ? detailedDarkStyle : detailedLightStyle}
        attributionControl={false}
      >
        <FullscreenControl position="top-right" />
        <CollapsibleAttribution />
        <LegendControlElement legend={legend} />
        <MapOverlays shownOverlays={shownOverlays} mode={mode} />
        { !geojsonsAreLoading && geojsonData !== null &&
          mapLayerPlotConf[selection.selectedPlot].map((layerName) => {
            const data = geojsonData[layerName]
            if (!data) return null

            return (
                <Source key={layerName+"source"} id={layerName+"source"} type="geojson" data={data}>
                  <Layer 
                    id={layerName} 
                    metadata={mapLayerLabelConf[layerName]} 
                    {...mapLayerConf[layerName]}
                    beforeId={DATA_ANCHOR_LAYER_ID}
                  />
                  { layerName === "wpcero" &&
                    <Layer 
                      {...mapLayerConf[layerName+"_line"]}
                      id={layerName+"_line"} 
                      beforeId={DATA_ANCHOR_LAYER_ID}
                    />
                  }
                </Source>
            )
          })
        }


      </Map>
      {/* Floating layers button, below maplibre's fullscreen control at the map's
          top-right and aligned with it: the Paper's 8px padding plus maplibre's
          10px control margin puts that control 18px in from the Paper's edges
          and ~29px tall. */}
      <LayerMenu shownOverlays={shownOverlays} setShownOverlays={setShownOverlays} top={62} right={18} />
    </Paper>
    </div>
  )
}

/**
 * Custom control element for the map legend
 *
 * @param props.legend - Legend control instance (a mapbox-gl plugin; it
 *   implements maplibre's IControl shape, hence the cast)
 */
const LegendControlElement = ({ legend }: { legend: LegendControl }) => {
  useControl(() => legend as unknown as IControl, { position: "bottom-left" })

  return null
}
