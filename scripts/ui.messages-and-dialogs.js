UI = window.UI || {};

/***************************************************************************************/
/* Funciones de visualización de alertas ,mensajes y ventanas de dialogo y confirmación
 /***************************************************************************************/

UI.messageAndDialogs = (function () {

    /*
     * Muestra un mesaje de gritter
     * text: texto del mensaje del gritter
     * type: UI.errorStates
     * title: título que aparece en el gritter
     * time: Tiempo que aparece en pantalla antes de desaparecer
     * callback: función a ejecutar tras la visualización del gritter
     */
    function showMessage(text, type, title, time, callback) {
        var state, image;
        switch (type) {

            case UI.errorStates.SUCCESS:
                state = "success";
                image = "fa-check";
                break;

            case UI.errorStates.WARNING:
                state = "warning";
                image = "";
                break;

            case UI.errorStates.ERROR:
                state = "error";
                image = "fa-exclamation-triangle";
                break;

            default:
                state = "info";
                image = "fa-info";
        }

        // http://boedesign.com/blog/2009/07/11/growl-for-jquery-gritter/
        jQuery.gritter.add({
            title: title,
            text: text,
            image: image,
            time: (typeof time == "undefined") ? '7000' : time,
            sticky: false,
            class_name: (type != UI.errorStates.WARNING) ? 'gritter-' + state : 'gritter-' + state + ' gritter-center',
            after_close: (typeof callback == "undefined") ? null : function () { callback(); }
        });
    }
    /*
     * Función privada
     */
    function getModalHtml(id) {
        return "<div class='modal fade' id='" + id + "' tabindex='-1' role='dialog' aria-labelledby='" + id + "-label' aria-hidden'true'>" +
            "<div class='modal-dialog'>" +
            "<div class='modal-content'>" +
            "<div class='modal-header'>" +
            "<button type='button' class='close' data-dismiss='modal' aria-hidden='true' tabindex='-1'>&times;</button>" +
            "<h4 class='modal-title' id='" + id + "-label'></h4>" +
            "</div>" +
            "<div class='modal-body'>" +
            "<p>Body</p>" +
            "</div>" +
            "<div class='modal-footer'>" +
            "<button type='submit' class='button-ok btn btn-primary'>Aceptar</button>" +
            "<button type='button' class='button-cancel btn btn-default' data-dismiss='modal'>Cancelar</button>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "</div>";
    }

    /*
     * Muestra una ventana de confirmación
     * settigs: Title: título de la ventana modal
     * settings: message: Mensaje de la ventana modal
     * settings: funcOK : Callback del boton de ok
     * settings: funcCancel : Callback del boton de ok
     * settings: funcClose : Callback del boton de ok
     */
    function confirmDialog(settings) {
        if ($("dialog-box").length == 0) {
            $("body").append(getModalHtml("dialog-box"));
            $("#dialog-box").modal({ show: false });
        }

        $("#dialog-box .modal-title").text(settings.title);
        $("#dialog-box .modal-body").html(settings.message);
        $("#dialog-box button.button-ok").unbind("click").bind("click", function () {
            $("#dialog-box").modal("hide");
            if (settings.funcOK) {
                settings.funcOK();
            }
            return true;
        });
        $("#dialog-box button.button-cancel").unbind("click").bind("click", function () {
            $("#dialog-box").modal("hide");
            if (settings.funcCancel) {
                settings.funcCancel();
            }
            return false;
        });

        $("#dialog-box button.close").unbind("click").bind("click", function () {
            $("#dialog-box").modal("hide");
            if (settings.funcClose) {
                settings.funcClose();
            }
            return false;
        });

        $('#dialog-box').modal('show')
            .on("shown.bs.modal", function () {
                $("#dialog-box button.button-ok").focus();
            });
    }


    /*
     * Muestra una ventana modal injectando data
     *  settings.width : Ancho de la ventana modal
     *  settings.title : Texto de la cabecera
     *  settings.textColor: Color de texto
     *  settings.backgroundColor: Color de fondo
     *  settings.onShowDialog : Callback
     *  settings.onCloseDialog : Callback
     *  settings.onBeforeShowDialog : Callback
     * dialogUtils.showGenericModal("kk", "<h1>hola</h1>", { width: '60%' , title: "titulo"});
     */
    function showGenericModal(dialogId, data, settings) {

        if ($("#" + dialogId).length == 0) {
            $("body").append(getModalHtml(dialogId));
        }
        var $dialog = $("#" + dialogId);
        $(".modal-body", $dialog).html(data);

        $(".modal-title", $dialog).text(settings.title);

        $(".modal-dialog", $dialog).css(
            {
                'width': settings.width || '60%'
            });

        $(".modal-title", $dialog).css(
            {
                'background-color': settings.backgroundColor || '#000000',
                'color': settings.textColor || '#ffffff'
            });

        $(".modal-header > .close", $dialog).css(
            {
                'color': settings.textColor || '#ffffff'
            });

        $(".modal-content", $dialog).css(
            {
                'background-color': settings.backgroundColor || '#000000',
                'color': settings.textColor || '#ffffff'
            });

        if (settings.hideHeader) {
            $(".modal-header", $dialog).hide();
        }

        if (settings.hideFooter) {
            $(".modal-footer", $dialog).hide();
        }

        $dialog.on('shown.bs.modal', function () {
            if (settings.onShowDialog) {
                settings.onShowDialog();
            }
        });
        $dialog.on('hidden.bs.modal', function () {
            if (settings.onCloseDialog) {
                settings.onCloseDialog();
            }
            $dialog.remove();
        });

        if (settings.onBeforeShowDialog) {
            settings.onBeforeShowDialog();
        }

        $dialog.modal({ backdrop: 'static' });

    }

    function showGenericModalRemoteContent(dialogId, url, settings) {

        if ($("#" + dialogId).length == 0) {
            $("body").append(getModalHtml(dialogId));
        }
        var $dialog = $("#" + dialogId);
        $(".modal-body", $dialog).load(url);

        $(".modal-title", $dialog).text(settings.title);

        $(".modal-dialog", $dialog).css(
            {
                'width': settings.width || '60%'
            });

        $(".modal-title", $dialog).css(
            {
                'background-color': settings.backgroundColor || '#000000',
                'color': settings.textColor || '#ffffff'
            });

        $(".modal-header > .close", $dialog).css(
            {
                'color': settings.textColor || '#ffffff'
            });

        $(".modal-content", $dialog).css(
            {
                'background-color': settings.backgroundColor || '#000000',
                'color': settings.textColor || '#ffffff'
            });

        if (settings.hideHeader) {
            $(".modal-header", $dialog).hide();
        }

        if (settings.hideFooter) {
            $(".modal-footer", $dialog).hide();
        }

        $dialog.on('shown.bs.modal', function () {
            if (settings.onShowDialog) {
                settings.onShowDialog();
            }
        });
        $dialog.on('hidden.bs.modal', function () {
            if (settings.onCloseDialog) {
                settings.onCloseDialog();
            }
            $dialog.remove();
        });

        if (settings.onBeforeShowDialog) {
            settings.onBeforeShowDialog();
        }

        $dialog.modal({ backdrop: 'static' });

    }
    return {
        showMessage: showMessage,
        confirmDialog: confirmDialog,
        showGenericModal: showGenericModal,
        showGenericModalRemoteContent:showGenericModalRemoteContent
    };
})();
