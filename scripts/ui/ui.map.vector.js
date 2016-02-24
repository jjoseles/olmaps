/**
 * Created by jose on 20/2/16.
 */
UI = window.UI || {};

/**
 * @desc Herramientas de mapas openlayers
 **/
UI.MapVector = (function (mapUtils) {


    var style = new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0.6)'
        }),
        stroke: new ol.style.Stroke({
            color: '#319FD3',
            width: 1
        }),
        text: new ol.style.Text({
            font: '12px Calibri,sans-serif',
            fill: new ol.style.Fill({
                color: '#000'
            }),
            stroke: new ol.style.Stroke({
                color: '#fff',
                width: 3
            })
        })
    });

    /**
     * @private
     * @desc Renderiza el selector de vectores
     **/
    function renderVectorSwitcher() {
        $("#map-vector-selection").empty();

        mapUtils.getMap().getLayers().forEach(function (lyr, idx, a) {
            //Solo capas de vectores
            if (lyr.get('type') === 'vector') {

                var li = "<li";
                li += lyr.getVisible() ? " class='active'" : '';
                li+= "><a href='javascript:' data-vector-name='" + lyr.get('title') + "'>" +
                    lyr.get('title') + "</a></li>";
                $("#map-vector-selection").append(li);
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

           // $('#map-vector-selection li').not(targetLi).removeClass('active');



            mapUtils.getMap().getLayers().forEach(function (lyr, idx, a) {
                //Solo los vectores
                if (lyr.get('type') === 'vector') {

                    if (lyr.get('title') === targetTile) {

                        if($(targetLi).hasClass('active'))
                        {
                            lyr.setVisible(false);
                            $(targetLi).removeClass('active');
                        }
                        else
                        {
                            lyr.setVisible(true);
                            $(targetLi).addClass('active');
                        }

                    }
                }
            });


        });


    }



    /**
     * @public
     * @desc Inicializa el vector trayéndose el GeoJson
     **/
    function loadGeoJSONData(url, name) {
        var vectorLayer = new ol.layer.Vector({
            source: new ol.source.Vector({
                url: url,
                format: new ol.format.GeoJSON()
            }),
            'title': name,
            'type': 'vector',
            style: function(feature, resolution) {
                //DEvuelve el nombre de la feature y lo pinta en el mapa
                //style.getText().setText(resolution < 5000 ? feature.get('CITY_NAME') : '');
                return new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: 'rgba(255, 255, 255, 0.2)'
                    }),
                    stroke: new ol.style.Stroke({
                        color: '#ffcc33',
                        width: 2
                    }),
                    image: new ol.style.Circle({
                        radius: 7,
                        fill: new ol.style.Fill({
                            color: '#ffcc33'
                        })
                    })
                })
            }
        });
        //Asignamos el vector al mapa
        mapUtils.getMap().addLayer(vectorLayer);

        mapUtils.getMap().addLayer(UI.FeatureOverlay.addFeatureOverlay());
        //Renderizamos el botoón de vectores
        renderVectorSwitcher();


    }

    /**
     * @public
     * @desc Inicializa el vector trayéndose el GeoJson
     * renderizando un mapa caliente
     **/
    function LoadGeoJSONDataAsHeatMap(url, name) {
        var vectorLayer = new ol.layer.Heatmap({
            source: new ol.source.Vector({
                url: url,
                format: new ol.format.GeoJSON()
            }),
            'title': name,
            'type': 'vector',
            weight: function (e) {

                return 2;
            },
            blur: parseInt(5, 10),
            radius: parseInt(5, 10),
            style: function(feature, resolution) {
                //DEvuelve el nombre de la feature y lo pinta en el mapa
                style.getText().setText(resolution < 5000 ? feature.get('CITY_NAME') : '');
                return style;
            }
        });
        //Asignamos el vector al mapa
        mapUtils.getMap().addLayer(vectorLayer);

        mapUtils.getMap().addLayer(UI.FeatureOverlay.addFeatureOverlay());
        //Renderizamos el botoón de vectores
        renderVectorSwitcher();


    }

    return {
        loadGeoJSONData: loadGeoJSONData,
        LoadGeoJSONDataAsHeatMap: LoadGeoJSONDataAsHeatMap

    }
})(UI.Map);