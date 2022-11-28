import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import styles from './app.module.css';

import Switch from "react-switch";

import ImageDisplay from './features/ImageDisplay'

function App() {
  const [comparisonToggled, setComparisonToggled] = useState(false);
  const [plotType, setPlotType] = useState("current");

  const handleToggleComparison = () => {
    setComparisonToggled(!comparisonToggled)
  }

  const handlePlotTypeSwitch = (e) => {
    setPlotType(e.target.value)
  }

  return (
    <div className="App">
      <div>
        <h1 className={styles.TitleHeader}>WPC ERO Verification</h1>

        <div className={styles.PlotTypeRadioContainer}>
          <input onChange={handlePlotTypeSwitch} type="radio" id="archive" name="type" value="archive" checked={plotType === 'archive'}/>
          <label htmlFor="archive">Archive</label>

          <input onChange={handlePlotTypeSwitch} type="radio" id="current" name="type" value="current" checked={plotType === 'current'}/>
          <label htmlFor="current">Current</label>
        </div>
        <div className={styles.ComparisonToggleContainer}>
            <p className={styles.ComparisonToggleLabel}>Enable Comparison:</p>
            <Switch className={styles.ComparisonToggleSwitch} onChange={handleToggleComparison} checked={comparisonToggled} />
        </div>


        <div className={comparisonToggled ? styles.MultiPlotContainer : styles.SinglePlotContainer}>
          <ImageDisplay plotType={plotType}/>
        </div>
        { comparisonToggled ? 
          <div className={styles.MultiPlotContainer}>
            <ImageDisplay plotType={plotType}/>
          </div>
          :
          null
        }


      </div>
    </div>
  );
}

export default App;
