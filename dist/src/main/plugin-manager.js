var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { PLUGINS } from '../../config';
import { download } from 'electron-dl';
import decompress from 'decompress';
import trash from 'trash';
import { ensureDirSync } from 'fs-extra';
import logger from 'electron-log';
export var setupPluginManager = function (_a) {
    var sendToWindow = _a.sendToWindow, windows = _a.windows, ipcMain = _a.ipcMain;
    var downloadItem;
    var savePath;
    var pluginsPath = "" + (process.env.NODE_ENV !== 'development' ? PLUGINS.path : PLUGINS.devPath);
    var cachePath = pluginsPath + "/.cache";
    ensureDirSync(cachePath);
    var prefix = 'plugin-manager:';
    ipcMain.on(prefix + 'download', function (_, _a) {
        var url = _a.url;
        return __awaiter(void 0, void 0, void 0, function () {
            var options, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        downloadItem = undefined;
                        options = {
                            directory: cachePath,
                            onStarted: function (item) {
                                logger.log(prefix + " Download started");
                                downloadItem = item;
                                savePath = item.getSavePath();
                            },
                            onProgress: function (progress) { return sendToWindow(prefix + 'download-progress', progress); }
                        };
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, download(windows.main, url, options)];
                    case 2:
                        _b.sent();
                        logger.log(prefix + " Download complete");
                        sendToWindow(prefix + 'plugin-downloaded', savePath);
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _b.sent();
                        sendToWindow(prefix + 'error', error_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    });
    ipcMain.on(prefix + 'install', function (_, _a) {
        var pluginId = _a.pluginId, pluginPath = _a.pluginPath;
        return __awaiter(void 0, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 6]);
                        if (!pluginPath) return [3 /*break*/, 2];
                        return [4 /*yield*/, trash(pluginPath)];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2:
                        pluginPath = [pluginsPath, pluginId].join('/');
                        return [4 /*yield*/, decompress(savePath, pluginPath, {
                                map: function (file) {
                                    file.path = file.path.split('/').slice(1).join('/');
                                    return file;
                                }
                            })];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, trash(savePath)];
                    case 4:
                        _b.sent();
                        sendToWindow(prefix + 'plugin-installed', pluginPath);
                        return [3 /*break*/, 6];
                    case 5:
                        error_2 = _b.sent();
                        sendToWindow(prefix + 'error', error_2);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    });
    ipcMain.on(prefix + 'cancel', function () { return __awaiter(void 0, void 0, void 0, function () {
        var wait;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    wait = function () { return __awaiter(void 0, void 0, void 0, function () {
                        var state, error_3;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!downloadItem) return [3 /*break*/, 6];
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 2, 4, 5]);
                                    state = downloadItem.getState();
                                    if (state === 'progressing') {
                                        downloadItem.cancel();
                                    }
                                    return [3 /*break*/, 5];
                                case 2:
                                    error_3 = _a.sent();
                                    return [4 /*yield*/, trash(savePath)];
                                case 3:
                                    _a.sent();
                                    return [3 /*break*/, 5];
                                case 4:
                                    logger.log(prefix + " Download cancelled");
                                    return [7 /*endfinally*/];
                                case 5: return [3 /*break*/, 7];
                                case 6:
                                    logger.log(prefix + " Trying to cancel download...");
                                    setTimeout(wait, 100);
                                    _a.label = 7;
                                case 7: return [2 /*return*/];
                            }
                        });
                    }); };
                    return [4 /*yield*/, wait()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    ipcMain.on(prefix + 'cleanup', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, trash(savePath)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
};
//# sourceMappingURL=plugin-manager.js.map