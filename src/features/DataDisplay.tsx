/**
 * @fileoverview DataDisplay component for the WPC ERO Verification tool
 *
 * This component handles the state and display for both interactive and static (plot) views
 */

import { useState } from 'react'

import { ImageDisplay } from "./ImageDisplay"
import { SelectionMenu } from "./SelectionMenu"
import type { MenuSelection } from "./types"


interface DataDisplayProps {
  displayType: "static"|"interactive";
}
export const DataDisplay = ( { displayType }: DataDisplayProps ) => {

  // State for storing menu selections
  const [selection, setSelection] = useState<MenuSelection>({
    selectedDate: new Date(),
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
        <ImageDisplay/>
      :
        null
      }
    </>
  )
}