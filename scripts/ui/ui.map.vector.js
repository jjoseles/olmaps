/**
 * Created by jose on 20/2/16.
 */
UI = window.UI || {};

/**
 * @desc Herramientas de mapas openlayers
 **/
UI.MapVector = (function (mapUtils, config) {

    function getVectorLayers() {

        return mapUtils.getMap().getLayers().getArray().filter(function (lyr) {
            return lyr.get('type') == config.internalLayerType.VECTOR;
        });
    }


    /**
     * @private
     * @desc estilo por defecto para las capas
     **/
    function getDefaultStyle() {
        return new ol.style.Style({
            image: new ol.style.Circle({
                radius: 3,
                fill: new ol.style.Fill({color: 'red'}),
                stroke: new ol.style.Stroke({
                    color: 'white', width: 1
                })
            }),
            text: new ol.style.Text({
                fill: new ol.style.Fill({color: '#123963'}),
                stroke: new ol.style.Stroke({color: "#fff", width: 1}),
                font: "12px Arial",
                textAlign: 'center',
                textBaseline: 'bottom',
                offsetX: 40,
                offsetY: 10
            }),
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
            text: new ol.style.Text({
                fill: new ol.style.Fill({color: '#123963'}),
                stroke: new ol.style.Stroke({color: "#fff", width: 1}),
                font: "12px Arial",
                textAlign: 'center',
                textBaseline: 'bottom',
                offsetX: 40,
                offsetY: 10
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

    //TODO Transformar a style function
    function showPointsInChangeResolution(currentZoom, viewExtent) {

        getVectorLayers().forEach(function (lyr, idx, a) {

            var zoomToShowPoints = lyr.get('zoomToShowPoints');
            var zoomToShowLabels = lyr.get('zoomToShowLabels');

            if(lyr.getSource())
            {
                lyr.getSource().forEachFeatureInExtent(viewExtent, function (feature) {
                    if (feature.getGeometry().getType() == "Point") {
                        var style = null;
                        style = feature.getStyle();
                        if(!feature.get("_style")) {
                            if (style) {

                                if (currentZoom >= zoomToShowPoints) {

                                    if (style.getImage() != null)
                                        style.getImage().setOpacity(1)
                                } else {

                                    if (style.getImage() != null)
                                        style.getImage().setOpacity(0)
                                }

                                //invisible si no se muestran puntos

                                if (lyr.get('showPoints') == false)
                                    style.getImage().setOpacity(0);

                            }
                        }
                    }
                });
            }


        });
        mapUtils.getMap().renderSync();
    }

    /**
     * @private
     * @desc Functión de estilo para las features de la capas de tipo POINT
     **/
    var LayerStyleFunctionForRouteLayers = function (feature) {

        if (feature) {
            if (feature.get("_style")) {
                if (feature.getGeometry().getType() == "LineString") {
                    var jsonStyle = feature.get("_style");
                    var style = new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            width: jsonStyle.line.width,
                            color: jsonStyle.line.color,
                        })
                    });
                    var styleSelect = new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            width: jsonStyle.line.width + 3,
                            color: jsonStyle.line.color,
                        })
                    });
                    feature.set("_defaultStyle", style);
                    feature.set("_interactionStyle", styleSelect);


                    return style;
                }
                else {
                  if (feature.getGeometry().getType() == "Point") {

                        var jsonStyle = feature.get("_style");
                        if (jsonStyle.circle) {
                            var style = new ol.style.Style({
                                image: new ol.style.Circle({
                                    radius: jsonStyle.circle.radius,
                                    fill: new ol.style.Fill({
                                        color: jsonStyle.circle.fill.color,

                                    }),
                                    stroke: new ol.style.Stroke({
                                        color: jsonStyle.circle.stroke.color,
                                        width: jsonStyle.circle.stroke.width
                                    }),

                                }),
                            });
                            var styleSelect = new ol.style.Style({
                                image: new ol.style.Circle({
                                    radius: jsonStyle.circle.radius + 4,
                                    fill: new ol.style.Fill({
                                        color: jsonStyle.circle.fill.color,

                                    }),
                                    stroke: new ol.style.Stroke({
                                        color: jsonStyle.circle.stroke.color,
                                        width: jsonStyle.circle.stroke.width
                                    }),

                                })
                            });
                            feature.set("_defaultStyle", style);
                            feature.set("_interactionStyle", styleSelect);
                            return style;
                        } else if (jsonStyle.image) {
                            var style = new ol.style.Style({
                                image: new ol.style.Icon({
                                    src: jsonStyle.image.src,
                                    anchor: jsonStyle.image.anchor,

                                    opacity: jsonStyle.image.opacity
                                })
                            });
                            feature.set("_defaultStyle", style);
                            feature.set("_interactionStyle", style);
                            return style;
                        }
                    }
                }
            }

            if (feature.getGeometry().getType() == "Point") {
                return feature.get("_defaultStyle");

            }
            var layer = feature.getLayer(UI.Map.getMap());
            feature.set("_defaultStyle", layer.get('defaultStyle'));
            feature.set("_interactionStyle", layer.get('styleSelectInteraction'));
            return layer.get('defaultStyle')
        }
    };

    /**
     * @private
     * @desc devuelve el estilo invisible/invisible de una determinada feature en función a su tipo
     **/
    var GetStyleHiddenVisibleForFeature = function (feature) {
        if (feature) {

            if (feature.get("isVisible")) {
                feature.set("isVisible", false);
                if (feature.getGeometry().getType() == "LineString") {
                    return config.hideLinesStyle;
                }
                if (feature.getGeometry().getType() == "Point") {

                    return config.hidePointsStyle;
                }

            }
            else {
                feature.set("isVisible", true);
                return LayerStyleFunctionForRouteLayers(feature)
            }


        }

    };

    /**
     * @private
     * @desc Functión de estilo para las features de la capas de tipo POINT
     **/
    var layerStyleFunctionForPointsLayers = function (feature) {

        if (feature) {
            var layer = feature.getLayer(UI.Map.getMap());

            if (feature.get("_style")) {
                if (feature.getGeometry().getType() == "Point") {


                    var jsonStyle = feature.get("_style");
                    if (jsonStyle.circle) {
                        var style = new ol.style.Style({
                            image: new ol.style.Circle({
                                radius: jsonStyle.circle.radius,
                                fill: new ol.style.Fill({
                                    color: jsonStyle.circle.fill.color,

                                }),
                                stroke: new ol.style.Stroke({
                                    color: jsonStyle.circle.stroke.color,
                                    width: jsonStyle.circle.stroke.width
                                }),

                            }),
                        });
                        var styleSelect = new ol.style.Style({
                            image: new ol.style.Circle({
                                radius: jsonStyle.circle.radius + 4,
                                fill: new ol.style.Fill({
                                    color: jsonStyle.circle.fill.color,

                                }),
                                stroke: new ol.style.Stroke({
                                    color: jsonStyle.circle.stroke.color,
                                    width: jsonStyle.circle.stroke.width
                                }),

                            })
                        });
                        feature.set("_defaultStyle", style);
                        feature.set("_interactionStyle", styleSelect);
                        return style;
                    } else if (jsonStyle.image) {
                        var style = new ol.style.Style({
                            image: new ol.style.Icon({
                                src: jsonStyle.image.src,
                                anchor: jsonStyle.image.anchor,

                                opacity: jsonStyle.image.opacity
                            })
                        });
                        feature.set("_defaultStyle", style);
                        feature.set("_interactionStyle", style);
                        return style;
                    }
                    //Por defecto
                    feature.set("_defaultStyle", layer.get('defaultStyle'));
                    feature.set("_interactionStyle", layer.get('styleSelectInteraction'));
                    return layer.get('defaultStyle')
                }
            }
            feature.set("_defaultStyle", layer.get('defaultStyle'));
            feature.set("_interactionStyle", layer.get('styleSelectInteraction'));
            return layer.get('defaultStyle')
        }


    };


    /**
     * @public
     * @desc Private, añade estilos por defecto a las features
     **/
    function AddSomeFeatureProperties(features, layerName) {

        //var layer = getVectorLayerByProperty("code", layerName);
        //  var layerStyle = layer.get('defaultStyle')

        var temFeatures = [];
        features.forEach(function (feat, idx, a) {

            feat.set("layerCode", layerName);
            feat.setId(Math.random() + 1);
            feat.set("isVisible", true);
            temFeatures.push(feat)
        });


        return temFeatures;
    }

    /**
     * @public
     * @desc Private, añade estilos por defecto a las features de una capa de ruta
     **/
    function addArrowsToLineString(features, layerName) {





        var lineStringFeatures = features.filter(function (f) {
            return f.getGeometry().getType() == "LineString";
        });


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

                        if(!feats[0].get("_style")) {

                            var featStyle = new ol.style.Style(
                                {
                                    // geometry: new ol.geom.Point(end),
                                    image: new ol.style.Icon({
                                        src: 'img/arrow-right-circle-blue-16.png',
                                        anchor: [0.75, 0.5],
                                        rotateWithView: false,
                                        rotation: -rotation,
                                        opacity: 0
                                    }),
                                    text: new ol.style.Text({
                                        fill: new ol.style.Fill({color: '#123963'}),
                                        stroke: new ol.style.Stroke({color: "#fff", width: 1}),
                                        font: "12px Arial",
                                        textAlign: 'center',
                                        textBaseline: 'bottom',
                                        offsetX: 40,
                                        offsetY: 10
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
                                        text: new ol.style.Text({
                                            fill: new ol.style.Fill({color: '#123963'}),
                                            stroke: new ol.style.Stroke({color: "#fff", width: 1}),
                                            font: "12px Arial",
                                            textAlign: 'center',
                                            textBaseline: 'bottom',
                                            offsetX: 40,
                                            offsetY: 10
                                        }),

                                    });
                            feats[0].setStyle(featStyle);
                            feats[0].set("_defaultStyle", featStyle);
                            feats[0].set("_interactionStyle", featInteracionStyle);
                        }
                        else{
                            //No metemos arrow si viene estilo en el geoJson
                        /*    console.log(feats[0].get("_style"))
                            var featStyle = layerStyleFunctionForPointsLayers(feats[0])
                            feats[0].setStyle(featStyle);
                            feats[0].set("_defaultStyle", featStyle);
                            feats[0].set("_interactionStyle", featStyle); */

                        }

                        // tempFeatures.push(feats[0])

                    }

                    //layer.setStyle(null)


                })
            })

        }

        return features;

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
        if(features.length>0) {
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
                    var featureKeys = feat.getKeys();

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
                "language": {"sSearch": ""},
                "lengthMenu": [5],
                'dom': 'ftpi',
                "columnDefs": [
                    {"orderable": false, "targets": 0, 'class': "text-center"}

                ],

                'rowCallback': function (nRow) {

                    $(nRow).find("[data-point-action='fixToExtendAndShowInfo']").on("click", function (e) {
                        var coordinate = $(this).data("feat-coordinates");
                        var pos = ol.proj.fromLonLat(coordinate);

                        if (layer.getSource()) {
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
                        }


                    });
                }

            });
        }
    }


    /**
     * @private
     * @desc Renderiza el selector de vectores
     **/
    function renderVectorSwitcher() {

        $("#vector-switcher-content").empty();
        var existsOne = false;

        var retHtml = "<table  data-ordering=\"true\"     data-order=\"[[1,&quot;asc&quot;]]\" class='table table-striped table-bordered table-hover dataTable no-footer' id='table-layer'>";
        retHtml += "<thead><tr><th  data-searchable=\"false\" data-orderable=\"false\">Opciones</th><th>Capa</th><th>Nº de características</th></tr></thead><tbody>";
        getVectorLayers().forEach(function (lyr, idx, a) {

            //Solo capas de vectores

            if (lyr.get('visibleInSwitcher') == true) {
                existsOne = true;
                retHtml += "<tr>";

                retHtml += "<td> <div class=\"action-buttons input-group-btn \">";

                if (lyr.get("customType") == config.layerType.ROUTE) {
                    retHtml += "<a role=\"button\" data-position=\"auto\" data-type='" + config.routeLayerTypes.ORIGINAL + "' data-vector-action='viewHideRoutePart' data-vector-code='" + lyr.get('code') + "' data-rel=\"tooltip\" data-original-title=\"Mostrar/ocultar ruta compactada\"  class=\"btn btn-xs btn-success\">" +
                        "<i class=\"ace-icon icon-only bigger-110 fa fa-eye\"></i>" +
                        "</a>";
                    retHtml += "<a role=\"button\" data-position=\"auto\" data-type='" + config.routeLayerTypes.COMPACTA + "'data-vector-action='viewHideRoutePart' data-vector-code='" + lyr.get('code') + "' data-rel=\"tooltip\" data-original-title=\"Mostrar/ocultar ruta original\"  class=\"btn btn-xs btn-success\">" +
                        "<i class=\"ace-icon icon-only bigger-110 fa fa-eye\"></i>" +
                        "</a>";
                    retHtml += "<a role=\"button\" data-position=\"auto\" data-type='play' data-vector-action='animate' data-vector-code='" + lyr.get('code') + "' data-rel=\"tooltip\" data-original-title=\"Animar\"  class=\"btn btn-xs btn-success\">" +
                        "<i class=\"ace-icon icon-only bigger-110 fa fa fa-play\"></i>" +
                        "</a>";
                }
                else {
                    retHtml += "<a role=\"button\" data-position=\"auto\" data-vector-action='view' data-vector-code='" + lyr.get('code') + "' data-rel=\"tooltip\" data-original-title=\"Mostrar/ocultar\"  class=\"btn btn-xs btn-success\">" +
                        "<i class=\"ace-icon icon-only bigger-110 fa fa-eye\"></i>" +
                        "</a>";
                }

                retHtml += "<a role=\"button\" data-position=\"auto\" data-vector-action='fixToExtend' data-vector-code='" + lyr.get('code') + "'data-rel=\"tooltip\"  data-original-title=\"Zoom y centrado sobre puntos\"  class=\"btn btn-xs btn-success\">" +
                    "<i class=\"ace-icon icon-only bigger-110 fa fa-map-pin\"></i>" +
                    "</a>";
                if (lyr.get('showListInfoButton') == true) {
                    retHtml += "<a role=\"button\" data-position=\"auto\" data-vector-action='showListInfo' data-vector-code='" + lyr.get('code') + "' data-rel=\"tooltip\" data-original-title=\"Ir al listado de datos\"  class=\"btn btn-xs btn-info\">" +
                        "<i class=\"ace-icon icon-only bigger-110 fa fa-list-alt\"></i>" +
                        "</a>";

                }
                if (lyr.get('loadInInit') == false) {
                    retHtml += "<a role=\"button\" data-position=\"auto\" data-vector-action='reload' data-vector-code='" + lyr.get('code') + "' data-rel=\"tooltip\" data-original-title=\"cargar datos \"  class=\"btn btn-xs btn-info\">" +
                        "<i class=\"ace-icon icon-only bigger-110 fa fa-cloud-download\"></i>" +
                        "</a>";

                }
                retHtml += "</div>";
                retHtml += "</td>";

                retHtml += "<td>" + lyr.get('title') + "</td>";
                retHtml += "<td>" + getVectorFeaturesCollection(lyr).length + "</td>";
                retHtml += "</tr>";

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
            "pageLength": 5,
            "language": {"sSearch": ""},
            "lengthMenu": [5],
            'sDom': 'ftpi',
            "columnDefs": [
                {"orderable": false, "targets": 0, 'class': "text-center"}

            ],
            'rowCallback': function (nRow) {
                prepareEvents(nRow);
            }
        });


    }


    /**
     * @private
     * @desc Prepara los eventos sobre los elementos del mapa para vectores
     **/
    function prepareEvents(nRow) {

        $(nRow).find("[data-rel=\"tooltip\"]").tooltip({'container': "body"});

        $(nRow).find("[data-vector-action='reload']").click(function () {
            var targetCode = $(this).attr('data-vector-code');
            var layer = getVectorLayerByProperty("code", targetCode);
            layer.setSource(layer.get("customSource"))

        });

        $(nRow).find("[data-vector-action='animate']").click(function () {

            var targetCode = $(this).attr('data-vector-code');
            var type =  $(this).attr('data-type');

            if(type == "play") {

                //  UI.MapVectorAnimation.stopAnimation(false);

                var map = mapUtils.getMap();

                var layer = getVectorLayerByProperty("code", targetCode);
                var lineString = getVectorFeaturesCollection(layer).filter(function (f) {
                    if (f.getGeometry().getType() == "LineString" && f.get("_type") == config.routeLayerTypes.COMPACTA) return f;
                });
                if(lineString.length > 0 )
                {

                    $(this).attr('data-type', "stop");
                    $(this).find("i").removeClass("fa-play")
                    $(this).find("i").addClass("fa-stop")
                    var coordinates = lineString[0].getGeometry().getCoordinates();
                    UI.MapVectorAnimation.startAnimation(coordinates, layer);
                }

            }
            else if(type=="stop")
            {

                $(this).attr('data-type', "play");
                $(this).find("i").removeClass("fa-stop")
                $(this).find("i").addClass("fa-play")
                 UI.MapVectorAnimation.stopAnimation(false);
            }
        });


        $(nRow).find("[data-vector-action='viewHideRoutePart']").click(function () {

            var targetCode = $(this).attr('data-vector-code');
            var dataType = $(this).attr('data-type');
            var firstExtend = false;
            var layer = getVectorLayerByProperty("code", targetCode);

            var originalFeatures = getVectorFeaturesCollection(layer).filter(function (f) {
                if (f.getGeometry().getType() == "LineString" && f.get("_type") == dataType)
                    return f;
                if (f.getGeometry().getType() == "Point" && typeof f.get('_lineString') != 'undefined')
                    if ($.inArray(dataType, f.get('_lineString'))) return f;
            }).forEach(function (feat, idx, a) {
                feat.setStyle(GetStyleHiddenVisibleForFeature(feat))
            });

            //layer.setVisible(!layer.getVisible());

            if ($(this).hasClass("btn-success")) {
                $(this).removeClass("btn-success");
                $(this).addClass("btn-danger");
            }
            else {
                $(this).removeClass("btn-danger");
                $(this).addClass("btn-success");
            }
        });

        //Visualizar los puntos
        $(nRow).find("[data-vector-action='view']").click(function () {

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
        $(nRow).find("[data-vector-action='showListInfo']").click(function () {
            $('#vector-switcher-content').toggleClass('open');

            var targetCode = $(this).attr('data-vector-code');

            var layer = getVectorLayerByProperty('code', targetCode);

            var callback = layer.get('showFeaturesInfoCallback');

            callback(targetCode)
        });


        //Fit to Extend sobre los puntos de la capa
        $(nRow).find("[data-vector-action='fixToExtend']").click(function () {

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

        getVectorLayers().forEach(function (lyr, idx, a) {
            if (lyr.get(propertyName) === propertyValue)
                currentLayer = lyr;
        });
        return currentLayer;
    }

    /**
     * @private Crea un contendedor de info de capa Listado para la capa
     * @desc
     **/
    function CreateInfoDetailContainer(code) {

        //Contendedor de info de capa Listado
        if ($('#vector-info-detail-content-' + code).length == 0) {
            var strInfoDetailContentForLayer = "<div id='vector-info-detail-content-" + code + "' class='vector-info-detail-content'>";
            strInfoDetailContentForLayer += "<div data-content='fixed-content'></div>";
            strInfoDetailContentForLayer += "<div data-content='dynamic-content'><!-- Generado por javascript --></div>";
            strInfoDetailContentForLayer += "</div>";
            $('.vector-switcher .btn-group').append(strInfoDetailContentForLayer);

        }
    }

    /**
     * @private
     * @desc Extrae parámetros de la llamada, establece paráemtros por defecto, comprueba errores
     **/
    function CheckLayerOptions(layerOptions) {
        var returnLayerOptions =
        {
            'url': '',
            'title': '',
            'code': '',
            'type': undefined,
            'style': getDefaultStyle(),
            'styleSelectInteraction': getDefaultSelectInteractionStyle(),
            'loadInInit':true,
            'showFeatureOverlayCallback': function () {
            },
            'showFeaturesInfoCallback': showFeatureListInfo,
            'visibleInSwitcher': true,
            'showListInfoButton': true,
            'propertiesShowInLabels': undefined,
            'zoomToShowPoints': 0,
            'zoomToShowLabels': 4,
            //Me quedo en la vista
            'pointOverlayZoom': undefined,
            'showPoints': true,
            'showLabels': true,
            'fitExtenxAfterLoad': false

        };


        //Comprobamos parámetros de entrada
        //Title
        if (typeof layerOptions.title === 'undefined' || layerOptions.title == '')
            throw new Error("Define 'title' de la capa");
        else
            returnLayerOptions.title = layerOptions.title;
        //type
        if (typeof layerOptions.type === 'undefined' || layerOptions.type == '')
            throw new Error("Define tipo de la capa");
        else
            returnLayerOptions.type = layerOptions.type;
        //code
        if (typeof layerOptions.code === 'undefined' || layerOptions.code == '')
            throw new Error("Define código de la capa");
        else
            returnLayerOptions.code = layerOptions.code;
        //url
        if (typeof layerOptions.url === 'undefined' || layerOptions.url == '')
            throw new Error("Define url de la capa");
        else
            returnLayerOptions.url = layerOptions.url;

        if (typeof layerOptions.showFeatureOverlayCallback !== 'undefined')
            returnLayerOptions.showFeatureOverlayCallback = layerOptions.showFeatureOverlayCallback;

        if (typeof layerOptions.showFeaturesInfoCallback !== 'undefined')
            returnLayerOptions.showFeaturesInfoCallback = layerOptions.showFeaturesInfoCallback;
        else
        //style
        if (typeof layerOptions.propertiesShowInLabels !== 'undefined')
            returnLayerOptions.propertiesShowInLabels = layerOptions.propertiesShowInLabels;

        //style
        if (typeof layerOptions.style !== 'undefined')
            returnLayerOptions.style = layerOptions.style;
        //styleSelectInteraction
        if (typeof layerOptions.styleSelectInteraction !== 'undefined')
            returnLayerOptions.styleSelectInteraction = layerOptions.styleSelectInteraction;
        //visibleInSwitcher
        if (typeof layerOptions.visibleInSwitcher !== 'undefined')
            returnLayerOptions.visibleInSwitcher = layerOptions.visibleInSwitcher;
        //showListInfoButton
        if (typeof layerOptions.showListInfoButton !== 'undefined')
            returnLayerOptions.showListInfoButton = layerOptions.showListInfoButton;

        //zoomToShowPoints
        if (typeof layerOptions.zoomToShowPoints !== 'undefined')
            returnLayerOptions.zoomToShowPoints = layerOptions.zoomToShowPoints;
        //zoomToShowLabels
        if (typeof layerOptions.zoomToShowLabels !== 'undefined')
            returnLayerOptions.zoomToShowLabels = layerOptions.zoomToShowLabels;
        //pointOverlayZoom
        if (typeof layerOptions.pointOverlayZoom !== 'undefined')
            returnLayerOptions.pointOverlayZoom = layerOptions.pointOverlayZoom;
        //showPoints
        if (typeof layerOptions.showPoints !== 'undefined')
            returnLayerOptions.showPoints = layerOptions.showPoints;
        //showLabels
        if (typeof layerOptions.showLabels !== 'undefined')
            returnLayerOptions.showLabels = layerOptions.showLabels;
        if (typeof layerOptions.fitExtenxAfterLoad !== 'undefined')
            returnLayerOptions.fitExtenxAfterLoad = layerOptions.fitExtenxAfterLoad;

        if (typeof layerOptions.loadInInit !== 'undefined')
            returnLayerOptions.loadInInit = layerOptions.loadInInit;
        return returnLayerOptions;
    }

    /**
     * @public
     * @desc Inicializa el vector trayéndose el GeoJson
     * @param  {paramOptions} Opciones ver customLayerConfig
     **/
    function loadGeoJSONData(paramOptions) {
        if (paramOptions) {

            //Compueba opciones, devuelve opciones por defecto
            var options = CheckLayerOptions(paramOptions);


            //Crea un contenedor para la la capa de listado
            CreateInfoDetailContainer(paramOptions.code);


            var source = new ol.source.Vector({
                // url: url,
                //format: new ol.format.GeoJSON()
                loader: ol.featureloader.loadFeaturesXhr(options.url, new ol.format.GeoJSON(), function (features) {
                    var tempFeatures = features;


                    //Añade id y nombre de la capa a las features
                    tempFeatures = AddSomeFeatureProperties(tempFeatures, options.code);

                    //Sólo capas de ruta

                    if (options.type === config.layerType.ROUTE) {

                        tempFeatures = addArrowsToLineString(tempFeatures, options.code);
                    }


                    this.addFeatures(tempFeatures);
                    renderVectorSwitcher();
                    //FitExtendOnLoad
                    if (options.fitExtenxAfterLoad)
                        if (tempFeatures.length > 0) {
                            mapUtils.getMap().getView().fit(this.getExtent(), mapUtils.getMap().getSize(), {"maxZoom": options.pointOverlayZoom});

                        }


                })
            });

            //Elemento base para el overlay sobre las features

            var overlayFeatureInfo = UI.Overlay.createBaseOverlay(options.code);


            var vectorLayer = new ol.layer.Vector({
                //resolución a la que empiezan a aparecer los puntos, sólo para capas de puntos
                updateWhileInteracting: true,
                maxResolution: options.type == config.layerType.POINT ? mapUtils.getResolutionByZoom(options.zoomToShowPoints) : undefined,
                source: options.loadInInit ? source : null,
                'loadInInit' : options.loadInInit,
                'customSource' : source,
                'title': options.title,
                'type': config.internalLayerType.VECTOR,
                'customType': options.type,
                'code': options.code,
                'overlayFeatureInfo': overlayFeatureInfo,
                style: options.type == config.layerType.POINT ? layerStyleFunctionForPointsLayers : LayerStyleFunctionForRouteLayers,
                'defaultStyle': options.style,
                'styleSelectInteraction': options.styleSelectInteraction,
                'visibleInSwitcher': options.visibleInSwitcher,
                'showListInfoButton': options.showListInfoButton,
                'showFeaturesInfoCallback': options.showFeaturesInfoCallback,
                'showFeatureOverlayCallback': options.showFeatureOverlayCallback,
                'propertiesShowInLabels': options.propertiesShowInLabels,
                'showLabels': options.showLabels,
                'showPoints': options.showPoints,
                'zoomToShowPoints': options.zoomToShowPoints,
                'zoomToShowLabels': options.zoomToShowLabels,
                'pointOverlayZoom': options.pointOverlayZoom
            });



            //Asignamos el vector al mapa
            mapUtils.getMap().addLayer(vectorLayer);

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
        if(layer.getSource())
              return layer.getSource().getFeatures();
        return [];
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
        if(source)
        {
            extent = source.getExtent();

            map.getView().fit(extent, map.getSize(), {"maxZoom": 19});
        }

    }

    return {
        loadGeoJSONData: loadGeoJSONData,
        addVector: addVector,
        getVectorLayerByProperty: getVectorLayerByProperty,
        removeVectorLayerByProperty: removeVectorLayerByProperty,
        getVecorLayerSource: getVecorLayerSource,

        fitToExtend: fitToExtend,
        getVectorFeaturesCollection: getVectorFeaturesCollection,
        showPointsInChangeResolution: showPointsInChangeResolution,
        getVectorLayers: getVectorLayers
    }
})(UI.Map, UI.MapConfig);