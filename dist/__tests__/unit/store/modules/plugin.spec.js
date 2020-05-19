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
import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import PluginModule from '@/store/modules/plugin';
import pluginManager from '@/services/plugin-manager';
import releaseService from '@/services/release';
import profiles, { profile1 } from '../../__fixtures__/store/profile';
import merge from 'lodash/merge';
var localVue = createLocalVue();
localVue.use(Vuex);
jest.mock('@/services/plugin-manager');
var dateSpy = jest.spyOn(Date, 'now');
dateSpy.mockReturnValue(1);
var availablePlugins = [
    { config: { id: 'plugin-1', version: '0.0.1' } },
    { config: { id: 'plugin-2', version: '0.0.1' } },
    { config: { id: 'plugin-3', version: '0.0.1' } }
];
var installedPlugins = [
    { config: { id: 'plugin-1', version: '1.0.1' } },
    { config: { id: 'plugin-installed', version: '0.0.1' } }
];
var sessionProfileId = jest.fn();
sessionProfileId.mockReturnValue(profile1.id);
var store = new Vuex.Store({
    modules: {
        plugin: PluginModule,
        session: {
            namespaced: true,
            getters: {
                profile: function () {
                    return profile1;
                },
                profileId: function () {
                    return sessionProfileId();
                },
                filterBlacklistedPlugins: function () {
                    return true;
                }
            }
        },
        profile: {
            namespaced: true,
            getters: {
                all: function () {
                    return profiles;
                }
            }
        }
    },
    strict: true
});
store._vm.$plugins = {
    deletePlugin: jest.fn(),
    enablePlugin: jest.fn(),
    disablePlugin: jest.fn()
};
store._vm.$logger = {
    error: jest.fn()
};
var initialState = JSON.parse(JSON.stringify(store.state));
describe('PluginModule', function () {
    describe('getters', function () {
        describe('lastFetched', function () {
            beforeAll(function () {
                store.replaceState(JSON.parse(JSON.stringify(initialState)));
            });
            it('should update lastFetched when setting available plugins', function () {
                expect(store.getters['plugin/lastFetched']).toEqual(0);
                store.dispatch('plugin/setAvailable', {});
                expect(store.getters['plugin/lastFetched']).toEqual(1);
            });
        });
        describe('filtered', function () {
            describe.only('when given a filter', function () {
                beforeAll(function () {
                    var _a, _b;
                    store.replaceState(merge(JSON.parse(JSON.stringify(initialState)), {
                        plugin: {
                            available: (_a = {},
                                _a[availablePlugins[0].config.id] = {
                                    config: __assign(__assign({}, availablePlugins[0].config), { isOfficial: true })
                                },
                                _a[availablePlugins[1].config.id] = availablePlugins[1],
                                _a),
                            whitelisted: {
                                global: (_b = {},
                                    _b[availablePlugins[0].config.id] = {
                                        version: availablePlugins[0].config.version
                                    },
                                    _b[availablePlugins[1].config.id] = {
                                        isGrant: true,
                                        version: availablePlugins[1].config.version
                                    },
                                    _b)
                            }
                        }
                    }));
                });
                it('should filter official plugins only', function () {
                    expect(store.getters['plugin/filtered'](null, null, 'official').map(function (plugin) {
                        return plugin.config.id;
                    })).toEqual([availablePlugins[0].config.id]);
                });
                it('should filter funded plugins only', function () {
                    expect(store.getters['plugin/filtered'](null, null, 'funded').map(function (plugin) {
                        return plugin.config.id;
                    })).toEqual([availablePlugins[1].config.id]);
                });
            });
            describe('blacklisted plugins', function () {
                it('should filter out globally blacklisted plugins', function () {
                    var _a;
                    store.replaceState(merge(JSON.parse(JSON.stringify(initialState)), {
                        plugin: {
                            available: (_a = {},
                                _a[availablePlugins[0].config.id] = availablePlugins[0],
                                _a),
                            blacklisted: {
                                global: [availablePlugins[0].config.id]
                            }
                        }
                    }));
                    expect(store.getters['plugin/filtered']()).toEqual([]);
                });
                it('should filter out locally blacklisted plugins', function () {
                    var _a;
                    store.replaceState(merge(JSON.parse(JSON.stringify(initialState)), {
                        plugin: {
                            available: (_a = {},
                                _a[availablePlugins[0].config.id] = availablePlugins[0],
                                _a),
                            blacklisted: {
                                local: [availablePlugins[0].config.id]
                            }
                        }
                    }));
                    expect(store.getters['plugin/filtered']()).toEqual([]);
                });
            });
            describe('whitelisted plugins', function () {
                it('should filter out plugins that are not installed and not whitelisted', function () {
                    var _a;
                    store.replaceState(merge(JSON.parse(JSON.stringify(initialState)), {
                        plugin: {
                            available: (_a = {},
                                _a[availablePlugins[0].config.id] = availablePlugins[0],
                                _a)
                        }
                    }));
                    expect(store.getters['plugin/filtered']()).toEqual([]);
                });
                it('should filter out plugins that are not installed and whitelisted', function () {
                    var _a, _b;
                    store.replaceState(merge(JSON.parse(JSON.stringify(initialState)), {
                        plugin: {
                            available: (_a = {},
                                _a[availablePlugins[0].config.id] = availablePlugins[0],
                                _a),
                            whitelisted: {
                                global: (_b = {},
                                    _b[availablePlugins[0].config.id] = {
                                        version: availablePlugins[0].config.version
                                    },
                                    _b)
                            }
                        }
                    }));
                    expect(store.getters['plugin/filtered']()).toEqual([availablePlugins[0]]);
                });
                it('should not filter out plugins that are installed and not whitelisted', function () {
                    var _a, _b;
                    store.replaceState(merge(JSON.parse(JSON.stringify(initialState)), {
                        plugin: {
                            available: (_a = {},
                                _a[availablePlugins[0].config.id] = availablePlugins[0],
                                _a),
                            installed: (_b = {},
                                _b[availablePlugins[0].config.id] = availablePlugins[0],
                                _b)
                        }
                    }));
                    expect(store.getters['plugin/filtered']()).toEqual([availablePlugins[0]]);
                });
            });
            describe('when given a category', function () {
                describe('when the category is \'all\'', function () {
                    it('should filter out theme plugins', function () {
                        var _a, _b;
                        var plugin1 = {
                            config: __assign(__assign({}, availablePlugins[0].config), { categories: ['match'] })
                        };
                        var plugin2 = {
                            config: __assign(__assign({}, availablePlugins[1].config), { categories: ['theme'] })
                        };
                        store.replaceState(merge(JSON.parse(JSON.stringify(initialState)), {
                            plugin: {
                                available: (_a = {},
                                    _a[plugin1.config.id] = plugin1,
                                    _a[plugin2.config.id] = plugin2,
                                    _a),
                                whitelisted: {
                                    global: (_b = {},
                                        _b[plugin1.config.id] = {
                                            version: plugin1.config.version
                                        },
                                        _b[plugin2.config.id] = {
                                            version: plugin2.config.version
                                        },
                                        _b)
                                }
                            }
                        }));
                        var result = store.getters['plugin/filtered'](null, 'all');
                        expect(result).toEqual(expect.arrayContaining([plugin1]));
                        expect(result).toEqual(expect.not.arrayContaining([plugin2]));
                    });
                });
                it('should not filter out plugins that match the category', function () {
                    var _a, _b;
                    var plugin1 = {
                        config: __assign(__assign({}, availablePlugins[0].config), { categories: ['match'] })
                    };
                    var plugin2 = {
                        config: __assign(__assign({}, availablePlugins[1].config), { categories: ['no-match'] })
                    };
                    store.replaceState(merge(JSON.parse(JSON.stringify(initialState)), {
                        plugin: {
                            available: (_a = {},
                                _a[plugin1.config.id] = plugin1,
                                _a[plugin2.config.id] = plugin2,
                                _a),
                            whitelisted: {
                                global: (_b = {},
                                    _b[plugin1.config.id] = {
                                        version: plugin1.config.version
                                    },
                                    _b[plugin2.config.id] = {
                                        version: plugin2.config.version
                                    },
                                    _b)
                            }
                        }
                    }));
                    var result = store.getters['plugin/filtered'](null, 'match');
                    expect(result).toEqual(expect.arrayContaining([plugin1]));
                    expect(result).toEqual(expect.not.arrayContaining([plugin2]));
                });
            });
            describe('when given a query', function () {
                it('should filter out plugins that do not match the query', function () {
                    var _a, _b;
                    var plugin1 = {
                        config: __assign(__assign({}, availablePlugins[0].config), { keywords: ['yes'] })
                    };
                    var plugin2 = {
                        config: __assign(__assign({}, availablePlugins[1].config), { keyowrds: ['no'] })
                    };
                    store.replaceState(merge(JSON.parse(JSON.stringify(initialState)), {
                        plugin: {
                            available: (_a = {},
                                _a[plugin1.config.id] = plugin1,
                                _a[plugin2.config.id] = plugin2,
                                _a),
                            whitelisted: {
                                global: (_b = {},
                                    _b[plugin1.config.id] = {
                                        version: plugin1.config.version
                                    },
                                    _b[plugin2.config.id] = {
                                        version: plugin2.config.version
                                    },
                                    _b)
                            }
                        }
                    }));
                    var result = store.getters['plugin/filtered']('yes');
                    expect(result).toEqual(expect.arrayContaining([plugin1]));
                    expect(result).toEqual(expect.not.arrayContaining([plugin2]));
                });
            });
        });
        describe('available', function () {
            beforeAll(function () {
                store.replaceState(JSON.parse(JSON.stringify(initialState)));
            });
            it('should return all available plugins', function () {
                store.dispatch('plugin/setAvailable', availablePlugins);
                expect(store.getters['plugin/available']).toEqual(availablePlugins);
            });
        });
        describe('availableById', function () {
            beforeAll(function () {
                store.replaceState(JSON.parse(JSON.stringify(initialState)));
            });
            it('should return null if there are no available plugins', function () {
                expect(store.getters['plugin/availableById'](availablePlugins[0].config.id)).toBeNull();
            });
            it('should return null if the plugin cannot be found', function () {
                expect(store.getters['plugin/availableById']('plugin-not-available')).toBeNull();
            });
            it('should return the plugin if it is available', function () {
                store.dispatch('plugin/setAvailable', [availablePlugins[0]]);
                expect(store.getters['plugin/availableById'](availablePlugins[0].config.id)).toEqual(availablePlugins[0]);
            });
        });
        describe('isAvailable', function () {
            beforeAll(function () {
                store.replaceState(JSON.parse(JSON.stringify(initialState)));
            });
            it('should be possible to check if a plugin is available', function () {
                store.dispatch('plugin/setAvailable', [availablePlugins[0]]);
                expect(store.getters['plugin/isAvailable'](availablePlugins[0].config.id)).toBe(true);
                expect(store.getters['plugin/isAvailable']('plugin-not-available')).toBe(false);
            });
        });
        describe('installed', function () {
            beforeAll(function () {
                store.replaceState(JSON.parse(JSON.stringify(initialState)));
            });
            it('should return all installed plugins', function () {
                for (var _i = 0, installedPlugins_1 = installedPlugins; _i < installedPlugins_1.length; _i++) {
                    var plugin = installedPlugins_1[_i];
                    store.dispatch('plugin/setInstalled', plugin);
                }
                expect(store.getters['plugin/installed']).toEqual(installedPlugins);
            });
        });
        describe('installedById', function () {
            beforeAll(function () {
                store.replaceState(JSON.parse(JSON.stringify(initialState)));
            });
            it('should return null if there are no installed plugins', function () {
                expect(store.getters['plugin/installedById'](installedPlugins[0].config.id)).toBeNull();
            });
            it('should return null if the plugin cannot be found', function () {
                expect(store.getters['plugin/installedById']('plugin-not-installed')).toBeNull();
            });
            it('should return the plugin if it is installed', function () {
                store.dispatch('plugin/setInstalled', installedPlugins[0]);
                expect(store.getters['plugin/installedById'](installedPlugins[0].config.id)).toEqual(installedPlugins[0]);
            });
        });
        describe('isInstalled', function () {
            beforeAll(function () {
                store.replaceState(JSON.parse(JSON.stringify(initialState)));
            });
            it('should be possible to check if a plugin is installed', function () {
                store.dispatch('plugin/setInstalled', installedPlugins[0]);
                expect(store.getters['plugin/isInstalled'](installedPlugins[0].config.id)).toBe(true);
                expect(store.getters['plugin/isInstalled']('plugin-not-installed')).toBe(false);
            });
        });
        describe('isUpdateAvailable', function () {
            beforeAll(function () {
                store.replaceState(JSON.parse(JSON.stringify(initialState)));
            });
            it('should return false if the plugin is not available', function () {
                var plugin = availablePlugins[0];
                store.dispatch('plugin/setInstalled', plugin);
                expect(store.getters['plugin/isUpdateAvailable'](plugin.config.id)).toBe(false);
            });
            it('should return false if the plugin is not installed', function () {
                var plugin = availablePlugins[0];
                store.dispatch('plugin/setAvailable', [plugin]);
                expect(store.getters['plugin/isUpdateAvailable'](plugin.config.id)).toBe(false);
            });
            it('should return false if the installed version is equal or higher than the available version', function () {
                store.dispatch('plugin/setAvailable', [availablePlugins[0]]);
                store.dispatch('plugin/setInstalled', installedPlugins[0]);
                expect(store.getters['plugin/isUpdateAvailable'](availablePlugins[0].config.id)).toBe(false);
            });
            it('should return true if the installed version is lower than the available version', function () {
                store.dispatch('plugin/setAvailable', [installedPlugins[0]]);
                store.dispatch('plugin/setInstalled', availablePlugins[0]);
                expect(store.getters['plugin/isUpdateAvailable'](availablePlugins[0].config.id)).toBe(true);
            });
        });
        describe('latestVersion', function () {
            beforeAll(function () {
                store.replaceState(JSON.parse(JSON.stringify(initialState)));
            });
            it('should return null if the plugin is not available', function () {
                expect(store.getters['plugin/latestVersion']('plugin-not-available')).toBeNull();
            });
            it('should return the version of the available plugin', function () {
                store.dispatch('plugin/setAvailable', [availablePlugins[0]]);
                expect(store.getters['plugin/latestVersion'](availablePlugins[0].config.id)).toBe(availablePlugins[0].config.version);
            });
        });
        describe('all', function () {
            beforeAll(function () {
                store.replaceState(JSON.parse(JSON.stringify(initialState)));
            });
            it('should return all available and installed plugins', function () {
                store.dispatch('plugin/setAvailable', availablePlugins);
                for (var _i = 0, installedPlugins_2 = installedPlugins; _i < installedPlugins_2.length; _i++) {
                    var plugin = installedPlugins_2[_i];
                    store.dispatch('plugin/setInstalled', plugin);
                }
                var all = store.getters['plugin/all'];
                var _loop_1 = function (plugin) {
                    expect(all.find(function (p) { return p.config.id === plugin; })).toBeTruthy();
                };
                for (var _a = 0, _b = availablePlugins.concat(installedPlugins).map(function (p) { return p.config.id; }); _a < _b.length; _a++) {
                    var plugin = _b[_a];
                    _loop_1(plugin);
                }
            });
            it('should merge all available and installed plugins correctly', function () {
                store.dispatch('plugin/setAvailable', availablePlugins);
                for (var _i = 0, installedPlugins_3 = installedPlugins; _i < installedPlugins_3.length; _i++) {
                    var plugin = installedPlugins_3[_i];
                    store.dispatch('plugin/setInstalled', plugin);
                }
                expect(store.getters['plugin/all'].find(function (p) { return p.config.id === 'plugin-1'; })).toEqual(installedPlugins[0]);
            });
        });
        describe('isEnabled', function () {
            beforeAll(function () {
                var _a, _b;
                store.replaceState(merge(JSON.parse(JSON.stringify(initialState)), {
                    plugin: {
                        enabled: (_a = {},
                            _a[profile1.id] = (_b = {},
                                _b[availablePlugins[0].config.id] = true,
                                _b),
                            _a)
                    }
                }));
            });
            describe('when no profile id given', function () {
                it('should return false if the plugin is not enabled', function () {
                    expect(store.getters['plugin/isEnabled']('plugin-not-enabled')).toBe(false);
                });
                it('should return true if the plugin is enabled', function () {
                    expect(store.getters['plugin/isEnabled'](availablePlugins[0].config.id)).toBe(true);
                });
            });
            describe('when profile id given', function () {
                it('should return false if the plugin is not enabled', function () {
                    expect(store.getters['plugin/isEnabled']('plugin-not-enabled', profile1.id)).toBe(false);
                });
                it('should return false if there are no enabled plugins', function () {
                    expect(store.getters['plugin/isEnabled']('plugin-not-enabled', 'wrong-profile')).toBe(false);
                });
                it('should return true if the plugin is enabled', function () {
                    expect(store.getters['plugin/isEnabled'](availablePlugins[0].config.id, profile1.id)).toBe(true);
                });
            });
        });
        describe('loaded', function () {
            beforeAll(function () {
                store.replaceState(JSON.parse(JSON.stringify(initialState)));
            });
            it('should return an empty object if there is no session profile', function () {
                sessionProfileId.mockReturnValue(null);
                expect(store.getters['plugin/loaded']).toEqual({});
            });
            it('should return an empty object if there are no loaded plugins for the session profile', function () {
                sessionProfileId.mockReturnValue(profile1.id);
                expect(store.getters['plugin/loaded']).toEqual({});
            });
            it('should return the loaded plugins for the session profile', function () {
                var _a, _b, _c;
                store.replaceState(merge(JSON.parse(JSON.stringify(initialState)), {
                    plugin: {
                        loaded: (_a = {},
                            _a[profile1.id] = (_b = {},
                                _b[availablePlugins[0].config.id] = __assign(__assign({}, availablePlugins[0]), { profileId: profile1.id, avatars: [], menuItems: [] }),
                                _b),
                            _a)
                    }
                }));
                expect(store.getters['plugin/loaded']).toEqual((_c = {},
                    _c[availablePlugins[0].config.id] = {
                        avatars: [],
                        menuItems: [],
                        config: availablePlugins[0].config,
                        profileId: profile1.id
                    },
                    _c));
            });
        });
        describe('isLoaded', function () {
            beforeAll(function () {
                var _a, _b;
                store.replaceState(merge(JSON.parse(JSON.stringify(initialState)), {
                    plugin: {
                        loaded: (_a = {},
                            _a[profile1.id] = (_b = {},
                                _b[availablePlugins[0].config.id] = __assign(__assign({}, availablePlugins[0]), { profileId: profile1.id, avatars: [], menuItems: [] }),
                                _b),
                            _a)
                    }
                }));
            });
            describe('when no profile id is given', function () {
                it('should return true if the plugin is loaded', function () {
                    expect(store.getters['plugin/isLoaded'](availablePlugins[0].config.id)).toBe(true);
                });
                it('should return false if the plugin is not loaded', function () {
                    expect(store.getters['plugin/isLoaded']('plugin-not-loaded')).toBe(false);
                });
            });
            describe('when profile id is given', function () {
                it('should return true if the plugin is loaded', function () {
                    expect(store.getters['plugin/isLoaded'](availablePlugins[0].config.id, profile1.id)).toBe(true);
                });
                it('should return false if the plugin is not loaded', function () {
                    expect(store.getters['plugin/isLoaded']('plugin-not-loaded', profile1.id)).toBe(false);
                });
                it('should return false if the profile id does not exist', function () {
                    expect(store.getters['plugin/isLoaded']('plugin-not-loaded', 'profile-invalid')).toBe(false);
                });
            });
        });
        describe('isBlacklisted', function () {
            beforeAll(function () {
                store.replaceState(merge(JSON.parse(JSON.stringify(initialState)), {
                    plugin: {
                        blacklisted: {
                            global: [availablePlugins[0].config.id],
                            local: [availablePlugins[1].config.id]
                        }
                    }
                }));
            });
            it('should return true if the plugin is blacklisted globally', function () {
                expect(store.getters['plugin/isBlacklisted'](availablePlugins[0].config.id)).toBe(true);
            });
            it('should return true if the plugin is blacklisted locally', function () {
                expect(store.getters['plugin/isBlacklisted'](availablePlugins[1].config.id)).toBe(true);
            });
            it('should return false if the plugin is not blacklisted', function () {
                expect(store.getters['plugin/isBlacklisted']('plugin-not-blacklisted')).toBe(false);
            });
        });
        describe('isWhitelisted', function () {
            beforeAll(function () {
                var _a;
                store.replaceState(JSON.parse(JSON.stringify(initialState)));
                store.dispatch('plugin/setWhitelisted', {
                    scope: 'global',
                    plugins: (_a = {},
                        _a[availablePlugins[0].config.id] = {
                            version: availablePlugins[0].config.version
                        },
                        _a)
                });
            });
            it('should return true if the plugin is whitelisted and the version is lower or equal', function () {
                var equal = {
                    config: {
                        id: availablePlugins[0].config.id,
                        version: '0.0.1'
                    }
                };
                expect(store.getters['plugin/isWhitelisted'](equal)).toBe(true);
            });
            it('should return false if the plugin is whitelisted and the version is higher', function () {
                var higher = {
                    config: {
                        id: availablePlugins[0].config.id,
                        version: '1.0.0'
                    }
                };
                expect(store.getters['plugin/isWhitelisted'](higher)).toBe(false);
            });
            it('should return false if the plugin is not whitelisted', function () {
                expect(store.getters['plugin/isWhitelisted']({ config: { id: 'plugin-not-whitelisted' } })).toBe(false);
            });
        });
        describe('isGrant', function () {
            beforeAll(function () {
                var _a;
                store.replaceState(JSON.parse(JSON.stringify(initialState)));
                store.dispatch('plugin/setWhitelisted', {
                    scope: 'global',
                    plugins: (_a = {},
                        _a[availablePlugins[0].config.id] = {
                            isGrant: true,
                            version: availablePlugins[0].config.version
                        },
                        _a[availablePlugins[1].config.id] = {
                            version: availablePlugins[1].config.version
                        },
                        _a)
                });
            });
            it('should return true if the plugin is whitelisted and is a funded by ark grants', function () {
                var pluginId = availablePlugins[0].config.id;
                expect(store.getters['plugin/isGrant'](pluginId)).toBe(true);
            });
            it('should return false if the plugin is whitelisted and is a not funded by ark grants', function () {
                var pluginId = availablePlugins[1].config.id;
                expect(store.getters['plugin/isGrant'](pluginId)).toBe(false);
            });
            it('should return false if the plugin is not whitelisted and is a not funded by ark grants', function () {
                expect(store.getters['plugin/isGrant']('plugin-not-grants')).toBe(false);
            });
        });
        describe('isInstalledSupported', function () {
            var spy;
            beforeAll(function () {
                store.replaceState(JSON.parse(JSON.stringify(initialState)));
                spy = jest.spyOn(releaseService, 'currentVersion', 'get').mockImplementation(function () { return '2.0.0'; });
            });
            afterAll(function () {
                spy.mockRestore();
            });
            it('should return true if the plugin does not define a min version', function () {
                store.dispatch('plugin/setInstalled', installedPlugins[0]);
                expect(store.getters['plugin/isInstalledSupported'](installedPlugins[0].config.id)).toBe(true);
            });
            it('should return true if the wallet version is equal or higher than the defined min version', function () {
                store.dispatch('plugin/setInstalled', {
                    config: __assign(__assign({}, installedPlugins[0].config), { minimumVersion: '1.0.0' })
                });
                expect(store.getters['plugin/isInstalledSupported'](installedPlugins[0].config.id)).toBe(true);
            });
            it('should return false if the wallet version is lower than the defined min version', function () {
                store.dispatch('plugin/setInstalled', {
                    config: __assign(__assign({}, installedPlugins[0].config), { minimumVersion: '3.0.0' })
                });
                expect(store.getters['plugin/isInstalledSupported'](installedPlugins[0].config.id)).toBe(false);
            });
        });
        describe('avatar', function () {
            beforeAll(function () {
                var _a;
                store.replaceState(merge(JSON.parse(JSON.stringify(initialState)), {
                    plugin: {
                        loaded: (_a = {},
                            _a[profile1.id] = {
                                'avatar-plugin': {}
                            },
                            _a)
                    }
                }));
            });
            it('should return null if there are no loaded plugins for the given profile', function () {
                expect(store.getters['plugin/avatar'](profiles[1])).toBe(null);
            });
            it('should retrieve the avatar components from the plugin manager', function () {
                var spy = jest.spyOn(pluginManager, 'getAvatarComponents').mockImplementation(function () {
                    var _a;
                    return (_a = {},
                        _a[profile1.avatar.avatarName] = 'avatar',
                        _a);
                });
                expect(store.getters['plugin/avatar'](profile1)).toBe('avatar');
                expect(spy).toHaveBeenCalledWith(profile1.avatar.pluginId);
                spy.mockRestore();
            });
        });
        describe('avatars', function () {
            beforeEach(function () {
                var _a, _b;
                store.replaceState(merge(JSON.parse(JSON.stringify(initialState)), {
                    plugin: {
                        loaded: (_a = {},
                            _a[profile1.id] = (_b = {},
                                _b[availablePlugins[0].config.id] = __assign(__assign({}, availablePlugins[0]), { avatars: { 'avatar-1': 'avatar-1' } }),
                                _b),
                            _a)
                    }
                }));
            });
            it('should return an empty list if there are no loaded plugins for the given profile', function () {
                expect(store.getters['plugin/avatars'](profiles[1].id)).toEqual([]);
            });
            it.each([null, profile1.id])('should return the avatars', function (profileId) {
                var spy = jest.spyOn(pluginManager, 'getAvatarComponents').mockImplementation(function () {
                    return store.getters['plugin/loaded'][availablePlugins[0].config.id].avatars;
                });
                expect(store.getters['plugin/avatars'](profileId)).toEqual([{
                        component: 'avatar-1',
                        name: 'avatar-1',
                        pluginId: availablePlugins[0].config.id
                    }]);
                spy.mockRestore();
            });
        });
        describe('menuItems', function () {
            beforeAll(function () {
                var _a, _b;
                store.replaceState(merge(JSON.parse(JSON.stringify(initialState)), {
                    plugin: {
                        loaded: (_a = {},
                            _a[profile1.id] = (_b = {},
                                _b[availablePlugins[0].config.id] = {
                                    menuItems: [{ title: 'menu-item-1' }]
                                },
                                _b[availablePlugins[1].config.id] = {
                                    menuItems: [{ title: 'menu-item-2' }]
                                },
                                _b),
                            _a)
                    }
                }));
            });
            it('should retrieve all menu items', function () {
                expect(store.getters['plugin/menuItems']).toEqual([
                    { title: 'menu-item-1' },
                    { title: 'menu-item-2' }
                ]);
            });
        });
        describe('themes', function () {
            beforeAll(function () {
                store.replaceState(JSON.parse(JSON.stringify(initialState)));
            });
            it('should return an empty object if there are no loaded plugins', function () {
                expect(store.getters['plugin/themes']).toEqual({});
            });
            it('should return an empty object if there are no loaded plugins with themes', function () {
                var _a, _b;
                store.replaceState(merge(JSON.parse(JSON.stringify(initialState)), {
                    plugin: {
                        loaded: (_a = {},
                            _a[profile1.id] = (_b = {},
                                _b[availablePlugins[0].config.id] = {},
                                _b),
                            _a)
                    }
                }));
                expect(store.getters['plugin/themes']).toEqual({});
            });
            it('should retrieve all themes of loaded plugins', function () {
                var _a, _b;
                store.replaceState(merge(JSON.parse(JSON.stringify(initialState)), {
                    plugin: {
                        loaded: (_a = {},
                            _a[profile1.id] = (_b = {},
                                _b[availablePlugins[0].config.id] = {},
                                _b[availablePlugins[1].config.id] = {
                                    themes: {
                                        'theme-1': {}
                                    }
                                },
                                _b),
                            _a)
                    }
                }));
                expect(store.getters['plugin/themes']).toEqual({ 'theme-1': {} });
            });
        });
        describe('languages', function () {
            beforeAll(function () {
                store.replaceState(JSON.parse(JSON.stringify(initialState)));
            });
            it('should return an empty object if there are no loaded plugins', function () {
                expect(store.getters['plugin/languages']).toEqual({});
            });
            it('should return an empty object if there are no loaded plugins with languages', function () {
                var _a, _b;
                store.replaceState(merge(JSON.parse(JSON.stringify(initialState)), {
                    plugin: {
                        loaded: (_a = {},
                            _a[profile1.id] = (_b = {},
                                _b[availablePlugins[0].config.id] = {},
                                _b),
                            _a)
                    }
                }));
                expect(store.getters['plugin/languages']).toEqual({});
            });
            it('should retrieve all languages of loaded plugins', function () {
                var _a, _b;
                store.replaceState(merge(JSON.parse(JSON.stringify(initialState)), {
                    plugin: {
                        loaded: (_a = {},
                            _a[profile1.id] = (_b = {},
                                _b[availablePlugins[0].config.id] = {},
                                _b[availablePlugins[1].config.id] = {
                                    languages: {
                                        'language-1': {}
                                    }
                                },
                                _b),
                            _a)
                    }
                }));
                expect(store.getters['plugin/languages']).toEqual({ 'language-1': {} });
            });
        });
        describe('walletTabs', function () {
            beforeEach(function () {
                var _a, _b;
                store.replaceState(merge(JSON.parse(JSON.stringify(initialState)), {
                    plugin: {
                        loaded: (_a = {},
                            _a[profile1.id] = (_b = {},
                                _b[availablePlugins[0].config.id] = {},
                                _b[availablePlugins[1].config.id] = {
                                    walletTabs: [{
                                            name: 'tab-1'
                                        }]
                                },
                                _b),
                            _a)
                    }
                }));
            });
            it('should return the wallet tabs', function () {
                var spy = jest.spyOn(pluginManager, 'getWalletTabComponent').mockImplementation(function () { return 'tab-1-component'; });
                expect(store.getters['plugin/walletTabs']).toEqual([{
                        name: 'tab-1',
                        component: 'tab-1-component'
                    }]);
                spy.mockRestore();
            });
        });
        describe('enabled', function () {
            beforeAll(function () {
                store.replaceState(JSON.parse(JSON.stringify(initialState)));
            });
            it('should return an empty object if there is no session profile', function () {
                sessionProfileId.mockReturnValue(null);
                expect(store.getters['plugin/enabled']).toEqual({});
            });
            it('should return an empty object if there are no enabled plugins for the session profile', function () {
                sessionProfileId.mockReturnValue(profile1.id);
                expect(store.getters['plugin/enabled']).toEqual({});
            });
            it('should return the enabled plugins for the session profile', function () {
                var _a, _b, _c;
                store.replaceState(merge(JSON.parse(JSON.stringify(initialState)), {
                    plugin: {
                        enabled: (_a = {},
                            _a[profile1.id] = (_b = {},
                                _b[availablePlugins[0].config.id] = true,
                                _b),
                            _a)
                    }
                }));
                expect(store.getters['plugin/enabled']).toEqual((_c = {}, _c[availablePlugins[0].config.id] = true, _c));
            });
        });
        describe('profileHasPluginOptions', function () {
            beforeAll(function () {
                var _a, _b;
                store.replaceState(merge(JSON.parse(JSON.stringify(initialState)), {
                    plugin: {
                        pluginOptions: (_a = {},
                            _a[profile1.id] = (_b = {},
                                _b[availablePlugins[0].config.id] = {},
                                _b),
                            _a)
                    }
                }));
            });
            describe('when no profile id given', function () {
                it('should return true if there are options', function () {
                    expect(store.getters['plugin/profileHasPluginOptions'](availablePlugins[0].config.id)).toBe(true);
                });
                it('should return false if there are options', function () {
                    expect(store.getters['plugin/profileHasPluginOptions']('plugin-no-options')).toBe(false);
                });
            });
            describe('when profile id given', function () {
                it('should return true if there are options', function () {
                    expect(store.getters['plugin/profileHasPluginOptions'](availablePlugins[0].config.id, profile1.id)).toBe(true);
                });
                it('should return false if there are options', function () {
                    expect(store.getters['plugin/profileHasPluginOptions']('plugin-no-options', profile1.id)).toBe(false);
                });
            });
        });
        describe('pluginOptions', function () {
            var options = { foo: 'bar' };
            beforeAll(function () {
                var _a, _b;
                store.replaceState(merge(JSON.parse(JSON.stringify(initialState)), {
                    plugin: {
                        pluginOptions: (_a = {},
                            _a[profile1.id] = (_b = {},
                                _b[availablePlugins[0].config.id] = options,
                                _b),
                            _a)
                    }
                }));
            });
            it('should return an empty object if there are options for the given profile', function () {
                expect(store.getters['plugin/pluginOptions'](availablePlugins[0].config.id, 'profile-no-options')).toEqual({});
            });
            it('should return an empty object if there are options for the given plugin and profile', function () {
                expect(store.getters['plugin/pluginOptions']('plugin-not-available', profile1.id)).toEqual({});
            });
            it('should return a copy of the object', function () {
                expect(store.getters['plugin/pluginOptions'](availablePlugins[0].config.id, profile1.id)).toEqual(options);
            });
        });
    });
    describe('actions', function () {
        describe('setBlacklisted', function () {
            beforeEach(function () {
                var _a, _b;
                store.replaceState(merge(JSON.parse(JSON.stringify(initialState)), {
                    plugin: {
                        enabled: (_a = {},
                            _a[profile1.id] = (_b = {},
                                _b[availablePlugins[0].config.id] = true,
                                _b),
                            _a)
                    }
                }));
            });
            var plugins = availablePlugins.map(function (plugin) { return plugin.config.id; });
            it('should set blacklisted plugins on the given scope', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            expect(store.getters['plugin/blacklisted'].global).toEqual([]);
                            return [4 /*yield*/, store.dispatch('plugin/setBlacklisted', {
                                    scope: 'global',
                                    plugins: plugins
                                })];
                        case 1:
                            _a.sent();
                            expect(store.getters['plugin/blacklisted'].global).toEqual(plugins);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should disable a plugin if it is enabled on a profile', function () { return __awaiter(void 0, void 0, void 0, function () {
                var spy;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            spy = jest.spyOn(store, 'dispatch');
                            return [4 /*yield*/, store.dispatch('plugin/setBlacklisted', {
                                    scope: 'global',
                                    plugins: plugins
                                })];
                        case 1:
                            _a.sent();
                            expect(spy).toHaveBeenCalledWith('plugin/setEnabled', {
                                enabled: false,
                                pluginId: availablePlugins[0].config.id,
                                profileId: profile1.id
                            });
                            spy.mockRestore();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('setLoaded', function () {
            beforeAll(function () {
                var _a, _b;
                store.replaceState(merge(JSON.parse(JSON.stringify(initialState)), {
                    plugin: {
                        enabled: (_a = {},
                            _a[profile1.id] = (_b = {},
                                _b[availablePlugins[0].config.id] = true,
                                _b[availablePlugins[2].config.id] = true,
                                _b),
                            _a)
                    }
                }));
            });
            it('should throw an error if the plugin is not enabled', function () {
                try {
                    store.dispatch('plugin/setLoaded', __assign(__assign({}, availablePlugins[1]), { profileId: profile1.id }));
                }
                catch (e) {
                    expect(e.message).toBe('Plugin is not enabled');
                }
            });
            it('should load the plugin if it is enabled', function () {
                expect(store.getters['plugin/isLoaded'](availablePlugins[0].config.id, profile1.id)).toBe(false);
                store.dispatch('plugin/setLoaded', __assign(__assign({}, availablePlugins[0]), { profileId: profile1.id }));
                expect(store.getters['plugin/isLoaded'](availablePlugins[0].config.id, profile1.id)).toBe(true);
            });
            it('should load the plugin on the session profile if no profile id given', function () {
                expect(store.getters['plugin/isLoaded'](availablePlugins[2].config.id, profile1.id)).toBe(false);
                store.dispatch('plugin/setLoaded', availablePlugins[2]);
                expect(store.getters['plugin/isLoaded'](availablePlugins[2].config.id, profile1.id)).toBe(true);
            });
        });
        describe('reset', function () {
            var dummy = { foo: 'bar' };
            beforeEach(function () {
                store.replaceState(merge(JSON.parse(JSON.stringify(initialState)), {
                    plugin: {
                        loaded: dummy,
                        installed: dummy
                    }
                }));
            });
            it('should reset loaded plugins to empty object', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            expect(store.state.plugin.loaded).toEqual(dummy);
                            return [4 /*yield*/, store.dispatch('plugin/reset')];
                        case 1:
                            _a.sent();
                            expect(store.state.plugin.loaded).toEqual({});
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should reset installed plugins to empty object', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            expect(store.state.plugin.installed).toEqual(dummy);
                            return [4 /*yield*/, store.dispatch('plugin/reset')];
                        case 1:
                            _a.sent();
                            expect(store.state.plugin.installed).toEqual({});
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('loadPluginsForProfiles', function () {
            beforeAll(function () {
                store.replaceState(JSON.parse(JSON.stringify(initialState)));
            });
            it('should dispatch loadPluginsForProfile for every profile', function () { return __awaiter(void 0, void 0, void 0, function () {
                var spy, _i, profiles_1, profile;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            spy = jest.spyOn(store, 'dispatch');
                            return [4 /*yield*/, store.dispatch('plugin/loadPluginsForProfiles')];
                        case 1:
                            _a.sent();
                            for (_i = 0, profiles_1 = profiles; _i < profiles_1.length; _i++) {
                                profile = profiles_1[_i];
                                expect(spy).toHaveBeenCalledWith('plugin/loadPluginsForProfile', profile);
                            }
                            spy.mockRestore();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('loadPluginsForProfile', function () {
            beforeAll(function () {
                var _a, _b, _c, _d, _e;
                store.replaceState(merge(JSON.parse(JSON.stringify(initialState)), {
                    plugin: {
                        enabled: (_a = {},
                            _a[profile1.id] = (_b = {
                                    'plugin-not-installed': false
                                },
                                _b[availablePlugins[0].config.id] = true,
                                _b[availablePlugins[1].config.id] = true,
                                _b[availablePlugins[2].config.id] = true,
                                _b),
                            _a),
                        installed: (_c = {},
                            _c[availablePlugins[1].config.id] = availablePlugins[1],
                            _c[availablePlugins[2].config.id] = availablePlugins[2],
                            _c),
                        loaded: (_d = {},
                            _d[profile1.id] = (_e = {},
                                _e[availablePlugins[2].config.id] = __assign(__assign({}, availablePlugins[0]), { avatars: [], menuItems: [] }),
                                _e),
                            _d)
                    }
                }));
            });
            it('should return early if there are no enabled plugins for the given profile', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = expect;
                            return [4 /*yield*/, store.dispatch('plugin/loadPluginsForProfile', profiles[1])];
                        case 1:
                            _a.apply(void 0, [_b.sent()]).toBe(undefined);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should try to enable the plugins for the given profile', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, store.dispatch('plugin/loadPluginsForProfile', profile1)];
                        case 1:
                            _a.sent();
                            expect(store._vm.$plugins.enablePlugin).toHaveBeenCalledTimes(1);
                            expect(store._vm.$plugins.enablePlugin).toHaveBeenCalledWith(availablePlugins[1].config.id, profile1.id);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should log the error if enabling a plugin fails', function () { return __awaiter(void 0, void 0, void 0, function () {
                var spy;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            spy = jest.spyOn(store._vm.$plugins, 'enablePlugin').mockImplementation(function () {
                                throw new Error('error');
                            });
                            return [4 /*yield*/, store.dispatch('plugin/loadPluginsForProfile', profile1)];
                        case 1:
                            _a.sent();
                            expect(store._vm.$logger.error).toHaveBeenCalledWith("Could not enable 'plugin-2' for profile 'Profile 1': error");
                            spy.mockRestore();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('setEnabled', function () {
            beforeAll(function () {
                var _a, _b;
                store.replaceState(merge(JSON.parse(JSON.stringify(initialState)), {
                    plugin: {
                        enabled: (_a = {},
                            _a[profile1.id] = (_b = {},
                                _b[availablePlugins[0].config.id] = true,
                                _b[availablePlugins[1].config.id] = false,
                                _b),
                            _a)
                    }
                }));
            });
            describe('when enabling a plugin', function () {
                it('should return early if the plugin is not disabled', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _a = expect;
                                return [4 /*yield*/, store.dispatch('plugin/setEnabled', {
                                        enabled: true,
                                        pluginId: availablePlugins[0].config.id
                                    })];
                            case 1:
                                _a.apply(void 0, [_b.sent()]).toBe(undefined);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('should throw an error if it cannot enable the plugin', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var spy, commitSpy, e_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                spy = jest.spyOn(store._vm.$plugins, 'enablePlugin').mockImplementation(function () {
                                    throw new Error('error');
                                });
                                commitSpy = jest.spyOn(store, 'commit');
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, store.dispatch('plugin/setEnabled', {
                                        enabled: true,
                                        pluginId: availablePlugins[1].config.id,
                                        profileId: profiles[1].id
                                    })];
                            case 2:
                                _a.sent();
                                return [3 /*break*/, 4];
                            case 3:
                                e_1 = _a.sent();
                                expect(e_1.message).toBe('error');
                                return [3 /*break*/, 4];
                            case 4:
                                expect(commitSpy).toHaveBeenCalledTimes(2);
                                spy.mockRestore();
                                commitSpy.mockRestore();
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
            describe('when disabling a plugin', function () {
                it('should return early if the plugin is not enabled', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _a = expect;
                                return [4 /*yield*/, store.dispatch('plugin/setEnabled', {
                                        enabled: false,
                                        pluginId: availablePlugins[1].config.id
                                    })];
                            case 1:
                                _a.apply(void 0, [_b.sent()]).toBe(undefined);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('should throw an error if it cannot disable the plugin', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var spy, commitSpy, e_2;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                spy = jest.spyOn(store._vm.$plugins, 'disablePlugin').mockImplementation(function () {
                                    throw new Error('error');
                                });
                                commitSpy = jest.spyOn(store, 'commit');
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, store.dispatch('plugin/setEnabled', {
                                        enabled: false,
                                        pluginId: availablePlugins[0].config.id
                                    })];
                            case 2:
                                _a.sent();
                                return [3 /*break*/, 4];
                            case 3:
                                e_2 = _a.sent();
                                expect(e_2.message).toBe('error');
                                return [3 /*break*/, 4];
                            case 4:
                                expect(commitSpy).toHaveBeenCalledTimes(2);
                                spy.mockRestore();
                                commitSpy.mockRestore();
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
        });
        describe('deletePlugin', function () {
            beforeAll(function () {
                var _a;
                store.replaceState(merge(JSON.parse(JSON.stringify(initialState)), {
                    plugin: {
                        installed: (_a = {},
                            _a[availablePlugins[0].config.id] = availablePlugins[0],
                            _a)
                    }
                }));
            });
            it('should return early if plugin is not installed', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = expect;
                            return [4 /*yield*/, store.dispatch('plugin/deletePlugin', { pluginId: availablePlugins[1].config.id })];
                        case 1:
                            _a.apply(void 0, [_b.sent()]).toBe(undefined);
                            return [2 /*return*/];
                    }
                });
            }); });
            it.each(profiles)('should disable the plugin', function (profile) { return __awaiter(void 0, void 0, void 0, function () {
                var spy;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            spy = jest.spyOn(store, 'dispatch');
                            return [4 /*yield*/, store.dispatch('plugin/deletePlugin', { pluginId: availablePlugins[0].config.id })];
                        case 1:
                            _a.sent();
                            expect(spy).toHaveBeenCalledWith('plugin/setEnabled', {
                                enabled: false,
                                pluginId: availablePlugins[0].config.id,
                                profileId: profile.id
                            });
                            spy.mockRestore();
                            return [2 /*return*/];
                    }
                });
            }); });
            it.each(profiles)('should disable the plugin and delete its options', function (profile) { return __awaiter(void 0, void 0, void 0, function () {
                var spy;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            spy = jest.spyOn(store, 'dispatch');
                            return [4 /*yield*/, store.dispatch('plugin/deletePlugin', { pluginId: availablePlugins[0].config.id, removeOptions: true })];
                        case 1:
                            _a.sent();
                            expect(spy).toHaveBeenCalledWith('plugin/setEnabled', {
                                enabled: false,
                                pluginId: availablePlugins[0].config.id,
                                profileId: profile.id
                            });
                            expect(spy).toHaveBeenCalledWith('plugin/deletePluginOptionsForProfile', {
                                pluginId: availablePlugins[0].config.id,
                                profileId: profile.id
                            });
                            spy.mockRestore();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should try to delete the plugin for the given profile', function () { return __awaiter(void 0, void 0, void 0, function () {
                var spy;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            spy = jest.spyOn(store._vm.$plugins, 'deletePlugin');
                            return [4 /*yield*/, store.dispatch('plugin/deletePlugin', { pluginId: availablePlugins[0].config.id })];
                        case 1:
                            _a.sent();
                            expect(spy).toHaveBeenCalledWith(availablePlugins[0].config.id);
                            spy.mockRestore();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should log the error if deleting a plugin fails', function () { return __awaiter(void 0, void 0, void 0, function () {
                var spy;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            spy = jest.spyOn(store._vm.$plugins, 'deletePlugin').mockImplementation(function () {
                                throw new Error('error');
                            });
                            return [4 /*yield*/, store.dispatch('plugin/deletePlugin', { pluginId: availablePlugins[0].config.id })];
                        case 1:
                            _a.sent();
                            expect(store._vm.$logger.error).toHaveBeenCalledWith("Could not delete 'plugin-1' plugin: error");
                            spy.mockRestore();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('deleteLoaded', function () {
            beforeEach(function () {
                var _a, _b;
                store.replaceState(merge(JSON.parse(JSON.stringify(initialState)), {
                    plugin: {
                        loaded: (_a = {},
                            _a[profile1.id] = (_b = {},
                                _b[availablePlugins[0].config.id] = {},
                                _b),
                            _a)
                    }
                }));
            });
            it('should return early if the plugin is not loaded', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = expect;
                            return [4 /*yield*/, store.dispatch('plugin/deleteLoaded', {
                                    pluginId: availablePlugins[1].config.id
                                })];
                        case 1:
                            _a.apply(void 0, [_b.sent()]).toBe(undefined);
                            return [2 /*return*/];
                    }
                });
            }); });
            it.each([null, profile1.id])('should delete the loaded plugin', function (profileId) {
                var _a;
                expect(store.getters['plugin/loaded']).toEqual((_a = {},
                    _a[availablePlugins[0].config.id] = {},
                    _a));
                store.dispatch('plugin/deleteLoaded', {
                    pluginId: availablePlugins[0].config.id,
                    profileId: profileId
                });
                expect(store.getters['plugin/loaded']).toEqual({});
            });
        });
        describe('deleteInstalled', function () {
            beforeAll(function () {
                var _a;
                store.replaceState(merge(JSON.parse(JSON.stringify(initialState)), {
                    plugin: {
                        installed: (_a = {},
                            _a[availablePlugins[0].config.id] = availablePlugins[0],
                            _a)
                    }
                }));
            });
            it('should return early if the plugin is not installed', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = expect;
                            return [4 /*yield*/, store.dispatch('plugin/deleteInstalled', availablePlugins[1].config.id)];
                        case 1:
                            _a.apply(void 0, [_b.sent()]).toBe(undefined);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should delete the installed plugin', function () {
                expect(store.getters['plugin/installed']).toEqual([availablePlugins[0]]);
                store.dispatch('plugin/deleteInstalled', availablePlugins[0].config.id);
                expect(store.getters['plugin/installed']).toEqual([]);
            });
        });
        describe('setAvatars', function () {
            beforeEach(function () {
                var _a, _b, _c, _d;
                store.replaceState(merge(JSON.parse(JSON.stringify(initialState)), {
                    plugin: {
                        enabled: (_a = {},
                            _a[profile1.id] = (_b = {},
                                _b[availablePlugins[0].config.id] = true,
                                _b),
                            _a),
                        loaded: (_c = {},
                            _c[profile1.id] = (_d = {},
                                _d[availablePlugins[0].config.id] = __assign(__assign({}, availablePlugins[0]), { avatars: { 'avatar-1': 'avatar-1' } }),
                                _d),
                            _c)
                    }
                }));
            });
            it('should throw an error if the plugin is not enabled', function () {
                try {
                    store.dispatch('plugin/setAvatars', {
                        pluginId: availablePlugins[1].config.id,
                        profileId: profile1.id
                    });
                }
                catch (e) {
                    expect(e.message).toBe('Plugin is not enabled');
                }
            });
            it.each([null, profile1.id])('should set the avatars if the plugin is enabled', function (profileId) {
                var spy = jest.spyOn(pluginManager, 'getAvatarComponents').mockImplementation(function () {
                    return store.getters['plugin/loaded'][availablePlugins[0].config.id].avatars;
                });
                expect(store.getters['plugin/avatars'](profile1.id)).toEqual([{
                        component: 'avatar-1',
                        name: 'avatar-1',
                        pluginId: availablePlugins[0].config.id
                    }]);
                store.dispatch('plugin/setAvatars', {
                    pluginId: availablePlugins[0].config.id,
                    profileId: profileId,
                    avatars: {
                        'avatar-2': 'avatar-2'
                    }
                });
                expect(store.getters['plugin/avatars'](profile1.id)).toEqual([{
                        component: 'avatar-2',
                        name: 'avatar-2',
                        pluginId: availablePlugins[0].config.id
                    }]);
                spy.mockRestore();
            });
        });
        describe('setMenuItems', function () {
            beforeEach(function () {
                var _a, _b, _c, _d;
                store.replaceState(merge(JSON.parse(JSON.stringify(initialState)), {
                    plugin: {
                        enabled: (_a = {},
                            _a[profile1.id] = (_b = {},
                                _b[availablePlugins[0].config.id] = true,
                                _b),
                            _a),
                        loaded: (_c = {},
                            _c[profile1.id] = (_d = {},
                                _d[availablePlugins[0].config.id] = {
                                    menuItems: []
                                },
                                _d),
                            _c)
                    }
                }));
            });
            it('should throw an error if the plugin is not enabled', function () {
                try {
                    store.dispatch('plugin/setMenuItems', {
                        pluginId: availablePlugins[1].config.id,
                        profileId: profile1.id
                    });
                }
                catch (e) {
                    expect(e.message).toBe('Plugin is not enabled');
                }
            });
            it.each([null, profile1.id])('should set the menu items if the plugin is enabled', function (profileId) {
                expect(store.getters['plugin/menuItems']).toEqual([]);
                var menuItems = [
                    { title: 'menu-item-1' },
                    { title: 'menu-item-2' }
                ];
                store.dispatch('plugin/setMenuItems', {
                    pluginId: availablePlugins[0].config.id,
                    profileId: profileId,
                    menuItems: menuItems
                });
                expect(store.getters['plugin/menuItems']).toEqual(menuItems);
            });
        });
        describe('setThemes', function () {
            beforeEach(function () {
                var _a, _b, _c, _d;
                store.replaceState(merge(JSON.parse(JSON.stringify(initialState)), {
                    plugin: {
                        enabled: (_a = {},
                            _a[profile1.id] = (_b = {},
                                _b[availablePlugins[0].config.id] = true,
                                _b),
                            _a),
                        loaded: (_c = {},
                            _c[profile1.id] = (_d = {},
                                _d[availablePlugins[0].config.id] = {
                                    themes: {}
                                },
                                _d),
                            _c)
                    }
                }));
            });
            it('should throw an error if the plugin is not enabled', function () {
                try {
                    store.dispatch('plugin/setThemes', {
                        pluginId: availablePlugins[1].config.id,
                        profileId: profile1.id
                    });
                }
                catch (e) {
                    expect(e.message).toBe('Plugin is not enabled');
                }
            });
            it.each([null, profile1.id])('should set the themes if the plugin is enabled', function (profileId) {
                expect(store.getters['plugin/themes']).toEqual({});
                store.dispatch('plugin/setThemes', {
                    pluginId: availablePlugins[0].config.id,
                    profileId: profileId,
                    themes: {
                        'theme-1': {}
                    }
                });
                expect(store.getters['plugin/themes']).toEqual({ 'theme-1': {} });
            });
        });
        describe('setLanguages', function () {
            beforeEach(function () {
                var _a, _b, _c, _d;
                store.replaceState(merge(JSON.parse(JSON.stringify(initialState)), {
                    plugin: {
                        enabled: (_a = {},
                            _a[profile1.id] = (_b = {},
                                _b[availablePlugins[0].config.id] = true,
                                _b[availablePlugins[2].config.id] = true,
                                _b),
                            _a),
                        loaded: (_c = {},
                            _c[profile1.id] = (_d = {},
                                _d[availablePlugins[0].config.id] = {
                                    languages: {}
                                },
                                _d[availablePlugins[2].config.id] = {},
                                _d),
                            _c)
                    }
                }));
            });
            it('should throw an error if the plugin is not enabled', function () {
                try {
                    store.dispatch('plugin/setLanguages', {
                        pluginId: availablePlugins[1].config.id,
                        profileId: profile1.id
                    });
                }
                catch (e) {
                    expect(e.message).toBe('Plugin is not enabled');
                }
            });
            it.each([null, profile1.id])('should set the languages if the plugin is enabled', function (profileId) {
                expect(store.getters['plugin/languages']).toEqual({});
                store.dispatch('plugin/setLanguages', {
                    pluginId: availablePlugins[0].config.id,
                    profileId: profileId,
                    languages: {
                        'language-1': {}
                    }
                });
                expect(store.getters['plugin/languages']).toEqual({ 'language-1': {} });
            });
        });
        describe('setWalletTabs', function () {
            beforeEach(function () {
                var _a, _b, _c, _d;
                store.replaceState(merge(JSON.parse(JSON.stringify(initialState)), {
                    plugin: {
                        enabled: (_a = {},
                            _a[profile1.id] = (_b = {},
                                _b[availablePlugins[0].config.id] = true,
                                _b),
                            _a),
                        loaded: (_c = {},
                            _c[profile1.id] = (_d = {},
                                _d[availablePlugins[0].config.id] = {},
                                _d),
                            _c)
                    }
                }));
            });
            it('should throw an error if the plugin is not enabled', function () { return __awaiter(void 0, void 0, void 0, function () {
                var e_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, store.dispatch('plugin/setWalletTabs', {
                                    pluginId: availablePlugins[1].config.id,
                                    profileId: profile1.id
                                })];
                        case 1:
                            _a.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            e_3 = _a.sent();
                            expect(e_3.message).toBe('Plugin is not enabled');
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            it.each([null, profile1.id])('should set the wallet tabs', function (profileId) {
                var spy = jest.spyOn(pluginManager, 'getWalletTabComponent').mockImplementation(function () { return 'tab-1-component'; });
                expect(store.getters['plugin/walletTabs']).toEqual([]);
                store.dispatch('plugin/setWalletTabs', {
                    pluginId: availablePlugins[0].config.id,
                    profileId: profileId,
                    walletTabs: [{
                            name: 'tab-1',
                            component: 'tab-1-component'
                        }]
                });
                expect(store.getters['plugin/walletTabs']).toEqual([{
                        name: 'tab-1',
                        component: 'tab-1-component'
                    }]);
                spy.mockRestore();
            });
        });
        describe('setPluginOption', function () {
            beforeAll(function () {
                var _a, _b;
                store.replaceState(merge(JSON.parse(JSON.stringify(initialState)), {
                    plugin: {
                        enabled: (_a = {},
                            _a[profile1.id] = (_b = {},
                                _b[availablePlugins[0].config.id] = true,
                                _b),
                            _a)
                    }
                }));
            });
            it('should throw an error if the plugin is not enabled', function () { return __awaiter(void 0, void 0, void 0, function () {
                var e_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, store.dispatch('plugin/setPluginOption', {
                                    pluginId: availablePlugins[1].config.id,
                                    profileId: profile1.id
                                })];
                        case 1:
                            _a.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            e_4 = _a.sent();
                            expect(e_4.message).toBe('Plugin is not enabled');
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            it('should set the plugin option', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            expect(store.getters['plugin/pluginOptions'](availablePlugins[0].config.id, profile1.id)).toEqual({});
                            return [4 /*yield*/, store.dispatch('plugin/setPluginOption', {
                                    pluginId: availablePlugins[0].config.id,
                                    profileId: profile1.id,
                                    key: 'foo',
                                    value: 'bar'
                                })];
                        case 1:
                            _a.sent();
                            expect(store.getters['plugin/pluginOptions'](availablePlugins[0].config.id, profile1.id)).toEqual({ foo: 'bar' });
                            return [4 /*yield*/, store.dispatch('plugin/setPluginOption', {
                                    pluginId: availablePlugins[0].config.id,
                                    profileId: profile1.id,
                                    key: 'bar',
                                    value: 'foo'
                                })];
                        case 2:
                            _a.sent();
                            expect(store.getters['plugin/pluginOptions'](availablePlugins[0].config.id, profile1.id)).toEqual({ foo: 'bar', bar: 'foo' });
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should set a global plugin option', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            expect(store.getters['plugin/pluginOptions'](availablePlugins[0].config.id, 'global')).toEqual({});
                            return [4 /*yield*/, store.dispatch('plugin/setPluginOption', {
                                    pluginId: availablePlugins[0].config.id,
                                    profileId: 'global',
                                    key: 'foo',
                                    value: 'bar'
                                })];
                        case 1:
                            _a.sent();
                            expect(store.getters['plugin/pluginOptions'](availablePlugins[0].config.id, 'global')).toEqual({ foo: 'bar' });
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('deletePluginOptionsForProfile', function () {
            var options = { foo: 'bar' };
            beforeEach(function () {
                var _a, _b;
                store.replaceState(merge(JSON.parse(JSON.stringify(initialState)), {
                    plugin: {
                        pluginOptions: (_a = {},
                            _a[profile1.id] = (_b = {},
                                _b[availablePlugins[0].config.id] = options,
                                _b),
                            _a)
                    }
                }));
            });
            it('should delete the plugin options when no profile id given', function () {
                expect(store.getters['plugin/pluginOptions'](availablePlugins[0].config.id, profile1.id)).toEqual(options);
                store.dispatch('plugin/deletePluginOptionsForProfile', {
                    pluginId: availablePlugins[0].config.id
                });
                expect(store.getters['plugin/pluginOptions'](availablePlugins[0].config.id, profile1.id)).toEqual({});
            });
            it('should delete the plugin options', function () {
                expect(store.getters['plugin/pluginOptions'](availablePlugins[0].config.id, profile1.id)).toEqual(options);
                store.dispatch('plugin/deletePluginOptionsForProfile', {
                    pluginId: availablePlugins[0].config.id,
                    profileId: profile1.id
                });
                expect(store.getters['plugin/pluginOptions'](availablePlugins[0].config.id, profile1.id)).toEqual({});
            });
        });
    });
});
//# sourceMappingURL=plugin.spec.js.map