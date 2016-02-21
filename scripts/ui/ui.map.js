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

    function getLayerByName(layerName)
    {
        _currentMap.getLayers().forEach(function (grp, idx, a) {
            grp.getLayers().forEach(function (lyr, idx, a) {
                console.log(lyr.get('title'))
                if (lyr.get('title') === layerName)
                   return lyr;

            });
        });
    }
    /**
     * @private
     * @desc Prepara los eventos sobre los elementos del mapa
     **/
    function prepareEvents() {
        //Selección del base map
        $('[data-map-tile]').click(function () {

            var targetTheme = $(this).attr('data-map-tile');
            var targetLi = $(this).closest('li');
            var targetText = $(this).text();
            var inverseContentMode = false;
            $('#map-tile-selection li').not(targetLi).removeClass('active');
            $('#map-tile-text').text(targetText);
            $(targetLi).addClass('active');

            _currentMap.getLayers().forEach(function (grp, idx, a) {
                grp.getLayers().forEach(function (lyr, idx, a) {
                    console.log(lyr.get('title'))
                    if (lyr.get('title') === targetTheme) {
                        lyr.setVisible(true);
                    } else {
                        lyr.setVisible(false);
                    }
                });
            });
        });

    }

    /**
     * @private
     * @desc Tiles por defecto para el mapa
     **/
    function defaultBaseMaps() {
        var baseMaps = new ol.layer.Group({
            'title': "Base maps",
            layers: [
                new ol.layer.Tile({
                    title: "Open Street Map",
                    type: "base",
                    visible: true,
                    source: new ol.source.OSM()
                }),
                new ol.layer.Tile({
                    title: "BingMaps Aereal",
                    type: "base",
                    visible: false,
                    source: new ol.source.BingMaps({
                        imagerySet: "Aerial",
                        key: "AmmSA7tKit_tgOFp7a1EUsrk5vPDb7BCud4Zm893Q-173mejBtEZGAUt95TYGdrl",

                    })
                }),
                new ol.layer.Tile({
                    title: "BingMaps road",
                    type: "base",
                    visible: false,
                    source: new ol.source.BingMaps({
                        imagerySet: "Road",
                        key: "AmmSA7tKit_tgOFp7a1EUsrk5vPDb7BCud4Zm893Q-173mejBtEZGAUt95TYGdrl",

                    })
                }),
                new ol.layer.Tile({
                    title: "MapQuest Satellite",
                    type: "base",
                    visible: false,
                    source: new ol.source.MapQuest({layer: "sat"})
                }),
                new ol.layer.Tile({
                    title: "MapQuest OSM",
                    type: "base",
                    visible: false,
                    source: new ol.source.MapQuest({layer: "osm"})
                })


            ]
        });
        return baseMaps;
    }

    /**
     * @public
     * @desc Inicializa el mapa con los tiles por defecto
     **/
    function init(mapId) {

        var map = new ol.Map({
            // use OL3-Google-Maps recommended default interactions
            interactions: olgm.interaction.defaults(),
            layers: [
                defaultBaseMaps(),
                //La capa base de gooble con olgm no puede ir en grupos
                //porque olgm hereda de o.Layer.Group
                //Siempre visible aunque no esté por defecto en inicio, porque si no no carga
                new olgm.layer.Google({
                    title: "Google",
                    visible: true


                })
            ],
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

        prepareEvents();
        _currentMap = map;
        return map;


    }


    return {
        init: init,
        getMap: getMap,
        getLayerByName : getLayerByName
    };
})();