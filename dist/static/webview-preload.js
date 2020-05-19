"use strict";
var ipcRenderer = require('electron').ipcRenderer;
window.triggerPluginEvent = function (event, data) {
    ipcRenderer.sendToHost(event, data);
};
//# sourceMappingURL=webview-preload.js.map