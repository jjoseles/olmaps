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
        $(".vector-switcher-content").empty();
        var existsOne = false;

        var retHtml = "<table        data-ordering=\"true\"     data-order=\"[[1,&quot;asc&quot;]]\" class=' table table-striped table-bordered table-hover' id='table-layer'>";
        retHtml += "<thead><tr><th  width='20%' data-searchable=\"false\" data-orderable=\"false\">Opciones</th><th>Capa</th><th>Features</th></tr></thead>";
        mapUtils.getMap().getLayers().forEach(function (lyr, idx, a) {

            //Solo capas de vectores
            if ((lyr.get('type') === 'vector')) {
                if (lyr.get('visibleInSwitcher') == true) {
                    existsOne = true;
                    retHtml += "<tr>";

                    retHtml += "<td><a class=\"btn btn-default btn-success\" data-rel='tooltip' data-placement='top' data-original-title='Mostrar/ocultar' data-vector-action='view' data-vector-code='" + lyr.get('code') + "'><i class='ace-icon fa fa-eye'></i></a>";
                    retHtml += "&nbsp;<a class=\"btn btn-default btn-info\" data-rel='tooltip' data-placement='top' data-original-title='Zoom y centrado sobre puntos' data-vector-action='fixToExtend' data-vector-code='" + lyr.get('code') + "'><i class='ace-icon fa fa-map-pin'></i></a>";
                    if (lyr.get('showSimpleInfoButton') == true) {
                        retHtml += "&nbsp;<a class=\"btn btn-default btn-danger\" data-rel='tooltip' data-placement='top' data-original-title='Info sobre puntos' data-vector-action='showSimpleInfo' data-vector-code='" + lyr.get('code') + "'><i class='ace-icon fa fa-map-marker '></i></a>";

                    }
                    retHtml += "</td>";

                    retHtml += "<td>" + lyr.get('title') + "</td>";
                    retHtml += "<td>" + getVectorFeaturesCollection(lyr).length  + "</td>";
                    retHtml += "</tr>";
                    console.log(lyr)
                }
            }
        });
        retHtml += "</tbody></table>";
        $(".vector-switcher-content").append(retHtml);
        if (existsOne)
            $(".vector-switcher").show();

        //Datatable
        var otable = $("#table-layer", $(".vector-switcher-content")).dataTable({

            "ordering": true,
            "stateSave": false,
            "pageLength": 10,
            "language": {"sSearch": ""},
            'sDom': 'ftlp',
            "columnDefs": [
                {"orderable": false, "targets": 0}

            ]
        });
        //Tooltip
        $('[data-rel=tooltip]', $(".vector-switcher-content")).tooltip({
            container: 'body'
        });

        prepareEvents();

    }


    /**
     * @private
     * @desc Prepara los eventos sobre los elementos del mapa para vectores
     **/
    function prepareEvents() {
        //Visualizar los puntos
        $("[data-vector-action='view']").click(function () {

            var targetCode = $(this).attr('data-vector-code');

            var layer = getVectorLayerByProperty("code", targetCode);

            layer.setVisible(!layer.getVisible());

            if (!layer.getVisible()) {
                $(this).removeClass("btn-success");
                $(this).addClass("btn-danger");
                //Si la capa no está visible quitamos los overlays
                var $element = $("." + targetCode + "-tooltip-point-info");
                $element.popover('hide');
            }
            else {
                $(this).removeClass("btn-danger");
                $(this).addClass("btn-success");
            }
        });

        $("[data-vector-action='showSimpleInfo']").click(function () {


            var targetCode = $(this).attr('data-vector-code');
            var layer = getVectorLayerByProperty("code", targetCode);

            //Fix To Extend
           fitToExtend(layer);

            var $element = $("." + targetCode + "-tooltip-point-info");

            if($(this).hasClass("btn-danger"))
            {
                if (layer.getVisible()) {
                    $element.popover('show');
                    $(this).removeClass("btn-danger");
                    $(this).addClass("btn-success");
                }
            }
            else {
                $element.popover('hide');
                $(this).removeClass("btn-success");
                $(this).addClass("btn-danger");
            }

        });
        $("[data-vector-action='fixToExtend']").click(function () {

            var targetCode = $(this).attr('data-vector-code');
            var layer = getVectorLayerByProperty("code", targetCode);
            //Fix To Extend
            fitToExtend(layer);

        });
    }

    /**
     * @public
     * @desc Borra una capa de vector buscándola por una determinada propiedad
     * @param {string} propertyName Nombre de la propiedad
     * @param {string} propertyValue Valor de la propiedad
     **/
    function removeVectorLayerByProperty(propertyName, propertyValue) {
        var currentMap = mapUtils.getMap();
        var layer = getVectorLayerByProperty(propertyName, propertyValue);

        currentMap.removeLayer(layer);
        currentMap.render();
    }

    /**
     * @public
     * @desc Obtiene la capa por el valor que toma una de sus propiedades
     * @param {string} propertyName Nombre de la propiedad
     * @param {string} propertyValue Valor de la propiedad
     **/
    function getVectorLayerByProperty(propertyName, propertyValue) {
        var currentLayer = null;

        mapUtils.getMap().getLayers().forEach(function (lyr, idx, a) {
            //Solo los vectores
            if (lyr.get('type') === 'vector') {

                if (lyr.get(propertyName) === propertyValue)
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
        if (options) {

            var style, title, type, code, url, visibleInSwitcher, showSimpleInfoButton;
            if (typeof options.style === 'undefined')
                style = getDefaultStyle();
            else
                style = options.style;

            if (typeof options.title === 'undefined' || options.title == '')
                console.log("Define 'title' de la capa");
            else
                title = options.title;

            if (typeof options.type === 'undefined' || options.type == '')
                type = 'vector';
            else
                type = options.type;

            if (typeof options.code === 'undefined' || options.code == '')
                console.log("Define código de la capa");
            else
                code = options.code;

            if (typeof options.url === 'undefined' || options.url == '')
                console.log("Define url de la capa");
            else
                url = options.url;

            if (typeof options.visibleInSwitcher === 'undefined')
                visibleInSwitcher = true;
            else
                visibleInSwitcher = options.visibleInSwitcher;


            if (typeof options.showSimpleInfoButton === 'undefined')
                showSimpleInfoButton = false;
            else
                showSimpleInfoButton = options.showSimpleInfoButton;

            //Elemento base para el overlay sobre las features
            var elem = document.createElement('div');
            elem.setAttribute('id', code);
            var overlay = createBaseOverlay(elem);

            var source = new ol.source.Vector({
                // url: url,
                //format: new ol.format.GeoJSON()
                loader: ol.featureloader.loadFeaturesXhr(url, new ol.format.GeoJSON(), function (features) {
                    var tempFeatures = [];
                    features.forEach(function (feat, idx, a) {
                        //Ya podemos pintar cosas sobre la feature
                        //Podenos crear un info overlay con texto sencillo, incluso un tooltip
                        //lo pasamos
                        if (showSimpleInfoButton) {


                            var simpleInfoHtml = "";
                            if (options.propertiesShowInSimpleInfo) {
                                options.propertiesShowInSimpleInfo.forEach(function (prop, idx, a) {
                                    simpleInfoHtml += feat.get(prop)
                                });
                            }
                            //Añade un overlay con estilo al funto
                            UI.Overlay.addOverlayPointTooltip(feat.getGeometry().getCoordinates(), simpleInfoHtml, code)

                        }

                        tempFeatures.push(feat);
                        feat.setStyle(null);

                    });
                    this.addFeatures(tempFeatures);
                    renderVectorSwitcher();
                })
            });
            var vectorLayer = new ol.layer.Vector({
                source: source,
                'title': title,
                'type': 'vector',
                'customType': type,
                'code': code,
                'overlay': overlay,
                'style': style,
                'visibleInSwitcher': visibleInSwitcher,
                'showSimpleInfoButton': showSimpleInfoButton

            });


            //Asignamos el vector al mapa
            mapUtils.getMap().addLayer(vectorLayer);


            // UI.Interactions.addDefaultSelectInteraction(interactionStyle);
            //Renderizamos el botoón de vectores

              //  renderVectorSwitcher();




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

    /**
     * @public
     * @desc Devuelve el source de una capa
     * @param {object} vecor
     **/
    function getVecorLayerSource(layer) {
        return layer.getSource();
    }

    /**
     * @public
     * @desc Devuelve el source de una capa
     * @param {object} vecor
     **/
    function getVectorFeaturesCollection(layer) {
        return layer.getSource().getFeatures();
    }


    /**
     * @public
     * @desc Centra el mapa y hace zoom sobre un conjunto de puntos del source de una capa durante la carga de la capa
     * @param {object} layer
     **/
    function fitToExtendOnLoad(layer) {
        var map = mapUtils.getMap();
        var source = getVecorLayerSource(layer);
        source.on("change", function (evt) {
            extent = source.getExtent();
            map.getView().fit(extent, map.getSize());
        });
    }
    /**
     * @public
     * @desc Centra el mapa y hace zoom sobre un conjunto de puntos del source de una capa
     * @param {object} layer
     **/
    function fitToExtend(layer) {

        //Fix To Extend
        var map = mapUtils.getMap();
        var source = getVecorLayerSource(layer);

        extent = source.getExtent();
        map.getView().fit(extent, map.getSize(),{"maxZoom": 19});
    }
    return {
        loadGeoJSONData: loadGeoJSONData,
        addVector: addVector,
        getVectorLayerByProperty: getVectorLayerByProperty,
        removeVectorLayerByProperty: removeVectorLayerByProperty,
        getVecorLayerSource: getVecorLayerSource,
        fitToExtendOnLoad:fitToExtendOnLoad,
        fitToExtend: fitToExtend,
        getVectorFeaturesCollection: getVectorFeaturesCollection
    }
})(UI.Map);