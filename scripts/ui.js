
UI = window.UI || {};


UI = (function() {
    'use strict';
    var version = '0.1.4';

    var debugMode = true;

    var errorStates = {
        WARNING: 2,
        SUCCESS: 1,
        ERROR: 0,
    };

    var optionsButtonType = {
        POPOVER: 1,
        DROPDOWN: 2
    };

    return {
        version: version,
        errorStates: errorStates,
        optionsButtonType : optionsButtonType
    };

})();

