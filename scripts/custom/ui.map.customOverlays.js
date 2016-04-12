UI = window.UI || {};

UI.CustomOverlays = (function (mapUtils) {


    /**
     * @private
     * @desc callback sobre el click de una de las ciudades
     * @param {object} featureProperties propiedades que vienen en el json
     * @param {object} layerProperties Propiedades de la capa por si se necesitaran
     * @param {string} element elemento a visualizar
     * @param {object} coordinate coordenadas
     **/
    var openPopoverPosicionCiudades = function (featureProperties, layerProperties, element, coordinate) {

        if (featureProperties) {


            var header = '<code>' + layerProperties["title"] + " " + layerProperties["code"] + " " + layerProperties["customType"] + '</code>';
			var content = featureProperties["STATUS"] + "<br/>" + featureProperties["ADMIN_NAME"] + " " + featureProperties["CITY_NAME"] + "<br/>" + featureProperties["CNTRY_NAME"];
            mapUtils.openPopover(element, header, content);
        }
    };
	/**
     * @private
     * @desc callback sobre el click de un punto de una ruta
     * @param {object} featureProperties propiedades que vienen en el json
     * @param {object} layerProperties Propiedades de la capa por si se necesitaran
     * @param {string} element elemento a visualizar
     * @param {object} coordinate coordenadas
     **/
    var openPopoverSituacion = function (featureProperties, layerProperties, element, coordinate) {

        if (featureProperties) {
            var header = '<table style="color:#000080;">';
            if (featureProperties["empresa"] != null) {
                header = header + '<tr>"><td style="padding:4px;border-top:1px solid #000080;">Empresa</td><td style="padding:4px;border-top:1px solid #000080;">' + featureProperties["empresa"] + '</td></tr>';
            }
            if (featureProperties["vehiculo"] != null) {
                header = header + '<tr><td style="padding:4px;border-top:1px solid #000080;">Vehículo</td><td style="padding:4px;border-top:1px solid #000080;">' + featureProperties["vehiculo"] + '</td></tr>';
            }
            if ((featureProperties["conductor"] != null) && (featureProperties["conductor"] != "")) {
                header = header + '<tr><td style="padding:4px;border-top:1px solid #000080;">Conductor</td><td style="padding:4px;border-top:1px solid #000080;">' + featureProperties["conductor"] + '</td></tr>';
            }
            header = header + '</table>';
            var content = '<table>';
            content = content + '<tr><td colspan="2" style="padding:4px;">' + featureProperties["localizacion"] + '</td></tr>';
            content = content + '<tr><td colspan="2" style="padding:4px;">' + featureProperties["poi"] + '</td></tr>';
            content = content + '<tr><td style="padding:4px;">Fecha</td><td style="padding:4px;">' + featureProperties["fecha"] + '</td></tr>';
            content = content + '<tr><td style="padding:4px;">Velocidad</td><td style="padding:4px;">' + featureProperties["velocidad"] + ' km/h</td></tr>';
            content = content + '<tr><td style="padding:4px;">Contacto</td><td style="padding:4px;">' + featureProperties["contacto"] + '</td></tr>';
            content = content + '</table>';
            mapUtils.openPopover(element, header, content);
        }
    };
	return {


        openPopoverPosicionCiudades: openPopoverPosicionCiudades,
        openPopoverSituacion: openPopoverSituacion

    }
})(UI.MapUtils);