/**
 * @fileoverview Map layer configuration for the WPC ERO Verification tool
 *
 * This file defines the styling and rendering properties for various map layers
 * used in the interactive map display. Each layer has specific visual properties
 * based on its data type and purpose.
 */

/**
 * Layer configuration object that defines how each data layer should be rendered on the map
 *
 * @type {Object.<string, {type: string, paint: Object}>}
 */
export const layerConf = {
  /**
   * ERO (Excessive Rainfall Outlook) contours
   * Displays risk categories as colored lines
   */
  ALL_ERO: {
    type: "line",
    paint: {
      "line-color": [
        "match",
        ["get", "title"],
        "MRGL",
        "green", // Marginal risk
        "SLGT",
        "orange", // Slight risk
        "MDT",
        "maroon", // Moderate risk
        "HIGH",
        "magenta", // High risk
        /* other */ "black", // Default fallback color
      ],
      "line-opacity": 0.8,
      "line-width": 3,
    },
  },

  /**
   * CSU-MLP 2020 model output contours
   * Colorado State University Machine Learning Probabilities (2020 version)
   */
  ALL_CSUopv2020: {
    type: "line",
    paint: {
      "line-color": [
        "match",
        ["get", "title"],
        "MRGL",
        "green",
        "SLGT",
        "orange",
        "MDT",
        "maroon",
        "HIGH",
        "magenta",
        /* other */ "black",
      ],
      "line-opacity": 0.8,
      "line-width": 3,
    },
  },

  /**
   * CSU-MLP 2022 model output contours
   * Colorado State University Machine Learning Probabilities (2022 version)
   */
  ALL_CSUopv2022: {
    type: "line",
    paint: {
      "line-color": [
        "match",
        ["get", "title"],
        "MRGL",
        "green",
        "SLGT",
        "orange",
        "MDT",
        "maroon",
        "HIGH",
        "magenta",
        /* other */ "black",
      ],
      "line-opacity": 0.8,
      "line-width": 3,
    },
  },

  /**
   * CSU-MLP UFVS 2022 model output contours
   * Colorado State University Machine Learning Probabilities (2022 UFVS version)
   */
  ALL_CSUopUFVSv2022: {
    type: "line",
    paint: {
      "line-color": [
        "match",
        ["get", "title"],
        "MRGL",
        "green",
        "SLGT",
        "orange",
        "MDT",
        "maroon",
        "HIGH",
        "magenta",
        /* other */ "black",
      ],
      "line-opacity": 0.8,
      "line-width": 3,
    },
  },

  /**
   * Practically Perfect (PP) verification areas
   * Displays probability ranges as filled polygons with different colors
   */
  ALL_PP: {
    type: "fill",
    paint: {
      "fill-color": [
        "match",
        ["get", "title"],
        "5.00-10.00 ",
        "#33fff3", 
        "10.00-20.00 ",
        "#33beff", 
        "20.00-50.00 ",
        "#337aff", 
        "50.00-100.00 ",
        "#3c33ff", 
        /* other */ "black",
      ],
      "fill-opacity": 0.5,
    },
  },

  /**
   * Stage IV exceeding Average Recurrence Interval (ARI)
   * Points where observed rainfall exceeds the ARI threshold
   */
  ALL_ST4gARI: {
    type: "circle",
    paint: {
      "circle-color": "red",
      "circle-opacity": 0.5,
    },
  },

  /**
   * Stage IV exceeding Flash Flood Guidance (FFG)
   * Areas where observed rainfall exceeds flash flood guidance values
   */
  ALL_ST4gFFG: {
    type: "fill",
    paint: {
      "fill-color": "blue",
      "fill-opacity": 0.5,
    },
  },

  /**
   * Local Storm Reports (LSR) for flash floods
   * Point data showing reported flash flood events
   */
  ALL_LSRFLASH: {
    type: "circle",
    paint: {
      "circle-color": "#38f9da",
      "circle-opacity": 1.0,
    },
  },

  /**
   * Local Storm Reports (LSR) for regular floods
   * Point data showing reported regular flood events
   */
  ALL_LSRREG: {
    type: "circle",
    paint: {
      "circle-color": "#0a95ab",
      "circle-opacity": 1.0,
    },
  },

  /**
   * USGS stream gauge flood observations
   * Point data showing USGS stream gauge locations reporting flood conditions
   */
  ALL_USGS: {
    type: "circle",
    paint: {
      "circle-color": "#9e42f4",
      "circle-opacity": 1.0,
    },
  },
}
