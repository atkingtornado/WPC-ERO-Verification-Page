# ERO Verification Website

This is the official codebase for the [ERO Verification tool](https://www.wpc.ncep.noaa.gov/ero-verification/), developed using [React](https://reactjs.org/) and [Vite](https://vitejs.dev/). The application visualizes Excessive Rainfall Outlook (ERO) verification statistics produced by the Weather Prediction Center (WPC).

## Features

- **Dual View Modes**:
  - Static Plot View: Display pre-rendered verification plots and images
  - Interactive Map View: Explore data layers on an interactive map interface

- **Comparison Capabilities**:
  - Side-by-side comparison of different data products
  - Toggle between archive and current data

- **Time Navigation**:
  - Day 1-5 forecast selection
  - Archive date selection with calendar interface
  - Keyboard navigation support (arrow keys)

## Prerequisites

- Node.js (v14.0.0 or higher)
- npm 

## Tech Stack

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)

## Getting Started

Follow the steps below to run the project locally.

### 1. Clone the Repository

```bash
git clone github.com:atkingtornado/WPC-ERO-Verification-Page.git
cd WPC-ERO-Verification-Page
```

### 2. Install dependencies:

```bash
npm install
```

## Development

This project uses Vite as its build tool and development server. Vite provides fast hot module replacement (HMR) and optimized builds.

### Start Development Server

```bash
npm run dev
```

This will start the development server at `http://localhost:3000`.

### Development Features

  - **Hot Module Replacement (HMR)**: Changes to your code will be reflected immediately without a full page reload
  - **Error Overlay**: Errors will be displayed in the browser
  - **ESLint Integration**: Code quality issues will be highlighted during development

## Building for Production

To create a production build:

```bash
npm run build
```

This will generate optimized files in the `dist` directory.


## Dependencies

- **React:** UI library
- **react-map-gl** & **maplibre-gl**: Map rendering and interaction
- **react-select**: Enhanced dropdown selection
- **react-datepicker**: Date selection component
- **react-medium-image-zoom**: Image zoom functionality
- **@tippyjs/react**: Tooltip component
- **@mui/material**: UI components (buttons, alerts, etc.)
- **@fortawesome/react-fontawesome**: Icon components
- **axios**: HTTP client for data fetching
- **moment**: Date manipulation

## Usage

### Basic Navigation

- Toggle between "Plot View" and "Interactive View" using the button at the top
- Switch between "Archive" and "Current" data using the radio buttons
- Enable comparison mode by toggling the "Compare" switch
- Navigate between forecast days (Day 1-5) using the buttons or arrow keys

### Plot View

- Select a product from the dropdown menu
- Click on the image to zoom in for detailed viewing
- When in archive mode, use the date picker to select historical dates

### Interactive Map View

- Select layers to add to the map from the dropdown menu
- Multiple layers can be selected for combined visualization
- Use standard map controls for navigation:
    - Pan: Click and drag
    - Zoom: Scroll wheel
    - Rotate/Tilt: Right-click and drag
- Toggle layer visibility using the legend in the bottom-left corner
- Use the fullscreen button to expand the map view

## Customizing Vite Configuration

If you need to customize the Vite configuration, you can modify the `vite.config.js` file.
