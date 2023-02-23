import React, { useState, useEffect } from 'react';

import Select from 'react-select';
import Map, {Source, Layer} from 'react-map-gl';
import maplibregl from 'maplibre-gl';

import styles from './MapDisplay.module.css';

import 'maplibre-gl/dist/maplibre-gl.css';


const MapDisplay = (props) => {

	const [allData, setAllData] = useState(null);

	useEffect(() => {
	    /* global fetch */
	    fetch(
	      'https://origin.wpc.ncep.noaa.gov/aking/ero_verif/geojsons/ALL_ST4gFFG_last_vday1.geojson'
	    )
	      .then(resp => resp.json())
	      .then(json => setAllData(json))
	      .catch(err => console.error('Could not load data', err)); // eslint-disable-line
	}, []);

	const dataLayer = {
	  id: 'data',
	  type: 'fill',
	  paint: {
	    'fill-color': 'blue',
	    'fill-opacity': 0.8
	  }
	};

	return (
		<div className={styles.MapDisplayContainer}>
			<div className={styles.ProductSelectContainer}>
		        <Select
		        	options={[ { value: 'test1', label: 'Test1' }, { value: 'test2', label: 'Test2' }]}
		            isMulti
		            closeMenuOnSelect={false}
		        />
		    </div>

		    <Map
		      mapLib={maplibregl}
		      initialViewState={{
		        longitude: -98.4,
		        latitude: 39.5,
		        zoom: 3
		      }}
		      style={{width: '100%', height: '100%'}}
		      mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
		    >
			    <Source id="my-data" type="geojson" data={allData}>
			      <Layer {...dataLayer} />
			    </Source>
		    </Map>
	    </div>
	);
}

export default MapDisplay;