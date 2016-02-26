/**
 * Created by jose on 24/2/16.
 */
UI = window.UI || {};

/**
 * @desc Herramientas de overlay de features del geoJson
 **/
UI.FeatureOverlay = (function (mapUtils) {
    this.cursor_ = 'pointer';
    this.previousCursor_ = undefined;
    var highlight;
    var featureOverlay;
    var image = new ol.style.Circle({

            radius: 10,
            //snapToPixel: false,
            fill: new ol.style.Fill({color: 'black'}),
            stroke: new ol.style.Stroke({
                color: 'white', width: 4
            })

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

    function addFeatureOverlay()
    {
        var highlightStyleCache = {};

         featureOverlay = new ol.layer.Vector({
            source: new ol.source.Vector(),
            //Con olgm no funcionan las llamadas a funciones
            style:new ol.style.Style({
                image: new ol.style.Circle({
                   radius: 10,
                    //snapToPixel: false,
                    'fill': new ol.style.Fill({color: 'blak'}),
                    stroke: new ol.style.Stroke({
                        color: 'white', width: 4
                    })
                }),
                stroke: new ol.style.Stroke({
                    width: 8,
                    color: 'black',

                })

            })

            /*    function(feature, resolution) {
                if (feature) {


                    var text = resolution < 5000 ? feature.get('name') : '';
                    if (!highlightStyleCache[text]) {

                        return styles[feature.getGeometry().getType()]
                    }
                    return highlightStyleCache[text];
                } */
                //else return new ol.style.Style();
            })

        return featureOverlay;
    }

function showHidePointer(evt)
{

    if (cursor_) {
        var map = evt.map;
        var feature = map.forEachFeatureAtPixel(evt.pixel,
            function(feature) {
                return feature;
            });
        var element = evt.map.getTargetElement();
        if (feature) {
            if (element.style.cursor != cursor_) {
                previousCursor_ = element.style.cursor;
                element.style.cursor = cursor_;
            }
        } else if (previousCursor_ !== undefined) {
            element.style.cursor = previousCursor_;
            this.previousCursor_ = undefined;
        }
    }
}
   function displayFeatureInfo(evt) {


       var feature = mapUtils.getMap().forEachFeatureAtPixel(evt.pixel, function(feature) {
           return feature;
       });

       //Visualizamos cursor
       var element = evt.map.getTargetElement();
       if (feature) {
           if (element.style.cursor != this.cursor_) {
               this.previousCursor_ = element.style.cursor;
               element.style.cursor = this.cursor_;
           }
       } else if (this.previousCursor_ !== undefined) {
           element.style.cursor = this.previousCursor_;
           this.previousCursor_ = undefined;
       }


        //Visualiza info sobre la feature
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
        addFeatureOverlay : addFeatureOverlay,
        showHidePointer: showHidePointer
    }
})(UI.Map);
