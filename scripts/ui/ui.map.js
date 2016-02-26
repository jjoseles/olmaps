/**
 * Created by jose on 20/2/16.
 */
UI = window.UI || {};

/**
 * @desc Herramientas de mapas openlayers
 **/
UI.Map = (function () {

    var _currentMap;

    function mapGlobalEvents(){
        _currentMap.on('pointermove', function(event) {
            var coord3857 = event.coordinate;
            var coord4326 = ol.proj.transform(coord3857, 'EPSG:3857', 'EPSG:4326');

            $('#mouse3857').text(ol.coordinate.toStringXY(coord3857, 2));
            $('#mouse4326').text(ol.coordinate.toStringXY(coord4326, 4));
        });

        // Sólo con interaccion con featureOverlay

       _currentMap.on('pointermove', function(evt) {
            if (evt.dragging) {
                return;
            }

            UI.FeatureOverlay.showHidePointer(evt);
        });

       _currentMap.on('click', function(evt) {

            UI.FeatureOverlay.displayFeatureInfo(evt);

        });




    }


    function globalEvents(){
        $('[data-rel=tooltip]').tooltip({
            container: 'body'
        });
        $('.map-info-panel-button').click(function () {
            $('.map-info-panel-content').toggle();
        });
        $(".export-button").click(function () {

            _currentMap.once('postcompose', function(event) {
                var canvas = event.context.canvas;
                $(".export-button").attr("href", canvas.toDataURL('image/png'));
            });
            _currentMap.renderSync();
        });
    }


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
            interactions:  ol.interaction.defaults({mouseWheelZoom:false}),
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
        //El control fs no funciona bién con el position fixed
        //map.addControl(new ol.control.FullScreen());
        map.addControl(new ol.control.OverviewMap());

        var olGM = new olgm.OLGoogleMaps({ map: map }); // map is the ol.Map instance
        olGM.activate();

        _currentMap = map;

        UI.MapBaseLayer.renderTileSwitcher();

        mapGlobalEvents();

        globalEvents();
        return map;


    }


    return {
        init: init,
        getMap: getMap

    }
})();