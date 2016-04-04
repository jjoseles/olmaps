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
                radius: 3,
                fill: new ol.style.Fill({color: 'blue'}),
                stroke: new ol.style.Stroke({
                    color: 'white', width: 1
                })
            }),
            text: new ol.style.Text(

            ),
            stroke: new ol.style.Stroke({
                width: 3,
                color: "#4B87C8"
            }),
            fill: new ol.style.Fill({
                color: [0, 0, 255, 0.1]
            })


        });
    }

    /**
     * @public
     * @desc estilo por defecto para la interacción
     **/
    function getDefaultSelectInteractionStyle() {
        return new ol.style.Style({
            //Color de los puntos
            image: new ol.style.Circle({
                radius: 10,
                //snapToPixel: false,
                'fill': new ol.style.Fill({color: 'red'}),
                stroke: new ol.style.Stroke({
                    color: 'white', width: 4
                })
            }),
            //Color de las líneas
            stroke: new ol.style.Stroke({
                width: 3,
                color: 'black'
            }),
            //Color de relleno
            fill: new ol.style.Fill({
                color: [0, 0, 255, 0.3]
            })
        });
    }
    function showPointsInChangeResolution(currentResolution,viewExtent)
    {

        mapUtils.getMap().getLayers().forEach(function (lyr, idx, a) {
            if ((lyr.get('type') === 'vector')) {
                if(lyr.get('minResolutionToShowPoints') != 0)
                {

                        lyr.getSource().forEachFeatureInExtent(viewExtent, function (feature) {
                            if(feature.getGeometry().getType() == "Point")
                            {

                                if(currentResolution <= lyr.get('minResolutionToShowPoints')) {
                                    var style = feature.getStyle();
                                    if(style.getImage() != null)
                                       style.getImage().setOpacity(1)

                                    feature.setStyle(style)
                                }
                                else
                                {
                                    var style = feature.getStyle();
                                    if(style.getImage() != null)
                                       style.getImage().setOpacity(0)
                                    feature.setStyle(style)
                                }

                            }

                        });
                    }



            }
        });
    }

    /**
     * @public
     * @desc Private, añade estilos por defecto a las features
     **/
    function addDefaultStyles(features, layerName,currentResolution) {

        var layer = getVectorLayerByProperty("code", layerName);
        features.forEach(function (feat, idx, a) {
            var style = feat.getStyle();
            if (style == null) {
                var layerStyle = layer.get('defaultStyle')
                feat.set("defaultStyle", layerStyle);
                feat.set("interactionStyle", layer.get('styleSelectInteraction'));
                layerStyle.getImage().setOpacity(currentResolution <= layer.get('minResolutionToShowPoints') ? 1: 0)
                feat.setStyle(layerStyle)
            }


        });
        return features;
    }
    /**
     * @public
     * @desc Private, añade estilos por defecto a las features de una capa de ruta
     **/
    function addArrowsToLineString(features, layerName) {

        var layer = getVectorLayerByProperty("code", layerName);



        var lineStringFeatures = features.filter(function (f) {
            return f.getGeometry().getType() == "LineString";
        });
        var tempFeatures = lineStringFeatures;
        if (lineStringFeatures.length > 0) {
            var pointFeatures = features.filter(function (f) {
                return f.getGeometry().getType() == "Point";
            });


            lineStringFeatures.forEach(function (lineStringFeature, idx, a) {
                //Cada uno de los segmentos de
                lineStringFeature.getGeometry().forEachSegment(function (start, end) {
                    var dx = end[0] - start[0];
                    var dy = end[1] - start[1];
                    var rotation = Math.atan2(dy, dx);

                    var feats = pointFeatures.filter(function (f) {
                        var coord = f.getGeometry().getCoordinates();
                        return (coord[0] === end[0] && coord[1] === end[1]);
                    });
                    if (feats.length > 0) {
                        var featStyle = new ol.style.Style(
                            {
                                // geometry: new ol.geom.Point(end),
                                image: new ol.style.Icon({
                                    src: 'img/arrow-right-circle-blue-16.png',
                                    anchor: [0.75, 0.5],
                                    rotateWithView: false,
                                    rotation: -rotation,
                                    opacity: layer.get('minResolutionToShowPoints') == 0 ? 1: 0
                                }),
                            });
                        var featInteracionStyle =
                            new ol.style.Style(
                                {
                                    // geometry: new ol.geom.Point(end),
                                    image: new ol.style.Icon({
                                        src: 'img/arrow-right-circle-green-16.png',
                                        anchor: [0.75, 0.5],
                                        rotateWithView: false,
                                        rotation: -rotation,

                                    }),

                                });

                        feats[0].set("defaultStyle", featStyle);
                        feats[0].set("interactionStyle", featInteracionStyle);
                        feats[0].setStyle(featStyle)
                        tempFeatures.push(feats[0])

                    }

                    //layer.setStyle(null)


                })
            })

        }
        else {
            tempFeatures = features
        }

        return tempFeatures;

    }

    /**
     * @private
     * @desc Visualiza la tabla con los dato de las features de manera genérica
     **/
    function showFeatureListInfo(code) {


        var $contentArea = $("#vector-info-detail-content-" + code + ".vector-info-detail-content");

        var retHtml = "<table   data-ordering=\"true\"     data-order=\"[[1,&quot;asc&quot;]]\" class=' table  table-bordered' id='table-layer" + code + "'>";
        retHtml += "<thead><tr>";
        var layer = getVectorLayerByProperty('code', code);
        var features = getVectorFeaturesCollection(layer);
        var arrkeys = [];
        retHtml += "<th></th>";
        //la feature de la primera posición
        features.forEach(function (feat, idx, a) {
            {
                if (feat.getGeometry().getType() === "Point") {
                    var featureKeys = feat.getKeys();
                    featureKeys.forEach(function (key, idxobj, a) {

                        if (key != "geometry" && key.indexOf('_') !== 0) {
                            if (arrkeys.indexOf(key) <= -1) {
                                retHtml += "<th>" + key + "</th>";
                                arrkeys.push(key)
                            }
                        }
                    });
                }
            }
        });


        retHtml += "</tr></thead>";
        retHtml += "<tbody>";
        features.forEach(function (feat, idx, a) {

            if (feat.getGeometry().getType() == 'Point') {

                retHtml += "<tr>";
                var featureKeys = feat.getKeys()
                console.log(feat)
                retHtml += "<td><a class=\"btn btn-default btn-xs btn-info\" data-point-action='fixToExtendAndShowInfo' data-feat-coordinates='" + feat.getGeometry().getCoordinates() + "'><i class='ace-icon fa fa-map-pin'></i></a></td>";
                arrkeys.forEach(function (key, idxobj, a) {

                    retHtml += "<td>" + feat.get(key) + "</td>";
                });
                retHtml += "</tr>";
            }

        });
        retHtml += "</tbody></table>";

        $contentArea.addClass("open");

        $("[data-content='dynamic-content']", $contentArea).append(retHtml);

        //Datatable
        var otable = $("#table-layer" + code, $contentArea).dataTable({

            "ordering": true,
            "stateSave": false,
            "pageLength": 5,
            'sDom': 'ftp',
            'rowCallback': function (nRow) {

                $(nRow).find("[data-point-action='fixToExtendAndShowInfo']").on("click", function (e) {
                    var coordinate = $(this).data("feat-coordinates");
                    var pos = ol.proj.fromLonLat(coordinate);

                    var feats = layer.getSource().getFeatures().filter(function (f) {
                        var coord = f.getGeometry().getCoordinates();
                        return (coord == pos);
                    });

                    if (feats.length > 0) {
                        var map = mapUtils.getMap();


                        map.getView().fit(feats[0].getGeometry().getExtent(), map.getSize(), {"maxZoom": 9});
                        map.renderSync();
                        UI.Feature.displayFeatureInfo(feats[0], mapUtils.getMap());
                    }


                });
            }

        });


    }


    /**
     * @private
     * @desc Renderiza el selector de vectores
     **/
    function renderVectorSwitcher() {
        $("#vector-switcher-content").empty();
        var existsOne = false;

        var retHtml = "<table  data-ordering=\"true\"     data-order=\"[[1,&quot;asc&quot;]]\" class=' table table-striped table-bordered table-hover' id='table-layer'>";
        retHtml += "<thead><tr><th  width='20%' data-searchable=\"false\" data-orderable=\"false\">Opciones</th><th>Capa</th><th>Features</th></tr></thead><tbody>";
        mapUtils.getMap().getLayers().forEach(function (lyr, idx, a) {

            //Solo capas de vectores
            if ((lyr.get('type') === 'vector')) {
                if (lyr.get('visibleInSwitcher') == true) {
                    existsOne = true;
                    retHtml += "<tr>";

                    retHtml += "<td>" + UI.gridColumnsRender.optionsHeader(UI.optionsButtonType.DROPDOWN);
                    retHtml += "<li><a class=\"btn btn-default btn-xs btn-success\" data-vector-action='view' data-vector-code='" + lyr.get('code') + "'><i class='ace-icon fa fa-eye'></i>Mostrar/ocultar</a></li>";
                    retHtml += "<li><a class=\"btn btn-default btn-xs btn-info\" data-vector-action='fixToExtend' data-vector-code='" + lyr.get('code') + "'><i class='ace-icon fa fa-map-pin'></i>Zoom y centrado sobre puntos</a></li>";
                    if (lyr.get('showSimpleInfoButton') == true) {
                        retHtml += "<li><a class=\"btn btn-default btn-xs btn-danger\"  data-vector-action='showSimpleInfo' data-vector-code='" + lyr.get('code') + "'><i class='ace-icon fa fa-map-marker '></i>Info sobre puntos</a></li>";

                    }
                    if (lyr.get('showListInfoButton') == true) {
                        retHtml += "<li><a class=\"btn btn-default btn-xs btn-danger\"  data-vector-action='showListInfo' data-vector-code='" + lyr.get('code') + "'><i class='ace-icon fa fa-list-alt '></i>Ir al listado de datos</a></li>";
                    }
                    retHtml += UI.gridColumnsRender.optionsFooter();
                    retHtml += "</td>";

                    retHtml += "<td>" + lyr.get('title') + "</td>";
                    retHtml += "<td>" + getVectorFeaturesCollection(lyr).length + "</td>";
                    retHtml += "</tr>";

                }
            }
        });
        retHtml += "</tbody></table>";
        $("#vector-switcher-content").append(retHtml);
        if (existsOne)
            $(".vector-switcher").show();

        //Datatable
        var otable = $("#table-layer", $("#vector-switcher-content")).dataTable({

            "ordering": true,
            "stateSave": false,
            "pageLength": 10,
            "language": {"sSearch": ""},
            'sDom': 'ftlp',
            "columnDefs": [
                {"orderable": false, "targets": 0, 'class': "text-center"}

            ]
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

        //Evento click sobre visualización de listado de datos
        $("[data-vector-action='showListInfo']").click(function () {
            $('#vector-switcher-content').toggleClass('open');

            var targetCode = $(this).attr('data-vector-code');

            var layer = getVectorLayerByProperty('code', targetCode);

            var callback = layer.get('showFeaturesInfoCallback')
            callback(targetCode)
        });

        //Imformación sencilla sobre los puntos de una capa
        $("[data-vector-action='showSimpleInfo']").click(function () {
            var targetCode = $(this).attr('data-vector-code');
            var layer = getVectorLayerByProperty("code", targetCode);


            //Fix To Extend
            fitToExtend(layer);
            //Visualizamos la información


            var $element = $("." + targetCode + "-tooltip-point-info");
            if ($element.length == 0)
                UI.Feature.displayFeatureTooltipInfo(layer);

            if ($(this).hasClass("btn-danger")) {
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
        //Fit to Extend sobre los puntos de la capa
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


            var style, styleSelectInteraction, title, type, code, url, visibleInSwitcher, showSimpleInfoButton, showListInfoButton;
            var showFeaturesInfoCallback, showFeatureOverlayCallback;


            //Comprobamos parámetros de entrada
            if (typeof options.style === 'undefined')
                style = getDefaultStyle();
            else
                style = options.style;


            if (typeof options.styleSelectInteraction === 'undefined')
                styleSelectInteraction = getDefaultSelectInteractionStyle();
            else
                styleSelectInteraction = options.styleSelectInteraction;


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

            if (typeof options.showListInfoButton === 'undefined')
                showListInfoButton = false;
            else
                showListInfoButton = options.showListInfoButton;


            if (typeof options.showFeaturesInfoCallback === 'undefined')
                showFeaturesInfoCallback = showFeatureListInfo;
            else
                showFeaturesInfoCallback = options.showFeaturesInfoCallback;

            if (typeof options.minResolutionToShowPoints === 'undefined')
                minResolutionToShowPoints = 0;
            else
                minResolutionToShowPoints = options.minResolutionToShowPoints;


            showFeatureOverlayCallback = options.showFeatureOverlayCallback;


            //Contendedor de info de capa Listado
            if ($('#vector-info-detail-content-' + code).length == 0) {
                var strInfoDetailContentForLayer = "<div id='vector-info-detail-content-" + code + "' class='vector-info-detail-content'>";
                strInfoDetailContentForLayer += "<div data-content='fixed-content'></div>";
                strInfoDetailContentForLayer += "<div data-content='dynamic-content'><!-- Generado por javascript --></div>";
                strInfoDetailContentForLayer += "</div>";
                $('.vector-switcher .btn-group').append(strInfoDetailContentForLayer);

            }


            var source = new ol.source.Vector({
                // url: url,
                //format: new ol.format.GeoJSON()
                loader: ol.featureloader.loadFeaturesXhr(url, new ol.format.GeoJSON(), function (features) {
                    var tempFeatures = [];
                    features.forEach(function (feat, idx, a) {
                        //Ya podemos pintar cosas sobre la feature
                        //Podenos crear un info overlay con texto sencillo, incluso un tooltip
                        //lo pasamos

                        feat.setId(Math.random() + 1)
                        tempFeatures.push(feat);


                    });
                    tempFeatures = addArrowsToLineString(tempFeatures, code);
                    tempFeatures = addDefaultStyles(tempFeatures, code,mapUtils.getMap().getView().getResolution());

                    this.addFeatures(tempFeatures);
                    renderVectorSwitcher();


                })
            });

            //Elemento base para el overlay sobre las features

            var overlayFeatureInfo = UI.Overlay.createBaseOverlay(code);


            var vectorLayer = new ol.layer.Vector({
                source: source,
                'title': title,
                'type': 'vector',
                'customType': type,
                'code': code,
                'overlayFeatureInfo': overlayFeatureInfo,
                 'style': style,
                'defaultStyle': style,
                'styleSelectInteraction': styleSelectInteraction,
                'visibleInSwitcher': visibleInSwitcher,
                'showSimpleInfoButton': showSimpleInfoButton,
                'showListInfoButton': showListInfoButton,
                'showFeaturesInfoCallback': showFeaturesInfoCallback,
                'showFeatureOverlayCallback': showFeatureOverlayCallback,
                'propertiesShowInSimpleInfo': options.propertiesShowInSimpleInfo,
                'minResolutionToShowPoints': minResolutionToShowPoints
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
        /* var map = mapUtils.getMap();
         var source = getVecorLayerSource(layer);
         source.on("change", function (evt) {
         extent = source.getExtent();
         map.getView().fit(extent, map.getSize());
         });*/
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
        map.getView().fit(extent, map.getSize(), {"maxZoom": 19});
    }

    return {
        loadGeoJSONData: loadGeoJSONData,
        addVector: addVector,
        getVectorLayerByProperty: getVectorLayerByProperty,
        removeVectorLayerByProperty: removeVectorLayerByProperty,
        getVecorLayerSource: getVecorLayerSource,
        fitToExtendOnLoad: fitToExtendOnLoad,
        fitToExtend: fitToExtend,
        getVectorFeaturesCollection: getVectorFeaturesCollection,
        showPointsInChangeResolution: showPointsInChangeResolution
    }
})(UI.Map);