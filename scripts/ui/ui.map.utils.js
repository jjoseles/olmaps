/**
 * Created by Neo-Si02 on 26/02/2016.
 */
UI = window.UI || {};


/**
 * @desc Overlays simples, sin geoJson
 **/
UI.MapUtils = (function () {
    function createUUID() {
        // http://www.ietf.org/rfc/rfc4122.txt
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";

        var uuid = s.join("");
        return uuid;
    }


    function stringDivider(str, width, spaceReplacer) {
        if (str.length > width) {
            var p = width;
            while (p > 0 && (str[p] != ' ' && str[p] != '-')) {
                p--;
            }
            if (p > 0) {
                var left;
                if (str.substring(p, p + 1) == '-') {
                    left = str.substring(0, p + 1);
                } else {
                    left = str.substring(0, p);
                }
                var right = str.substring(p + 1);
                return left + spaceReplacer + stringDivider(right, width, spaceReplacer);
            }
        }
        return str;
    }

    /**
     * @private
     * @desc abre una ventana modal genérica
     * @param {string} element elemento a visualizar
     * @param {string} header Texto de la cabecera del popover
     * @param {string} content Contenido del cuerpo del popover
     **/
    function openPopover(element, header, content) {
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

        });
        $(element).popover("show");
    }

    return {
        openPopover: openPopover,
        createUUID: createUUID,
        stringDivider: stringDivider


    }
})();