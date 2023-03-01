import React, { useState, useEffect, useRef } from 'react';

import Select from 'react-select';
import Map, {Source, Layer, useMap, MapProvider, FullscreenControl, useControl} from 'react-map-gl';
import maplibregl from 'maplibre-gl';
import DatePicker from 'react-datepicker';
import LegendControl from 'mapboxgl-legend';
import axios from 'axios'

import styles from './MapDisplay.module.css';

import 'mapboxgl-legend/dist/style.css';
import 'maplibre-gl/dist/maplibre-gl.css';


const MapDisplay = (props) => {

	const menuOptions = [
		{
			value: 'ALL_ERO',
			label: 'ERO'
		},
		{
			value: 'ALL_ST4gARI',
			label: 'ST4 > ARI'
		},
		{
			value: 'ALL_ST4gFFG',
			label: 'ST4 > FFG'
		}
	]

	const layerConf = {
		'ERO': {
			id: 'ERO',
			type: 'line',
			paint: {
				'line-color': 'green',
				'line-opacity': 0.5
			}
		},
		'ALL_ST4gARI': {
			id: 'ALL_ST4gARI',
			type: 'circle',
			paint: {
				'circle-color': 'red',
				'circle-opacity': 0.5
			}
		},
		'ALL_ST4gFFG': {
			id: 'ALL_ST4gFFG',
			type: 'fill',
			paint: {
				'fill-color': 'blue',
				'fill-opacity': 0.5
			}
		}
	}

	let defDate = new Date();
  	defDate.setDate(defDate.getDate() - 7);
	const [selectedArchiveDate, setSelectedArchiveDate] = useState(defDate);
	const [allLayerData, setAllLayerData] = useState([]);
	const [selectedDay, setSelectedDay] = useState(1);
	const [selectedProducts, setSelectedProducts] = useState(null);

	const mapRef = useRef();

	const baseURL = 'https://origin.wpc.ncep.noaa.gov/aking/ero_verif/geojsons/' //'http://localhost:3001/'

	const legend = new LegendControl({
		layers: Object.keys(layerConf),
		toggler: true
	});

	const LegendControlElement = (props) => {
	  useControl(() => legend, {
	    position: 'bottom-left'
	  });

	  return null;
	}
	

	const constructGeojsonURL = (layerName, day) => {
		let url = baseURL + layerName
		if (props.archiveOrCurrent === 'current'){
			url += '_last_vday' + day + '.geojson'
		} else {

		}
		
		return url
	}
	
	const fetchGeojsonData = async (layerName) => {
		let requests = []
		for(let i=1; i<6; i++){
			let url = constructGeojsonURL(layerName, i.toString())
			requests.push(axios.get(url))
		}

		const response = await Promise.allSettled(requests)

		return response
	}

	const handleLayerChange = (layersArr, actionObj) => {
		console.log(actionObj)
		if (actionObj.action === 'select-option') {
			let geojsonDataArr = []

			fetchGeojsonData(actionObj.option.value)
			.then((resultArr) => {
				for(let res of resultArr) {
					if(res.status === 'fulfilled'){
						geojsonDataArr.push(res.value.data)
					} else {
						geojsonDataArr.push(null)
					}
				}
				let tmpAllLayerData = [...allLayerData]
				tmpAllLayerData.push({
					'layer_name':actionObj.option.value,
					'label': actionObj.option.label,
					'data': geojsonDataArr
				})

				setAllLayerData(tmpAllLayerData)

			}).catch((e) => {
				console.log(e)
			})
		} else if(actionObj.action === 'remove-value') {
			let tmpAllLayerData = [...allLayerData]
			tmpAllLayerData.splice(tmpAllLayerData.findIndex(({layer_name}) => layer_name == actionObj.removedValue.value), 1);
			setAllLayerData(tmpAllLayerData)
		} else if(actionObj.action === 'clear') {
			setAllLayerData([])
		}
	}

	const handleDayChange = (e) => {
	    setSelectedDay(parseInt(e.target.value))
	}

	const onMapLoad = () => {
		mapRef.current.getMap().addControl(legend, 'bottom-left');
	}

	return (
		<div className={`${styles.MapDisplayContainer} ${props.archiveOrCurrent === 'current' ? styles.MapDisplayContainerShort : styles.MapDisplayContainerTall}`}>
			<div className={styles.ProductSelectContainer}>
		        <Select
		        	options={menuOptions}
		        	onChange={handleLayerChange}
		            isMulti
		            closeMenuOnSelect={false}
		            placeholder={'Select layers to add to map...'}
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
			    <Map
			      ref={mapRef}
			      onLoad={onMapLoad}
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
			    	<LegendControlElement/>
			    	
			    	{ allLayerData.map((layer) => {
			    		console.log(layer)
			    		return (
							<Source key={layer.layer_name+selectedDay} id={layer.layer_name+selectedDay} type="geojson" data={layer.data[selectedDay-1]}>
						      <Layer {...layerConf[layer.layer_name]} metadata={{name: layer.label}}/>
						    </Source>
			    		)
			    	})

			    	}
			    </Map>
			    {/*<MapLegend legend={legend}/>*/}
			</MapProvider>
	    </div>
	);
}

const MapLegend = (props) => {
	const {map} = useMap();

	console.log(map)

	if (map !== undefined && props.legend._map === undefined) {
		console.log("here")
		map.addControl(props.legend, 'bottom-left');
	}
	
	return(null)
}

export default MapDisplay;