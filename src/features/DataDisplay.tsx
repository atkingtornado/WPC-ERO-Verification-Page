/**
 * @fileoverview DataDisplay component for the WPC ERO Verification tool
 *
 * This component handles the state and display for both interactive and static (plot) views
 */

import React, { useState } from 'react'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

import { ImageDisplay } from "./ImageDisplay"
import { MapDisplay } from "./MapDisplay"
import { SelectionMenu } from "./SelectionMenu"
import type { MenuSelection, MapViewState } from "./types"

dayjs.extend(utc)


interface DataDisplayProps {
  mapViewState: MapViewState;
  setMapViewState: React.Dispatch<React.SetStateAction<MapViewState>>;
  displayType: "static"|"interactive";
}
export const DataDisplay = ({ mapViewState, setMapViewState, displayType }: DataDisplayProps) => {

  // State for storing menu selections
  const [selection, setSelection] = useState<MenuSelection>({
    selectedDate: dayjs.utc().subtract(1,"day").hour(12).minute(0).second(0).millisecond(0),
    fHour: 24,
    selectedPlot: "wpc_ero_verifall",
  });

  /**
    * Handles updating menu selection based on provided key/value
  */
  const updateSelection = <K extends keyof SelectionState>(key: K, value: SelectionState[K]) => {
    setSelection(prev => ({ ...prev, [key]: value }));
  };

  return (
    <>
      <SelectionMenu 
        displayType={displayType}
        selection={selection}
        updateSelection={updateSelection}
      />
      { displayType === "static" ?
        <ImageDisplay
          selection={selection}
        />
      :
        <MapDisplay
          selection={selection}
          mapViewState={mapViewState}
          setMapViewState={setMapViewState}
        />
      }
    </>
  )
}