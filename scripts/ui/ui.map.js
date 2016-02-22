/**
 * Created by jose on 20/2/16.
 */
UI = window.UI || {};

/**
 * @desc Herramientas de mapas openlayers
 **/
UI.map = (function () {

    var _currentMap;

    /**
     * @public
     * @desc devuelve el mapa de openlayers
     **/
    function getMap() {
        return _currentMap;
    }

    /**
     * @public
     * @desc devuelve una capa basada en el nombre
     **/
    function getLayerByName(layerName)
    {
        _currentMap.getLayers().forEach(function (grp, idx, a) {
            grp.getLayers().forEach(function (lyr, idx, a) {
                if (lyr.get('title') === layerName)
                   return lyr;
            });
        });
    }
    /**
     * @private
     * @desc Renderiza la lista de tiles para el mapa
     **/
    function renderTileSwitcher()
    {
            _currentMap.getLayers().forEach(function (lyr, idx, a) {
                $("#map-tile-selection").append("<li><a href='javascript:' data-map-name='" + lyr.get('name') + "'>" +
                    lyr.get('title') + "</a></li>");
            });

    }
    /**
     * @private
     * @desc Prepara los eventos sobre los elementos del mapa
     **/
    function prepareEvents() {
        //Selección del base map
        $('[data-map-name]').click(function () {

            var targetTile = $(this).attr('data-map-name');
            var targetLi = $(this).closest('li');
            var targetText = $(this).text();
            var inverseContentMode = false;
            $('#map-tile-selection li').not(targetLi).removeClass('active');

            $(targetLi).addClass('active');


                _currentMap.getLayers().forEach(function (lyr, idx, a) {

                    if (lyr.get('name') === targetTile) {
                        lyr.setVisible(true);
                    } else {
                        lyr.setVisible(false);
                    }
                });

        });

    }

    /**
     * @private
     * @desc Tiles por defecto para el mapa
     **/
    function defaultBaseMaps() {

        return [
            new ol.layer.Tile({
                    title: "Open Street Map",
                    name: "OSM",
                    type: "base",
                    visible: true,
                    source: new ol.source.OSM()
                }),
                new ol.layer.Tile({
                    title: "BingMaps Aereal",
                    type: "base",
                    name: "BING_AEREAL",
                    visible: false,
                    source: new ol.source.BingMaps({
                        culture:"es-es",
                        imagerySet: "Aerial",
                        key: "AmmSA7tKit_tgOFp7a1EUsrk5vPDb7BCud4Zm893Q-173mejBtEZGAUt95TYGdrl",
                    })
                }),
                new ol.layer.Tile({
                    title: "BingMaps road",
                    type: "base",
                    name: "BING_ROAD",
                    visible: false,
                    source: new ol.source.BingMaps({
                        culture:"es-es",
                        imagerySet: "Road",
                        key: "AmmSA7tKit_tgOFp7a1EUsrk5vPDb7BCud4Zm893Q-173mejBtEZGAUt95TYGdrl",
                    })
                }),
                new ol.layer.Tile({
                    title: "MapQuest Satellite",
                    type: "base",
                    name:"MAPQUEST",
                    visible: false,
                    source: new ol.source.MapQuest({
                        layer: "sat"
                    })
                }),
                new ol.layer.Tile({
                    title: "MapQuest OSM",
                    type: "base",
                    name:"MAPQUEST_OSM",
                    visible: false,
                    source: new ol.source.MapQuest({
                        layer: "osm"
                    })
                }),
                new ol.layer.Tile({
                    title: "MapQuest Hyb",
                    type: "base",
                    name:"MAPQUEST_HYB",
                    visible: false,
                    source: new ol.source.MapQuest({
                        layer: "hyb"
                    })
                }),
                //Siempre visible aunque no esté por defecto en inicio, porque si no no carga
                new olgm.layer.Google({
                    title: "Google Road",
                    name:"GOOGLE_ROAD",
                    visible: true,
                    mapTypeId:google.maps.MapTypeId.ROADMAP
                }),
                new olgm.layer.Google({
                    title: "Google Satellite",
                    name:"GOOGLE_SAT",
                    visible: true,
                    mapTypeId:google.maps.MapTypeId.SATELLITE
                })
            ];
    }

    /**
     * @public
     * @desc Inicializa el mapa con los tiles por defecto
     **/
    function init(mapId) {

        var map = new ol.Map({
            // use OL3-Google-Maps recommended default interactions
            interactions: olgm.interaction.defaults(),
            layers: defaultBaseMaps(),
            //Vista por defecto, centrada en la península
            view: new ol.View({
                center: [-2.6865266, 40.2398021],
                zoom: 6
            }),
            controls: ol.control.defaults({ attribution: false }).extend( new ol.control.Attribution({
                collapsible: false
            })),
            target: mapId

        });

       //Controles por defecto del map


        map.addControl(new ol.control.ZoomSlider());
        map.addControl(new ol.control.FullScreen());
        map.addControl(new ol.control.OverviewMap());

        var olGM = new olgm.OLGoogleMaps({ map: map }); // map is the ol.Map instance
        olGM.activate();

        _currentMap = map;

        renderTileSwitcher();
        prepareEvents();
        return map;


    }


    return {
        init: init,
        getMap: getMap,
        getLayerByName : getLayerByName
    };
})();