/**
 * Created by Neo-Si02 on 07/04/2016.
 */

/**
 * @desc Herramientas de mapas openlayers
 **/
UI.MapConfig = (function () {

    var _hideLinesStyle = new ol.style.Style({
        stroke: new ol.style.Stroke({
            width: 0,
            color: "rgba(0,0,0,0)"
        })
    });

    var _hidePointsStyle = new ol.style.Style({
        image: new ol.style.Circle({
            radius: 0,
            fill: new ol.style.Fill({
                color: "rgba(0,0,0,0)",

            }),
            stroke: new ol.style.Stroke({
                color: "rgba(0,0,0,0)",
                width: 0
            }),
        }),
    });

    var _hideImageStyle = new ol.style.Style({
        image: new ol.style.Icon({
            opacity: 0,
            src: 'none',
        })
    });

    var _layerType = {
        ROUTE: 'ROUTE',
        POINT: 'POINT'
    };

    var _internalLayerType =
    {
        BASE: 'BASE',
        VECTOR: 'VECTOR'
    };

    var _routeLayerTypes =
    {
        ORIGINAL: 'ORIGINAL',
        COMPACTA: 'COMPACTADA'
    };

    var _rutaIconos = 'img/';
    var _resolutionInZeroZoom = '156543.03392804097';
    return {
        layerType: _layerType,
        internalLayerType: _internalLayerType,
        resolutionInZeroZoom: _resolutionInZeroZoom,
        routeLayerTypes: _routeLayerTypes,
        hideLinesStyle: _hideLinesStyle,
        hidePointsStyle: _hidePointsStyle,
        hideImageStyle: _hideImageStyle,
        rutaIconos : _rutaIconos

    }
})();