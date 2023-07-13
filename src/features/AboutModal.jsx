import React, { useState, useEffect } from 'react';

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

const AboutModal = (props) => {
    return(
      <Dialog 
        style={{zIndex:9999}} 
        onClose={props.onClose} 
        open={props.open}
        scroll={"paper"}
      >
        <DialogTitle variant="h5"><b>About the ERO Verification Page</b></DialogTitle>
        <DialogContent dividers={true}>

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="mainpanel1-content"
              id="mainpanel1-header"
            >
              <Typography variant="h6"><b>Product Descriptions</b></Typography>
            </AccordionSummary>
            <AccordionDetails>
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
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="mainpanel2-content"
              id="mainpanel2-header"
            >
              <Typography variant="h6"><b>Webpage Help</b></Typography>
            </AccordionSummary>
            <AccordionDetails>

              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel7-content"
                  id="panel6-header"
                >
                  <Typography><b>Basic Functions</b></Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <ul>
                    <li>This webpage allows for two ways of viewing ERO verification data: static plots & an interactive map viewer. To switch between these views, click either the "INTERACTIVE VIEW" or "PLOT VIEW" buttons.</li>
                    <li>To switch between archived plots/data & the most recent plots/data, click the radio button labeled "Archive" or "Current"</li>
                    <ul>
                      <li>If "Archive" is selected, an input box for selecting the valid date will appear. Dates can be selected either by clicking on the box & using the calendar or by advancing forward/backwards using the arrow buttons.</li>
                      <li>Detailed explanations of how to select what data is displayed for both display types is contained in the folllowing sections.</li>
                    </ul>
                    <li>To change the forecast day click any of the DAY 1-5 buttons.</li>
                    <ul>
                      <li>Use the arrow keys to quickly flip back and forth between days.</li>
                    </ul>
                    <li>The webpage allows for the comparison of two plots or interactive maps by flipping the “Compare” switch. This will generate a second data display to the right of the one that was already being viewed.</li>
                  </ul>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel8-content"
                  id="panel6-header"
                >
                  <Typography><b>Plot View</b></Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <ul>
                    <li>To select the plot to view, click the dropdown menu and scroll through the list of options, or start typing to search the listing.</li>
                    <li>Click on the plot itself to enlarge it.</li>
                  </ul>
                </AccordionDetails>
              </Accordion>


              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel9-content"
                  id="panel6-header"
                >
                  <Typography><b>Interactive View</b></Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <ul>
                    <li>To add a layer to the interactive map, click the dropdown menu and scroll through the list of options, or start typing to search the listing.</li>
                    <li>To remove a layer from the interactive map, click the “X” next to the layer name within the dropdown menu input box.</li>
                    <ul>
                      <li>To remove all active layers, click the “X” at the far right side of the input box.</li>
                    </ul>
                    <li>To pan, click & drag anywhere on the map.</li>
                    <li>To zoom, use the scroll wheel.</li>
                    <li>To rotate or tilt the map, hold right click and drag.</li>
                    <li>A legend will be dynamically generated at the bottom left corner of the map based upon the layers that have been added.</li>
                    <ul>
                      <li>You can hide/show layers by clicking on the eye icon within the legend.</li>
                    </ul>
                    <li>To make the interactive map full screen, click the expand icon at the top right of the map.</li>

                  </ul>
                </AccordionDetails>
              </Accordion>


            </AccordionDetails>
          </Accordion>

        </DialogContent>
      </Dialog>
    )
}

export default AboutModal;