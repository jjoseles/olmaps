/**
 * Created by jose on 20/2/16.
 */
UI = window.UI || {};

/**
 * @desc Herramientas de mapas openlayers
 **/
UI.MapVector = (function (mapUtils) {

    var image = new ol.style.Circle({
        radius: 5,
        fill: null,
        stroke: new ol.style.Stroke({color: 'red', width: 1})
    });

    var styles = {
        'Point': new ol.style.Style({
            image: image
        }),
        'LineString': new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'green',
                width: 1
            })
        }),
        'MultiLineString': new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'green',
                width: 1
            })
        }),
        'MultiPoint': new ol.style.Style({
            image: image
        }),
        'MultiPolygon': new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'yellow',
                width: 1
            }),
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 0, 0.1)'
            })
        }),
        'Polygon': new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'blue',
                lineDash: [4],
                width: 3
            }),
            fill: new ol.style.Fill({
                color: 'rgba(0, 0, 255, 0.1)'
            })
        }),
        'GeometryCollection': new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'magenta',
                width: 2
            }),
            fill: new ol.style.Fill({
                color: 'magenta'
            }),
            image: new ol.style.Circle({
                radius: 10,
                fill: null,
                stroke: new ol.style.Stroke({
                    color: 'magenta'
                })
            })
        }),
        'Circle': new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'red',
                width: 2
            }),
            fill: new ol.style.Fill({
                color: 'rgba(255,0,0,0.2)'
            })
        })
    };
    /**
     * @private
     * @desc Renderiza el selector de vectores
     **/
    function renderVectorSwitcher()
    {
        $("#map-vector-selection").empty();

        mapUtils.getMap().getLayers().forEach(function (lyr, idx, a) {
            //Solo capas de vectores
            if(lyr.get('type') === 'vector') {
                $("#map-vector-selection").append("<li><a href='javascript:' data-vector-name='" + lyr.get('title') + "'>" +
                    lyr.get('title') + "</a></li>");
            }
        });
        $(".vector-switcher").show();
        prepareEvents();

    }
    /**
     * @private
     * @desc Prepara los eventos sobre los elementos del mapa para vectores
     **/
    function prepareEvents() {
        //Selección del base map
        $('[data-vector-name]').click(function () {

            var targetTile = $(this).attr('data-vector-name');
            var targetLi = $(this).closest('li');
            var targetText = $(this).text();
            var inverseContentMode = false;
            $('#map-vector-selection li').not(targetLi).removeClass('active');

            $(targetLi).addClass('active');
            mapUtils.getMap().getLayers().forEach(function (lyr, idx, a) {
                //Solo los mapas base
                if(lyr.get('type') === 'vector') {
                    console.log(targetTile);
                    if (lyr.get('title') === targetTile) {
                        lyr.setVisible(true);
                    } else {
                        lyr.setVisible(false);
                    }
                }
            });


        });



    }

    /**
     * @public
     * @desc Inicializa el vector trayéndose el GeoJson
     **/
    function loadGeoJSONData(url,name)
    {
        var vectorLayer = new ol.layer.Vector({
            source: new ol.source.Vector({
                url: url,
                format: new ol.format.GeoJSON()
            }),
            'title': name,
            'type': 'vector'
        });
        //Asignamos el vector al mapa
        mapUtils.getMap().addLayer(vectorLayer);
        //Renderizamos el botoón de vectores
        renderVectorSwitcher();




    }
    /**
     * @public
     * @desc Inicializa el vector trayéndose el GeoJson
     * renderizando un mapa caliente
     **/
    function LoadGeoJSONDataAsHeatMap(url,name)
    {
        var vectorLayer = new ol.layer.Heatmap({
            source: new ol.source.Vector({
                url: url,
                format: new ol.format.GeoJSON()
            }),
            'title': name,
            'type': 'vector',
            weight : function(e) {

                return 2;
            },
            blur: parseInt(5, 10),
            radius: parseInt(5, 10)
        });
        //Asignamos el vector al mapa
        mapUtils.getMap().addLayer(vectorLayer);
        //Renderizamos el botoón de vectores
        renderVectorSwitcher();



    }
    return {
        loadGeoJSONData: loadGeoJSONData,
        LoadGeoJSONDataAsHeatMap: LoadGeoJSONDataAsHeatMap
    }
})(UI.Map);