/**
 * Created by jose on 20/2/16.
 */
UI = window.UI || {};

/**
 * @desc Herramientas de mapas openlayers
 **/
UI.MapBaseLayer = (function (mapUtils) {

    /**
     * @private
     * @desc Pone a visible las capas de google. Tienen que estar en la inicialización
     * visibles porque si no no renderiza en mapa. Las ponemos invisibles cuando
     * arranque la carga inicial del mapa
     **/
    function setGoogleLayersVisibility(visible) {
        getLayerByName("GOOGLE_ROAD").setVisible(visible);
        getLayerByName("GOOGLE_HYBRID").setVisible(visible);
        getLayerByName("GOOGLE_ROAD_DARKRED").setVisible(visible);
        getLayerByName("GOOGLE_ROAD_COBALT").setVisible(visible);
    }
    /**
     * @public
     * @desc devuelve  la capa visible
     **/
    function getVisibleLayer()
    {
        mapUtils.getMap().getLayers().forEach(function (lyr, idx, a) {
                //Solo los mapas base
                if (lyr.get('type') === 'base') {
                    if(lyr.getVisible())
                    {
                        return lyr;
                    }
                }
            })
    }

    /**
     * @public
     * @desc devuelve una capa basada en el nombre
     **/
    function getLayerByName(layerName) {
        var currentLayer = null;
        mapUtils.getMap().getLayers().forEach(function (lyr, idx, a) {
            if (lyr.get('name') === layerName)
                currentLayer = lyr;
        });
        return currentLayer;
    }

    /**
     * @private
     * @desc Renderiza la lista de tiles para el mapa
     **/
    function renderTileSwitcher() {
        setGoogleLayersVisibility(false);
        mapUtils.getMap().getLayers().forEach(function (lyr, idx, a) {
            //Solo los mapas base
            if (lyr.get('type') === 'base') {
                var li = "<li";
                li += lyr.getVisible() ? " class='active'" : '';
                li+= "><a href='javascript:' data-map-name='" + lyr.get('name') + "'>" +
                    lyr.get('title') + "</a></li>";
                $("#map-tile-selection").append(li);

            }
        });
        prepareEvents();

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
            mapUtils.getMap().getLayers().forEach(function (lyr, idx, a) {
                //Solo los mapas base
                if (lyr.get('type') === 'base') {
                    if (lyr.get('name') === targetTile) {
                        lyr.setVisible(true);
                        if(lyr.get('name').indexOf("GOOGLE") > -1)
                            $('.export-button-area').hide();
                         else
                            $('.export-button-area').show();
                    } else {
                        lyr.setVisible(false);
                    }
                }
            });

        });

    }

    /**
     * @public
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
                title: "BingMaps Aerial WithL abels",
                type: "base",
                name: "BING_AEREAL",
                visible: false,
                source: new ol.source.BingMaps({
                    culture: "es-es",
                    maxZoom: 19,
                    imagerySet: "AerialWithLabels",
                    key: "AmmSA7tKit_tgOFp7a1EUsrk5vPDb7BCud4Zm893Q-173mejBtEZGAUt95TYGdrl",
                })
            }),
            new ol.layer.Tile({
                title: "BingMaps road",
                type: "base",
                name: "BING_ROAD",
                visible: false,
                source: new ol.source.BingMaps({
                    culture: "es-es",
                    imagerySet: "Road",
                    key: "AmmSA7tKit_tgOFp7a1EUsrk5vPDb7BCud4Zm893Q-173mejBtEZGAUt95TYGdrl",
                })
            }),

            new ol.layer.Tile({
                title: "MapQuest OSM",
                type: "base",
                name: "MAPQUEST_OSM",
                visible: false,
                source: new ol.source.MapQuest({
                    layer: "osm"
                })
            }),
            new olgm.layer.Google({
                title: "Google Road",
                name: "GOOGLE_ROAD",
                visible: true,
                type: "base",
                disableDefaultUI: true,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
               }),
            //Siempre visible aunque no esté por defecto en inicio, porque si no no carga
            new olgm.layer.Google({
                title: "Google Road - (Dark red)",
                name: "GOOGLE_ROAD_DARKRED",
                visible: true,
                type: "base",
                disableDefaultUI: true,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                styles : [{"featureType":"all","elementType":"all","stylers":[{"invert_lightness":true},{"saturation":10},{"lightness":10},{"gamma":0.8},{"hue":"#000000"}]},{"featureType":"water","stylers":[{"visibility":"on"},{"color":"#293036"}]}]
            }),

            new olgm.layer.Google({
                title: "Google Road - (Cobalt)",
                name: "GOOGLE_ROAD_COBALT",
                visible: true,
                type: "base",
                disableDefaultUI: true,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                styles : [{"featureType":"all","elementType":"all","stylers":[{"invert_lightness":true},{"saturation":10},{"lightness":10},{"gamma":0.8},{"hue":"#293036"}]},{"featureType":"water","stylers":[{"visibility":"on"},{"color":"#293036"}]}]
            }),

            new olgm.layer.Google({
                title: "Google Satellite - (Hybrid)",
                name: "GOOGLE_HYBRID",
                type: "base",
                visible: true,

                mapTypeId: google.maps.MapTypeId.HYBRID
            })
        ];
    }


    return {
        renderTileSwitcher: renderTileSwitcher,
        getLayerByName: getLayerByName,
        defaultBaseMaps: defaultBaseMaps,
        getVisibleLayer : getVisibleLayer,
        setGoogleLayersVisibility: setGoogleLayersVisibility
    };
})(UI.Map);