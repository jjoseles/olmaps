/**
 * Created by jose on 24/2/16.
 */
UI = window.UI || {};

/**
 * @desc Herramientas de mapas openlayers
 **/
UI.FeatureOverlay = (function (mapUtils) {

    var highlight;
    var featureOverlay;
    var styles = {
        'route': new ol.style.Style({
            stroke: new ol.style.Stroke({
                width: 6, color: [237, 212, 0, 0.8]
            })
        }),
        'icon': new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [0.5, 1],
                src: 'data/icon.png'
            })
        }),
        'point': new ol.style.Style({
            image: new ol.style.Circle({
                radius: 7,
                snapToPixel: false,
                fill: new ol.style.Fill({color: 'black'}),
                stroke: new ol.style.Stroke({
                    color: 'white', width: 2
                })
            })
        })
    };

    function addFeatureOverlay()
    {
        var highlightStyleCache = {};

         featureOverlay = new ol.layer.Vector({
            source: new ol.source.Vector(),

            style: function(feature, resolution) {
                if (feature) {


                    var text = resolution < 5000 ? feature.get('name') : '';
                    if (!highlightStyleCache[text]) {

                        if (feature.getGeometry().getType() === 'Point') {
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
                                        color: 'red'
                                    })
                                })
                            })
                        }
                        else {
                            highlightStyleCache[text] = new ol.style.Style({
                                stroke: new ol.style.Stroke({
                                    color: '#f00',
                                    width: 1
                                }),
                                fill: new ol.style.Fill({
                                    color: 'rgba(255,0,0,0.1)'
                                }),
                                text: new ol.style.Text({
                                    font: '12px Calibri,sans-serif',
                                    text: text,
                                    fill: new ol.style.Fill({
                                        color: '#000'
                                    }),
                                    stroke: new ol.style.Stroke({
                                        color: '#f00',
                                        width: 3
                                    })
                                })
                            });
                        }
                    }
                    return highlightStyleCache[text];
                }
                else return new ol.style.Style();
            }
        });
        return featureOverlay;
    }


   function displayFeatureInfo(pixel) {

        var feature = mapUtils.getMap().forEachFeatureAtPixel(pixel, function(feature) {
            return feature;
        });

        var info = document.getElementById('info');
        if (feature) {
            info.innerHTML = feature.getId() + ': ' + feature.get('CITY_NAME');
        } else {
            info.innerHTML = '&nbsp;';
        }

        if (feature !== highlight) {
            if (highlight) {
                featureOverlay.getSource().removeFeature(highlight);
            }
            if (feature) {
                featureOverlay.getSource().addFeature(feature);
            }
            highlight = feature;
        }

    };
    return {

        displayFeatureInfo: displayFeatureInfo,
        addFeatureOverlay : addFeatureOverlay
    }
})(UI.Map);
