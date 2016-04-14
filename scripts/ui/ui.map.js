/**
 * Created by jose on 20/2/16.
 */
UI = window.UI || {};

/**
 * @desc Herramientas de mapas openlayers
 **/
UI.Map = (function (config) {


    var _currentMap;


    /**
     * @public
     * @desc obtiene la resolución a patir del zoom
     **/
    function getResolutionByZoom(zoom) {
        return config.resolutionInZeroZoom / Math.pow(2, zoom);
    }

    /**
     * @private
     * @desc Eventos sobre elementos del mapa
     **/
    function mapGlobalEvents() {
        //información de coordenadas
        _currentMap.on('pointermove', function (event) {
            if (event.dragging) {
                return;
            }

            UI.Feature.showHidePointer(event);

            var coord3857 = event.coordinate;
            var coord4326 = ol.proj.transform(coord3857, 'EPSG:3857', 'EPSG:4326');

            $('#mouse3857').text(ol.coordinate.toStringXY(coord3857, 2));
            $('#mouse4326').text(ol.coordinate.toStringXY(coord4326, 4));
        });
        //Click sobre las features
        _currentMap.on('click', function (event) {
            var feature = _currentMap.forEachFeatureAtPixel(event.pixel, function (feature) {
                return feature;
            });

            if (feature)
            {
                //Sólo puntos
                if(feature.getGeometry().getType() == 'Point')
                     UI.Feature.displayFeatureInfo(feature, _currentMap,event.coordinate);
            }



        });



        _currentMap.getView().on('propertychange', function(e) {
            var view = e.target;


            switch (e.key) {

                case 'center':
                case 'resolution':
                        //Calculamos el extend de la vista


                    UI.MapVector.showPointsInChangeResolution(view.getZoom(), view.calculateExtent(_currentMap.getSize()));
                    //mostrar puntos
                    _currentMap.render();
                    break;
            }
        });
    }

    /**
     * @private
     * @desc Eventos sobre elementos no openlayers
     **/
    function globalEvents(createPointCallback) {
        $('[data-rel=tooltip]').tooltip({
            container: 'body'
        });
        $('.map-info-panel-button').click(function () {
            $('.map-info-panel-content').toggle();
        });
        //Exportación
        $(".export-button").click(function () {

            _currentMap.once('postcompose', function (event) {

                var canvas = event.context.canvas;
                $(".export-button").attr("href", canvas.toDataURL('image/png'));
            });
            _currentMap.renderSync();
        });
        //Crear punto sobre el mapa
        $(".poi-button").click(function () {
            UI.Interactions.addSelectPointInteraction(createPointCallback);
        });
        //Vector switcher
        $('.vector-switcher button').click(function(e){

           e.preventDefault();
            $('#vector-switcher-content').toggleClass('open');
            //Vaciamos detalles

            $("[data-content='dynamic-content']").empty();
            $('.vector-info-detail-content').removeClass('open');
            _currentMap.renderSync();

        })
    }


    /**
     * @public
     * @desc Devuelve la vista asociada al mapa
     **/
    function getView() {
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
     * @desc {array} array de latitud,longitud en decimal [16.3725, 48.208889]
     **/
    function setCenter(center)
    {
        var pos = ol.proj.fromLonLat(center);
        _currentMap.getView().setCenter(pos);
    }
    /**
     * @public
     * @desc Inicializa el mapa con los tiles por defecto
     **/
    function init(mapId, createPointCallback) {


        var map = new ol.Map({
            // use OL3-Google-Maps recommended default interactions
            interactions: ol.interaction.defaults({mouseWheelZoom: true}),
            loadTilesWhileAnimating: true,
            layers: UI.MapBaseLayer.defaultBaseMaps(),
            //Vista por defecto, centrada en la península
            view: new ol.View({
                center: ol.proj.fromLonLat([-3.7058977, 40.4169601]),
                zoom: 6,
                minZoom: 5
            }),

            target: mapId,

        });



        //Controles por defecto del map

        map.addControl(new ol.control.ZoomSlider());
        //El control fs no funciona bién con el position fixed
        //map.addControl(new ol.control.FullScreen());
        //El overview no funciona en ventanas modales
        //map.addControl(new ol.control.OverviewMap());

        var scaleLineControl = new ol.control.ScaleLine();
        scaleLineControl.setUnits(ol.control.ScaleLineUnits.METRIC);
        map.addControl(scaleLineControl);

        var olGM = new olgm.OLGoogleMaps({map: map}); // map is the ol.Map instance
        olGM.activate();

        var gmap = olGM.getGoogleMapsMap();

        var trafficLayer = new google.maps.TrafficLayer();
        trafficLayer.setMap(gmap);

        _currentMap = map;

        UI.MapBaseLayer.renderTileSwitcher();


        mapGlobalEvents();

        globalEvents(createPointCallback);


        return map;


    }


    return {
        init: init,
        getMap: getMap,
        setCenter: setCenter,
        getResolutionByZoom: getResolutionByZoom

    }
})(UI.MapConfig);