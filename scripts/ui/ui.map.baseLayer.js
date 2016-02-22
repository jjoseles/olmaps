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
    function setGoogleLayersAsNotVisible()
    {
        getLayerByName("GOOGLE_ROAD").setVisible(false);
        getLayerByName("GOOGLE_SAT").setVisible(false);
    }


    /**
     * @public
     * @desc devuelve una capa basada en el nombre
     **/
    function getLayerByName(layerName)
    {
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
    function renderTileSwitcher()
    {
        mapUtils.getMap().getLayers().forEach(function (lyr, idx, a) {
            $("#map-tile-selection").append("<li><a href='javascript:' data-map-name='" + lyr.get('name') + "'>" +
                lyr.get('title') + "</a></li>");
        });
        prepareEvents();
        setGoogleLayersAsNotVisible();
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
                if (lyr.get('name') === targetTile) {
                 // if (targetTile.indexOf("GOOGLE") >= 0)

                      //$('#' + mapUtils.getMap().get('target')).css('height',"98%");
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


    return {
        renderTileSwitcher: renderTileSwitcher,
        defaultBaseMaps: defaultBaseMaps,
        getLayerByName : getLayerByName

    };
})(UI.Map);