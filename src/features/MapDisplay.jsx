import React, { useState, useEffect, useRef } from 'react';

import Select from 'react-select';
import Map, {Source, Layer, useMap, MapProvider, FullscreenControl, useControl} from 'react-map-gl';
import maplibregl from 'maplibre-gl';
import DatePicker from 'react-datepicker';
import LegendControl from 'mapboxgl-legend';
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import Tippy from '@tippyjs/react';
import moment from 'moment';

import { layerConf } from './mapConf'

import styles from './MapDisplay.module.css';

import 'mapboxgl-legend/dist/style.css';
import 'maplibre-gl/dist/maplibre-gl.css';
import 'tippy.js/dist/tippy.css';


const menuOptions = [
    {
        value: 'ALL_ERO',
        label: 'ERO'
    },
    {
        value: 'ALL_ST4gFFG',
        label: 'ST4 > FFG'
    },
    {
        value: 'ALL_ST4gARI',
        label: 'ST4 > ARI'
    },
    {
        value: 'ALL_LSRFLASH',
        label: 'LSR Flash'
    },
    {
        value: 'ALL_LSRREG',
        label: 'LSR Regular'
    },
    {
        value: 'ALL_USGS',
        label: 'USGS'
    },
    {
        value: 'ALL_PP',
        label: 'Practically Perfect'
    },
    {
        value: 'ALL_CSUopv2020',
        label: 'CSUopv2020'
    },
    {
        value: 'ALL_CSUopv2022',
        label: 'CSUopv2022'
    },
    {
        value: 'ALL_CSUopUFVSv2022',
        label: 'CSUopUFVSv2020'
    },
]




const MapDisplay = (props) => {

    let defDate = new Date();
    defDate.setDate(defDate.getDate() - 7);
    const [selectedArchiveDate, setSelectedArchiveDate] = useState(defDate);
    const [allLayerData, setAllLayerData] = useState([]);
    const [selectedDay, setSelectedDay] = useState(1);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [errArr, setErrArr] = useState([]);
    const [dateLabel, setDateLabel] = useState('');
    const [noContourLabel, setNoContourLabel] = useState('');

    const mapRef = useRef();

    // const baseURL = 'https://origin.wpc.ncep.noaa.gov/aking/ero_verif/geojsons/'
    const baseURL = 'https://origin.wpc.ncep.noaa.gov/verification/ero_verif/geojsons/'
    // const baseURL = 'http://localhost:3001/'

    const legend = new LegendControl({
        layers: Object.keys(layerConf),
        toggler: true
    });

    const updateNoContourLabel = () => {
        let tmpLabel = ''
        for (let d of allLayerData) {
            if (d.label === 'ERO') {
                if(d.data[selectedDay-1] !== null && d.data[selectedDay-1].features.length === 0 ){
                    tmpLabel = "The probablility of rainfall\nexceeding flash flood guidance\nis less than 5 percent"
                }
            }
        }
        setNoContourLabel(tmpLabel)
    }

    const updateDateLabel = () => {
        let tmpLabel = ''
        for (let d of allLayerData) {
            if (d.label === 'ERO') {
                if (d.data[0] !== null && 'label' in d.data[0]) {
                    tmpLabel = d.data[0]['label']
                }                
                // tmpLabel = tmpLabel.substring(0, tmpLabel.indexOf('UTC') + 3) + '\n' + tmpLabel.substring(tmpLabel.indexOf('UTC') + 4, tmpLabel.length)
            }
        }
        console.log(tmpLabel)
        setDateLabel(tmpLabel)
    }

    const constructGeojsonURL = (layerName, day) => {
        let url = baseURL
        if (props.archiveOrCurrent === 'current'){
            url += layerName + '_last_vday' + day + '.geojson'
        } else {
            let tmpvhr = '12'
            let tmpStartDate = new Date(selectedArchiveDate)
            let tmpEndDate = new Date(selectedArchiveDate)
            tmpEndDate.setDate(tmpEndDate.getDate() + 1);

            let startDateStr = tmpStartDate.toISOString().split('T')[0].replaceAll('-','')
            let endDateStr = tmpEndDate.toISOString().split('T')[0].replaceAll('-','')

            url += 'daybyday/' + layerName + '_' + startDateStr + '12_to_' + endDateStr + '12_vday' + day + '_vhr' + tmpvhr + '.geojson'
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

    const addLayerToMap = (layerName, layerLabel) => {
        let geojsonDataArr = []
        let tmpAllLayerData = [...allLayerData]
        let tmpErrArr = []

        fetchGeojsonData(layerName)
        .then((resultArr) => {
            console.log(resultArr)
            let i = 0
            for(let res of resultArr) {
                if(res.status === 'fulfilled'){
                    geojsonDataArr.push(res.value.data)
                } else {
                    geojsonDataArr.push(null)
                    tmpErrArr.push(i+1)
                }
                i++
            }
            tmpAllLayerData.push({
                'layer_id':  layerName+props.mapID,
                'layer_name':layerName,
                'label': layerLabel,
                'data': geojsonDataArr
            })

            setErrArr(tmpErrArr)
            setAllLayerData(tmpAllLayerData)

        }).catch((e) => {
            console.log(e)
        })
    }

    const removeLegendEntries = (layers) => {
        for (let n of layers) {
            const s = document.querySelector(`.mapboxgl-ctrl-legend-pane--${n}`);
            s && s.remove()
        }

    }

    const handleLayerChange = (layersArr, actionObj) => {
        setSelectedProducts(layersArr)
        if (actionObj.action === 'select-option') {
            addLayerToMap(actionObj.option.value, actionObj.option.label)
        } else if(actionObj.action === 'remove-value') {
            let tmpAllLayerData = [...allLayerData]
            let removedIndex = tmpAllLayerData.findIndex(({layer_name}) => layer_name == actionObj.removedValue.value)
            removeLegendEntries([tmpAllLayerData[removedIndex].layer_id])
            tmpAllLayerData.splice(removedIndex, 1);
            setAllLayerData(tmpAllLayerData)
        } else if(actionObj.action === 'clear') {
            let ids = allLayerData.map(function (el) { return el.layer_id; });
            removeLegendEntries(ids)
            setAllLayerData([])
            setSelectedProducts(null)
        }
    }

    const handleDayChange = (e) => {
        setSelectedDay(parseInt(e.target.value))
    }

    const handleDateChange = (date) => {
        setAllLayerData([])
        setSelectedArchiveDate(date)
    }

    const incrementDate = () => {
        let tempDate = moment(selectedArchiveDate).add(1, 'days');
        tempDate = tempDate.toDate();
        setSelectedArchiveDate(tempDate)
    }

    const decrementDate = () => {
        let tempDate = moment(selectedArchiveDate).subtract(1, 'days');
        tempDate = tempDate.toDate();
        setSelectedArchiveDate(tempDate)
    }

    useEffect(() => {
        if (selectedProducts !== null) {
            let requests = []
            for (let product of selectedProducts) {
                requests.push(fetchGeojsonData(product.value))
            }
            let tmpAllLayerData = []
            Promise.allSettled(requests).then((resultArr) => {
                for(let i=0; i<resultArr.length; i++) {
                    let res = resultArr[i]
                    let geojsonDataArr = []

                    if(res.status === 'fulfilled'){
                        for(let pRes of res.value) {
                            if(pRes.status === 'fulfilled'){
                                geojsonDataArr.push(pRes.value.data)
                            } else {
                                geojsonDataArr.push(null)
                            }
                        }
                    } else {
                        geojsonDataArr = [null, null, null, null, null]
                    }


                    tmpAllLayerData.push({
                        'layer_id':  selectedProducts[i].value+props.mapID,
                        'layer_name':selectedProducts[i].value,
                        'label': selectedProducts[i].label,
                        'data': geojsonDataArr
                    })
                }
                setAllLayerData(tmpAllLayerData)
            })
        }
    }, [selectedArchiveDate])

    useEffect(() => {
        if(mapRef.current !== null) {
            mapRef.current.resize()
        }
    }, [props.comparisonToggled])

    useEffect(() => {
        if(mapRef.current !== null) {
            mapRef.current.resize()
        }
        let ids = allLayerData.map(function (el) { return el.layer_id; });
        removeLegendEntries(ids)
        setAllLayerData([])
        setSelectedProducts(null)
        
    }, [props.archiveOrCurrent])


    useEffect(() => {
        updateNoContourLabel()
        updateDateLabel()
        if(allLayerData.length === 0) {
            setErrArr([])
        }
    }, [allLayerData])

    useEffect(() => {
        updateNoContourLabel()
        updateDateLabel()
    }, [selectedDay])

    return (
        <div className={`${styles.MapDisplayContainer} ${props.archiveOrCurrent === 'current' ? styles.MapDisplayContainerShort : styles.MapDisplayContainerTall}`}>
            <div className={styles.ProductSelectContainer}>
                <Select
                    value={selectedProducts}
                    options={menuOptions}
                    onChange={handleLayerChange}
                    isMulti
                    closeMenuOnSelect={false}
                    placeholder={'Select layers to add to map...'}
                />
            </div>
            { props.archiveOrCurrent === 'archive' ?
                <div className={styles.ArchiveDatePickerContainer}>
                    <Tippy placement="top" content="Previous Day">
                        <FontAwesomeIcon onClick={decrementDate} className={styles.ArchiveDatePickerArrowLeft} icon={faArrowLeft} />
                    </Tippy>
                    <Tippy placement="top" content="Valid Date">
                        <div style={{width:'100%'}}>
                        <DatePicker 
                          className={styles.ArchiveDatePicker}
                          selected={selectedArchiveDate} 
                          onChange={handleDateChange} 
                          />
                        </div>
                    </Tippy>
                    <Tippy placement="top" content="Next Day">
                        <FontAwesomeIcon onClick={incrementDate} className={styles.ArchiveDatePickerArrowRight} icon={faArrowRight} />
                    </Tippy>
                </div>
                :
                null
            }

            <div className={styles.DaySelectContainer}>
                <button className={`${styles.DaySelectButton} ${selectedDay === 1 ? styles.selected : ''}`} onClick={handleDayChange} value={1}>Day 1</button>
                <button className={`${styles.DaySelectButton} ${selectedDay === 2 ? styles.selected : ''}`} onClick={handleDayChange} value={2}>Day 2</button>
                <button className={`${styles.DaySelectButton} ${selectedDay === 3 ? styles.selected : ''}`} onClick={handleDayChange} value={3}>Day 3</button>
                <button className={`${styles.DaySelectButton} ${selectedDay === 4 ? styles.selected : ''}`} onClick={handleDayChange} value={4}>Day 4</button>
                <button className={`${styles.DaySelectButton} ${selectedDay === 5 ? styles.selected : ''}`} onClick={handleDayChange} value={5}>Day 5</button>
            </div>
            

            <div className={styles.MapContainer}>
                <div className={styles.DateLabelContainer}>
                    {selectedProducts !== null && dateLabel !== '' ?
                        <p>{"ERO " + dateLabel}</p>
                    :
                        null
                    }
                </div>
                <div className={styles.NoContourLabelContainer}>
                    {noContourLabel !== '' ?
                        <p>{noContourLabel}</p>
                    :
                        null
                    }
                </div>
                <MapProvider>
                    <Map
                      {...props.mapViewState}
                      ref={mapRef}
                      onMove={evt => props.setMapViewState(evt.viewState)}
                      id="map"
                      mapLib={maplibregl}
                      style={{width: '100%', height: '100%'}}
                      mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
                    >
                        <LegendControlElement legend={legend}/>
                        
                        { allLayerData.map((layer) => {
                            let idObj = {'id':layer.layer_id}
                            let keyVal = props.archiveOrCurrent === 'current' ? layer.layer_id : layer.layer_id+selectedArchiveDate.toISOString().split('T')[0].replaceAll('-','')

                            return (
                                <Source key={keyVal} id={layer.layer_id} type="geojson" data={layer.data[selectedDay-1]}>
                                  <Layer {...{ ...idObj, ...layerConf[layer.layer_name]}} metadata={{name: layer.label, labels:{other:false}}}/>
                                </Source>
                            )
                        })

                        }
                        <FullscreenControl />
                    </Map>
                </MapProvider>
            </div>

             { errArr.length > 0 ?
                <div className={styles.ErrorMsgContainer}>
                    <p>{'Error loading map data for days: ' + errArr.toString()} </p>
                </div>
            :
                null
            }

        </div>
    );
}


const LegendControlElement = (props) => {

    useControl(() => props.legend, {
        position: 'bottom-left',
        onRemove: () => {console.log("remove")},
        onAdd: () => {console.log("add")},
        onCreate: () => {console.log("create")},
    });

    return null
}


export default MapDisplay;