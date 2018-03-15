cordova.define("cordova-plugin-lock-info.lockinfo", function(require, exports, module) {
var exec = require("cordova/exec");

function isLocked (successCallback, errorCallback) {
    exec(
        successCallback,
        errorCallback,
        'LockInfoPlugin',
        'isLocked',
        []
    );
}

module.exports.isLocked = isLocked;

});
