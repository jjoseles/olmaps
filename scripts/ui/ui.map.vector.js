/**
 * Created by jose on 20/2/16.
 */
UI = window.UI || {};

/**
 * @desc Herramientas de mapas openlayers
 **/
UI.MapVector = (function (mapUtils) {

    /**
     * @private
     * @desc estilo por defecto para las capas
     **/
    function getDefaultStyle() {
        return new ol.style.Style({
            image: new ol.style.Circle({
                radius: 5,
                fill: new ol.style.Fill({color: 'red'}),
                stroke: new ol.style.Stroke({
                    color: 'white', width: 3
                })
            }),
            stroke: new ol.style.Stroke({
                width: 3,
                color: 'blue'
            }),
            fill: new ol.style.Fill({
                color: [0, 0, 255, 0.1]
            })


        });
    }

    /**
     * @private
     * @desc Crea un overlay para visualizar el popover
     **/
    function createBaseOverlay(element) {
        var popup = new ol.Overlay({
            element: element,
            positioning: 'center-center',
            stopEvent: false
        });
        mapUtils.getMap().addOverlay(popup);
        return popup;

    }

    /**
     * @private
     * @desc Función no utilzada de momento hasta que funcionen las funciones en ol3-google-maps
     * https://github.com/mapgears/ol3-google-maps/blob/master/LIMITATIONS.md
     **/
    function renderStyleFunction(feature, resolution) {

        var image = new ol.style.Circle({
            radius: 5,
            fill: new ol.style.Fill({color: 'red'}),
            stroke: new ol.style.Stroke({
                color: 'white', width: 3
            })
        });

        var styles = {
            'Point': new ol.style.Style({
                image: image
            }),
            'LineString': new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: 'green',
                    width: 1
                })
            }),
            'MultiLineString': new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: 'green',
                    width: 1
                })
            }),
            'MultiPoint': new ol.style.Style({
                image: image
            }),
            'MultiPolygon': new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: 'yellow',
                    width: 1
                }),
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 0, 0.1)'
                })
            }),
            'Polygon': new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: 'blue',
                    lineDash: [4],
                    width: 3
                }),
                fill: new ol.style.Fill({
                    color: 'rgba(0, 0, 255, 0.1)'
                })
            }),
            'GeometryCollection': new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: 'magenta',
                    width: 2
                }),
                fill: new ol.style.Fill({
                    color: 'magenta'
                }),
                image: new ol.style.Circle({
                    radius: 10,
                    fill: null,
                    stroke: new ol.style.Stroke({
                        color: 'magenta'
                    })
                })
            }),
            'Circle': new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: 'red',
                    width: 2
                }),
                fill: new ol.style.Fill({
                    color: 'rgba(255,0,0,0.2)'
                })
            })
        };
        if (feature)
            return styles[feature.getGeometry().getType()];


        // else return new ol.style.Style();
    }

    /**
     * @private
     * @desc Renderiza el selector de vectores
     **/
    function renderVectorSwitcher() {
        $("#map-vector-selection").empty();
        var existsOne = false;
        mapUtils.getMap().getLayers().forEach(function (lyr, idx, a) {

console.log(lyr.get('visibleInSwitcher') )
            //Solo capas de vectores
            if ((lyr.get('type') === 'vector') ) {
                if (lyr.get('visibleInSwitcher') == true) {
                    existsOne = true;
                    var li = "<li";
                    li += lyr.getVisible() ? " class='active'" : '';
                    li += "><a href='javascript:' data-vector-name='" + lyr.get('title') + "'>" +
                        lyr.get('title') + "</a></li>";
                    $("#map-vector-selection").append(li);
                }
            }
        });
        if(existsOne)
            $(".vector-switcher").show();
        prepareEvents();

    }


    /**
     * @private
     * @desc Prepara los eventos sobre los elementos del mapa para vectores
     **/
    function prepareEvents() {
        //Selección del base map
        $('[data-vector-name]').click(function () {

            var targetTile = $(this).attr('data-vector-name');
            var targetLi = $(this).closest('li');

            // $('#map-vector-selection li').not(targetLi).removeClass('active');

            mapUtils.getMap().getLayers().forEach(function (lyr, idx, a) {
                //Solo los vectores
                if (lyr.get('type') === 'vector') {

                    if (lyr.get('title') === targetTile) {

                        if ($(targetLi).hasClass('active')) {
                            lyr.setVisible(false);
                            $(targetLi).removeClass('active');
                        }
                        else {
                            lyr.setVisible(true);
                            $(targetLi).addClass('active');
                        }

                    }
                }
            });
        });
    }

    /**
     * @public
     * @desc Borra una capa de vector por su title
     * @param {string} title Title asociado al vector
     **/
    function removeVectorLayerByTitle(title) {
        var currentLayer = null;
        var currentMap = mapUtils.getMap();
        currentMap.getLayers().forEach(function (lyr, idx, a) {
            //Solo los vectores
            if (lyr.get('type') === 'vector') {

                if (lyr.get('title') === title) {
                    currentMap.removeLayer(lyr);
                    currentMap.render();
                    return;
                }

            }
        });

    }

    /**
     * @public
     * @desc Obtiene la capa por su title
     * @param {string} title Title asociado al vector
     **/
    function getVectorLayerByTitle(title) {
        var currentLayer = null;

        mapUtils.getMap().getLayers().forEach(function (lyr, idx, a) {
            //Solo los vectores
            if (lyr.get('type') === 'vector') {

                if (lyr.get('title') === title)
                    currentLayer = lyr;
            }
        });
        return currentLayer;
    }

    /**
     * @public
     * @desc Inicializa el vector trayéndose el GeoJson
     * @param  {options} Opciones
     * @param  {string} url, url del geoJson
     * @param {string} title. Title de la capa
     * @param {string} type. Tipo de la capa (definido por el programador)
     * @param {string} code. código asociado a la capa (definido por el programador)
     * @param {object} style ol.style.Style asociado al vector
     * @param {object}  interactionStyle ol.style.Style asociado al la interaión select
     * @param {bool} visibleInSwitcher indica si la capa va visible en el selector de capas
     **/
    function loadGeoJSONData(options) {
        if(options)
        {
            var style,title,type,code,url,visibleInSwitcher;
            if (options.style == undefined || options.style == null){

                style = getDefaultStyle();
            }
            if(options.title == undefined || options.title == null || options.title == '')
                  console.log("Define 'title' de la capa")
            else
                title = options.title;

            if(options.type == undefined || options.type == null || options.type == '')
                type='vector'
            else
                type = options.type;

            if(options.code == undefined || options.code == null || options.code == '')
                console.log("Define código de la capa")
            else
                code = options.code;

            if(options.url == undefined || options.url == null || options.url == '')
                console.log("Define url de la capa")
            else
                url = options.url;


            visibleInSwitcher = options.visibleInSwitcher;

            //Elemento base para el overlay sobre las features
            var elem = document.createElement('div');
            elem.setAttribute('id', name);
            var overlay = createBaseOverlay(elem);

            var vectorLayer = new ol.layer.Vector({
                source: new ol.source.Vector({
                    url: url,
                    format: new ol.format.GeoJSON()
                }),
                'title': title,
                'type': 'vector',
                'customType': type,
                'code' : code,
                'overlay': overlay,
                 'style': style,
                'visibleInSwitcher' : visibleInSwitcher

            });
            //Asignamos el vector al mapa
            mapUtils.getMap().addLayer(vectorLayer);


          //  UI.Interactions.addDefaultSelectInteraction(interactionStyle);
            //Renderizamos el botoón de vectores
            renderVectorSwitcher();


            return vectorLayer;
        }

    }

    /**
     * @public
     * @desc Crea un vector con source vacío para incluir features en cliente
     * @param {string} name Title asociado al vector
     **/
    function addVector(name) {
        var vector = new ol.layer.Vector({
            source: new ol.source.Vector(),
            'title': name,
            'type': 'vector'
        });
        mapUtils.getMap().addLayer(vector);

        //Renderizamos el botoón de vectores
        renderVectorSwitcher();
        return vector;
    }


    return {
        loadGeoJSONData: loadGeoJSONData,
        addVector: addVector,
        getVectorLayerByTitle: getVectorLayerByTitle,
        removeVectorLayerByTitle: removeVectorLayerByTitle
    }
})(UI.Map);