/**
 * @fileoverview ImageDisplay component for the WPC ERO Verification tool
 *
 * This component displays ERO verification plots based on user selections.
 */

import { useState, useEffect } from 'react'

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';
import Zoom from "react-medium-image-zoom"

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

import type { MenuSelection } from "../types"

dayjs.extend(utc)


interface ImageDisplayProps {
  selection: MenuSelection;
}
export const ImageDisplay = ({ selection }: ImageDisplayProps) => {

  // State for image URL string, updates as selections change
  const [imgURL, setImgURL] = useState<string|null>(null)

  // State for an error message string (for image loading errors)
  const [errMsg, setErrMsg] = useState<string|null>(null)

  // State to track if image is loading
  const [imgIsLoading, setImgIsLoading] = useState<boolean>(false)


  // Effect to handle updating image as selection updates
  useEffect(() => {
    setImgIsLoading(true)
    setErrMsg(null)
    genImgURL()
  },[selection])

  /**
   * Constructs the image URL based on current selections and sets the state accordingly
  */
  const genImgURL = () => {
    let tmpURL = "https://www.wpc.ncep.noaa.gov/verification/ero_verif_updated/images/"
    const formattedDate = dayjs.utc(selection.selectedDate).format("YYYYMMDDHH")
    const formattedPlotDate = dayjs.utc(selection.selectedDate).subtract(selection.fHour, "hour").format("YYYYMMDDHH")

    tmpURL += `${formattedDate}/${selection.selectedPlot}_${formattedPlotDate}f${selection.fHour.toString().padStart(3, '0')}.png`

    setImgURL(tmpURL)
  }

  /**
   * Handles successful image load
  */
  const onImageLoad = () => {
    setImgIsLoading(false)
    setErrMsg(null)
  }

  /**
   * Handles image load errors
  */
  const onImageError = () => {
    setImgIsLoading(false)
    setErrMsg("No plot available for selected date & product")
  }

return (
  <div className="flex align-center justify-center m-4">
    <Paper className="p-2 relative flex items-center justify-center min-w-[200px] min-h-[200px] max-h-[calc(100vh-280px)]">
      {errMsg ? (
        <div className="p-2 flex flex-col items-center justify-center gap-2">
          <Typography fontWeight="bold" color="error" variant="body1">
            {errMsg}
          </Typography>
          <ImageNotSupportedIcon fontSize="large" color="error" />
        </div>
      ) : (
        imgURL && (
          <>
            <Zoom>
              <img
                src={imgURL}
                className="max-h-[calc(100vh-280px)] min-h-[200px] object-contain"
                onLoad={onImageLoad}
                onError={onImageError}
                alt="ERO verification plot"
                style={{ visibility: imgIsLoading ? "hidden" : "visible" }}
              />
            </Zoom>
            {imgIsLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <CircularProgress />
              </div>
            )}
          </>
        )
      )}
    </Paper>
  </div>
)

}