/**
 * Created by Neo-Si02 on 26/02/2016.
 */
UI = window.UI || {};

UI.Feature = (function (mapUtils) {

    /**
     * @public
     * @desc Añade un punto al mapa y centra el mapa en ese punto. Puntos basados en estilos
     **/
    function addOverlayPoint(center,styleId) {
        var pos = ol.proj.fromLonLat(center);

        // Vienna marker
        var marker = new ol.Overlay({
            position: pos,
            positioning: 'center-center',
            element: document.getElementById(styleId),
            stopEvent: false
        });

        mapUtils.getMap().addOverlay(marker);

        //Centra el mapa
        mapUtils.getMap().getView().setCenter(pos);

    }

    return {
        addOverlayPoint: addOverlayPoint


    }
})(UI.Map);