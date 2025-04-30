/**
 * @fileoverview ImageDisplay component for the WPC ERO Verification tool
 *
 * This component displays ERO verification plots based on user selections.
 * It allows users to select different products, toggle between current and archive data,
 * select forecast days, and navigate through dates for historical data.
 */
import { useState, useEffect } from "react"
import Select from "react-select"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faImage, faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons"
import DatePicker from "react-datepicker"
import Zoom from "react-medium-image-zoom"
import Tippy from "@tippyjs/react"
import moment from "moment"

import Button from "@mui/material/Button"
import ButtonGroup from "@mui/material/ButtonGroup"

import styles from "./ImageDisplay.module.css"
import "react-datepicker/dist/react-datepicker.css"
import "react-medium-image-zoom/dist/styles.css"
import "tippy.js/dist/tippy.css"

// Base URL for fetching images
const baseURL = "https://www.wpc.ncep.noaa.gov/verification/ero_verif/images/"

/**
 * Product options for the current data view
 * Organized into categories with nested options
 */
const options = [
  {
    label: "Most Recent ERO Verification Day",
    options: [
      { value: "ALL_EROwST4gFFG", label: "ERO With Verification Overlay" },
      { value: "ALL_ST4gFFG", label: "Verification Only" },
      { value: "ALL_EROwALL_PP", label: "Practically Perfect Verification" },
    ],
  },
  {
    label: "CSU-MLP Daily Verification",
    options: [
      { value: "ALL_CSUopUFVSv2022", label: "CSU-MLP GEFS Operational - 2022 UFVS Version" },
      { value: "ALL_CSUopv2022", label: "CSU-MLP GEFS Operational - 2022 Version" },
      { value: "ALL_CSUopv2020", label: "CSU-MLP GEFS Operational - 2020 Version" },
    ],
  },
  {
    label: "Bulk Error Statistics",
    options: [
      { value: "ALL_issuancetime_BSandAuROC", label: "BSS and AuROC by Issuance Time - Compared to Observations" },
      { value: "ALL_bulkBSaAuROC", label: "BSS and AuROC - Compared to Practically Perfect" },
      { value: "ALL_CSUMLPaEROvsPP_CB", label: "Contingency Bias - Compared to Practically Perfect" },
      { value: "ALL_CSUMLPaEROvsPP_CSI", label: "Critical Success Index - Compared to Practically Perfect" },
      { value: "ALL_CSUMLPaEROvsPP_FAR", label: "False Alarm Ratio - Compared to Practically Perfect" },
      { value: "ALL_CSUMLPaEROvsPP_HIT", label: "Hit Rate - Compared to Practically Perfect" },
    ],
  },
  {
    label: "Fractional Coverage",
    options: [
      { value: "ALL_ERO_bycat", label: "ERO Bulk Probabilities by Threshold" },
      { value: "ALL_CSUMLP_bycat", label: "CSU-MLP Bulk Probabilities by Threshold" },
    ],
  },
  {
    label: "Heat Maps",
    options: [
      { value: "ALL_ERO_spatprob_MRGL", label: "1-Year ERO - Marginal Frequency" },
      { value: "ALL_PP_spatprob_MRGL", label: "1-Year Practically Perfect - Marginal Frequency" },
      {
        value: "ALL_CSUopUFVSv2022_spatprob_MRGL",
        label: "1-Year 2022 UFVS CSU-MLP Operational GEFS - Marginal Frequency",
      },
      { value: "ALL_CSUopv2022_spatprob_MRGL", label: "1-Year 2022 CSU-MLP Operational GEFS - Marginal Frequency" },
      { value: "ALL_CSUopv2020_spatprob_MRGL", label: "1-Year 2020 CSU-MLP Operational GEFS - Marginal Frequency" },
      { value: "ALL_ERO_spatprob_SLGT", label: "1-Year ERO - Slight Frequency" },
      { value: "ALL_PP_spatprob_SLGT", label: "1-Year Practically Perfect  - Slight Frequency" },
      {
        value: "ALL_CSUopUFVSv2022_spatprob_SLGT",
        label: "1-Year 2022 UFVS CSU-MLP Operational GEFS - Slight Frequency",
      },
      { value: "ALL_CSUopv2022_spatprob_SLGT", label: "1-Year 2022 CSU-MLP Operational GEFS - Slight Frequency" },
      { value: "ALL_CSUopv2020_spatprob_SLGT", label: "1-Year 2020 CSU-MLP Operational GEFS - Slight Frequency" },
      { value: "ALL_ERO_spatprob_MDT", label: "1-Year ERO - Moderate Frequency" },
      { value: "ALL_PP_spatprob_MDT", label: "1-Year Practically Perfect  - Moderate Frequency" },
      {
        value: "ALL_CSUopUFVSv2022_spatprob_MDT",
        label: "1-Year 2022 UFVS CSU-MLP Operational GEFS - Moderate Frequency",
      },
      { value: "ALL_CSUopv2020_spatprob_MDT", label: "1-Year 2020 CSU-MLP Operational GEFS - Moderate Frequency" },
      { value: "ALL_ERO_spatprob_HIGH", label: "1-Year ERO - High Frequency" },
      { value: "ALL_PP_spatprob_HIGH", label: "1-Year Practically Perfect  - High Frequency" },
      {
        value: "ALL_CSUopUFVSv2022_spatprob_HIGH",
        label: "1-Year 2022 UFVS CSU-MLP Operational GEFS - High Frequency",
      },
      { value: "ALL_CSUopv2022_spatprob_HIGH", label: "1-Year 2022 CSU-MLP Operational GEFS - High Frequency" },
      { value: "ALL_CSUopv2020_spatprob_HIGH", label: "1-Year 2020 CSU-MLP Operational GEFS - High Frequency" },
    ],
  },
]

/**
 * Product options for the archive data view
 * Includes a subset of current options plus MRMS
 */
const archiveOptions = options.slice(0, 2)
archiveOptions.push({
  label: "MRMS",
  options: [{ value: "observed_24hr_precip", label: "MRMS QPE" }],
})

/**
 * Component for displaying ERO verification images and plots
 *
 * @param {Object} props - Component props
 * @param {string} props.archiveOrCurrent - Controls whether to display current or archive data
 * @returns {JSX.Element} The rendered ImageDisplay component
 */
const ImageDisplay = (props) => {
  // Default date for archive view (7 days ago)
  const defDate = new Date()
  defDate.setDate(defDate.getDate() - 7)

  // State for user selections and UI
  const [selectedProduct, setSelectedProduct] = useState(options[0].options[0])
  const [selectedDay, setSelectedDay] = useState(1)
  const [selectedArchiveDate, setSelectedArchiveDate] = useState(defDate)
  const [imgURL, setImgURL] = useState(null)
  const [errMsg, setErrMsg] = useState("")

  /**
   * Handles keyboard navigation between days
   *
   * @param {Object} event - Keyboard event
   * @param {string} event.key - Key that was pressed
   */
  const keyPressHandler = ({ key }) => {
    if (key === "ArrowRight") {
      if (selectedDay < 5) {
        setSelectedDay(selectedDay + 1)
      }
    }
    if (key === "ArrowLeft") {
      if (selectedDay > 1) {
        setSelectedDay(selectedDay - 1)
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
   * Increments the selected archive date by one day
   */
  const incrementDate = () => {
    let tempDate = moment(selectedArchiveDate).add(1, "days")
    tempDate = tempDate.toDate()
    setSelectedArchiveDate(tempDate)
  }

  /**
   * Decrements the selected archive date by one day
   */
  const decrementDate = () => {
    let tempDate = moment(selectedArchiveDate).subtract(1, "days")
    tempDate = tempDate.toDate()
    setSelectedArchiveDate(tempDate)
  }

  /**
   * Constructs the image URL based on current selections
   *
   * @returns {string} The constructed image URL
   */
  const constructImgURL = () => {
    let tmpURL = ""
    let tmpSelectedProduct = selectedProduct.value

    if (props.archiveOrCurrent === "current") {
      // Handle current data URL construction
      if (
        tmpSelectedProduct === "ALL_EROwST4gFFG" ||
        tmpSelectedProduct === "ALL_ST4gFFG" ||
        tmpSelectedProduct === "ALL_EROwALL_PP" ||
        tmpSelectedProduct === "ALL_CSUopUFVSv2022" ||
        tmpSelectedProduct === "ALL_CSUopv2022" ||
        tmpSelectedProduct === "ALL_CSUopv2020"
      ) {
        tmpSelectedProduct = tmpSelectedProduct + "_last"
      }

      tmpURL = baseURL + tmpSelectedProduct + "_vday" + selectedDay.toString() + ".png"
    } else {
      // Handle archive data URL construction
      const tmpStartDate = new Date(selectedArchiveDate)
      const tmpEndDate = new Date(selectedArchiveDate)
      tmpEndDate.setDate(tmpEndDate.getDate() + 1)

      const startDateStr = tmpStartDate.toISOString().split("T")[0].replaceAll("-", "")
      const endDateStr = tmpEndDate.toISOString().split("T")[0].replaceAll("-", "")

      let tmpvhr = "12"
      if (
        tmpSelectedProduct === "ALL_CSUopUFVSv2022" ||
        tmpSelectedProduct === "ALL_CSUopv2022" ||
        tmpSelectedProduct === "ALL_CSUopv2020"
      ) {
        tmpSelectedProduct = tmpSelectedProduct + "wALL"

        if (selectedDay.toString() === "1") {
          tmpvhr = "09"
        } else {
          tmpvhr = "00"
        }
      }

      if (tmpSelectedProduct === "observed_24hr_precip") {
        // Special case for MRMS QPE
        const tmpQPEDate = new Date(selectedArchiveDate)
        tmpQPEDate.setDate(tmpQPEDate.getDate() - 1)

        tmpURL =
          "https://origin.wpc.ncep.noaa.gov/verification/mode/images_test/" +
          endDateStr +
          "/" +
          tmpSelectedProduct +
          "_valid_" +
          endDateStr +
          "12_prelim.png"
      } else {
        tmpURL =
          baseURL +
          "daybyday/" +
          tmpSelectedProduct +
          "_" +
          startDateStr +
          "12_to_" +
          endDateStr +
          "12_vday" +
          selectedDay.toString() +
          "_vhr" +
          tmpvhr +
          ".png"
      }
    }
    return tmpURL
  }

  /**
   * Handles successful image load
   */
  const onImageLoad = () => {
    setErrMsg("")
  }

  /**
   * Handles image load errors
   */
  const onImageError = () => {
    if (props.archiveOrCurrent === "archive") {
      setErrMsg("No plot available for selected date & product")
    } else {
      const currDate = new Date()
      const currDateStr = currDate.toISOString().split("T")[0].replaceAll("-", "")

      setErrMsg("No current (" + currDateStr + ") plot available for selected product")
    }
  }

  // Update image URL when selections change
  useEffect(() => {
    setImgURL(constructImgURL())
    setErrMsg("")
  }, [selectedDay, selectedProduct, selectedArchiveDate, props.archiveOrCurrent])

  // Add keyboard event listeners
  useEffect(() => {
    window.addEventListener("keydown", keyPressHandler)
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener("keydown", keyPressHandler)
    }
  }, [selectedDay])

  // Adjust selected day when product changes
  useEffect(() => {
    if (
      !(selectedProduct.value === "ALL_CSUopUFVSv2022" || selectedProduct.value === "ALL_CSUopv2022") &&
      selectedDay > 3
    ) {
      setSelectedDay(3)
    }
  }, [selectedProduct])

  return (
    <div className={styles.ImageDisplayContainer}>
      {/* Product selection dropdown */}
      <div className={styles.ProductSelectContainer}>
        <Select
          defaultValue={selectedProduct}
          onChange={setSelectedProduct}
          options={props.archiveOrCurrent === "current" ? options : archiveOptions}
          placeholder={"Select Product"}
        />
      </div>

      {props.archiveOrCurrent === "current" ? (
        // Current data view
        selectedProduct.value !== "observed_24hr_precip" ? (
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
              {selectedProduct.value !== "ALL_CSUopv2020" ? (
                <>
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
                </>
              ) : null}
            </ButtonGroup>
          </div>
        ) : null
      ) : (
        // Archive data view
        <>
          {/* Date picker for archive view */}
          <div className={styles.ArchiveDatePickerContainer}>
            <Tippy placement="top" content="Previous Day">
              <FontAwesomeIcon
                onClick={decrementDate}
                className={styles.ArchiveDatePickerArrowLeft}
                icon={faArrowLeft}
              />
            </Tippy>
            <Tippy placement="top" content="Valid Date">
              <div style={{ width: "100%" }}>
                <DatePicker
                  className={styles.ArchiveDatePicker}
                  selected={selectedArchiveDate}
                  onChange={(date) => setSelectedArchiveDate(date)}
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

          {/* Day selection for archive view */}
          {selectedProduct.value !== "observed_24hr_precip" ? (
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
                {selectedProduct.value !== "ALL_CSUopv2020" ? (
                  <>
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
                  </>
                ) : null}
              </ButtonGroup>
            </div>
          ) : null}
        </>
      )}

      {/* Image display container */}
      <div className={styles.ImgContainer}>
        {errMsg !== "" ? (
          // Error message display
          <>
            <p className={styles.MissingImgText}>{errMsg}</p>
            <FontAwesomeIcon className={styles.MissingImgIcon} icon={faImage} />
          </>
        ) : (
          // Image with zoom capability
          <Zoom>
            <img
              className={`${styles.ImgElement} ${
                props.archiveOrCurrent === "current" ? styles.ImgElementShort : styles.ImgElementTall
              }`}
              src={imgURL || "/placeholder.svg"}
              onLoad={onImageLoad}
              onError={onImageError}
              alt="Weather verification plot"
            />
          </Zoom>
        )}
      </div>
    </div>
  )
}

export default ImageDisplay
