import React, { useState, useEffect } from 'react';
import { NavBar } from "@atkingtornado/wpc-navbar-reactjs";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons'
import Switch from "react-switch";

import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import ImageDisplay from './features/ImageDisplay';
import MapDisplay from './features/MapDisplay';

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

      <Dialog 
        style={{zIndex:9999}} 
        onClose={handleClose} 
        open={helpMenuOpen}
        scroll={"paper"}
      >
        <DialogTitle><b>About the ERO Verification Page</b></DialogTitle>
        <DialogContent dividers={true}>

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <Typography><b>ERO Verification Plot Layers</b></Typography>
            </AccordionSummary>
            <AccordionDetails>
              <ul>
                <li><b>ST4 > ARI</b></li>
                <ul>
                  <li><b>Description:</b> Points where Stage IV rainfall exceeds the 1-, 2-, and 10-year Average Recurrence Interval value.</li>
                  <li><b>Relevant Publications:</b></li>
                  <ul>
                    <li>Perica, S., and Coauthors, 2013: Precipitation-frequency atlas of the United States. NOAA Atlas.</li>
                  </ul>
                </ul>

                <li><b>USGS</b></li>
                <ul>
                  <li><b>Description:</b> Flood observations from the U.S. Geological Survey stream gauges.</li>
                </ul>

                <li><b>LSR(s)</b></li>
                <ul>
                  <li><b>Description:</b> Local Storm Reports of “Flood” or “Flash Flood” as recorded by the WFOs.</li>
                </ul>

                <li><b>mPING</b></li>
                <ul>
                  <li><b>Description:</b> Public weather reports submitted via the NSSL mPING application </li>
                </ul>

                <li><b>ST4 > FFG</b></li>
                <ul>
                  <li><b>Description:</b> Points where Stage IV rainfall exceeds the 1-, 3-, and 6-hour Flash Flood Guidance value.</li>
                  <li><b>Relevant Publications:</b></li>
                  <ul>
                    <li> Barthold, F. E., T. E. Workoff, B. A. Cosgrove, J. J. Gourley, D. R. Novak, and K. M. Mahoney, 2015: “Improving flash flood forecasts: The HMT-WPC Flash Flood and Intense Rainfall Experiment. Bulletin of the American Meteorological Society, 96 (11), 1859–1866, <a href='https://doi.org/10.1175/BAMS-D-14-00201.1'>https://doi.org/10.1175/BAMS-D-14-00201.1.</a></li>
                    <li>Schmidt, J. A., A. J. Anderson, and J. H. Paul, 2007: Spatially variable, physically-derived flash flood guidance. 21st Conference on Hydrology, San Antonio, TX, Amer. Meteor. Soc., 6B.2, <a href='https://ams.confex.com/ams/pdfpapers/120022.pdf'>https://ams.confex.com/ams/pdfpapers/120022.pdf</a></li>
                  </ul>
                </ul>

                <li><b>ERO Risk Categories</b></li>
                <ul>
                  <li><b>Description:</b> The risk (probability) of rainfall exceeding Flash Flood Guidance within 40 km of a point.
                    <br/><br/>Marginal: At least 5%
                    <br/>Slight: At least 15%
                    <br/>Moderate: At least 40 %
                    <br/>High: At least 70%
                  </li>
                </ul>
              </ul>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2-content"
              id="panel2-header"
            >
              <Typography><b>ERO Verification Plot Statistics</b></Typography>
            </AccordionSummary>
            <AccordionDetails>
              <ul>
                <li><b>BSS:</b></li>
                <li><b>FC stats:</b> Fractional coverage of UFVS observations within the ERO contour for each respective category.</li>

              </ul>
            </AccordionDetails>
          </Accordion>

           <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel3-content"
              id="panel3-header"
            >
              <Typography><b>CSU-MLP Verification</b></Typography>
            </AccordionSummary>
            <AccordionDetails>
              <ul>
                  <li><b>Relevant Publications:</b></li>
                  <ul>
                    <li>Schumacher, Russ S. and Hill, Aaron J. and Klein, Mark and Nelson, James A. and Erickson, Michael J. and Trojniak, Sarah M. and Herman, Gregory R. “From Random Forests to Flood Forecasts: A Research to Operations Success Story,” (2021) Bulletin of the American Meteorological Society, 102:9, E1742-E1755. <a href="https://doi.org/10.1175/BAMS-D-20-0186.1">https://doi.org/10.1175/BAMS-D-20-0186.1</a></li>
                  </ul>
              </ul>
            </AccordionDetails>
          </Accordion>

           <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel4-content"
              id="panel4-header"
            >
              <Typography><b>Bulk Error Statistics</b></Typography>
            </AccordionSummary>
            <AccordionDetails>
              <ul>
              </ul>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel5-content"
              id="panel5-header"
            >
              <Typography><b>Fractional Coverage</b></Typography>
            </AccordionSummary>
            <AccordionDetails>
              <ul>
              </ul>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel6-content"
              id="panel6-header"
            >
              <Typography><b>Heat Maps</b></Typography>
            </AccordionSummary>
            <AccordionDetails>
              <ul>
              </ul>
            </AccordionDetails>
          </Accordion>

        </DialogContent>
      </Dialog>

    </div>
  );
}

export default App;
