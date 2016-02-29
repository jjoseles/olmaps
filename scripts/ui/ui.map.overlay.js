/**
 * Created by Neo-Si02 on 26/02/2016.
 */
UI = window.UI || {};

UI.Feature = (function (mapUtils) {

    /**
     * @public
     * @desc Añade un punto al mapa y centra el mapa en ese punto. Puntos basados en estilos
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