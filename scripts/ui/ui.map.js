/**
 * Created by jose on 20/2/16.
 */
UI = window.UI || {};

/**
 * @desc Herramientas de mapas openlayers
 **/
UI.Map = (function () {

    var _currentMap;

    /**
    * @public
    * @desc Devuelve la vista asociada al mapa
    **/
    function getView()
    {
        return _currentMap.getView();
    }

    /**
     * @public
     * @desc devuelve el mapa de openlayers
     **/
    function getMap() {
        return _currentMap;
    }





    /**
     * @public
     * @desc Inicializa el mapa con los tiles por defecto
     **/
    function init(mapId) {

        var map = new ol.Map({
            // use OL3-Google-Maps recommended default interactions
            interactions: olgm.interaction.defaults(),
            layers: UI.MapBaseLayer.defaultBaseMaps(),
            //Vista por defecto, centrada en la península
            view: new ol.View({
                center: ol.proj.fromLonLat( [-3.7058977,40.4169601]),
                zoom: 6
            }),

            target: mapId

        });

       //Controles por defecto del map


        map.addControl(new ol.control.ZoomSlider());
        map.addControl(new ol.control.FullScreen());
        map.addControl(new ol.control.OverviewMap());

        var olGM = new olgm.OLGoogleMaps({ map: map }); // map is the ol.Map instance
        olGM.activate();

        _currentMap = map;

        UI.MapBaseLayer.renderTileSwitcher();


        return map;


    }


    return {
        init: init,
        getMap: getMap,

    }
})();