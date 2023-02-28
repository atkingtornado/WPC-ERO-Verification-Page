import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage } from '@fortawesome/free-solid-svg-icons'
import DatePicker from "react-datepicker";
import Zoom from 'react-medium-image-zoom'


import styles from './ImageDisplay.module.css';
import "react-datepicker/dist/react-datepicker.css"
import 'react-medium-image-zoom/dist/styles.css'

const baseURL = 'https://www.wpc.ncep.noaa.gov/verification/ero_verif/images/'

const options = [
  {
    label: 'Most Recent ERO Verification Day',
    options: [
      { value: 'ALL_EROwST4gFFG', label: 'ERO With Verification Overlay' },
      { value: 'ALL_ST4gFFG', label: 'Verification Only' },
      { value: 'ALL_EROwALL_PP', label: 'Practically Perfect Verification' },
    ]
  },
  {
    label: 'CSU-MLP Daily Verification',
    options: [
      { value: 'ALL_CSUopUFVSv2022', label: 'CSU-MLP GEFS Operational - 2022 UFVS Version' },
      { value: 'ALL_CSUopv2022', label: 'CSU-MLP GEFS Operational - 2022 Version' },
      { value: 'ALL_CSUopv2020', label: 'CSU-MLP GEFS Operational - 2020 Version' },
    ]
  },
  {
    label: 'Bulk Error Statistics',
    options: [
      { value: 'ALL_issuancetime_BSandAuROC', label: 'BSS and AuROC by Issuance Time - Compared to Observations' },
      { value: 'ALL_bulkBSaAuROC', label: 'BSS and AuROC - Compared to Practically Perfect' },
      { value: 'ALL_CSUMLPaEROvsPP_CB', label: 'Contingency Bias - Compared to Practically Perfect' },
      { value: 'ALL_CSUMLPaEROvsPP_CSI', label: 'Critical Success Index - Compared to Practically Perfect' },
      { value: 'ALL_CSUMLPaEROvsPP_FAR', label: 'False Alarm Ratio - Compared to Practically Perfect' },
      { value: 'ALL_CSUMLPaEROvsPP_HIT', label: 'Hit Rate - Compared to Practically Perfect' },
    ]
  },
  {
    label: 'Fractional Coverage',
    options: [
      { value: 'ALL_ERO_bycat', label: 'ERO Bulk Probabilities by Threshold' },
      { value: 'ALL_CSUMLP_bycat', label: 'CSU-MLP Bulk Probabilities by Threshold' },
    ]
  },
  {
    label: 'Heat Maps',
    options: [
      { value: 'ALL_ERO_spatprob_MRGL', label: '1-Year ERO - Marginal Frequency' },
      { value: 'ALL_PP_spatprob_MRGL', label: '1-Year Practically Perfect - Marginal Frequency' },
      { value: 'ALL_CSUopUFVSv2022_spatprob_MRGL', label: '1-Year 2022 UFVS CSU-MLP Operational GEFS - Marginal Frequency' },
      { value: 'ALL_CSUopv2022_spatprob_MRGL', label: '1-Year 2022 CSU-MLP Operational GEFS - Marginal Frequency' },
      { value: 'ALL_CSUopv2020_spatprob_MRGL', label: '1-Year 2020 CSU-MLP Operational GEFS - Marginal Frequency' },
      { value: 'ALL_ERO_spatprob_SLGT', label: '1-Year ERO - Slight Frequency' },
      { value: 'ALL_PP_spatprob_SLGT', label: '1-Year Practically Perfect  - Slight Frequency' },
      { value: 'ALL_CSUopUFVSv2022_spatprob_SLGT', label: '1-Year 2022 UFVS CSU-MLP Operational GEFS - Slight Frequency' },
      { value: 'ALL_CSUopv2022_spatprob_SLGT', label: '1-Year 2022 CSU-MLP Operational GEFS - Slight Frequency' },
      { value: 'ALL_CSUopv2020_spatprob_SLGT', label: '1-Year 2020 CSU-MLP Operational GEFS - Slight Frequency' },
      { value: 'ALL_ERO_spatprob_MDT', label: '1-Year ERO - Moderate Frequency' },
      { value: 'ALL_PP_spatprob_MDT', label: '1-Year Practically Perfect  - Moderate Frequency' },
      { value: 'ALL_CSUopUFVSv2022_spatprob_MDT', label: '1-Year 2022 UFVS CSU-MLP Operational GEFS - Moderate Frequency' },
      { value: 'ALL_CSUopv2020_spatprob_MDT', label: '1-Year 2020 CSU-MLP Operational GEFS - Moderate Frequency' },
      { value: 'ALL_ERO_spatprob_HIGH', label: '1-Year ERO - High Frequency' },
      { value: 'ALL_PP_spatprob_HIGH', label: '1-Year Practically Perfect  - High Frequency' },
      { value: 'ALL_CSUopUFVSv2022_spatprob_HIGH', label: '1-Year 2022 UFVS CSU-MLP Operational GEFS - High Frequency' },
      { value: 'ALL_CSUopv2022_spatprob_HIGH', label: '1-Year 2022 CSU-MLP Operational GEFS - High Frequency' },
      { value: 'ALL_CSUopv2020_spatprob_HIGH', label: '1-Year 2020 CSU-MLP Operational GEFS - High Frequency' }
    ]
  }

];

var archiveOptions = options.slice(0, 2)
archiveOptions.push({
    label: 'MRMS',
    options: [
      { value: 'observed_24hr_precip', label: 'MRMS QPE' },
    ]
})


const ImageDisplay = (props) => {
  let defDate = new Date();
  defDate.setDate(defDate.getDate() - 7);

  const [selectedProduct, setSelectedProduct] = useState(options[0].options[0]);
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedArchiveDate, setSelectedArchiveDate] = useState(defDate);
  const [imgURL, setimgURL] = useState(null)
  const [errMsg, setErrMsg] = useState('')

  const keyPressHandler = ({ key }) => {
    // if (props.archiveOrCurrent === 'current') {
      if (key === "ArrowRight") {
        if (selectedDay < 5) {
          setSelectedDay(selectedDay+1)
        }
      } 
      if (key === "ArrowLeft") {
        if (selectedDay > 1) {
          setSelectedDay(selectedDay-1)
        }
      } 
    // }
  }

  const handleDayChange = (e) => {
    setSelectedDay(parseInt(e.target.value))
  }

  const constructImgURL = () => {
    let tmpURL = ''
    let tmpSelectedProduct = selectedProduct.value

    if (props.archiveOrCurrent === 'current') {
      
      
      if (tmpSelectedProduct === 'ALL_EROwST4gFFG' || tmpSelectedProduct === 'ALL_ST4gFFG' || tmpSelectedProduct === 'ALL_EROwALL_PP' ||
        tmpSelectedProduct === 'ALL_CSUopUFVSv2022' || tmpSelectedProduct === 'ALL_CSUopv2022' || tmpSelectedProduct === 'ALL_CSUopv2020') {

        tmpSelectedProduct = tmpSelectedProduct + '_last'
      }

      tmpURL = baseURL + tmpSelectedProduct + '_vday' + selectedDay.toString() + '.png'

    } else {
      let tmpStartDate = new Date(selectedArchiveDate)
      let tmpEndDate = new Date(selectedArchiveDate)
      tmpEndDate.setDate(tmpEndDate.getDate() + 1);

      let startDateStr = tmpStartDate.toISOString().split('T')[0].replaceAll('-','')
      let endDateStr = tmpEndDate.toISOString().split('T')[0].replaceAll('-','')

      let tmpvhr = '12'
      if (tmpSelectedProduct === 'ALL_CSUopUFVSv2022' || tmpSelectedProduct === 'ALL_CSUopv2022' || tmpSelectedProduct === 'ALL_CSUopv2020') {
          tmpSelectedProduct = tmpSelectedProduct + 'wALL'

          if (selectedDay.toString() === '1') {
            tmpvhr = '09'
          } else {
            tmpvhr = '00'
          }
          
      }

      if (tmpSelectedProduct === 'observed_24hr_precip') { 
        let tmpQPEDate = new Date(selectedArchiveDate)
        tmpQPEDate.setDate(tmpQPEDate.getDate() - 1);

        let QPEDateStr = tmpQPEDate.toISOString().split('T')[0].replaceAll('-','')
        tmpURL = 'https://origin.wpc.ncep.noaa.gov/verification/mode/images_test/' + endDateStr + '/' + tmpSelectedProduct + '_valid_' +  endDateStr + '12_prelim.png'
      } else {
        tmpURL = baseURL + 'daybyday/' + tmpSelectedProduct + '_' + startDateStr + '12_to_' + endDateStr + '12_vday' + selectedDay.toString() + '_vhr' + tmpvhr + '.png'
      }

    }
    return tmpURL
  }

  const onImageLoad = () => {
    setErrMsg('')
  }

  const onImageError = (e) => {
    if(props.archiveOrCurrent === "archive"){
      setErrMsg('No plot available for selected date & product')
    } else {
      let currDate = new Date();
      let currDateStr = currDate.toISOString().split('T')[0].replaceAll('-','')

      setErrMsg('No current (' + currDateStr + ') plot available for selected product')
    }
  }

  useEffect(() => {
    setimgURL(constructImgURL())
    setErrMsg('')
  },[selectedDay, selectedProduct, selectedArchiveDate, props.archiveOrCurrent])

  useEffect(() => {
    window.addEventListener('keydown', keyPressHandler)
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keydown', keyPressHandler)
    }
  },[selectedDay])

  useEffect(() => {
    if (!(selectedProduct.value === 'ALL_CSUopUFVSv2022' || selectedProduct.value === 'ALL_CSUopv2022') && selectedDay > 3) {
      setSelectedDay(3)
    }
  },[selectedProduct])

  return(
    <div className={styles.ImageDisplayContainer}>
      <div className={styles.ProductSelectContainer}>
        <Select
          defaultValue={selectedProduct}
          onChange={setSelectedProduct}
          options={props.archiveOrCurrent === 'current' ? options : archiveOptions}
          placeholder={'Select Product'}
        />
      </div>
      {
        props.archiveOrCurrent === 'current' ?
          selectedProduct.value !== 'observed_24hr_precip' ? 
            <div className={styles.DaySelectContainer}>
              <button className={`${styles.DaySelectButton} ${selectedDay === 1 ? styles.selected : ''}`} onClick={handleDayChange} value={1}>Day 1</button>
              <button className={`${styles.DaySelectButton} ${selectedDay === 2 ? styles.selected : ''}`} onClick={handleDayChange} value={2}>Day 2</button>
              <button className={`${styles.DaySelectButton} ${selectedDay === 3 ? styles.selected : ''}`} onClick={handleDayChange} value={3}>Day 3</button>
              { selectedProduct.value !== 'ALL_CSUopv2020' ? 
                <>
                   <button className={`${styles.DaySelectButton} ${selectedDay === 4 ? styles.selected : ''}`} onClick={handleDayChange} value={4}>Day 4</button>
                   <button className={`${styles.DaySelectButton} ${selectedDay === 5 ? styles.selected : ''}`} onClick={handleDayChange} value={5}>Day 5</button>
                </>
              :
                null
              }
              
            </div>
            : null
        :
        <>
          {selectedProduct.value !== 'observed_24hr_precip' ? 
            <div className={styles.DaySelectContainer}>
              <button className={`${styles.DaySelectButton} ${selectedDay === 1 ? styles.selected : ''}`} onClick={handleDayChange} value={1}>Day 1</button>
              <button className={`${styles.DaySelectButton} ${selectedDay === 2 ? styles.selected : ''}`} onClick={handleDayChange} value={2}>Day 2</button>
              <button className={`${styles.DaySelectButton} ${selectedDay === 3 ? styles.selected : ''}`} onClick={handleDayChange} value={3}>Day 3</button>
              { 
                selectedProduct.value !== 'ALL_CSUopv2020' ? 
                <>
                 <button className={`${styles.DaySelectButton} ${selectedDay === 4 ? styles.selected : ''}`} onClick={handleDayChange} value={4}>Day 4</button>
                 <button className={`${styles.DaySelectButton} ${selectedDay === 5 ? styles.selected : ''}`} onClick={handleDayChange} value={5}>Day 5</button>
                </>
                :
                null
              }
            </div>
            : null
          }
          <div className={styles.ArchiveDatePickerContainer}>
            <p className={styles.ArchiveDatePickerLabel}>Valid start date:</p>
            <DatePicker 
              className={styles.ArchiveDatePicker}
              selected={selectedArchiveDate} 
              onChange={(date) => setSelectedArchiveDate(date)} 
              />
          </div>
        </>
      }
     
      <div className={styles.ImgContainer}>
        {errMsg !== '' ?
          <>
            <p className={styles.MissingImgText}>{errMsg}</p>
            <FontAwesomeIcon className={styles.MissingImgIcon} icon={faImage} />
          </>
        :
          <Zoom>
            <img className={`${styles.ImgElement} ${props.archiveOrCurrent === 'current' ? styles.ImgElementShort : styles.ImgElementTall}`} src={imgURL} onLoad={onImageLoad} onError={onImageError}/>
          </Zoom>
        }
      </div>
    </div>
  )
}

export default ImageDisplay;