export const layerConf = {
    'ALL_ERO': {
        type: 'line',
        paint: {
            'line-color': [
                'match',
                ['get', 'title'],
                'MRGL',
                'green',
                'SLGT',
                'orange',
                'MDT',
                'maroon',
                'HIGH',
                'magenta',
                /* other */ 'black'
            ],
            'line-opacity': 0.5
        }
    },
    'ALL_CSUopv2020': {
        type: 'line',
        paint: {
            'line-color': [
                'match',
                ['get', 'title'],
                'MRGL',
                'green',
                'SLGT',
                'orange',
                'MDT',
                'maroon',
                'HIGH',
                'magenta',
                /* other */ 'black'
            ],
            'line-opacity': 0.5
        }
    },
    'ALL_CSUopv2022': {
        type: 'line',
        paint: {
            'line-color': [
                'match',
                ['get', 'title'],
                'MRGL',
                'green',
                'SLGT',
                'orange',
                'MDT',
                'maroon',
                'HIGH',
                'magenta',
                /* other */ 'black'
            ],
            'line-opacity': 0.5
        }
    },
    'ALL_CSUopUFVSv2022': {
        type: 'line',
        paint: {
            'line-color': [
                'match',
                ['get', 'title'],
                'MRGL',
                'green',
                'SLGT',
                'orange',
                'MDT',
                'maroon',
                'HIGH',
                'magenta',
                /* other */ 'black'
            ],
            'line-opacity': 0.5
        }
    },
    'ALL_PP_ST4gFFG': {
        type: 'fill',
        paint: {
            'fill-color': 'blue',
            'fill-opacity': 0.5
        }
    },
    'ALL_ST4gARI': {
        type: 'circle',
        paint: {
            'circle-color': 'red',
            'circle-opacity': 0.5
        }
    },
    'ALL_ST4gFFG': {
        type: 'fill',
        paint: {
            'fill-color': 'blue',
            'fill-opacity': 0.5
        }
    },
    'ALL_LSRFLASH': {
        type: 'circle',
        paint: {
            'circle-color': '#38f9da',
            'circle-opacity': 1.0
        }
    },
    'ALL_LSRREG': {
        type: 'circle',
        paint: {
            'circle-color': '#0a95ab',
            'circle-opacity': 1.0
        }
    },
    'ALL_USGS': {
        type: 'circle',
        paint: {
            'circle-color': '#9e42f4',
            'circle-opacity': 1.0
        }
    }
}