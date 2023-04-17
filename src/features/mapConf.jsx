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
            'line-opacity': 0.8,
            'line-width': 3
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
            'line-opacity': 0.8,
            'line-width': 3
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
            'line-opacity': 0.8,
            'line-width': 3
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
            'line-opacity': 0.8,
            'line-width': 3
        }
    },
    'ALL_PP': {
        type: 'fill',
        paint: {
            'fill-color': [
                'match',
                ['get', 'title'],
                '5.00-10.00 ',
                '#33fff3',
                '10.00-20.00 ',
                '#33beff',
                '20.00-50.00 ',
                '#337aff',
                '50.00-100.00 ',
                '#3c33ff',
                /* other */ 'black'
            ],
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