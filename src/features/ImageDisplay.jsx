import React, { useState, useEffect } from 'react';
import Select from 'react-select';

import styles from './ImageDisplay.module.css';

const baseURL = 'https://origin.wpc.ncep.noaa.gov/verification/ero_verif/images/'

const options = [
  {
    label: 'Most Recent ERO Verification Day',
    options: [
      { value: 'ALL_EROwST4gFFG_last_v', label: 'ERO With Verification Overlay' },
      { value: 'ALL_ST4gFFG_last_v', label: 'Verification Only' },
      { value: 'ALL_EROwALL_PP_last_v', label: 'Practically Perfect Verification' },
    ]
  },
  {
    label: 'CSU-MLP Daily Verification',
    options: [
      { value: 'ALL_CSUopUFVSv2022_last_v', label: 'CSU-MLP GEFS Operational - 2022 UFVS Version' },
      { value: 'ALL_CSUopv2022_last_v', label: 'CSU-MLP GEFS Operational - 2022 Version' },
      { value: 'ALL_CSUopv2020_last_v', label: 'CSU-MLP GEFS Operational - 2020 Version' },
    ]
  },
  {
    label: 'Bulk Error Statistics',
    options: [
      { value: 'ALL_issuancetime_BSandAuROC_v', label: 'BSS and AuROC by Issuance Time - Compared to Observations' },
      { value: 'ALL_bulkBSaAuROC_v', label: 'BSS and AuROC - Compared to Practically Perfect' },
      { value: 'ALL_CSUMLPaEROvsPP_CB_v', label: 'Contingency Bias - Compared to Practically Perfect' },
      { value: 'ALL_CSUMLPaEROvsPP_CSI_v', label: 'Critical Success Index - Compared to Practically Perfect' },
      { value: 'ALL_CSUMLPaEROvsPP_FAR_v', label: 'False Alarm Ratio - Compared to Practically Perfect' },
      { value: 'ALL_CSUMLPaEROvsPP_HIT_v', label: 'Hit Rate - Compared to Practically Perfect' },
    ]
  },
  {
    label: 'Fractional Coverage',
    options: [
      { value: 'ALL_ERO_bycat_v', label: 'ERO Bulk Probabilities by Threshold' },
      { value: 'ALL_CSUMLP_bycat_v', label: 'CSU-MLP Bulk Probabilities by Threshold' },
    ]
  }

];


const ImageDisplay = (props) => {

  const [selectedProduct, setSelectedProduct] = useState(options[0].options[0]);
  const [selectedDay, setSelectedDay] = useState(1);

  const keyPressHandler = ({ key }) => {
    if (props.plotType === 'current') {
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
    }
  }

  const handleDayChange = (e) => {
    setSelectedDay(parseInt(e.target.value))
  }

  useEffect(() => {
    window.addEventListener('keydown', keyPressHandler)
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keydown', keyPressHandler)
    }
  },[selectedDay])

  return(
    <div className={styles.ImageDisplayContainer}>
      <div className={styles.ProductSelectContainer}>
        <Select
          defaultValue={selectedProduct}
          onChange={setSelectedProduct}
          options={options}
          placeholder={'Select Product'}
        />
      </div>
      {
        props.plotType === 'current' ?
        <div className={styles.DaySelectContainer}>
          <button className={`${styles.daySelectButton} ${selectedDay === 1 ? styles.selected : ''}`} onClick={handleDayChange} value={1}>Day 1</button>
          <button className={`${styles.daySelectButton} ${selectedDay === 2 ? styles.selected : ''}`} onClick={handleDayChange} value={2}>Day 2</button>
          <button className={`${styles.daySelectButton} ${selectedDay === 3 ? styles.selected : ''}`} onClick={handleDayChange} value={3}>Day 3</button>
          <button className={`${styles.daySelectButton} ${selectedDay === 4 ? styles.selected : ''}`} onClick={handleDayChange} value={4}>Day 4</button>
          <button className={`${styles.daySelectButton} ${selectedDay === 5 ? styles.selected : ''}`} onClick={handleDayChange} value={5}>Day 5</button>
        </div>
        :
        null
      }
     
      <div className={styles.ImgContainer}>
        <img className={styles.ImgElement} src={baseURL + selectedProduct.value + 'day' + selectedDay.toString() + '.png'}/>
      </div>
    </div>
  )
}

export default ImageDisplay;