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
import { createLocalVue } from '@vue/test-utils';
import { PLUGINS } from '@config';
import { PluginManager } from '@/services/plugin-manager';
import { PluginSandbox } from '@/services/plugin-manager/plugin-sandbox';
import { PluginSetup } from '@/services/plugin-manager/plugin-setup';
import npmAdapter from '@/services/plugin-manager/adapters/npm-adapter';
import nock from 'nock';
jest.mock('@/services/plugin-manager/plugin-sandbox.js');
jest.mock('@/services/plugin-manager/plugin-setup.js');
jest.mock('fs-extra', function () { return ({
    ensureDirSync: jest.fn(),
    readdirSync: jest.fn(function () { return []; }),
    lstatSync: jest.fn(function () { return ({
        isDirectory: jest.fn(function () { return true; })
    }); })
}); });
jest.mock('@/services/plugin-manager/utils/validate-plugin-path.js', function () { return ({
    validatePluginPath: jest.fn()
}); });
var mockDispatch = jest.fn();
var mockSandboxInstall = jest.fn();
var mockSandboxSetup = jest.fn();
PluginSandbox.mockImplementation(function () { return ({
    install: mockSandboxInstall
}); });
PluginSetup.mockImplementation(function () { return ({
    install: mockSandboxSetup
}); });
var localVue = createLocalVue();
var pkg = {
    name: 'plugin-test',
    description: 'Test',
    title: 'Plugin Test',
    version: '0.0.1'
};
var app = {
    $store: {
        dispatch: mockDispatch,
        getters: {
            'plugin/isEnabled': jest.fn(function (pluginId) { return pluginId === 'plugin-test'; }),
            'plugin/isInstalledSupported': jest.fn(function () { return true; }),
            'plugin/isGrant': jest.fn(function () { return true; }),
            'plugin/lastFetched': jest.fn(function () { return 0; }),
            'profile/byId': jest.fn(function () { }),
            'session/pluginAdapter': 'npm'
        }
    }
};
var pluginManager;
beforeEach(function () {
    mockDispatch.mockReset();
    pluginManager = new PluginManager();
    pluginManager.setVue(localVue);
    pluginManager.setAdapter('npm');
    pluginManager.setApp(app);
});
describe('Plugin Manager', function () {
    it('should load plugins on init', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, pluginManager.init(app)];
                case 1:
                    _a.sent();
                    expect(app.$store.dispatch).toHaveBeenNthCalledWith(1, 'plugin/reset');
                    expect(app.$store.dispatch).toHaveBeenNthCalledWith(2, 'plugin/loadPluginsForProfiles');
                    return [2 /*return*/];
            }
        });
    }); });
    describe('Fetch plugins', function () {
        it('should fetch plugins from path', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        jest.spyOn(pluginManager, 'fetchPluginsFromPath');
                        return [4 /*yield*/, pluginManager.fetchPlugins()];
                    case 1:
                        _a.sent();
                        expect(pluginManager.fetchPluginsFromPath).toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should fetch plugins from adapter if forced', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        jest.spyOn(pluginManager, 'fetchPluginsFromAdapter').mockReturnValue({});
                        return [4 /*yield*/, pluginManager.fetchPlugins(true)];
                    case 1:
                        _a.sent();
                        expect(pluginManager.fetchPluginsFromAdapter).toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        describe('fetchPluginsFromAdapter', function () {
            it('should exclude plugins with minimum version above wallet version', function () { return __awaiter(void 0, void 0, void 0, function () {
                var validPlugin, invalidPlugin, spyNpm;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            validPlugin = {
                                name: 'test-plugin-1',
                                keywords: PLUGINS.keywords,
                                'desktop-wallet': {
                                    minimumVersion: '1.0'
                                }
                            };
                            invalidPlugin = {
                                name: 'test-plugin-2',
                                keywords: PLUGINS.keywords,
                                'desktop-wallet': {
                                    minimumVersion: '3.0'
                                }
                            };
                            jest.spyOn(pluginManager, 'fetchLogo').mockReturnValue(null);
                            jest.spyOn(pluginManager, 'fetchImages').mockReturnValue([]);
                            spyNpm = jest.spyOn(npmAdapter, 'all').mockReturnValue([validPlugin, invalidPlugin]);
                            pluginManager.setAdapter('npm');
                            return [4 /*yield*/, pluginManager.fetchPluginsFromAdapter()];
                        case 1:
                            _a.sent();
                            expect(mockDispatch.mock.calls[0][0]).toBe('plugin/setAvailable');
                            expect(Object.keys(mockDispatch.mock.calls[0][1])).toEqual(['test-plugin-1']);
                            spyNpm.mockRestore();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('Enable plugin', function () {
        it('should throw not initiated error', function () { return __awaiter(void 0, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expect.assertions(1);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, pluginManager.enablePlugin('plugin-1', 'p-1')];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        expect(e_1.message).toBe('Plugin Manager not initiated');
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        it('should throw not found error', function () { return __awaiter(void 0, void 0, void 0, function () {
            var e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expect.assertions(1);
                        return [4 /*yield*/, pluginManager.init(app)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, pluginManager.enablePlugin('plugin-not-loaded', 'p-1')];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        e_2 = _a.sent();
                        expect(e_2.message).toBe('Plugin \'plugin-not-loaded\' not found');
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
        it('should throw not enabled error', function () { return __awaiter(void 0, void 0, void 0, function () {
            var e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expect.assertions(2);
                        return [4 /*yield*/, pluginManager.init(app)];
                    case 1:
                        _a.sent();
                        pluginManager.plugins = {
                            'plugin-not-enabled': {
                                config: {
                                    id: '1'
                                }
                            }
                        };
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, pluginManager.enablePlugin('plugin-not-enabled', 'p-1')];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        e_3 = _a.sent();
                        expect(e_3.message).toBe('Plugin \'1\' is not enabled');
                        expect(app.$store.getters['plugin/isEnabled']).toHaveBeenCalled();
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
        it('should enable', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, pluginManager.init(app)];
                    case 1:
                        _b.sent();
                        pluginManager.plugins = (_a = {},
                            _a[pkg.name] = {
                                config: {
                                    id: pkg.name
                                },
                                fullPath: './test'
                            },
                            _a);
                        return [4 /*yield*/, pluginManager.enablePlugin(pkg.name, 'p-1')];
                    case 2:
                        _b.sent();
                        expect(mockDispatch).toHaveBeenCalledWith('plugin/setLoaded', expect.any(Object));
                        expect(mockSandboxInstall).toHaveBeenCalled();
                        expect(mockSandboxSetup).toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Disable plugin', function () {
        it('should throw not initiated error', function () { return __awaiter(void 0, void 0, void 0, function () {
            var e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expect.assertions(1);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, pluginManager.disablePlugin('plugin-1', 'p-1')];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_4 = _a.sent();
                        expect(e_4.message).toBe('Plugin Manager not initiated');
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        it('should throw not found error', function () { return __awaiter(void 0, void 0, void 0, function () {
            var e_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expect.assertions(1);
                        return [4 /*yield*/, pluginManager.init(app)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, pluginManager.disablePlugin('plugin-not-loaded', 'p-1')];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        e_5 = _a.sent();
                        expect(e_5.message).toBe('Plugin \'plugin-not-loaded\' not found');
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
        it('should disable', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, pluginManager.init(app)];
                    case 1:
                        _c.sent();
                        pluginManager.plugins = (_a = {},
                            _a[pkg.name + "-disabled"] = {
                                config: {
                                    id: pkg.name + "-disabled",
                                    permissions: []
                                }
                            },
                            _a);
                        pluginManager.pluginSetups = (_b = {},
                            _b[pkg.name + "-disabled"] = {
                                destroy: jest.fn()
                            },
                            _b);
                        return [4 /*yield*/, pluginManager.disablePlugin(pkg.name + "-disabled", 'p-1')];
                    case 2:
                        _c.sent();
                        expect(mockDispatch).toHaveBeenCalledWith('plugin/deleteLoaded', { pluginId: pkg.name + "-disabled", profileId: 'p-1' });
                        expect(pluginManager.pluginSetups[pkg.name + "-disabled"].destroy).toHaveBeenCalledTimes(1);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should unload theme', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, pluginManager.init(app)];
                    case 1:
                        _c.sent();
                        pluginManager.plugins = (_a = {},
                            _a[pkg.name + "-disabled"] = {
                                config: {
                                    id: pkg.name + "-disabled",
                                    permissions: ['THEMES']
                                }
                            },
                            _a);
                        pluginManager.pluginSetups = (_b = {},
                            _b[pkg.name + "-disabled"] = {
                                destroy: jest.fn()
                            },
                            _b);
                        return [4 /*yield*/, pluginManager.disablePlugin(pkg.name + "-disabled", 'p-1')];
                    case 2:
                        _c.sent();
                        expect(mockDispatch).toHaveBeenCalledWith('plugin/deleteLoaded', { pluginId: pkg.name + "-disabled", profileId: 'p-1' });
                        expect(mockDispatch).toHaveBeenCalledWith('session/setTheme', expect.any(String));
                        expect(mockDispatch).toHaveBeenCalledWith('profile/update', expect.any(Object));
                        expect(pluginManager.pluginSetups[pkg.name + "-disabled"].destroy).toHaveBeenCalledTimes(1);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('fetchPluginsList', function () {
        it('should fetch using cache-busted url', function () { return __awaiter(void 0, void 0, void 0, function () {
            var spy, spyError;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        spy = jest.spyOn(Date.prototype, 'getTime').mockReturnValue(1234);
                        spyError = jest.spyOn(console, 'error');
                        nock('https://raw.githubusercontent.com')
                            .get('/ark-ecosystem-desktop-plugins/config/master/plugins.json')
                            .query({
                            ts: 1234
                        })
                            .reply(200, []);
                        return [4 /*yield*/, pluginManager.fetchPluginsList()];
                    case 1:
                        _a.sent();
                        expect(spyError).not.toHaveBeenCalled();
                        spy.mockRestore();
                        spyError.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=plugin-manager.spec.js.map