import React, { useState, useEffect, useRef } from 'react';

import Select from 'react-select';
import Map, {Source, Layer, useMap, MapProvider, FullscreenControl} from 'react-map-gl';
import maplibregl from 'maplibre-gl';
import DatePicker from 'react-datepicker';
import LegendControl from 'mapboxgl-legend';

import styles from './MapDisplay.module.css';

import 'mapboxgl-legend/dist/style.css';
import 'maplibre-gl/dist/maplibre-gl.css';


const MapDisplay = (props) => {

	const menuOptions = [
		{
			value: 'ALL_ST4gFFG',
			label: 'ST4 > FFG'
		},
		{
			value: 'ALL_PP_ST4gFFG',
			label: 'ST4 > FFG - Practically Perfect'
		}
	]

	const layerConf = {
		'ALL_ST4gFFG': {
			id: 'ALL_ST4gFFG',
			type: 'fill',
			paint: {
				'fill-color': 'blue',
				'fill-opacity': 0.8
			}
		},
		'ALL_PP_ST4gFFG': {
			id: 'ALL_PP_ST4gFFG',
			type: 'fill',
			paint: {
				'fill-color': 'blue',
				'fill-opacity': 0.8
			}
		}
	}

	let defDate = new Date();
  	// defDate.setDate(defDate.getDate() - 7);
	const [selectedArchiveDate, setSelectedArchiveDate] = useState(defDate);
	const [allLayerData, setAllLayerData] = useState([]);
	const [selectedDay, setSelectedDay] = useState(1);
	const [selectedProducts, setSelectedProducts] = useState(null);

	const baseURL = 'https://origin.wpc.ncep.noaa.gov/aking/ero_verif/geojsons/'

	const legend = new LegendControl({
		layers: ['data', 'data2'],
		toggler: true
	});

	const constructGeojsonURL = (layerName) => {
		let url = baseURL + layerName
		if (props.archiveOrCurrent === 'current'){
			url += '_last_vday' + selectedDay.toString() + '.geojson'
		} else {

		}
		
		return url
	}
	
	const fetchGeojsonData = (layerName) => {
		let url = constructGeojsonURL(layerName)

		fetch(url)
	      .then(resp => resp.json())
	      .then((json) => {return(json)})
	      .catch(err => console.error('Could not load data', err)); // eslint-disable-line

	}

	const handleLayerChange = (layersArr, actionObj) => {
		if (actionObj.action === 'select-option') {
			let geojsonData = fetchGeojsonData(actionObj.option.value)
			
			let tmpAllLayerData = [...allLayerData]
			tmpAllLayerData.push({
				'layer_name':actionObj.option.value,
				'data': geojsonData
			})

			setAllLayerData(tmpAllLayerData)
		}
	}

	const handleDayChange = (e) => {
	    setSelectedDay(parseInt(e.target.value))
	}

	// useEffect(() => {
	//     /* global fetch */
	//     fetch(
	//       'https://origin.wpc.ncep.noaa.gov/aking/ero_verif/geojsons/ALL_ST4gFFG_last_vday1.geojson'
	//     )
	//       .then(resp => resp.json())
	//       .then(json => setAllData(json))
	//       .catch(err => console.error('Could not load data', err)); // eslint-disable-line
	// }, [selectedProducts]);	





	return (
		<div className={`${styles.MapDisplayContainer} ${props.archiveOrCurrent === 'current' ? styles.MapDisplayContainerShort : styles.MapDisplayContainerTall}`}>
			<div className={styles.ProductSelectContainer}>
		        <Select
		        	options={menuOptions}
		        	onChange={handleLayerChange}
		            isMulti
		            closeMenuOnSelect={false}
		            placeholder={'Add Layers to Map...'}
		        />
		    </div>

	        <div className={styles.DaySelectContainer}>
            	<button className={`${styles.DaySelectButton} ${selectedDay === 1 ? styles.selected : ''}`} onClick={handleDayChange} value={1}>Day 1</button>
            	<button className={`${styles.DaySelectButton} ${selectedDay === 2 ? styles.selected : ''}`} onClick={handleDayChange} value={2}>Day 2</button>
            	<button className={`${styles.DaySelectButton} ${selectedDay === 3 ? styles.selected : ''}`} onClick={handleDayChange} value={3}>Day 3</button>
            	<button className={`${styles.DaySelectButton} ${selectedDay === 4 ? styles.selected : ''}`} onClick={handleDayChange} value={4}>Day 4</button>
            	<button className={`${styles.DaySelectButton} ${selectedDay === 5 ? styles.selected : ''}`} onClick={handleDayChange} value={5}>Day 5</button>
            </div>
            { props.archiveOrCurrent === 'archive' ?
	            <div className={styles.ArchiveDatePickerContainer}>
		            <p className={styles.ArchiveDatePickerLabel}>Valid start date:</p>
		            <DatePicker 
		              className={styles.ArchiveDatePicker}
		              selected={selectedArchiveDate} 
		              onChange={(date) => setSelectedArchiveDate(date)} 
		              />
		        </div>
		        :
		        null
	    	}

            <MapProvider>
            	<MapLegend legend={legend}/>
			    <Map
			      id="map"
			      mapLib={maplibregl}
			      initialViewState={{
			        longitude: -98.4,
			        latitude: 39.5,
			        zoom: 3
			      }}
			      style={{width: '100%', height: '100%'}}
			      mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
			    >
			    	<FullscreenControl />
			    	{ allLayerData.map((layer) => {
			    		return (
			    			<Source id={layer.layer_name} type="geojson" data={layer.data}>
						      <Layer {...layerConf[layer.layer_name]} />
						    </Source>
			    		)
			    	})

			    	}
			    </Map>
			</MapProvider>
	    </div>
	);
}

const MapLegend = (props) => {
	const {map} = useMap();


	if (map !== undefined) {
		console.log("HERE")
		map.addControl(props.legend, 'bottom-left');
	}
	
	return(<></>)
}

export default MapDisplay;