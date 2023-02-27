import React, { useState, useEffect } from 'react';

import Select from 'react-select';
import Map, {Source, Layer} from 'react-map-gl';
import maplibregl from 'maplibre-gl';
import DatePicker from 'react-datepicker';

import styles from './MapDisplay.module.css';

import 'maplibre-gl/dist/maplibre-gl.css';


const MapDisplay = (props) => {

	let defDate = new Date();
  	// defDate.setDate(defDate.getDate() - 7);
	const [selectedArchiveDate, setSelectedArchiveDate] = useState(defDate);
	const [allData, setAllData] = useState(null);
	const [selectedDay, setSelectedDay] = useState(1);


	const handleDayChange = (e) => {
	    setSelectedDay(parseInt(e.target.value))
	}

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

		    <div className={styles.ArchiveDatePickerContainer}>
	            <p className={styles.ArchiveDatePickerLabel}>Valid start date:</p>
	            <DatePicker 
	              className={styles.ArchiveDatePicker}
	              selected={selectedArchiveDate} 
	              onChange={(date) => setSelectedArchiveDate(date)} 
	              />
	        </div>

	        <div className={styles.DaySelectContainer}>
            	<button className={`${styles.DaySelectButton} ${selectedDay === 1 ? styles.selected : ''}`} onClick={handleDayChange} value={1}>Day 1</button>
            	<button className={`${styles.DaySelectButton} ${selectedDay === 2 ? styles.selected : ''}`} onClick={handleDayChange} value={2}>Day 2</button>
            	<button className={`${styles.DaySelectButton} ${selectedDay === 3 ? styles.selected : ''}`} onClick={handleDayChange} value={3}>Day 3</button>
            	<button className={`${styles.DaySelectButton} ${selectedDay === 4 ? styles.selected : ''}`} onClick={handleDayChange} value={4}>Day 4</button>
            	<button className={`${styles.DaySelectButton} ${selectedDay === 5 ? styles.selected : ''}`} onClick={handleDayChange} value={5}>Day 5</button>
            </div>

		    <Map
		      mapLib={maplibregl}
		      initialViewState={{
		        longitude: -98.4,
		        latitude: 39.5,
		        zoom: 4
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