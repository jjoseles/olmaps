UI = window.UI || {};

UI.CustomScriptsMap = (function (mapUtils, layerConfig) {

    var mapa;

    var createPointCallback = function (coordinates) {

        var messageText = "Has seleccionado  estas coordenadas<br/> <code>" + ol.coordinate.toStringHDMS(ol.proj.transform(
                coordinates, "EPSG:3857", "EPSG:4326")) + "</code>" + "<br/><code> " + coordinates + "</code>";
        UI.messageAndDialogs.showGenericModal("dialogId", messageText, {
            width: '40%',
            title: "Coordenadas seleccionadas",
            backgroundColor: "#fff",
            textColor: "#4D6883"
        });

    };


    /**
     * @public
     * Prepara eventos
     **/
    function prepareEvents() {
        $("#openModal").on('click', function () {

            UI.messageAndDialogs.showGenericModalRemoteContent("dialogId", 'mapModal.html', {
                onShowDialog: function () {
                    UI.CustomScriptsMap.loadMap();
                    UI.CustomScriptsMap.loadData('http://www.acuriousanimal.com/thebookofopenlayers3/data/world_cities.json', 'lagos');
                }, width: '80%', title: "Lagos", backgroundColor: "#fff", textColor: "#4D6883"
            });


        });

    }


    /**
     * @public
     * @desc carga datos para una capa determinada
     * @param {string} url de la llamada geoJson
     * @param {string} código dde la capa
     * @param {string} element elemento a visualizar

     **/
    var loadData = function (url, title, configCode, code) {


        var config = layerConfig.getConfig(configCode);

        if (config.length == 1) {
            var properties = config[0].properties;
            properties["title"] = title;


            if (code)
                properties["code"] = code;
            else
                properties["code"] = mapUtils.createUUID();


            properties["url"] = url;
           // try {
                UI.MapVector.loadGeoJSONData(properties);
            /*}
            catch (e) {
                console.log(e)
            }*/

        } else console.log('No se han definido valores de configuracion  el valor ' + configCode);


    };
    /**
     * @public
     * @desc Inicializa el mapa
     * @param {string} url de la llamada geoJson
     * @param {string} código dde la capa
     * @param {string} element elemento a visualizar

     **/
    var loadMap = function () {
        mapa = UI.Map.init("map", null);
        return mapa;
    };
    return {

        loadData: loadData,
        loadMap: loadMap,
        prepareEvents: prepareEvents,
        createPointCallback: createPointCallback


    }
})(UI.MapUtils, UI.CustomLayerConfig);