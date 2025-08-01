/**
 * @fileoverview Map layer configuration for the WPC ERO Verification webpage
 *
 * This file defines the styling and rendering properties for various map layers
 * used in the interactive map display. Each layer has specific visual properties
 * based on its data type and purpose.
 */

/**
 * Layer configuration object that defines how each data layer should be rendered on the map
 *
 */
export const mapLayerConf = {
  /**
   * ERO (Excessive Rainfall Outlook) contours
   * Displays risk categories as filled contours
   */
  wpcero: {
    type: "fill",
    paint: {
      "fill-color":[
        "match",
        ["get", "title"],
        "5.00-15.00 ",
        "#7fff7f", // Marginal risk
        "15.00-40.00 ",
        "#ffff7f", // Slight risk
        "40.00-70.00 ",
        "#ff7f7f", // Moderate risk
        "70.00-100.00 ",
        "#ff7fff", // High risk
        /* other */ "black", // Default fallback color
      ],
      "fill-opacity": 0.2,
    },
  },
  wpcero_line: {
    type: "line",
    paint: {
      "line-color":[
        "match",
        ["get", "title"],
        "5.00-15.00 ",
        "#7fff7f", // Marginal risk
        "15.00-40.00 ",
        "#ffff7f", // Slight risk
        "40.00-70.00 ",
        "#ff7f7f", // Moderate risk
        "70.00-100.00 ",
        "#ff7fff", // High risk
        /* other */ "black", // Default fallback color
      ],
      "line-opacity": 0.9,
      "line-width": 2.0,
    },
  },

  /**
   * Practically Perfect (PP) verification areas
   * Displays probability ranges as filled polygons with different colors
   */
  pp_co_2p5km: {
    type: "fill",
    paint: {
      "fill-color":[
        "match",
        ["get", "title"],
        "5.00-10.00 ",
        "#149e13", // Marginal risk
        "10.00-20.00 ",
        "#baba13", // Slight risk
        "20.00-50.00 ",
        "#a11213", // Moderate risk
        "50.00-100.00 ",
        "#a601ff", // High risk
        /* other */ "black", // Default fallback color
      ],
      "fill-opacity": ["get", "fill-opacity"],
    },
  },

  /**
   * Stage IV exceeding Average Recurrence Interval (ARI)
   * Points where observed rainfall exceeds the ARI threshold
   */
  st4geari_co_2p5km_with_40km_radius: {
    type: "fill",
    paint: {
      "fill-color": "#ff403f",
      "fill-opacity": 0.6,
    },
  },

  /**
   * Stage IV exceeding Flash Flood Guidance (FFG)
   * Areas where observed rainfall exceeds flash flood guidance values
   */
  st4geffg_co_2p5km_with_40km_radius: {
    type: "fill",
    paint: {
      "fill-color": "#7f7fff",
      "fill-opacity": 0.6,
    },
  },

  /**
   * Local Storm Reports (LSR) for flash floods
   * Point data showing reported flash flood events
   */
  lsr_flash: {
    type: "circle",
    paint: {
      "circle-color": "#ffc1cd",
      "circle-opacity": 1.0,
    },
  },

  /**
   * Local Storm Reports (LSR) for regular floods
   * Point data showing reported regular flood events
   */
  lsr_flood: {
    type: "circle",
    paint: {
      "circle-color": "#ffa500",
      "circle-opacity": 1.0,
    },
  },

  /**
   * USGS stream gauge flood observations
   * Point data showing USGS stream gauge locations reporting flood conditions
   */
  usgs: {
    type: "circle",
    paint: {
      "circle-color": "#008001",
      "circle-opacity": 1.0,
    },
  },
}

/**
 * Layer label configuration object that defines long names for each layer (used in legend)
 *
 */
export const mapLayerLabelConf = {
  wpcero: {
    name: "ERO", 
    labels: {
      "other": false,
      "5.00-15.00 ":"ERO MRGL",
      "15.00-40.00 ":"ERO SLGT",
      "40.00-70.00 ":"ERO MOD",
      "70.00-100.00 ":"ERO HIGH",
    }
  },
  pp_co_2p5km: {
    name: "Practically Perfect", 
    labels:{
      "other": false,
      "5.00-10.00 ":"PP MRGL",
      "10.00-20.00 ":"PP SLGT",
      "20.00-50.00 ":"PP MOD",
      "50.00-100.00 ":"PP HIGH",
    }
  },
  st4geari_co_2p5km_with_40km_radius: {name: "St4 > ARI", labels:{other: false,}},
  st4geffg_co_2p5km_with_40km_radius: {name: "St4 > FFG", labels:{other: false,}},
  lsr_flash: {name: "LSR FLASH", labels:{other: false,}},
  lsr_flood: {name: "LSR FLOOD", labels:{other: false,}},
  usgs: {name: "USGS", labels:{other: false,}},
}

/**
 * Map plot layer configuration object that defines which layers are in each "plot"
 *
 */
export const mapLayerPlotConf = {
  wpc_ero_verifall: ["wpcero", "st4geari_co_2p5km_with_40km_radius","st4geffg_co_2p5km_with_40km_radius","lsr_flash","lsr_flood","usgs"],
  wpc_ero_verifpp: ["pp_co_2p5km", "wpcero"],
  wpc_ero_verifallnc: [],
  wpc_ero_verifppnc: [],
}
