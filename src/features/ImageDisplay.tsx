/**
 * @fileoverview ImageDisplay component for the WPC ERO Verification tool
 *
 * This component displays ERO verification plots based on user selections.
 */

import Paper from '@mui/material/Paper';

import Zoom from "react-medium-image-zoom"

export const ImageDisplay = () => {

  return (
    // Image with zoom capability
    <div className="flex align-center justify-center m-2">
      <Paper className="p-2">
        <Zoom>
          <img
            src={"https://www.wpc.ncep.noaa.gov/verification/ero_verif_updated/images/2025072712/wpc_ero_verifall_2025072212f120.png"}
            className="max-h-[calc(100vh-280px)] min-h-[200px]"
            // onLoad={onImageLoad}
            // onError={onImageError}
            alt="ERO verification plot"
          />
        </Zoom>
      </Paper>
    </div>
  )
}