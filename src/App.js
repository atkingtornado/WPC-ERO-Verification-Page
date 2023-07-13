import React, { useState, useEffect } from 'react';
import { NavBar } from "@atkingtornado/wpc-navbar-reactjs";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons'
import Switch from "react-switch";

import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import ImageDisplay from './features/ImageDisplay';
import MapDisplay from './features/MapDisplay';
import AboutModal from './features/AboutModal';

import logo from './logo.svg';
import './App.css';
import styles from './app.module.css';

function App() {
  const [comparisonToggled, setComparisonToggled] = useState(false);
  const [archiveOrCurrent, setArchiveOrCurrent] = useState("current");
  const [displayType, setDisplayType] = useState("static");
  const [mapViewState, setMapViewState] = useState({
      longitude: -98.4,
      latitude: 39.5,
      zoom: 3
  });
  const [helpMenuOpen, setHelpMenuOpen] = React.useState(false);

  const handleOpen = () => setHelpMenuOpen(true);
  const handleClose = () => setHelpMenuOpen(false);


  const handleToggleComparison = () => {
    setComparisonToggled(!comparisonToggled)
  }

  const handleArchiveOrCurrentSwitch = (e) => {
    setArchiveOrCurrent(e.target.value)
  }

  const handleDisplayTypeSwitch = (e) => {
    setDisplayType(displayType === 'static' ? 'interactive' : 'static')
  }

  return (
    <div className="App">
      <div className={styles.NavBar}>
        <NavBar/>
      </div>
      <div>
        <div className={styles.TitleContainer}>
          <h2 className={styles.TitleHeader}>WPC ERO Verification</h2>
          <Tooltip title="About this product">
            <FontAwesomeIcon className={styles.AboutIcon} icon={faCircleQuestion} onClick={handleOpen} />
          </Tooltip>
        </div>


        <div className={styles.DisplayTypeButtonContainer}>
          <Button size="small" variant="contained" className={styles.DisplayTypeButton} onClick={handleDisplayTypeSwitch}>{displayType === 'static' ? "Interactive View" : "Plot View"}</Button>
        </div>

        <div className={styles.PlotOptionsContainer}>
            <div className={styles.PlotTypeRadioContainer}>
              <div>
                <input onChange={handleArchiveOrCurrentSwitch} type="radio" id="archive" name="type" value="archive" checked={archiveOrCurrent === 'archive'}/>
                <label htmlFor="archive"><b>Archive</b></label>

                <input onChange={handleArchiveOrCurrentSwitch} type="radio" id="current" name="type" value="current" checked={archiveOrCurrent === 'current'}/>
                <label htmlFor="current"><b>Current</b></label>
              </div>
            </div>
            <div className={styles.ComparisonToggleContainer}>
              <Switch className={styles.ComparisonToggleSwitch} onChange={handleToggleComparison} checked={comparisonToggled} />
              <p className={styles.ComparisonToggleLabel}>Compare</p>  
            </div>
        </div>

      { displayType === 'interactive' ?
        <>
          <div className={comparisonToggled ? styles.MultiPlotContainer : styles.SinglePlotContainer}>
            <MapDisplay mapID={'map1'} comparisonToggled={comparisonToggled} mapViewState={mapViewState} setMapViewState={setMapViewState} archiveOrCurrent={archiveOrCurrent}/>
          </div>
          { comparisonToggled ? 
            <div className={styles.MultiPlotContainer}>
              <MapDisplay mapID={'map2'} comparisonToggled={comparisonToggled} mapViewState={mapViewState} setMapViewState={setMapViewState} archiveOrCurrent={archiveOrCurrent}/>
            </div>
            :
            null
          }
        </>
       :
        <>
          <div className={comparisonToggled ? styles.MultiPlotContainer : styles.SinglePlotContainer}>
            <ImageDisplay archiveOrCurrent={archiveOrCurrent}/>
          </div>
          { comparisonToggled ? 
            <div className={styles.MultiPlotContainer}>
              <ImageDisplay archiveOrCurrent={archiveOrCurrent}/>
            </div>
            :
            null
          }
        </>
      }


      </div>

      <AboutModal onClose={handleClose} open={helpMenuOpen}/>

    </div>
  );
}

export default App;
