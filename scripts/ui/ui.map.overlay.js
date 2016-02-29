/**
 * Created by Neo-Si02 on 26/02/2016.
 */
UI = window.UI || {};

UI.Overlay = (function (mapUtils) {

    /**
     * @public
     * @desc Añade un punto al mapa y centra el mapa en ese punto. Puntos basados en estilos
     * @param {center} array [lat,lon]
     * @param {styleId} string clase de estilo asignada al punto
     * @param {callback} function. Función de callback en el click
     * @param {data} {object}. Objeto key-value. Se asignarán data atributes para key
     **/
    function addOverlayPoint(center,styleId,callback,data) {
        var pos = ol.proj.fromLonLat(center);

        //Creamos elemento al vuelo y asignamos click
        var elem = document.createElement('div');
        elem.setAttribute('class', styleId);
        if(callback) {
            $(elem).on('click', function (evt) {
                callback(evt)
            });
        }

        //Asignamos atributos al elemento
        if(data)
        {
            for(var k in data) {
                elem.setAttribute('data-' + k, data[k]);
             }
        }

        // Vienna marker
        var marker = new ol.Overlay({
            position: pos,
            positioning: 'center-center',
            element: elem,
            stopEvent: false,
        });

        mapUtils.getMap().addOverlay(marker);

        //Centra el mapa
        mapUtils.getMap().getView().setCenter(pos);

    }

    return {
        addOverlayPoint: addOverlayPoint
    }
})(UI.Map);