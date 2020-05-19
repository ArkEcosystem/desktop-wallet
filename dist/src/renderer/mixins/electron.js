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
import electron from 'electron';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import os from 'os';
var validatePath = function (parentPath, filePath) {
    var relative = path.relative(parentPath, filePath);
    return relative && !relative.startsWith('..') && !path.isAbsolute(relative);
};
var parseFilters = function (filters) {
    if (typeof filters === 'string') {
        filters = [filters];
    }
    if (Array.isArray(filters) && filters.length) {
        if (filters.every(function (filter) { return typeof filter === 'string'; })) {
            return filters.map(function (filter) { return ({
                name: filter.toUpperCase(), extensions: [filter]
            }); });
        }
    }
    return filters || [
        { name: 'JSON', extensions: ['json'] },
        { name: 'All Files', extensions: ['*'] }
    ];
};
export default {
    methods: {
        electron_openExternal: function (url) {
            electron.shell.openExternal(url);
        },
        electron_reload: function () {
            var win = electron.remote.getCurrentWindow();
            win.reload();
        },
        electron_writeFile: function (raw, defaultPath, options) {
            if (options === void 0) { options = {}; }
            return __awaiter(this, void 0, void 0, function () {
                var filters, filePath;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            filters = parseFilters(options.filters);
                            return [4 /*yield*/, electron.remote.dialog.showSaveDialog({
                                    defaultPath: defaultPath,
                                    filters: filters
                                })];
                        case 1:
                            filePath = (_a.sent()).filePath;
                            if (!filePath)
                                return [2 /*return*/];
                            if (options.restrictToPath && !validatePath(options.restrictToPath, filePath)) {
                                throw new Error("Path \"" + filePath + "\" not allowed");
                            }
                            writeFileSync(filePath, raw, 'utf8');
                            return [2 /*return*/, filePath];
                    }
                });
            });
        },
        electron_readFile: function (defaultPath, options) {
            if (options === void 0) { options = {}; }
            return __awaiter(this, void 0, void 0, function () {
                var filters, filePaths;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            filters = parseFilters(options.filters);
                            return [4 /*yield*/, electron.remote.dialog.showOpenDialog({
                                    defaultPath: defaultPath || os.homedir(),
                                    properties: ['openFile'],
                                    filters: filters
                                })];
                        case 1:
                            filePaths = (_a.sent()).filePaths;
                            if (!filePaths || !filePaths.length)
                                return [2 /*return*/];
                            if (options.restrictToPath && !validatePath(options.restrictToPath, filePaths[0])) {
                                throw new Error("Path \"" + filePaths[0] + "\" not allowed");
                            }
                            return [2 /*return*/, readFileSync(filePaths[0], 'utf8')];
                    }
                });
            });
        }
    }
};
//# sourceMappingURL=electron.js.map