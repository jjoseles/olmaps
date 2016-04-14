UI = window.UI || {};

UI.CustomLayerConfig = (function (customOverlays, config) {


    var layerConfig = [
        {
            'code': 'SITUACION',

            'properties': {
                'url': '',
                'title': '',
                'code': '',
                'type': UI.MapConfig.layerType.ROUTE,
              /*  'style': new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: 5,
                        fill: new ol.style.Fill({
                            color: 'blue'
                        }),
                        stroke: new ol.style.Stroke({
                            color: 'white',
                            width: 1
                        })
                    }),
                    stroke: new ol.style.Stroke({
                        width: 3,
                        color: 'rgba(255,0,0,0.5)'
                    }),
                    fill: new ol.style.Fill({
                        color: [255, 0, 0, 0.2]
                    }),
                    text: new ol.style.Text({
                        fill: new ol.style.Fill({color: '#3C5C66'}),
                        stroke: new ol.style.Stroke({color: "#fff", width: 1}),
                        font: "bold 11px Open Sans",
                        textAlign: 'center',
                        textBaseline: 'bottom',
                        offsetX: 40,
                        offsetY: 10
                    }),

                }),
                'styleSelectInteraction': new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: 5,
                        fill: new ol.style.Fill({
                            color: 'rgba(154,0,217,0.5)'
                        }),
                        stroke: new ol.style.Stroke({
                            color: 'rgba(217,217,217,0.7)', // 1
                            width: 3
                        })
                    }),
                    stroke: new ol.style.Stroke({
                        width: 5,
                        color: 'rgba(255,0,0,0.8)'
                    }),
                    fill: new ol.style.Fill({
                        color: 'rgba(0,154,217,0.2)'
                    }),
                    text: new ol.style.Text({
                        fill: new ol.style.Fill({color: '#3C5C66'}),
                        stroke: new ol.style.Stroke({color: "#fff", width: 1}),
                        font: "bold 11px Open Sans",
                        textAlign: 'center',
                        textBaseline: 'bottom',
                        offsetX: 40,
                        offsetY: 10
                    })
                }), */
                'showFeatureOverlayCallback': customOverlays.openPopoverSituacion,

                'visibleInSwitcher': true,
                'propertiesShowInLabels': ['vehiculo', 'fecha'],

                'showListInfoButton': true,

                'zoomToShowPoints': 15,
                'zoomToShowLabels': 19,
                'pointOverlayZoom': 19,
                'showPoints': true,
                'showLabels': true,
                'fitExtenxAfterLoad': true,
                'loadInInit' : true

            }
        },


        {
            'code': 'POSICION_CIUDADES',
            'properties': {
                'url': '',
                'title': '',
                'code': '',
                'type': UI.MapConfig.layerType.POINT,
                'style': new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: 5,
                        fill: new ol.style.Fill({
                            color: 'rgba(0,154,217,0.5)'
                        }),
                        stroke: new ol.style.Stroke({
                            color: 'rgba(0,154,217,1.0)',
                            width: 1
                        })
                    }),
                    text: new ol.style.Text({
                        fill: new ol.style.Fill({color: '#3C5C66'}),
                        stroke: new ol.style.Stroke({color: "#fff", width: 1}),
                        font: "bold 11px Open Sans",
                        textAlign: 'center',
                        textBaseline: 'bottom',
                        offsetX: 40,
                        offsetY: 10
                    }),
                    stroke: new ol.style.Stroke({
                        width: 5,
                        color: 'rgba(255,0,0,0.8)'
                    }),
                    fill: new ol.style.Fill({
                        color: 'rgba(0,154,217,0.2)'
                    }),
                }),
                'styleSelectInteraction': new ol.style.Style({

                    image: new ol.style.Circle({
                        radius: 10,
                        fill: new ol.style.Fill({
                            color: 'rgba(0,154,217,1.0)'
                        }),
                        stroke: new ol.style.Stroke({
                            color: 'rgba(0,154,217,0.5)',
                            width: 1
                        })
                    }),
                    text: new ol.style.Text({
                        fill: new ol.style.Fill({color: '#3C5C66'}),
                        stroke: new ol.style.Stroke({color: "#fff", width: 1}),
                        font: "bold 11px Open Sans",
                        textAlign: 'center',
                        textBaseline: 'bottom',
                        offsetX: 40,
                        offsetY: 10
                    }),
                    stroke: new ol.style.Stroke({
                        width: 5,
                        color: 'rgba(255,0,0,0.8)'
                    }),
                    fill: new ol.style.Fill({
                        color: 'rgba(0,154,217,0.2)'
                    }),


                }),
                'showFeatureOverlayCallback': customOverlays.openPopoverPosicionCiudades,

                'visibleInSwitcher': true,
                'propertiesShowInLabels': ['CITY_NAME'],

                'showListInfoButton': true,

                'zoomToShowPoints': 5,
                'zoomToShowLabels': 19,
                'pointOverlayZoom': 8,
                'showPoints': true,
                'showLabels': false,
                'fitExtenxAfterLoad': false,
                'loadInInit' : true

            }
        },
        {
            'code': 'POSICION_CIUDADES_UK',
            'properties': {
                'url': '',
                'title': '',
                'code': '',
                'type': UI.MapConfig.layerType.POINT,
                'style': new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: 5,
                        fill: new ol.style.Fill({
                            color: 'yellow'
                        }),
                        stroke: new ol.style.Stroke({
                            color: 'rgba(8, 4, 29, 1)',
                            width: 1
                        })
                    }),
                    text: new ol.style.Text({
                        fill: new ol.style.Fill({color: '#3C5C66'}),
                        stroke: new ol.style.Stroke({color: "#fff", width: 1}),
                        font: "bold 11px Open Sans",
                        textAlign: 'center',
                        textBaseline: 'bottom',
                        offsetX: 40,
                        offsetY: 10,
                        text: ''
                    }),
                    stroke: new ol.style.Stroke({
                        width: 5,
                        color: 'rgba(255,0,0,0.8)'
                    }),
                    fill: new ol.style.Fill({
                        color: 'rgba(0,154,217,0.2)'
                    }),

                }),
                'styleSelectInteraction': new ol.style.Style({

                    image: new ol.style.Circle({
                        radius: 10,
                        fill: new ol.style.Fill({
                            color: 'rgba(8, 4, 45, 0.9)'
                        }),
                        stroke: new ol.style.Stroke({
                            color: 'rgba(8, 4, 29, 1)',
                            width: 2
                        })
                    }),
                    text: new ol.style.Text({
                        fill: new ol.style.Fill({color: '#3C5C66'}),
                        stroke: new ol.style.Stroke({color: "#fff", width: 1}),
                        font: "bold 11px Open Sans",
                        textAlign: 'center',
                        textBaseline: 'bottom',
                        offsetX: 40,
                        offsetY: 10
                    }),
                    stroke: new ol.style.Stroke({
                        width: 5,
                        color: 'rgba(255,0,0,0.8)'
                    }),
                    fill: new ol.style.Fill({
                        color: 'rgba(0,154,217,0.2)'
                    }),


                }),
                'showFeatureOverlayCallback': customOverlays.openPopoverPosicionCiudades,

                'visibleInSwitcher': true,
                'propertiesShowInLabels': ['CITY_NAME'],

                'showListInfoButton': true,
                //Aparecem siempre
                'zoomToShowPoints': 0,
                'zoomToShowLabels': 0,
                'pointOverlayZoom': 8,
                'showPoints': true,
                'showLabels': true,
                'fitExtenxAfterLoad': true,
                'loadInInit' : false

            }
        }
    ];

    function getConfig(configCode) {
        var config = layerConfig.filter(function (f) {
            return f['code'] === configCode;
        });
        return config;
    }

    return {

        getConfig: getConfig

    }
})(UI.CustomOverlays, UI.MapConfig);