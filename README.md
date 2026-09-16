# WPC ERO Verification

Interactive verification of the WPC Excessive Rainfall Outlook (ERO): static
verification plots and an interactive MapLibre map of the outlook contours
against flash-flood reports, USGS gauges and gridded exceedance products, with
a side-by-side comparison mode and a light/dark theme.

## Getting Started

```bash
npm install
npm run dev
```

`npm run build` type-checks (`tsc -b`) and produces the deployable site in
`dist/`.

## Map

The interactive map draws the same basemap as wpc-urrd and wpc-wssi: the
detailed MapLibre style (`src/constants/mapStyles.ts`, light and dark variants
following the app theme) served from the WPC-hosted OpenMapTiles vector tiles
rather than a third-party style service. It carries land, water, borders,
major highways and city labels, and no water-body labels. The floating
**layers button** at the map's top-right (`src/features/LayerMenu.tsx`)
toggles the geographic boundary overlays (state borders on by default, FEMA
regions, NWS CWAs, RFCs, counties) and the major roads overlay, drawn from the
tile pyramids under `https://www.wpc.ncep.noaa.gov/geographical_boundaries/`.
The choices persist in `localStorage` and are shared by both maps in
comparison mode.

Those tile hosts and the verification GeoJSON send no CORS headers, so on
localhost the Vite dev server proxies them (`/proxy/wpc`, `/proxy/maptiler`
in `vite.config.ts`; `src/constants/externalOrigins.ts` switches the URLs).
In production the site is same-origin with them and no proxy is involved.

## Deploying

Deploys use the shared [wpc-deploy](https://github.com/atkingtornado/wpc-deploy)
script through the `deploy.sh` wrapper; this app's endpoints are listed in
`deploy.config.sh`.

```bash
./deploy.sh --list              # show the configured targets
./deploy.sh dev --dry-run       # build, then show what would change
./deploy.sh dev                 # build and deploy to the dev endpoint
./deploy.sh production          # prompts: type "production"
./deploy.sh dev --skip-build    # reuse existing ./dist
```

Requires the AWS CLI configured with credentials for the NOAA GovCloud account.
