UI = window.UI || {};

UI.CustomLayerConfig = (function (customOverlays) {
    // Constantes de la capa de SITUACION
    var color_fill_situacion = 'rgba(255,0,0,0.5)';
    var color_stroke_situacion = 'rgba(0,0,0,0.8)';
    var color_fill_selected_situacion = 'rgba(192,0,0,1)';
    var color_stroke_selected_situacion = 'rgba(0,0,0,1)';
    var color_fill_text_situacion = 'rgba(0,0,0,1)';
    var color_stroke_text_situacion = 'rgba(0,0,0,1)';

    // Constantes de la capa de POSICION
    var color_fill_posicion = 'rgba(104, 77,231, 0.2)';
    var color_stroke_posicion = 'rgba(104, 77,231, 0.9)';
    var color_fill_selected_posicion = 'rgba(77 ,104,231, 0.2)';
    var color_stroke_selected_posicion = 'rgba(77 ,104,231, 0.9)';
    var color_fill_text_posicion = 'rgba(0,0,0,1)';
    var color_stroke_text_posicion = 'rgba(0,0,0,1)';

    // Constantes de la capa de PUNTOS_DE_INTERES (de Empresa)
    var color_fill_pois_empresa = 'rgba(200,50,50,0.5)';
    var color_stroke_pois_empresa = 'rgba(200,50,50,1.0)';
    var color_fill_selected_pois_empresa = 'rgba(200,50,50,0.5)';
    var color_stroke_selected_pois_empresa = 'rgba(200,50,50,1.0)';
    var color_fill_text_pois_empresa = 'rgba(0,0,0,1)';
    var color_stroke_text_pois_empresa = 'rgba(0,0,0,1)';

    // Constantes de la capa de PUNTOS_DE_INTERES_GENERICOS
    var color_fill_pois_genericos = 'rgba(4,94,217,0.2)'; 
    var color_stroke_pois_genericos = 'rgba(4,94,217,0.5)';
    var color_fill_selected_pois_genericos = 'rgba(4,94,217,0.2)';
    var color_stroke_selected_pois_genericos = 'rgba(4,94,217,0.5)';
    var color_fill_text_pois_genericos = 'rgba(0,0,0,1)';
    var color_stroke_text_pois_genericos = 'rgba(0,0,0,1)';


    var layerConfig = [
        {
            // Codigo de las properties
        	'code': 'SITUACION', //Mapa de situación actual
        	'properties':
             {
                 ///////////////////////////////////////////////////////////////
                 // (OBLIGATORIO) Definición de Propiedades generales, dejar a ''
                 ///////////////////////////////////////////////////////////////
                 'url': '',
                 'title': '',
                 'code': 'SITUACION',
                 ///////////////////////////////////////////////////////////////////////
                 // (OBLIGATORIO) Tipo de Capa: POINT (puntos inconexos), 
                 //                             ROUTE (Ruta Historica + Compactada)
                 ///////////////////////////////////////////////////////////////////////
                 'type': UI.MapConfig.layerType.POINT,
                 ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                 // (OBLIGATORIO): Seleccion de Elemento sobre el mapa
                 // showFeatureOverlayCallback: función que genera el contenido del Popover cuando el usuario selecciona un elemento
                 // pointOverlayZoom          : (-1 (Desactivado), 0 (Maximo) .. 19 (Mínimo)) 
                 //                             Cuando el usuario selecciona un elemento, qué nivel de zoom muestra el mapa
                 ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                 'showFeatureOverlayCallback': customOverlays.openPopoverSituacion,
                 'pointOverlayZoom': -1,
                 /////////////////////////////////////////////////////////////////////////////////////////////////////////
                 // (OBLIGATORIO): selector de Capas
                 // visibleInSwitcher: (true/false) Indica si la capa aparece en el selector de Capas
                 // showListInfoButton: (true/false) Indica si el selector de Capas ofrece un grid con los elementos
                 // (OPCIONAL) showFeaturesInfoCallback: funcion que se encarga de generar el grid con los elementos,
                 //                                      si no se define, hay una por defecto  
                 /////////////////////////////////////////////////////////////////////////////////////////////////////////
                 'visibleInSwitcher': true,
                 'showListInfoButton': true,
                 'showFeaturesInfoCallback': customOverlays.showFeaturesInfoCallbackSituacion,
                 /////////////////////////////////////////////////////////////////////////////////////////////////////////
                 // (OBLIGATORIO): Puntos
                 // showPoints            : true/false controla si aparecen los puntos en el mapa
                 // zoomToShowPoints      : (0 (Maximo) .. 19 (Mínimo)) A qué nivel de zoom aparece el punto
                 /////////////////////////////////////////////////////////////////////////////////////////////////////////
                 'showPoints': true,
                 'zoomToShowPoints': 0,
                 /////////////////////////////////////////////////////////////////////////////////////////////////////////
                 // (OBLIGATORIO): Labels
                 // showLabels            : true/false controla si aparece un label al lado del punto
                 // zoomToShowLabels      : (0 (Maximo) .. 19 (Mínimo)) A qué nivel de zoom aparece el label
                 // propertiesInShowLabels: Array de propiedades del GeoJSON que forman el label
                 /////////////////////////////////////////////////////////////////////////////////////////////////////////
                 'showLabels': true,
                 'zoomToShowLabels': 0,
                 'propertiesShowInLabels': ['_vehiculo'],
                 'maxPointInExtentForShowLabels': 10,
                 'labelColor': 'rgb(255,21,65)',
                 'labelTextColor': 'blue',

                 /////////////////////////////////////////////////////////////////////////////////////////////////////////
                 // (OPCIONAL) Carga de la Capa
                 // loadInInit        : (true/false) Si se carga la capa al cargar el mapa, o cuando quiere el usuario
                 // fitExtenxAfterLoad: (true/false) Si depsues de la carga, se ajusta automaticamente el mapa para visualizarla
                 /////////////////////////////////////////////////////////////////////////////////////////////////////////
                 'loadInInit': true,
                 'fitExtenxAfterLoad': true,
                 ///////////////////////////////////////////////////////////////////////
                 // (OPCIONAL): Definicion de Estilo genérico de Capa
                 ///////////////////////////////////////////////////////////////////////
                 'style': new ol.style.Style({
                     image: new ol.style.Circle({

                         radius: 8,
                         fill: new ol.style.Fill({
                             color: color_fill_situacion
                         }),

                         stroke: new ol.style.Stroke({
                             color: color_stroke_situacion,
                             width: 1
                         })
                     }),
                     stroke: new ol.style.Stroke({
                         width: 3,
                         color: color_stroke_situacion,
                     }),
                     fill: new ol.style.Fill({
                         color: color_fill_situacion
                     }),
                     text: new ol.style.Text({
                         fill: new ol.style.Fill({
                             color: color_fill_text_situacion
                         }),
                         stroke: new ol.style.Stroke({
                             color: color_stroke_text_situacion,
                             width: 0
                         }),

                         font: "11px Open Sans",
                         textAlign: 'center',
                         textBaseline: 'bottom',
                         offsetX: 40,
                         offsetY: -10
                     })
                 }),
                 ////////////////////////////////////////////////////////////////////////////////////
                 // (OPCIONAL): Definicion de Estilo genérico de Capa para elementos seleccionados
                 ////////////////////////////////////////////////////////////////////////////////////
                 'styleSelectInteraction': new ol.style.Style({
                     image: new ol.style.Circle({

                         radius: 8,
                         fill: new ol.style.Fill({
                             color: color_fill_selected_situacion
                         }),

                         stroke: new ol.style.Stroke({
                             color: color_stroke_selected_situacion,
                             width: 0
                         })
                     }),
                     stroke: new ol.style.Stroke({
                         width: 3,
                         color: color_stroke_selected_situacion,
                     }),
                     fill: new ol.style.Fill({
                         color: color_fill_selected_situacion
                     }),
                     text: new ol.style.Text({
                         fill: new ol.style.Fill({
                             color: color_fill_text_situacion
                         }),
                         stroke: new ol.style.Stroke({
                             color: color_stroke_text_situacion,
                             width: 0
                         }),

                         font: "11px Open Sans",
                         textAlign: 'center',
                         textBaseline: 'bottom',
                         offsetX: 40,
                         offsetY: -10
                     })
                 }),
                
             }
        },

        {
            // Codigo de las Propiedades
            'code': 'POSICION',
            'properties':
            {
                ///////////////////////////////////////////////////////////////
                // (OBLIGATORIO) Definición de Propiedades generales, dejar a ''
                ///////////////////////////////////////////////////////////////
                'url': '',
                'title': '',
                'code': 'POSICION',
                ///////////////////////////////////////////////////////////////////////
                // (OBLIGATORIO) Tipo de Capa: POINT (puntos inconexos), 
                //                             ROUTE (Ruta Historica + Compactada)
                ///////////////////////////////////////////////////////////////////////
                'type': UI.MapConfig.layerType.ROUTE,
                /////////////////////////////////////////////////////////////////////////////////////////////////////////
                // (OBLIGATORIO): Seleccion de Elemento sobre el mapa
                // showFeatureOverlayCallback: función que genera el contenido del Popover cuando el usuario selecciona un elemento
                // pointOverlayZoom          : (-1 (Desactivado), 0 (Maximo) .. 19 (Mínimo)) 
                //                             Cuando el usuario selecciona un elemento, qué nivel de zoom muestra el mapa
                /////////////////////////////////////////////////////////////////////////////////////////////////////////
                'showFeatureOverlayCallback': customOverlays.openPopoverPosicion,
                'pointOverlayZoom': 15,

                /////////////////////////////////////////////////////////////////////////////////////////////////////////
                // (OBLIGATORIO): selector de Capas
                // visibleInSwitcher: (true/false) Indica si la capa aparece en el selector de Capas
                // showListInfoButton: (true/false) Indica si el selector de Capas ofrece un grid con los elementos
                // (OPCIONAL) showFeaturesInfoCallback: funcion que se encarga de generar el grid con los elementos,
                //                                      si no se define, hay una por defecto  
                /////////////////////////////////////////////////////////////////////////////////////////////////////////
                'visibleInSwitcher': true,
                'showListInfoButton': true,

                /////////////////////////////////////////////////////////////////////////////////////////////////////////
                // (OBLIGATORIO): Puntos
                // showPoints            : true/false controla si aparecen los puntos en el mapa
                // zoomToShowPoints      : (0 (Maximo) .. 19 (Mínimo)) A qué nivel de zoom aparece el punto
                /////////////////////////////////////////////////////////////////////////////////////////////////////////
                'showPoints': true,
                'zoomToShowPoints': 14,

                /////////////////////////////////////////////////////////////////////////////////////////////////////////
                // (OBLIGATORIO): Labels
                // showLabels            : true/false controla si aparece un label al lado del punto
                // zoomToShowLabels      : (0 (Maximo) .. 19 (Mínimo)) A qué nivel de zoom aparece el label
                // propertiesInShowLabels: Array de propiedades del GeoJSON que forman el label
                /////////////////////////////////////////////////////////////////////////////////////////////////////////
                'showLabels':true,
                'zoomToShowLabels': 15,
                'propertiesShowInLabels': ['_vehiculo', 'fecha'],
                'maxPointInExtentForShowLabels': 50,
                'labelColor': 'rgb(255,21,65)',
                'labelTextColor': 'blue',

                /////////////////////////////////////////////////////////////////////////////////////////////////////////
                // (OPCIONAL) Carga de la Capa
                // loadInInit        : (true/false) Si se carga la capa al cargar el mapa, o cuando quiere el usuario
                // fitExtenxAfterLoad: (true/false) Si depsues de la carga, se ajusta automaticamente el mapa para visualizarla
                /////////////////////////////////////////////////////////////////////////////////////////////////////////
                'loadInInit': true,
                'fitExtenxAfterLoad': true,

                ///////////////////////////////////////////////////////////////////////
                // (OPCIONAL): Definicion de Estilo genérico de Capa
                ///////////////////////////////////////////////////////////////////////
                'style': new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: 5,
                        fill: new ol.style.Fill({
                            color: color_fill_posicion
                        }),
                        stroke: new ol.style.Stroke({
                            color: color_stroke_posicion,
                            width: 3
                        })
                    }),
                    stroke: new ol.style.Stroke({
                        width: 3,
                        color: color_stroke_posicion
                    }),
                    fill: new ol.style.Fill({
                        color: color_fill_posicion
                    }),
                    text: new ol.style.Text({
                        fill: new ol.style.Fill({ color: color_fill_text_posicion }),
                        stroke: new ol.style.Stroke({ color: color_stroke_text_posicion, width: 1 }),
                        font: "bold 11px Open Sans",
                        textAlign: 'center',
                        textBaseline: 'bottom',
                        offsetX: 40,
                        offsetY: 10
                    }),

                }),
                ////////////////////////////////////////////////////////////////////////////////////
                // (OPCIONAL): Definicion de Estilo genérico de Capa para elementos seleccionados
                ////////////////////////////////////////////////////////////////////////////////////
                'styleSelectInteraction': new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: 5,
                        fill: new ol.style.Fill({
                            color: color_fill_selected_posicion
                        }),
                        stroke: new ol.style.Stroke({
                            color: color_stroke_selected_posicion,
                            width: 3
                        })
                    }),
                    stroke: new ol.style.Stroke({
                        width: 3,
                        color: color_stroke_selected_posicion
                    }),
                    fill: new ol.style.Fill({
                        color: color_fill_selected_posicion
                    }),
                    text: new ol.style.Text({
                        fill: new ol.style.Fill({ color: color_fill_text_posicion }),
                        stroke: new ol.style.Stroke({ color: color_stroke_text_posicion, width: 1 }),
                        font: "bold 11px Open Sans",
                        textAlign: 'center',
                        textBaseline: 'bottom',
                        offsetX: 40,
                        offsetY: 10
                    }),
                }),
            }
        },

        {
            // Codigo de las Propiedades
        	'code': 'PUNTOS_DE_INTERES',
        	'properties':
            {
                ///////////////////////////////////////////////////////////////
                // (OBLIGATORIO) Definición de Propiedades generales, dejar a ''
                ///////////////////////////////////////////////////////////////
                'url': '',
                'title': '',
                'code': 'PUNTOS_DE_INTERES',
                ///////////////////////////////////////////////////////////////////////
                // (OBLIGATORIO) Tipo de Capa: POINT (puntos inconexos), 
                //                             ROUTE (Ruta Historica + Compactada)
                ///////////////////////////////////////////////////////////////////////
                'type': UI.MapConfig.layerType.POINT,
                /////////////////////////////////////////////////////////////////////////////////////////////////////////
                // (OBLIGATORIO): Seleccion de Elemento sobre el mapa
                // showFeatureOverlayCallback: función que genera el contenido del Popover cuando el usuario selecciona un elemento
                // pointOverlayZoom          : (-1 (Desactivado), 0 (Maximo) .. 19 (Mínimo)) 
                //                             Cuando el usuario selecciona un elemento, qué nivel de zoom muestra el mapa
                /////////////////////////////////////////////////////////////////////////////////////////////////////////
                'showFeatureOverlayCallback': customOverlays.openPopoverPosicionCiudades,
                'pointOverlayZoom': -1,

                /////////////////////////////////////////////////////////////////////////////////////////////////////////
                // (OBLIGATORIO): selector de Capas
                // visibleInSwitcher: (true/false) Indica si la capa aparece en el selector de Capas
                // showListInfoButton: (true/false) Indica si el selector de Capas ofrece un grid con los elementos
                // (OPCIONAL) showFeaturesInfoCallback: funcion que se encarga de generar el grid con los elementos,
                //                                      si no se define, hay una por defecto  
                /////////////////////////////////////////////////////////////////////////////////////////////////////////
                'visibleInSwitcher': true,
                'showListInfoButton': true,

                /////////////////////////////////////////////////////////////////////////////////////////////////////////
                // (OBLIGATORIO): Puntos
                // showPoints            : true/false controla si aparecen los puntos en el mapa
                // zoomToShowPoints      : (0 (Maximo) .. 19 (Mínimo)) A qué nivel de zoom aparece el punto
                /////////////////////////////////////////////////////////////////////////////////////////////////////////
                'showPoints': true,
                'zoomToShowPoints': 0,

                /////////////////////////////////////////////////////////////////////////////////////////////////////////
                // (OBLIGATORIO): Labels
                // showLabels            : true/false controla si aparece un label al lado del punto
                // zoomToShowLabels      : (0 (Maximo) .. 19 (Mínimo)) A qué nivel de zoom aparece el label
                // propertiesInShowLabels: Array de propiedades del GeoJSON que forman el label
                /////////////////////////////////////////////////////////////////////////////////////////////////////////
                'showLabels': true,
                'zoomToShowLabels': 0,
                'propertiesShowInLabels': ['nombre'],
                'maxPointInExtentForShowLabels': 50,
                /////////////////////////////////////////////////////////////////////////////////////////////////////////
                // (OPCIONAL) Carga de la Capa
                // loadInInit        : (true/false) Si se carga la capa al cargar el mapa, o cuando quiere el usuario
                // fitExtenxAfterLoad: (true/false) Si depsues de la carga, se ajusta automaticamente el mapa para visualizarla
                /////////////////////////////////////////////////////////////////////////////////////////////////////////
                'loadInInit': false,
                'fitExtenxAfterLoad': false,


                ///////////////////////////////////////////////////////////////////////
                // (OPCIONAL): Definicion de Estilo genérico de Capa
                ///////////////////////////////////////////////////////////////////////
                'style': new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: 5,
                        fill: new ol.style.Fill({
                            color: color_fill_pois_empresa
                        }),
                        stroke: new ol.style.Stroke({
                            color: color_stroke_pois_empresa,
                            width: 1
                        })
                    }),
                    stroke: new ol.style.Stroke({
                        width: 3,
                        color: color_stroke_pois_empresa
                    }),
                    fill: new ol.style.Fill({
                        color: color_fill_pois_empresa
                    }),
                    text: new ol.style.Text({
                        fill: new ol.style.Fill({ color: color_fill_text_pois_empresa }),
                        stroke: new ol.style.Stroke({ color: color_stroke_text_pois_empresa, width: 1 }),
                        font: "bold 11px Open Sans",
                        textAlign: 'center',
                        textBaseline: 'bottom',
                        offsetX: 40,
                        offsetY: 10
                    }),

                }),
                ////////////////////////////////////////////////////////////////////////////////////
                // (OPCIONAL): Definicion de Estilo genérico de Capa para elementos seleccionados
                ////////////////////////////////////////////////////////////////////////////////////
                'styleSelectInteraction': new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: 5,
                        fill: new ol.style.Fill({
                            color: color_fill_selected_pois_empresa
                        }),
                        stroke: new ol.style.Stroke({
                            color: color_stroke_selected_pois_empresa,
                            width: 1
                        })
                    }),
                    stroke: new ol.style.Stroke({
                        width: 3,
                        color: color_stroke_selected_pois_empresa
                    }),
                    fill: new ol.style.Fill({
                        color: color_fill_selected_pois_empresa
                    }),
                    text: new ol.style.Text({
                        fill: new ol.style.Fill({ color: color_fill_text_pois_empresa }),
                        stroke: new ol.style.Stroke({ color: color_stroke_text_pois_empresa, width: 1 }),
                        font: "bold 11px Open Sans",
                        textAlign: 'center',
                        textBaseline: 'bottom',
                        offsetX: 40,
                        offsetY: 10
                    }),
                }),

            }
        },

         {
             // Codigo de las Propiedades
             'code': 'PUNTOS_DE_INTERES_GENERICOS',
             'properties':
             {
                 ///////////////////////////////////////////////////////////////
                 // (OBLIGATORIO) Definición de Propiedades generales, dejar a ''
                 ///////////////////////////////////////////////////////////////
                 'url': '',
                 'title': '',
                 'code': 'PUNTOS_DE_INTERES_GENERICOS',
                 ///////////////////////////////////////////////////////////////////////
                 // (OBLIGATORIO) Tipo de Capa: POINT (puntos inconexos), 
                 //                             ROUTE (Ruta Historica + Compactada)
                 ///////////////////////////////////////////////////////////////////////
                 'type': UI.MapConfig.layerType.POINT,
                 /////////////////////////////////////////////////////////////////////////////////////////////////////////
                 // (OBLIGATORIO): Seleccion de Elemento sobre el mapa
                 // showFeatureOverlayCallback: función que genera el contenido del Popover cuando el usuario selecciona un elemento
                 // pointOverlayZoom          : (-1 (Desactivado), 0 (Maximo) .. 19 (Mínimo)) 
                 //                             Cuando el usuario selecciona un elemento, qué nivel de zoom muestra el mapa
                 /////////////////////////////////////////////////////////////////////////////////////////////////////////
                 'showFeatureOverlayCallback': customOverlays.openPopoverPosicionCiudades,
                 'pointOverlayZoom': -1,

                 /////////////////////////////////////////////////////////////////////////////////////////////////////////
                 // (OBLIGATORIO): selector de Capas
                 // visibleInSwitcher: (true/false) Indica si la capa aparece en el selector de Capas
                 // showListInfoButton: (true/false) Indica si el selector de Capas ofrece un grid con los elementos
                 // (OPCIONAL) showFeaturesInfoCallback: funcion que se encarga de generar el grid con los elementos,
                 //                                      si no se define, hay una por defecto  
                 /////////////////////////////////////////////////////////////////////////////////////////////////////////
                 'visibleInSwitcher': true,
                 'showListInfoButton': true,

                 /////////////////////////////////////////////////////////////////////////////////////////////////////////
                 // (OBLIGATORIO): Puntos
                 // showPoints            : true/false controla si aparecen los puntos en el mapa
                 // zoomToShowPoints      : (0 (Maximo) .. 19 (Mínimo)) A qué nivel de zoom aparece el punto
                 /////////////////////////////////////////////////////////////////////////////////////////////////////////
                 'showPoints': true,
                 'zoomToShowPoints': 0,

                 /////////////////////////////////////////////////////////////////////////////////////////////////////////
                 // (OBLIGATORIO): Labels
                 // showLabels            : true/false controla si aparece un label al lado del punto
                 // zoomToShowLabels      : (0 (Maximo) .. 19 (Mínimo)) A qué nivel de zoom aparece el label
                 // propertiesInShowLabels: Array de propiedades del GeoJSON que forman el label
                 /////////////////////////////////////////////////////////////////////////////////////////////////////////
                 'showLabels': true,
                 'zoomToShowLabels': 6,
                 'propertiesShowInLabels': ['nombre'],
                 'maxPointInExtentForShowLabels': 50,
                 /////////////////////////////////////////////////////////////////////////////////////////////////////////
                 // (OPCIONAL) Carga de la Capa
                 // loadInInit        : (true/false) Si se carga la capa al cargar el mapa, o cuando quiere el usuario
                 // fitExtenxAfterLoad: (true/false) Si depsues de la carga, se ajusta automaticamente el mapa para visualizarla
                 /////////////////////////////////////////////////////////////////////////////////////////////////////////
                 'loadInInit': false,
                 'fitExtenxAfterLoad': false,

                 ///////////////////////////////////////////////////////////////////////
                 // (OPCIONAL): Definicion de Estilo genérico de Capa
                 ///////////////////////////////////////////////////////////////////////
                 'style': new ol.style.Style({
                     image: new ol.style.Circle({
                         radius: 5,
                         fill: new ol.style.Fill({
                             color: color_fill_pois_genericos
                         }),
                         stroke: new ol.style.Stroke({
                             color: color_stroke_pois_genericos,
                             width: 1
                         })
                     }),
                     stroke: new ol.style.Stroke({
                         width: 3,
                         color: color_stroke_pois_genericos
                     }),
                     fill: new ol.style.Fill({
                         color: color_fill_pois_genericos
                     }),
                     text: new ol.style.Text({
                         fill: new ol.style.Fill({ color: color_fill_text_pois_genericos }),
                         stroke: new ol.style.Stroke({ color: color_stroke_text_pois_genericos, width: 1 }),
                         font: "bold 11px Open Sans",
                         textAlign: 'center',
                         textBaseline: 'bottom',
                         offsetX: 40,
                         offsetY: 10
                     }),

                 }),
                 ////////////////////////////////////////////////////////////////////////////////////
                 // (OPCIONAL): Definicion de Estilo genérico de Capa para elementos seleccionados
                 ////////////////////////////////////////////////////////////////////////////////////
                 'styleSelectInteraction': new ol.style.Style({
                     image: new ol.style.Circle({
                         radius: 5,
                         fill: new ol.style.Fill({
                             color: color_fill_selected_pois_genericos
                         }),
                         stroke: new ol.style.Stroke({
                             color: color_stroke_selected_pois_genericos,
                             width: 1
                         })
                     }),
                     stroke: new ol.style.Stroke({
                         width: 3,
                         color: color_stroke_selected_pois_genericos
                     }),
                     fill: new ol.style.Fill({
                         color: color_fill_selected_pois_genericos
                     }),
                     text: new ol.style.Text({
                         fill: new ol.style.Fill({ color: color_fill_text_pois_genericos }),
                         stroke: new ol.style.Stroke({ color: color_stroke_text_pois_genericos, width: 1 }),
                         font: "bold 11px Open Sans",
                         textAlign: 'center',
                         textBaseline: 'bottom',
                         offsetX: 40,
                         offsetY: 10
                     }),
                 }),
             },
         },

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
})(UI.CustomOverlays);