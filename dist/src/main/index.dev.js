"use strict";
/**
 * This file is used specifically and only for development. It installs
 * `electron-debug` & `vue-devtools`. There shouldn't be any need to
 *  modify this file, but it can be used to extend your development
 *  environment.
 */
/* eslint-disable */
// Install `electron-debug` with `devtron`
require('electron-debug')({ showDevTools: true });
// It is necessary to require `electron-log` here to use it on the renderer process
require('electron-log');
// Install `vue-devtools`
require('electron').app.whenReady().then(function () {
    var _a = require('electron-devtools-installer'), installExtension = _a.default, VUEJS_DEVTOOLS = _a.VUEJS_DEVTOOLS;
    installExtension(VUEJS_DEVTOOLS)
        .then(function () { })
        .catch(function (err) {
        console.log('Unable to install `vue-devtools`: \n', err);
    });
});
// Require `main` process to boot app
require('./index');
//# sourceMappingURL=index.dev.js.map