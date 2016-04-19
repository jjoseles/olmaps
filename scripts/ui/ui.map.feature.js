/**
 * Created by jose on 24/2/16.
 */
UI = window.UI || {};

/**
 * @desc Herramientas de overlay de features del geoJson
 **/
UI.Feature = (function (mapUtils) {

    ol.Feature.prototype.getLayer = function (map) {
        var this_ = this, layer_, layersToLookFor = [];
        /**
         * Populates array layersToLookFor with only
         * layers that have features
         */
        var check = function (layer) {
            var source = layer.getSource();
            if (source instanceof ol.source.Vector) {
                var features = source.getFeatures();
                if (features.length > 0) {
                    layersToLookFor.push({
                        layer: layer,
                        features: features
                    });
                }
            }
        };
        //loop through map layers
        map.getLayers().forEach(function (layer) {
            if (layer instanceof ol.layer.Group) {
                layer.getLayers().forEach(check);
            } else {
                check(layer);
            }
        });
        layersToLookFor.forEach(function (obj) {
            var found = obj.features.some(function (feature) {
                return this_ === feature;
            });
            if (found) {
                //this is the layer we want
                layer_ = obj.layer;
            }
        });
        return layer_;
    };


    this.cursor_ = 'pointer';
    this.previousCursor_ = undefined;

    function showHidePointer(evt) {

        if (cursor_) {
            var map = evt.map;
            var feature = map.forEachFeatureAtPixel(evt.pixel,
                function (feature) {
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

    function displayFeatureTooltipInfo(feat) {

            if (feat.getGeometry().getType() == "Point") {
                UI.Overlay.createTooltipOverlay(feat);

            }

    }

    function removeFeatureTooltipInfo(feat) {
        UI.Overlay.removeTooltipOverlay(feat)
    }

    function displayFeatureInfo(feature,  map, pixelCoordinates) {


      //  var layer = feature.getLayer(map);
        var layer = UI.MapVector.getVectorLayerByProperty("code",feature.get("_layerCode"))
        if (layer) {
            var pointOverlayZoom = map.getView().getZoom();

            var features = UI.MapVector.getVectorFeaturesCollection(layer);
             features.forEach(function (feat, idx, a) {
                 if(feature.getGeometry().getType() == "Point")
                         feat.setStyle(feat.get('_defaultStyle'));
             });
            var coordinate;
            var overlay = layer.get('overlayFeatureInfo');
            if (overlay) {
                var element = overlay.getElement();
                 if(feature.getGeometry().getType() == "LineString")
                     coordinate = pixelCoordinates;
                 else
                    coordinate = feature.getGeometry().getCoordinates();
               overlay.setPosition(coordinate);
                //Sacamos el callback de la capa
                var callback = layer.get('showFeatureOverlayCallback');
                if (typeof callback !== 'undefined')
                    callback(feature.getProperties(), layer.getProperties(), element, coordinate);;;

                if(layer.get('pointOverlayZoom') > pointOverlayZoom)
                    pointOverlayZoom = layer.get('pointOverlayZoom');
            }
            // Sacamos la interacción select por defecto de la capa
            feature.setStyle(feature.get("_interactionStyle"));

           /*   extent = feature.getGeometry().getExtent();
             map.getView().fit(extent, map.getSize(),{"maxZoom": pointOverlayZoom}); */
        }

    }

    return {

        displayFeatureInfo: displayFeatureInfo,
        showHidePointer: showHidePointer,
        displayFeatureTooltipInfo: displayFeatureTooltipInfo,
        removeFeatureTooltipInfo: removeFeatureTooltipInfo
    }
})(UI.Map);
