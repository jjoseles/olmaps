/**
 * Created by jose on 20/2/16.
 */
UI = window.UI || {};

/**
 * @desc Herramientas de mapas openlayers
 **/
UI.MapVectorAnimation = (function (mapUtils, config) {

    var _animating = false;
    var _speed = 1600; //
    var _coordinates;
    var _map;
    var _currentLayer;
    var _currenIndex = -1;
    function getGeoMarker() {
       return  new ol.Feature({
            type: 'geoMarker',
            geometry: new ol.geom.Point(_coordinates[0])
        });
    }

    var moveFeature = function(event) {
        var vectorContext = event.vectorContext;
        var frameState = event.frameState;





        if (_animating) {
            var elapsedTime = frameState.time - now;

            // here the trick to increase speed is to jump some indexes
            // on lineString coordinates
            var index = Math.round(elapsedTime / _speed);




            if (index >= _coordinates.length) {
                stopAnimation(true);
                return;
            }


            var currentPoint = new ol.geom.Point(_coordinates[index]);
            var feature = new ol.Feature(currentPoint);
            vectorContext.drawFeature(feature, new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 7,
                    snapToPixel: false,
                    fill: new ol.style.Fill({color: 'black'}),
                    stroke: new ol.style.Stroke({
                        color: 'white', width: 2
                    })
                })

            }));
            if(index != _currenIndex)
            {
                _currenIndex = index;


               // var featureCoord = ol.proj.transform(_coordinates[index],'EPSG:3857', 'EPSG:4326')

               _currentLayer.getSource().forEachFeatureInExtent(feature.getGeometry().getExtent(), function(f) {
                 if( f.getGeometry().getType() == "Point")
                    UI.Feature.displayFeatureInfo(f,_map)
                });





            }

            _map.getView().setCenter(_coordinates[index]);


        }
        // tell OL3 to continue the postcompose animation

        _map.render();
    };

    function startAnimation(coordinates,layer) {
        _coordinates = coordinates;
        _map = mapUtils.getMap();
        _currentLayer = layer;

        if (_animating) {
            stopAnimation(false);
        } else {
            _animating = true;
            now = new Date().getTime();


            // hide geoMarker
            getGeoMarker().setStyle(null);
            // just in case you pan somewhere else

            _map.getView().setCenter(_coordinates[0]);
             var extent = getGeoMarker().getGeometry().getExtent();
             _map.getView().fit(extent, _map.getSize(),{"maxZoom": 16});

            _map.on('postcompose', moveFeature);
            _map.render();
        }
    }
    function stopAnimation(ended) {
        _animating = false;


        // if animation cancelled set the marker at the beginning
         var coord = ended ? _coordinates[_coordinates.length - 1] : _coordinates[0];
        /** @type {ol.geom.Point} */ ( getGeoMarker().getGeometry())
            .setCoordinates(coord);
        //remove listener
      //  _map.getView().setCenter(coord);
        _map.un('postcompose', moveFeature);
    }

    return {
        startAnimation : startAnimation,
        stopAnimation : stopAnimation
    }
})(UI.Map, UI.MapConfig);