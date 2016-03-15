UI = window.UI || {};


UI.CustomScriptsMap = (function () {

    var mapa;
    //Popover geoJson
    var openPopoverGeoJson = function (data, layerName, element, coordinate) {
        console.log(data)
        if (data) {
            var hdms = ol.coordinate.toStringHDMS(ol.proj.transform(
                coordinate, 'EPSG:3857', 'EPSG:4326'));

            var header = '<code>' + hdms + '</code><br/>', content;

            header = header;
            content = "Content"




            var genericCloseBtnHtml = "<button type=\"button\" class=\"close\" aria-hidden=\"true\">&times;</button>";

            $(element).popover("destroy");
            $(element).popover({
                trigger: "manual",
                'placement': "top",
                'animation': false,
                'html': true,
                'content': content,
                'title': genericCloseBtnHtml + header

            }).on("shown.bs.popover", function (e) {

                var $pop = $(element).data("bs.popover").$tip;

                $pop.find(".close").click(function () {

                    $(element).popover("destroy");
                });

            });;
            $(element).popover("show");
        }
    }

    //Abre el popover sobre un overlay
    var openPopover = function (e) {

        e.preventDefault();
        var elem = e.currentTarget;


        $(elem).popover(
            {
                trigger: "manual",
                'animation': false,
                html: true,
                'placement': "top",
                content: $(elem).data("description"),
                title: $(elem).data("name"),

            }
        ).popover("toggle");


    };

    var createPointCallback = function (coordinates) {

        var messageText = "Has seleccionado  estas coordenadas<br/> <code>" + ol.coordinate.toStringHDMS(ol.proj.transform(
                coordinates, "EPSG:3857", "EPSG:4326")) + "</code>" + "<br/><code> " + coordinates + "</code>";
        UI.messageAndDialogs.showGenericModal("dialogId", messageText, { width: '40%', title: "Coordenadas seleccionadas", backgroundColor: "#fff", textColor: "#4D6883" });

    };

    var openModal = function (e) {
        e.preventDefault();
        var elem = e.currentTarget;

        var messageText = $(elem).data("description");
        UI.messageAndDialogs.showGenericModal("dialogId", messageText, { width: '40%', title: $(elem).data("name"), backgroundColor: "#fff", textColor: "#4D6883" });
    };

    var loadMap = function() {
        //TODO Pasar parámemtros de inicialización al mapa
        mapa = UI.Map.init("map", openPopoverGeoJson, createPointCallback);
    }

    var loadData = function (url, nombre_capa) {
        var iconStyle =  new ol.style.Style({
            image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({


                src: 'img/map-object-blue-geo-point-32.png',

                anchor: [0.5, 0.5],
                size: [32,32],

                opacity: 0.7,
                scale: 1,
            }))
        });





        var iconStyleSelectInteraction = new ol.style.Style({
            image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({


                src: 'img/map-object-point-target-dot-48.png',

                anchor: [0.5, 0.5],
                size: [48,48],

                opacity: 1,
                scale: 1,
            }))
        });

        UI.MapVector.loadGeoJSONData(url, nombre_capa, iconStyle,iconStyleSelectInteraction);
    }

    var createPointCallback_null = function (coordinates) {
        // No hace nada
    };





    return {
        loadMap: loadMap,
        loadData: loadData,

    }
})();
