/**
 * Created by jose on 24/2/16.
 */
UI = window.UI || {};

/**
 * @desc Herramientas de overlay de features del geoJson
 **/
UI.Feature = (function (mapUtils) {

    ol.Feature.prototype.getLayer = function(map) {
        var this_ = this, layer_, layersToLookFor = [];
        /**
         * Populates array layersToLookFor with only
         * layers that have features
         */
        var check = function(layer){
            var source = layer.getSource();
            if(source instanceof ol.source.Vector){
                var features = source.getFeatures();
                if(features.length > 0){
                    layersToLookFor.push({
                        layer: layer,
                        features: features
                    });
                }
            }
        };
        //loop through map layers
        map.getLayers().forEach(function(layer){
            if (layer instanceof ol.layer.Group) {
                layer.getLayers().forEach(check);
            } else {
                check(layer);
            }
        });
        layersToLookFor.forEach(function(obj){
            var found = obj.features.some(function(feature){
                return this_ === feature;
            });
            if(found){
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

    function displayFeatureInfo(feature,callback,map,coordinate) {

        var layer = feature.getLayer(map);
        var overlay = layer.get('overlay');
        var element  = overlay.getElement();


        overlay.setPosition(coordinate);
        // the keys are quoted to prevent renaming in ADVANCED mode.


               callback(feature.getProperties(),layer.get('title'),element,coordinate)
    }

    return {

        displayFeatureInfo: displayFeatureInfo,
        showHidePointer: showHidePointer
    }
})(UI.Map);
