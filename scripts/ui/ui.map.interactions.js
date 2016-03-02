/**
 * Created by Neo-Si02 on 01/03/2016.
 */
UI = window.UI || {};

/**
 * @desc Herramientas de overlay de features del geoJson
 **/
UI.Interactions = (function (mapUtils) {

    var defaultInteraction, addPointInteraction;


    function addFeatureOverlay(currentMap)
    {
        var features = new ol.Collection();
        var featureOverlay = new ol.layer.Vector({
            source: new ol.source.Vector({features: features}),
            style: new ol.style.Style({

                    //Color de los puntos
                    image: new ol.style.Circle({
                        radius: 10,
                        //snapToPixel: false,
                        'fill': new ol.style.Fill({color: 'yellow'}),
                        stroke: new ol.style.Stroke({
                            color: 'white', width: 4
                        })
                    }),
                    //Color de las líneas
                    stroke: new ol.style.Stroke({
                        width: 3,
                        color: 'black',
                    }),
                    //Color de relleno
                    fill: new ol.style.Fill({
                        color: [0, 0, 255, 0.3]
                    })

            })
        });
        featureOverlay.setMap(currentMap);
        return features;
    }

    var addSelectPointInteraction = function(createPointCallback) {
        var currentMap =mapUtils.getMap();
        if(addPointInteraction)
        {
            currentMap.removeInteraction(addPointInteraction);
            addPointInteraction = null;
            currentMap.renderSync();
        }
        else
        {
            currentMap.removeInteraction(defaultInteraction);
            var features = addFeatureOverlay(currentMap);
            var draw = new ol.interaction.Draw({
                'name': 'drawpoint',
                features: features,
                type: ol.geom.GeometryType.POINT
            });
            currentMap.addInteraction(draw);
            addPointInteraction = draw;
            currentMap.renderSync();
            if(createPointCallback)
            {
                draw.on('drawend', function(evt) {

                    createPointCallback(evt.feature.getGeometry().getCoordinates());
                }, this);
            }


        }

    }



    var addDefaultSelectInteraction = function() {

        //Click sobre las features estilos
        var selectInteraction = new ol.interaction.Select({
            'name': 'default',
            style: new ol.style.Style({
                //Color de los puntos
                image: new ol.style.Circle({
                    radius: 10,
                    //snapToPixel: false,
                    'fill': new ol.style.Fill({color: 'red'}),
                    stroke: new ol.style.Stroke({
                        color: 'white', width: 4
                    })
                }),
                //Color de las líneas
                stroke: new ol.style.Stroke({
                    width: 3,
                    color: 'black',
                }),
                //Color de relleno
                fill: new ol.style.Fill({
                    color: [0, 0, 255, 0.3]
                })
            }),

        });


        mapUtils.getMap().addInteraction(selectInteraction);
        defaultInteraction = selectInteraction;
    }
    return {
        addSelectPointInteraction: addSelectPointInteraction,
        addDefaultSelectInteraction: addDefaultSelectInteraction

    }
})(UI.Map);