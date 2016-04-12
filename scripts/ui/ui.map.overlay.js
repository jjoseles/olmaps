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
    function createTooltipOverlay(code) {
        var element = document.createElement('div');
        $(element).addClass(code + "-tooltip-point-info");
        $(element).addClass("tooltip-point-info");
        //  marker
        var marker = new ol.Overlay({

            positioning: 'top-left',
            element: element,
            stopEvent: false
        });

        mapUtils.getMap().addOverlay(marker);

      return marker;
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
        addOverlayPoint: addOverlayPoint,

        createBaseOverlay:createBaseOverlay,
        createTooltipOverlay:createTooltipOverlay
    }
})(UI.Map);