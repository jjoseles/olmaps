UI = window.UI || {};
/****************************************************************************/
/* Funciones de renderizado de columnas de datatables
 /****************************************************************************/

UI.gridColumnsRender = (function () {


    var getColorFromButtontype = function (optionsButtonType) {
        switch (optionsButtonType) {
            case "success":
                return "green";
            case "warning":
                return "orange2";
            case "danger":
                return "red";
            case "info":
                return "blue";
            case "default":
            case "primary":
                return "widget-color-blue";
            case "inverse":
            case "pink":
                return "pink";
            case "purple":
                return "purple";
            case "yellow":
                return "light-orange";
            case "grey":
                return "grey";
            case "ligth":
                return "light-grey";
            default:
                return optionsButtonType;
        }
    };
    return {
        //Renderiza una fecha y hora según locale
        dateTime: function(data) {

            if (data) {
                var currentCulture = Globalize.culture().name;
                var locale = currentCulture.substr(0, 2).toLowerCase() || "en";

                var dateFormat = locale == "en" ? "MM/DD/YYYY HH:mm:ss" : "DD/MM/YYYY HH:mm:ss";

                moment.locale(locale);
                var mDate = moment(data);


                return (mDate && mDate.isValid()) ? mDate.format(dateFormat) : "";
            } else return "";
        },

        //Renderiza una fecha según locale
        date: function(data) {

            if (data) {
                var currentCulture = Globalize.culture().name;
                var locale = currentCulture.substr(0, 2).toLowerCase() || "en";

                var dateFormat = locale == "en" ? "MM/DD/YYYY" : "DD/MM/YYYY";

                moment.locale(locale);
                var mDate = moment(data);


                return (mDate && mDate.isValid()) ? mDate.format(dateFormat) : "";
            } else return "";
        },

        //Renderiza una etiqueta segun labeltype
        label: function(data, labelType) {
            if (data) {
                return "<span class=\"label label-" + labelType + "\">" + data + "</span>";
            } else return "";
        },
        //Renderiza un campo de tipo booleano
        bool: function(data) {

            if (data) {
                return "<i class=\"ace-icon fa  fa-lg  fa-check-square-o\"></i>";
            } else return "<i class=\"ace-icon fa  fa-lg  fa-square-o\"></i>";
        },
        //Renderiza un campo enumerado según el literal determinado
        enumerado: function (data, meta) {

            var api = new $.fn.dataTable.Api(meta.settings);
            var enumdata = ($(api.column(meta.col).header()).data("enum-values"));

            var elem = enumdata.filter(
                function (enumdata) { return enumdata.value == data }
            );
            if (elem)
                return (elem[0].text);

            return "";

        },

        //Botón de opciones
        optionButton: function (link, icon, buttomType, text, action, optionsButtonType) {
            action = action || '';


            switch (optionsButtonType) {
                case UI.optionsButtonType.POPOVER:
                    return "<li><a href=\"" + link + "\" class=\"clearfix\">" +
                        "<label class=\"btn btn-" + buttomType + " btn-sm\" data-toggle=\"button\" style=\"float:left; border-radius: 3px;\">" +
                        "<i class=\"icon-only ace-icon fa " + icon + "\"></i>" +
                        "</label>" +
                        "<span class=\"msg-body\"><span class=\"msg-title\">" + text + "</span></span>" +
                        "</a>" +
                        "</li>";
                case UI.optionsButtonType.DROPDOWN:
                    return "<li> " +
                        "<a href=\"" + link + "\"  data-original-title=\"" + text + "\">" +
                        "<i class=\"ace-icon fa " + icon + " " + getColorFromButtontype(buttomType) + "\" ></i>" + text +
                        "</a>" +
                        "</li>";
                default:
                    return "<a href=\"" + link + "\" class=\"btn btn-xs btn-" + buttomType + "\" data-rel=\"tooltip\" data-original-title=\"" + text + "\" data-action=\"" + action + "\" ><i class=\"fa " + icon + " fa-lg fa-fw\"></i></a>";
            }


        },
        optionAjaxButtonConfirm: function (link, icon, buttomType, text, comfirmTitle, comfirmMessage, action, optionsButtonType) {

            action = action || '';

            switch (optionsButtonType) {
                case UI.optionsButtonType.POPOVER:
                    return "<li><a href=\"" + link + "\" class=\"clearfix ajax-action-confirm-dialog\" data-confirm-title=\"" + comfirmTitle + "\" data-confirm-message=\"" + comfirmMessage + "\" data-action=\"" + action + "\">" +
                        "<label class=\"btn btn-" + buttomType + " btn-sm\" data-toggle=\"button\" style=\"float:left; border-radius: 3px;\">" +
                        "<i class=\"icon-only ace-icon fa " + icon + "\"></i>" +
                        "</label>" +
                        "<span class=\"msg-body\"><span class=\"msg-title\">" + text + "</span></span>" +
                        "</a>" +
                        "</li>";
                case UI.optionsButtonType.DROPDOWN:
                    return "<li><a href=\"" + link + "\" class=\"clearfix ajax-action-confirm-dialog\" data-confirm-title=\"" + comfirmTitle + "\"   data-original-title=\"" + text + "\" data-confirm-message=\"" + comfirmMessage + "\" data-action=\"" + action + "\">" +
                        "<i class=\"icon-only ace-icon fa " + icon + " " + getColorFromButtontype(buttomType) + "\"></i>" + text +
                        "</a>" +
                        "</li>";
                default :
                    return "<a href=\"" + link + "\" class=\"ajax-action-confirm-dialog btn btn-xs btn-" + buttomType + "\" data-rel=\"tooltip\" data-original-title=\"" + text + "\"  data-confirm-title=\"" + comfirmTitle + "\" data-confirm-message=\"" + comfirmMessage + "\" data-action=\"" + action + "\"><i class=\"fa " + icon + " fa-lg fa-fw\"></i></a>";

            }

        },
        //Pinta un icono y prepara para sacar ventana modal
        optionButtonOpenModalAside: function (action, icon, buttomType, text, optionsButtonType) {

            action = action || '';


            switch (optionsButtonType) {
                case UI.optionsButtonType.POPOVER:
                    return "<li><a href=\"#\" rel=\"ajax-action-open-modal\" data-original-title=\"" + text + "\" data-action=\"" + action + "\"  class=\"clearfix ajax-action-open-modal aside-trigger\" data-target=\"#generic-modal-placeholder\" data-toggle=\"modal\" >" +

                        "<label class=\"btn btn-" + buttomType + " btn-sm\" data-toggle=\"button\" style=\"float:left; border-radius: 3px;\">" +
                        "<i class=\"icon-only ace-icon fa " + icon + "\"></i>" +
                        "</label>" +
                        "<span class=\"msg-body\"><span class=\"msg-title\">" + text + "</span></span>" +

                        "</a>" +
                        "</li>";
                case UI.optionsButtonType.DROPDOWN:
                    return "<li><a href=\"#\" rel=\"ajax-action-open-modal\"  data-original-title=\"" + text + "\" data-action=\"" + action + "\"  class=\"clearfix ajax-action-open-modal aside-trigger\" data-target=\"#generic-modal-placeholder\" data-toggle=\"modal\" >" +
                        "<i class=\"icon-only ace-icon fa " + icon + " " + getColorFromButtontype(buttomType) + "\"></i>" + text +
                        "</a>" +
                        "</li>";
                default:
                    return "<a data-target=\"#generic-modal-placeholder\" data-toggle=\"modal\" class=\"ajax-action-open-modal aside-trigger btn btn-xs btn-" + buttomType + "\" data-rel=\"tooltip\" data-original-title=\"" + text + "\" href=\"#\" rel=\"ajax-action-open-modal\" data-action=\"" + action + "\" ><i class=\"fa " + icon + " fa-lg fa-fw\"></i></a>";


            }
        },

        //Link de acción para columnas
        actionLink: function(link, text) {
            return "<a href=\"" + link + "\">" + text + "</a></li>";
        },
        editableColumn: function (id, text, ajaxUpdateUrl, meta) {
            var api = new $.fn.dataTable.Api(meta.settings);

            var dataSrc = api.column(meta.col).dataSrc();
            return "<a href='#' class='editable editable-click' data-name='" + dataSrc  + "' data-rel='editable' data-type='text'  data-mode='inline' data-url='" + ajaxUpdateUrl + "' data-pk='" + id + "' data-title='" + title + "'>" + text + "</a>";

        },

        //Columna belongings 1-N
        belongins: function(data) {

            var str = "";
            if (data) {
                for (var i = 0; i <= data.length - 1; i++) {

                    str += "<span class=\"label label-success\">" + data[i].EntityName + " <i class=\"ace-icon fa fa-angle-right\"></i> " + data[i].Name + "</span>&nbsp;<br\>";
                }
            }
            return str;
        },
        //Columna belong 1
        belong: function(data) {
            if (data != null) {
                return "<span class=\"label label-success\">" + data.EntityName + " <i class=\"ace-icon fa fa-angle-right\"></i> " + data.Name + "</span>&nbsp;";
            } else return "";
        },
        //Badge
        badge: function(data, color) {
            return "<span class=\"badge badge badge-" + color + "\">" + data + "</span>";
        },
        //Popover
        popover: function(data, header) {
            return "<i class=\"ace-icon fa fa-info-circle blue fa-2x\" data-content=\"" + data + "\" data-original-title=\"<i class='icon-info blue'></i>&amp;nbsp; " + header + "\" data-placement=\"bottom\" data-rel=\"popover\" data-trigger=\"hover\"></i>";
        },
        icon: function(data) {
            return "<i class=\"ace-icon fa " + data + " blue fa-2x\" data-rel=\"tooltip\" data-original-title=\"" + data + "\" ></i>";
        },
        //Visualiza un popover con elementos relacionados
        popoverRelatedItems: function (data, header, url) {
            var html = "";
            var total = 0;

            if (data != null) {
                if (data.length > 0) {
                    total = data.length;
                    html += "<div class='message-list-container'>";
                    html += "<div class='mmessage-list'>";
                    for (var i = 0; i <= data.length - 1; i++) {
                        html += "<div class='message-item'><a href='" + url + "?id=" + data[i].Id + "'>" + data[i].Name + "</a></div>";
                    }
                    html += "</div>";
                    html += "</div>";
                    return "<a  style=\"cursor:pointer\" tabindex=\"0\" role=\"button\" data-content=\"" + html + "\" data-original-title=\"<i class='icon-info blue'></i>&amp;nbsp; " + header + "\" data-placement=\"bottom\" data-rel=\"popover-relateditems\" data-trigger=\"namual\"><span class=\"badge badge-info\">" + total + "</span></a>";

                }
            }
            return "<span class=\"badge badge-info\">0</span></a>";

        },


        //Cabecera de columna de opciones
        optionsHeader: function (optionsButtonType) {


                return this.dropdownOptionsHeader() + this.dropdownOptionsButton("info", "Opciones", "fa-cogs");



        },
        //Pié de columna de opciones
        optionsFooter: function () {
            return "</div><!-- /.btn-group -->";
        },

        //Visualiza un boton que abre un dropdown con opciones
        dropdownOptionsHeader: function () {
            return "<div class=\"inline\">";
        },
        dropdownOptionsButton: function (buttomType, text, icon) {
            return "<a role=\"button\" data-position=\"auto\" data-relation=\"dropdown_options\" data-original-title=\"" + text + "\"  class=\"btn btn-xs btn-" + buttomType + "\" data-toggle=\"dropdown\" class=\"dropdown-toggle\">" +
                "<i class=\"ace-icon icon-only bigger-110 fa " + icon + "\"></i>" +
                "</a>" +
                "<ul class=\"dropdown-menu dropdown-menu-td user-menu  dropdown-yellow\" style=\"top: inherit; left: inherit; bottom: inherit\">";
        },
        dropdownOptionsFooter: function () {
            return "</ul></div>";
        },


        //Visualiza un boton que abre un popover con opciones
        popoverOptionsButton: function (id, buttomType, text, icon) {
            return this.dropdownOptionsHeader() + this.dropdownOptionsButton(buttomType, text, icon);
            // return "<a role=\"button\" data-placement=\"right\"  data-original-title=\"" + text + "\" data-popover-content=\"#popover-options-row" + id + "\" data-relation=\"popover_options\" data-trigger=\"namual\" tabindex=\"0\" class=\"btn btn-xs btn-" + buttomType + "\"><i class=\"fa " + icon + " fa-lg fa-fw\"></i></a>";
        },

        popoverOptionsHeader: function (id) {
            //return '<div class="hidden" id="popover-options-row' + id + '">' +
            //    '<div class="popover-body">' +
            //    '<ul class=\"dropdown-navbar dropdown-menu dropdown-menu-right \" style="display: block;position: static; width:auto;border:0; margin-top:0">' +
            //    '<li class=\"dropdown-content\">' +
            //    "<ul class=\"dropdown-menu dropdown-navbar \">";
            return "";
        },
        popoverOptionsFooter: function () {
            return this.dropdownOptionsFooter();
            //  return '</ul></li></ul></div></div>';
        },



        hasmany: function(data, url) {
            return this.popoverRelatedItems(data, "Elementos relacionados", url);
        },

        checkboxes : function(name,dataId) {
            return "<input value=\"" + dataId + "\" name=\"" + name + "\" class=\"ace input-lg\" type=\"checkbox\" data-id=\"" + dataId + "\"/><span class=\"lbl\"></span>";

        },
        options: function() {
            return "";
        }
    };
})();