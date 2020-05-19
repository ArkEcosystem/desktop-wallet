var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
/* eslint-disable no-unused-vars */
import path from 'path';
import { castArray } from 'lodash';
import { NodeVM } from 'vm2';
import { HTTP, MESSAGING, WEBSOCKET, PUBLIC, TIMERS, PROFILE_ALL, PROFILE_CURRENT, PEER_ALL, PEER_CURRENT, STORAGE, AUDIO, EVENTS, ALERTS, UTILS, DIALOGS } from './plugin-permission';
import * as HttpSandbox from './sandbox/http-sandbox';
import * as MessagingSandbox from './sandbox/messaging-sandbox';
import * as WebsocketSandbox from './sandbox/websocket-sandbox';
import * as FontAwesomeSandbox from './sandbox/font-awesome-sandbox';
import * as RouteSandbox from './sandbox/route-sandbox';
import * as TimersSandbox from './sandbox/timers-sandbox';
import * as ProfileAllSandbox from './sandbox/profile-all-sandbox';
import * as ProfileCurrentSandbox from './sandbox/profile-current-sandbox';
import * as PeerAllSandbox from './sandbox/peer-all-sandbox';
import * as PeerCurrentSandbox from './sandbox/peer-current-sandbox';
import * as StorageSandbox from './sandbox/storage-sandbox';
import * as AudioSandbox from './sandbox/audio-sandbox';
import * as EventsSandbox from './sandbox/events-sandbox';
import * as AlertsSandbox from './sandbox/alerts-sandbox';
import * as BigNumberSandbox from './sandbox/big-number-sandbox';
import * as DatetimeSandbox from './sandbox/datetime-sandbox';
import * as DialogSandbox from './sandbox/dialogs-sandbox';
var PluginSandbox = /** @class */ (function () {
    function PluginSandbox(_a) {
        var app = _a.app, plugin = _a.plugin;
        this.app = app;
        this.plugin = plugin;
        this.sandbox = {};
        this.walletApi = {};
        this.sandboxes = this.__mapPermissionsToSandbox();
    }
    // Robust VM with relative module resolution and properties implemented by permission
    PluginSandbox.prototype.getComponentVM = function () {
        return new NodeVM({
            sandbox: __assign(__assign({}, this.sandbox), { walletApi: this.walletApi }),
            require: {
                builtin: [],
                context: 'sandbox',
                external: {
                    modules: [],
                    transitive: true
                },
                root: [
                    path.resolve(this.plugin.fullPath)
                ]
            }
        });
    };
    // Basic VM with access to properties required to render elements
    PluginSandbox.prototype.getPluginVM = function () {
        var rootPath = this.plugin.rootPath;
        return new NodeVM({
            sandbox: {
                document: document
            },
            require: {
                context: 'sandbox',
                resolve: function (source) {
                    return path.resolve(rootPath, 'node_modules', source);
                },
                external: ['vue']
            }
        });
    };
    PluginSandbox.prototype.install = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, permissionName;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.__run(this.sandboxes[PUBLIC.name])];
                    case 1:
                        _b.sent();
                        _i = 0, _a = this.plugin.config.permissions;
                        _b.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        permissionName = _a[_i];
                        if (!this.sandboxes[permissionName]) {
                            return [3 /*break*/, 4];
                        }
                        return [4 /*yield*/, this.__run(this.sandboxes[permissionName])];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    PluginSandbox.prototype.destroy = function () {
        return __awaiter(this, void 0, void 0, function () {
            var sandboxesDestroy, _i, _a, permissionName;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        sandboxesDestroy = this.__mapDestroy();
                        _i = 0, _a = this.plugin.config.permissions;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        permissionName = _a[_i];
                        if (!sandboxesDestroy[permissionName]) {
                            return [3 /*break*/, 3];
                        }
                        return [4 /*yield*/, sandboxesDestroy[permissionName]()];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    PluginSandbox.prototype.__run = function (sandboxes) {
        if (sandboxes === void 0) { sandboxes = []; }
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, sandbox;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _i = 0, _a = castArray(sandboxes);
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        sandbox = _a[_i];
                        return [4 /*yield*/, sandbox()];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    PluginSandbox.prototype.__mapPermissionsToSandbox = function () {
        var _a;
        return _a = {},
            _a[ALERTS.name] = AlertsSandbox.create(this.walletApi, this.app),
            _a[AUDIO.name] = AudioSandbox.create(this.sandbox),
            _a[DIALOGS.name] = DialogSandbox.create(this.walletApi),
            _a[EVENTS.name] = EventsSandbox.create(this.walletApi, this.app),
            _a[HTTP.name] = HttpSandbox.create(this.walletApi, this.plugin),
            _a[MESSAGING.name] = MessagingSandbox.create(this.walletApi, this.app),
            _a[PEER_ALL.name] = PeerAllSandbox.create(this.walletApi, this.app),
            _a[PEER_CURRENT.name] = PeerCurrentSandbox.create(this.walletApi, this.app),
            _a[PROFILE_ALL.name] = ProfileAllSandbox.create(this.walletApi, this.app),
            _a[PROFILE_CURRENT.name] = ProfileCurrentSandbox.create(this.walletApi, this.app),
            _a[PUBLIC.name] = [
                FontAwesomeSandbox.create(this.walletApi),
                RouteSandbox.create(this.walletApi, this.plugin, this.app)
            ],
            _a[STORAGE.name] = StorageSandbox.create(this.walletApi, this.app, this.plugin),
            _a[TIMERS.name] = TimersSandbox.create(this.walletApi, this.app),
            _a[UTILS.name] = [
                DatetimeSandbox.create(this.walletApi),
                BigNumberSandbox.create(this.walletApi)
            ],
            _a[WEBSOCKET.name] = WebsocketSandbox.create(this.walletApi, this.app, this.plugin),
            _a;
    };
    PluginSandbox.prototype.__mapDestroy = function () {
        var _a;
        var _this = this;
        return _a = {},
            _a[EVENTS.name] = function () { return EventsSandbox.destroy(_this.walletApi); },
            _a;
    };
    return PluginSandbox;
}());
export { PluginSandbox };
//# sourceMappingURL=plugin-sandbox.js.map