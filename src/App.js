import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import styles from './app.module.css';

import Switch from "react-switch";

import ImageDisplay from './features/ImageDisplay'

function App() {
  const [comparisonToggled, setComparisonToggled] = useState(false);

  const handleToggleComparison = () => {
    setComparisonToggled(!comparisonToggled)
  }

  return (
    <div className="App">
      <div>
        <h1 className={styles.TitleHeader}>WPC ERO Verification</h1>
        <div className={styles.ComparisonToggleContainer}>
            <p className={styles.ComparisonToggleLabel}>Enable Comparison:</p>
            <Switch className={styles.ComparisonToggleSwitch} onChange={handleToggleComparison} checked={comparisonToggled} />
        </div>


        <div className={comparisonToggled ? styles.MultiPlotContainer : styles.SinglePlotContainer}>
          <ImageDisplay/>
        </div>
        { comparisonToggled ? 
          <div className={styles.MultiPlotContainer}>
            <ImageDisplay/>
          </div>
          :
          null
        }


      </div>
    </div>
  );
}

export default App;
