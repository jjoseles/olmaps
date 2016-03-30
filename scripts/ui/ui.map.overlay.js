/**
 * Created by Neo-Si02 on 26/02/2016.
 */
UI = window.UI || {};

/**
 * @desc Overlays simples, sin geoJson
 **/
UI.Overlay = (function (mapUtils) {

    /**
     * @public
     * @desc Añade un punto al mapa y centra el mapa en ese punto. Puntos basados en estilos
     * @param {array} center  [lat,lon]
     * @param {string} styleId clase de estilo asignada al punto
     * @param {function} callback function. Función de callback en el click
     * @param {object} data . Objeto key-value. Se asignarán data atributes para key
     **/
    function addOverlayPoint(center, styleId, callback, data) {
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
        if (data) {
            for (var k in data) {
                elem.setAttribute('data-' + k, data[k]);
            }
        }

        //  marker
        var marker = new ol.Overlay({
            position: pos,
            positioning: 'center-center',
            element: elem,
            stopEvent: false
        });

        mapUtils.getMap().addOverlay(marker);

        //Centra el mapa
        mapUtils.getMap().getView().setCenter(pos);

    }

    /**
     * @public
     * @desc Añade un overlay al mapa para posteriormente sacar info simple
     * @param {array} center  [lat,lon]

     **/
    function addOverlayPointTooltip( pointPostition, dataHtml,layerCode) {

        var element = document.createElement('div');
        $(element).addClass(layerCode + "-tooltip-point-info");
        $(element).addClass("tooltip-point-info");
        //  marker
        var marker = new ol.Overlay({
            position: pointPostition,
            positioning: 'top-left',
            element: element,
            stopEvent: false
        });

        mapUtils.getMap().addOverlay(marker);


        // the keys are quoted to prevent renaming in ADVANCED mode.
        $(element).popover({
            'placement': 'bottom',
            'animation': false,
            'html': true,
            'content': dataHtml
        });



    }

    return {
        addOverlayPoint: addOverlayPoint,
        addOverlayPointTooltip:addOverlayPointTooltip
    }
})(UI.Map);