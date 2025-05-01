/**
 * @fileoverview AboutModal component for the WPC ERO Verification tool
 *
 * This component displays a modal dialog with detailed information about
 * the ERO Verification tool, including product descriptions and usage instructions.
 * It uses Material UI components to create an accordion-based information structure.
 */
import { Dialog, DialogTitle, DialogContent } from "@mui/material"
import Accordion from "@mui/material/Accordion"
import AccordionSummary from "@mui/material/AccordionSummary"
import AccordionDetails from "@mui/material/AccordionDetails"
import Typography from "@mui/material/Typography"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"

/**
 * Modal component that displays information about the ERO Verification tool
 *
 * @param {Object} props - Component props
 * @param {boolean} props.open - Controls whether the modal is displayed
 * @param {Function} props.onClose - Handler function called when the modal is closed
 * @returns {JSX.Element} The rendered AboutModal component
 */
const AboutModal = (props) => {
  const { open, onClose } = props

  return (
    <Dialog style={{ zIndex: 9999 }} onClose={onClose} open={open} scroll="paper">
      <DialogTitle variant="h5">
        <b>About the ERO Verification Page</b>
      </DialogTitle>

      <DialogContent dividers={true}>
        {/* Main accordion section for Product Descriptions */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="mainpanel1-content" id="mainpanel1-header">
            <Typography variant="h6">
              <b>Product Descriptions</b>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {/* ERO Verification Plot Layers section */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1-content" id="panel1-header">
                <Typography>
                  <b>ERO Verification Plot Layers</b>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ul>
                  {/* ST4 > ARI information */}
                  <li>
                    <b>ST4 &gt; ARI</b>
                  </li>
                  <ul>
                    <li>
                      <b>Description:</b> Points where Stage IV rainfall exceeds the 5-year Average
                      Recurrence Interval value.
                    </li>
                    <li>
                      <b>Relevant Publications:</b>
                    </li>
                    <ul>
                      <li>
                        Perica, S., and Coauthors, 2013: Precipitation-frequency atlas of the United States. NOAA Atlas.
                      </li>
                      <li>
                        Nelson, B. R., O. P. Prat, D.-J. Seo, and E. Habib, 2016: Assessment and implications of NCEP Stage IV quantitative precipitation estimates for product intercomparisons. Weather and Forecasting, 31 (2), 371 – 394, <a href="https://doi.org/https://doi.org/10.1175/WAF-D-14-00112.1">https://doi.org/https://doi.org/10.1175/WAF-D-14-00112.1</a>.
                      </li>
                    </ul>
                  </ul>

                  {/* USGS information */}
                  <li>
                    <b>USGS</b>
                  </li>
                  <ul>
                    <li>
                      <b>Description:</b> Flood observations from the U.S. Geological Survey stream gauges.
                    </li>
                  </ul>

                  {/* LSR information */}
                  <li>
                    <b>LSR(s)</b>
                  </li>
                  <ul>
                    <li>
                      <b>Description:</b> Local Storm Reports of "Flood" or "Flash Flood" as recorded by the WFOs.
                    </li>
                  </ul>

                  {/* mPING information */}
                  <li>
                    <b>mPING</b>
                  </li>
                  <ul>
                    <li>
                      <b>Description:</b> Public weather reports submitted via the NSSL mPING application{" "}
                    </li>
                  </ul>

                  {/* ST4 > FFG information */}
                  <li>
                    <b>ST4 &gt; FFG</b>
                  </li>
                  <ul>
                    <li>
                      <b>Description:</b> Points where Stage IV rainfall exceeds the 1-, 3-, and 6-hour Flash Flood
                      Guidance value.
                    </li>
                    <li>
                      <b>Relevant Publications:</b>
                    </li>
                    <ul>
                      <li>
                        Barthold, F. E., T. E. Workoff, B. A. Cosgrove, J. J. Gourley, D. R. Novak, and K. M. Mahoney,
                        2015: "Improving flash flood forecasts: The HMT-WPC Flash Flood and Intense Rainfall Experiment.
                        Bulletin of the American Meteorological Society, 96 (11), 1859–1866,{" "}
                        <a href="https://doi.org/10.1175/BAMS-D-14-00201.1">
                          https://doi.org/10.1175/BAMS-D-14-00201.1.
                        </a>
                      </li>
                      <li>
                        Schmidt, J. A., A. J. Anderson, and J. H. Paul, 2007: Spatially variable, physically-derived
                        flash flood guidance. 21st Conference on Hydrology, San Antonio, TX, Amer. Meteor. Soc., 6B.2,{" "}
                        <a href="https://ams.confex.com/ams/pdfpapers/120022.pdf">
                          https://ams.confex.com/ams/pdfpapers/120022.pdf
                        </a>
                      </li>
                    </ul>
                  </ul>

                  {/* ERO Risk Categories information */}
                  <li>
                    <b>ERO Risk Categories</b>
                  </li>
                  <ul>
                    <li>
                      <b>Description:</b> The risk (probability) of rainfall exceeding Flash Flood Guidance within 25 miles
                      of a point.
                      <br />
                      <br />
                      Marginal: At least 5%
                      <br />
                      Slight: At least 15%
                      <br />
                      Moderate: At least 40 %
                      <br />
                      High: At least 70%
                    </li>
                    <br/>
                    *Note that these values changed on 2/11/2022
                    <br/>
                    <li>
                      <b>Issuance Times:</b>
                      <br/>
                      Day 1 is issued at 09Z, 16Z, 21Z, and 01Z
                      <br/>
                      Days 2-5 are issued at 09Z and 21Z
                    </li>
                    <li>
                      <b>Valid Times:</b>
                      <br/>
                      Day 1 can be valid from 12Z - 12Z (09Z issuance), from 01 - 12Z (01Z issuance *no verification produced for this period), or from 16Z/21Z - 12Z.
                      <br/>
                      Days 2-5 are always valid from 12Z - 12Z
                    </li>
                  </ul>
                </ul>
              </AccordionDetails>
            </Accordion>

            {/* ERO Verification Plot Statistics section */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2-content" id="panel2-header">
                <Typography>
                  <b>ERO Verification Plot Statistics</b>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ul>
                  <li>
                    <b>BSS:</b> Brier Skill Score for the UFVS observations and the ERO contour.
                  </li>
                  <li>
                    <b>FC stats:</b> Fractional coverage of UFVS observations within the ERO contour for each respective
                    category.
                    <br/>
                    (The goal of this is to get the fractional coverage to the probability threshold for that contour. For example, ideally FC for MDT would be above 40%)
                  </li>
                </ul>
              </AccordionDetails>
            </Accordion>

            {/* CSU-MLP Verification section */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel3-content" id="panel3-header">
                <Typography>
                  <b>CSU-MLP Verification</b>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ul>
                  <li>
                    <b>Description:</b> Grid-to-grid verification of the CSU-MLP products. These products provide a first guess for the ERO which forecasters can choose to use as guidance in creating their EROs. The CSU-MLP has the same risk categories as the regular ERO, and verification is completed the same way.
                  </li>
                  <li>
                    <b>Relevant Publications:</b>
                  </li>
                  <ul>
                    <li>
                      Schumacher, Russ S. and Hill, Aaron J. and Klein, Mark and Nelson, James A. and Erickson, Michael
                      J. and Trojniak, Sarah M. and Herman, Gregory R. "From Random Forests to Flood Forecasts: A
                      Research to Operations Success Story," (2021) Bulletin of the American Meteorological Society,
                      102:9, E1742-E1755.{" "}
                      <a href="https://doi.org/10.1175/BAMS-D-20-0186.1">https://doi.org/10.1175/BAMS-D-20-0186.1</a>
                    </li>
                  </ul>
                </ul>
              </AccordionDetails>
            </Accordion>

            {/* Bulk Error Statistics section */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel4-content" id="panel4-header">
                <Typography>
                  <b>Bulk Error Statistics</b>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ul>
                  <li><b>BSS and AuROC:</b> Shows the Brier Skill Score for each issuance time of the Day 1 ERO (see if the updates improved the skill) in the blue line. The red line shows the area under the relative operating characteristic curve (ROC curve) as a function of issuance time. A perfect ERO would have an AuROC of 1.0. (further <a href="https://developers.google.com/machine-learning/crash-course/classification/roc-and-auc">information</a>)</li>
                  <li><b>BSS and AuROC Compared to Practically Perfect:</b> Shows BSS and AuROC (see above) for the EROs and CSU MLP products compared to the Practically Perfect Verification. The Practically Perfect takes the UFVS verification, creates one “super” object, and applies a Gaussian smoother (making the object more circular) as well as a weighting algorithm to give more weight to observations in the UFVS and less weight to the proxies (Stage IV exceedances). <a href="https://doi.org/10.1175/WAF-D-20-0020.1">Further information on PP</a></li>
                  <li><b>Contingency bias compared to PP:</b> Contingency bias for EROs and the various versions of the CSU-MLP for each ERO category.</li>
                  <li><b>CSI compared to PP:</b> Critical Success Index of the EROs (split by category) versus the practically perfect verification.</li>
                  <li><b>False alarm compared to PP:</b> contingency table statistics false alarm rate of each ERO category compared to the PP verification. “Perfect” would be 0.</li>
                  <li><b>Hit rate compared to PP:</b> contingency table statistics hit rate of each ERO category compared to the PP verification. “Perfect” would be 1.0.</li>
                </ul>
              </AccordionDetails>
            </Accordion>

            {/* Fractional Coverage section */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel5-content" id="panel5-header">
                <Typography>
                  <b>Fractional Coverage</b>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ul>
                  <li><b>ERO bulk probabilities by threshold:</b> Average probability of the verification for each ERO category compared to two different subsets of the UFVS. Blue bars indicate using Stage IV exceedances of FFG only. The orange bars indicate probabilities when using the full UFVS. The green bars represent the lower bound of the probability defining each ERO category, and the red lines represent the upper bound of the probability. For example, a Slight Risk is defined as a 15-40% risk of excessive rainfall occurring within 40 km of a point.</li>
                  <li><b>CSU bulk probabilities by threshold:</b>  Average probability of the UFVS verification for each CSU-MLP ERO category. The green bars represent the lower bound of the probability defining each ERO category, and the red lines represent the upper bound of the probability. Different color bars show different versions of the CSU-MLP.</li>
                </ul>
              </AccordionDetails>
            </Accordion>

            {/* Heat Maps section */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel6-content" id="panel6-header">
                <Typography>
                  <b>Heat Maps</b>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ul>
                  <li><b>1-year ERO category frequency (Marginal, Slight, Moderate, High):</b> Probability of the point being within an ERO of this category.</li>
                  <li><b>1-year PP frequency at each category (Marginal, Slight, Moderate, High):</b> Probability of the point being within a PP verification object of this category.</li>
                  <li><b>1-year 2022 UFVS CSU-MLP Operational GEFS:</b> Probability of the point being within a UFVS object matching this category.</li>
                  <li><b>1-year 2022 CSU-MLP Operational GEFS:</b> Probability of the point being within an ERO first guess from CSU MLP of this category. 2022 version of the CSU MLP.</li>
                  <li><b>1-year 2020 CSU-MLP Operational GEFS:</b> Probability of the point being within an ERO first guess from CSU MLP of this category. 2020 version of the CSU MLP.</li>
                </ul>
              </AccordionDetails>
            </Accordion>
          </AccordionDetails>
        </Accordion>

        {/* Main accordion section for Webpage Help */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="mainpanel2-content" id="mainpanel2-header">
            <Typography variant="h6">
              <b>Webpage Help</b>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {/* Basic Functions section */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel7-content" id="panel7-header">
                <Typography>
                  <b>Basic Functions</b>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ul>
                  <li>
                    This webpage allows for two ways of viewing ERO verification data: static plots & an interactive map
                    viewer. To switch between these views, click either the "INTERACTIVE VIEW" or "PLOT VIEW" buttons.
                  </li>
                  <li>
                    To switch between archived plots/data & the most recent plots/data, click the radio button labeled
                    "Archive" or "Current"
                  </li>
                  <ul>
                    <li>
                      If "Archive" is selected, an input box for selecting the valid date will appear. Dates can be
                      selected either by clicking on the box & using the calendar or by advancing forward/backwards
                      using the arrow buttons.
                    </li>
                    <li>
                      Detailed explanations of how to select what data is displayed for both display types is contained
                      in the folllowing sections.
                    </li>
                  </ul>
                  <li>To change the forecast day click any of the DAY 1-5 buttons.</li>
                  <ul>
                    <li>Use the arrow keys to quickly flip back and forth between days.</li>
                  </ul>
                  <li>
                    The webpage allows for the comparison of two plots or interactive maps by flipping the "Compare"
                    switch. This will generate a second data display to the right of the one that was already being
                    viewed.
                  </li>
                </ul>
              </AccordionDetails>
            </Accordion>

            {/* Plot View section */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel8-content" id="panel8-header">
                <Typography>
                  <b>Plot View</b>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ul>
                  <li>
                    To select the plot to view, click the dropdown menu and scroll through the list of options, or start
                    typing to search the listing.
                  </li>
                  <li>Click on the plot itself to enlarge it.</li>
                </ul>
              </AccordionDetails>
            </Accordion>

            {/* Interactive View section */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel9-content" id="panel9-header">
                <Typography>
                  <b>Interactive View</b>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ul>
                  <li>
                    To add a layer to the interactive map, click the dropdown menu and scroll through the list of
                    options, or start typing to search the listing.
                  </li>
                  <li>
                    To remove a layer from the interactive map, click the "X" next to the layer name within the dropdown
                    menu input box.
                  </li>
                  <ul>
                    <li>To remove all active layers, click the "X" at the far right side of the input box.</li>
                  </ul>
                  <li>To pan, click & drag anywhere on the map.</li>
                  <li>To zoom, use the scroll wheel.</li>
                  <li>To rotate or tilt the map, hold right click and drag.</li>
                  <li>
                    A legend will be dynamically generated at the bottom left corner of the map based upon the layers
                    that have been added.
                  </li>
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

export default AboutModal
