'use strict';
import { app, BrowserWindow, ipcMain, screen } from 'electron';
import { setupPluginManager } from './plugin-manager';
import { setupUpdater } from './updater';
import winState from 'electron-window-state';
import packageJson from '../../package.json';
import assignMenu from './menu';
// It is necessary to require `electron-log` here to use it on the renderer process
require('electron-log');
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
    global.__static = require('path')
        .join(__dirname, '/static')
        .replace(/\\/g, '\\\\');
}
// To E2E tests
if (process.env.TEMP_USER_DATA === 'true') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    var tempy = require('tempy');
    var tempDirectory = tempy.directory();
    app.setPath('userData', tempDirectory);
}
var windows = {
    main: null,
    loading: null
};
var windowState;
var deeplinkingUrl = null;
var winURL = process.env.NODE_ENV === 'development'
    ? 'http://localhost:9080'
    : "file://" + __dirname + "/index.html";
var loadingURL = process.env.NODE_ENV === 'development'
    ? 'http://localhost:9080/splashscreen.html'
    : "file://" + __dirname + "/splashscreen.html";
var createLoadingWindow = function () {
    windows.loading = new BrowserWindow({
        width: 800,
        height: 600,
        backgroundColor: '#f7fafb',
        skipTaskbar: true,
        frame: false,
        autoHideMenuBar: true,
        resizable: false,
        webPreferences: {
            nodeIntegration: true
        }
    });
    windows.loading.loadURL(loadingURL);
    windows.loading.show();
    windows.loading.on('close', function () { return (windows.loading = null); });
    windows.loading.on('closed', function () { return (windows.loading = null); });
    windows.loading.webContents.on('did-finish-load', function () { return windows.loading.show(); });
};
function broadcastURL(url) {
    if (!url || typeof url !== 'string') {
        return;
    }
    if (windows.main && windows.main.webContents) {
        windows.main.webContents.send('process-url', url);
        deeplinkingUrl = null;
    }
}
assignMenu({ createLoadingWindow: createLoadingWindow });
// The `window.main.show()` is executed after the opening splash screen
ipcMain.on('splashscreen:app-ready', function () {
    if (windows.loading) {
        windows.loading.close();
    }
    windows.main.show();
    windows.main.setFullScreen(windowState ? Boolean(windowState.isFullScreen) : false);
});
ipcMain.on('disable-iframe-protection', function (_event, urls) {
    var filter = { urls: urls };
    windows.main.webContents.session.webRequest.onHeadersReceived(filter, function (details, done) {
        var headers = details.responseHeaders;
        var xFrameOrigin = Object.keys(headers).find(function (header) {
            return header.toString().match(/^x-frame-options$/i);
        });
        if (xFrameOrigin) {
            delete headers[xFrameOrigin];
        }
        done({
            cancel: false,
            responseHeaders: headers,
            statusLine: details.statusLine
        });
    });
});
function createWindow() {
    var _a = screen.getPrimaryDisplay().workAreaSize, width = _a.width, height = _a.height;
    windowState = winState({
        defaultWidth: width,
        defaultHeight: height,
        fullScreen: false
    });
    windows.main = new BrowserWindow({
        width: windowState.width,
        height: windowState.height,
        x: windowState.x,
        y: windowState.y,
        backgroundColor: '#f7fafb',
        center: true,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            webviewTag: true
        }
    });
    windows.main.isMain = true;
    windowState.manage(windows.main);
    windows.main.loadURL(winURL);
    windows.main.hide();
    windows.main.setBackgroundColor('#f7fafb');
    windows.main.on('close', function () { return (windows.main = null); });
    windows.main.on('closed', function () { return (windows.main = null); });
    windows.main.webContents.on('did-finish-load', function () {
        var name = packageJson.build.productName;
        var version = app.getVersion();
        var windowTitle = name + " " + version;
        windows.main.setTitle(windowTitle);
        broadcastURL(deeplinkingUrl);
    });
}
ipcMain.on('show-loading-window-on-reload', function () {
    if (windows.main && windows.main.isMain) {
        windows.main.reload();
        windows.main.webContents.clearHistory();
        windows.main.hide();
        createLoadingWindow();
    }
});
function sendToWindow(key, value) {
    if (windows.main && windows.main.webContents) {
        windows.main.webContents.send(key, value);
        return true;
    }
    return false;
}
// Force Single Instance Application
var gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
    app.exit();
}
else {
    app.on('second-instance', function (_, argv) {
        // Someone tried to run a second instance, we should focus our window.
        // argv: An array of the second instance’s (command line / deep linked) arguments
        for (var _i = 0, argv_1 = argv; _i < argv_1.length; _i++) {
            var arg = argv_1[_i];
            if (arg.startsWith('ark:')) {
                deeplinkingUrl = arg;
                broadcastURL(deeplinkingUrl);
                break;
            }
        }
        if (windows.main) {
            if (windows.main.isMinimized()) {
                windows.main.restore();
            }
            windows.main.focus();
        }
    });
    for (var _i = 0, _a = process.argv; _i < _a.length; _i++) {
        var arg = _a[_i];
        if (arg.startsWith('ark:')) {
            deeplinkingUrl = arg;
            broadcastURL(deeplinkingUrl);
            break;
        }
    }
}
app.on('ready', function () {
    createLoadingWindow();
    createWindow();
    setupPluginManager({ sendToWindow: sendToWindow, windows: windows, ipcMain: ipcMain });
    setupUpdater({ sendToWindow: sendToWindow, ipcMain: ipcMain });
});
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
app.on('activate', function () {
    if (windows.main === null) {
        createLoadingWindow();
        createWindow();
    }
});
app.on('open-url', function (event, url) {
    // Protocol handler for osx
    event.preventDefault();
    deeplinkingUrl = url;
    broadcastURL(deeplinkingUrl);
});
app.setAsDefaultProtocolClient('ark', process.execPath, ['--']);
//# sourceMappingURL=index.js.map