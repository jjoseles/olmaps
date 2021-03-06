/**
 * Created by Neo-Si02 on 26/02/2016.
 */
UI = window.UI || {};

/**
 * @desc Overlays simples, sin geoJson
 **/
UI.Overlay = (function (mapUtils) {

    /**
     * @private
     * @desc Crea un overlay para visualizar el popover
     **/
    function createTooltipOverlay(feat) {

        var existElement = $("#" + feat.getId() + ".tooltip-point-info.tooltip-static").length > 0;
        if(!existElement) {
            var element = document.createElement('div');
            $(element).attr("id", feat.getId());
            $(element).addClass("tooltip-point-info tooltip-static");

            var simpleInfoHtml = "";
            var layer = UI.MapVector.getVectorLayerByProperty('code',  feat.get('_layerCode'));

            layer.get('propertiesShowInLabels').forEach(function (prop) {
                simpleInfoHtml += feat.get(prop) + "<br/>"
            });

            simpleInfoHtmlDivider = UI.MapUtils.stringDivider(simpleInfoHtml, 25, '<br/>')
            var addOverlay = true;
            var labelColor = layer.get('labelColor');
            if(labelColor == "") {
                if (feat.getStyle() != null) {
                    if (feat.getStyle().getImage() instanceof ol.style.Icon) {
                        labelColor = layer.get("defaultStyle").getStroke().getColor();

                    }
                    else    labelColor = feat.getStyle().getImage().getFill().getColor();
                } else if (feat.get("_defaultStyle") != null) {
                    if (feat.get("_defaultStyle").getImage() instanceof ol.style.Icon) {
                        labelColor = layer.get("defaultStyle").getStroke().getColor();

                    }

                    else  labelColor = feat.get("_defaultStyle").getImage().getFill().getColor();


                } else {
                    labelColor = layer.get("defaultStyle").getImage().getFill().getColor();
                }
            }
            if (labelColor == "rgba(0,0,0,0)") addOverlay = false;


            if(addOverlay) {

                var labelTextColor = layer.get('labelTextColor');
                if(labelTextColor != "")
                    $(element).attr("style", " background-color:" + labelColor + ";color:" + labelTextColor);
                else $(element).attr("style", " background-color:" + labelColor);
                element.innerHTML = simpleInfoHtmlDivider;
                //  marker
                var marker = new ol.Overlay({
                    id: feat.getId(),
                    element: element,
                    offset: [0, -15],
                    positioning: 'bottom-center',
                    position: feat.getGeometry().getCoordinates()
                });
                mapUtils.getMap().addOverlay(marker);
            }
        }


        return marker;


    }
    /**
     * @private
     * @desc Borra todos los tooltips de una capa
     **/
    function removeTooltipOverlay(feat)
    {
        var map = mapUtils.getMap();
        var overlay = map.getOverlayById(feat.getId());
        if(overlay)
            map.removeOverlay(overlay);
        map.render();
    }
    /**
     * @private
     * @desc Crea un overlay para visualizar el popover
     **/
    function createBaseOverlay(code) {
        var elem = document.createElement('div');
        elem.setAttribute('id', code);
        var popup = new ol.Overlay({
            element: elem,
            positioning: 'center-center',
            stopEvent: false,
            id:"overlayFeatureInfo"


        });
        mapUtils.getMap().addOverlay(popup);
        return popup;


    }
    /**
     * @public
     * @desc Añade un punto al mapa y centra el mapa en ese punto. Puntos basados en estilos
     * @param {array} center  [lat,lon]
     * @param {string} styleId clase de estilo asignada al punto
     * @param {function} callback function. Función de callback en el click
     * @param {object} data . Objeto key-value. Se asignarán data atributes para key
     **/
    function addOverlayPoint(center, styleId, callback) {
        var pos = ol.proj.fromLonLat(center);

        //Creamos elemento al vuelo y asignamos click
        var elem = document.createElement('div');
        elem.setAttribute('class', styleId);
        if (callback) {
            $(elem).on('click', function (evt) {
                callback(evt)
            });
        }

        //Asignamos atributos al elemento
        /*/if (data) {
            for (var k in data) {
                elem.setAttribute('data-' + k, data[k]);
            }
         }*/

        //  marker
        var marker = new ol.Overlay({
            position: pos,
            positioning: 'center-center',
            element: elem,
            stopEvent: false
        });

        mapUtils.getMap().addOverlay(marker);


    }



    return {
      //  addOverlayPoint: addOverlayPoint,

        createBaseOverlay:createBaseOverlay,
        createTooltipOverlay:createTooltipOverlay,
        removeTooltipOverlay: removeTooltipOverlay
    }
})(UI.Map);