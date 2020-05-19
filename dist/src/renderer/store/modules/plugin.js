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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import Vue from 'vue';
import pluginManager from '@/services/plugin-manager';
import releaseService from '@/services/release';
import { sortByProps } from '@/utils';
import { cloneDeep, uniqBy } from 'lodash';
import semver from 'semver';
export default {
    namespaced: true,
    state: {
        available: {},
        installed: {},
        enabled: {},
        loaded: {},
        blacklisted: {
            global: [],
            local: []
        },
        whitelisted: {
            global: {}
        },
        pluginOptions: {},
        lastFetched: 0
    },
    getters: {
        lastFetched: function (state) { return state.lastFetched; },
        all: function (_, getters) {
            return uniqBy(__spreadArrays(getters.installed, getters.available), 'config.id');
        },
        official: function (_, getters) {
            return getters.all.filter(function (plugin) { return plugin.config.isOfficial; });
        },
        funded: function (_, getters) {
            return getters.all.filter(function (plugin) { return getters.isGrant(plugin.config.id); });
        },
        filtered: function (_, getters, __, rootGetters) { return function (query, category, filter) {
            var plugins = getters[filter || 'all'];
            plugins = plugins.filter(function (plugin) {
                if (rootGetters['session/filterBlacklistedPlugins'] && getters.isBlacklisted(plugin.config.id)) {
                    return false;
                }
                if (!getters.installedById(plugin.config.id) && !getters.isWhitelisted(plugin)) {
                    return false;
                }
                var match = true;
                if (category === 'all') {
                    match = match && !plugin.config.categories.some(function (category) { return ['theme', 'language'].includes(category); });
                }
                else if (category && category !== 'all') {
                    match = match && plugin.config.categories.includes(category);
                }
                if (query) {
                    match = match && ['id', 'title', 'description', 'keywords'].some(function (property) {
                        var value = plugin.config[property];
                        if (!value) {
                            return false;
                        }
                        if (property === 'keywords') {
                            value = value.join(' ');
                        }
                        return value.toLowerCase().includes(query);
                    });
                }
                return match;
            });
            return plugins;
        }; },
        available: function (state) { return Object.values(state.available); },
        availableById: function (_, getters) { return function (id) {
            var plugins = getters.available;
            if (!Object.keys(plugins).length) {
                return null;
            }
            return plugins.find(function (plugin) { return id === plugin.config.id; });
        }; },
        installed: function (state) { return Object.values(state.installed); },
        installedById: function (_, getters) { return function (id) {
            var plugins = getters.installed;
            if (!plugins.length) {
                return null;
            }
            return plugins.find(function (plugin) { return id === plugin.config.id; });
        }; },
        loaded: function (state, _, __, rootGetters) {
            var profileId = rootGetters['session/profileId'];
            if (!profileId || !state.loaded[profileId]) {
                return {};
            }
            return state.loaded[profileId];
        },
        blacklisted: function (state) { return state.blacklisted; },
        whitelisted: function (state) { return state.whitelisted; },
        enabled: function (state, _, __, rootGetters) {
            var profileId = rootGetters['session/profileId'];
            if (!profileId || !state.enabled[profileId]) {
                return {};
            }
            return state.enabled[profileId];
        },
        isAvailable: function (_, getters) { return function (pluginId) { return !!getters.availableById(pluginId); }; },
        isInstalled: function (_, getters) { return function (pluginId) { return !!getters.installedById(pluginId); }; },
        isUpdateAvailable: function (_, getters) { return function (pluginId) {
            var available = getters.availableById(pluginId);
            var installed = getters.installedById(pluginId);
            return available && installed ? semver.lt(installed.config.version, available.config.version) : false;
        }; },
        latestVersion: function (_, getters) { return function (pluginId) {
            var plugin = getters.availableById(pluginId);
            return plugin ? plugin.config.version : null;
        }; },
        isEnabled: function (state, getters) { return function (pluginId, profileId) {
            if (!profileId) {
                return !!getters.enabled[pluginId];
            }
            return state.enabled[profileId] ? !!state.enabled[profileId][pluginId] : false;
        }; },
        isLoaded: function (state, getters) { return function (pluginId, profileId) {
            if (!profileId) {
                return !!getters.loaded[pluginId];
            }
            return state.loaded[profileId] ? !!state.loaded[profileId][pluginId] : false;
        }; },
        isBlacklisted: function (_, getters) { return function (pluginId) {
            return getters.blacklisted.global.includes(pluginId) || getters.blacklisted.local.includes(pluginId);
        }; },
        isWhitelisted: function (_, getters) { return function (plugin) {
            if (Object.prototype.hasOwnProperty.call(getters.whitelisted.global, plugin.config.id)) {
                return semver.lte(plugin.config.version, getters.whitelisted.global[plugin.config.id].version);
            }
            return false;
        }; },
        isGrant: function (_, getters) { return function (pluginId) {
            if (Object.prototype.hasOwnProperty.call(getters.whitelisted.global, pluginId) && Object.prototype.hasOwnProperty.call(getters.whitelisted.global[pluginId], 'isGrant')) {
                return getters.whitelisted.global[pluginId].isGrant;
            }
            return false;
        }; },
        isInstalledSupported: function (_, getters) { return function (pluginId) {
            var plugin = getters.installedById(pluginId);
            if (!plugin.config.minimumVersion) {
                return true;
            }
            return semver.gte(releaseService.currentVersion, plugin.config.minimumVersion);
        }; },
        avatar: function (state) { return function (profile) {
            var loaded = state.loaded[profile.id];
            var plugin = loaded ? loaded[profile.avatar.pluginId] : null;
            if (!plugin) {
                return null;
            }
            return pluginManager.getAvatarComponents(profile.avatar.pluginId)[profile.avatar.avatarName];
        }; },
        avatars: function (state, getters) { return function (profileId) {
            var loadedPlugins = profileId ? state.loaded[profileId] : getters.loaded;
            if (!loadedPlugins || !Object.keys(loadedPlugins)) {
                return [];
            }
            var avatars = [];
            for (var _i = 0, _a = Object.values(loadedPlugins); _i < _a.length; _i++) {
                var plugin = _a[_i];
                for (var _b = 0, _c = Object.entries(pluginManager.getAvatarComponents(plugin.config.id)); _b < _c.length; _b++) {
                    var avatar = _c[_b];
                    avatars.push({
                        component: avatar[1],
                        name: avatar[0],
                        pluginId: plugin.config.id
                    });
                }
            }
            return avatars;
        }; },
        menuItems: function (_, getters) {
            var loadedPlugins = getters.loaded;
            var menuItems = [];
            for (var _i = 0, _a = Object.values(loadedPlugins); _i < _a.length; _i++) {
                var plugin = _a[_i];
                menuItems.push.apply(menuItems, plugin.menuItems);
            }
            return __spreadArrays(menuItems).sort(sortByProps('title'));
        },
        themes: function (_, getters) {
            return Object.keys(getters.loaded).reduce(function (themes, pluginId) {
                var plugin = getters.loaded[pluginId];
                if (plugin.themes) {
                    themes = __assign(__assign({}, themes), plugin.themes);
                }
                return themes;
            }, {});
        },
        languages: function (_, getters) {
            return Object.keys(getters.loaded).reduce(function (languages, pluginId) {
                var plugin = getters.loaded[pluginId];
                if (plugin.languages) {
                    languages = __assign(__assign({}, languages), plugin.languages);
                }
                return languages;
            }, {});
        },
        // For each plugin that supports wallet tabs, get the component and configuration of each tab
        walletTabs: function (_, getters) {
            return Object.keys(getters.loaded).reduce(function (walletTabs, pluginId) {
                var plugin = getters.loaded[pluginId];
                if (plugin.walletTabs) {
                    var pluginWalletTabs = plugin.walletTabs.map(function (walletTab) {
                        return __assign(__assign({}, walletTab), { component: pluginManager.getWalletTabComponent(pluginId, walletTab) });
                    });
                    walletTabs.push.apply(walletTabs, pluginWalletTabs);
                }
                return walletTabs;
            }, []);
        },
        profileHasPluginOptions: function (state, _, __, rootGetters) { return function (pluginId, profileId) {
            if (!profileId) {
                profileId = rootGetters['session/profileId'];
            }
            return !!(state.pluginOptions[profileId] && state.pluginOptions[profileId][pluginId]);
        }; },
        pluginOptions: function (state) { return function (pluginId, profileId) {
            if (!state.pluginOptions[profileId]) {
                return {};
            }
            else if (!state.pluginOptions[profileId][pluginId]) {
                return {};
            }
            return cloneDeep(state.pluginOptions[profileId][pluginId]);
        }; }
    },
    mutations: {
        RESET_PLUGINS: function (state) {
            state.loaded = {};
            state.installed = {};
        },
        SET_LAST_FETCHED: function (state, timestamp) {
            state.lastFetched = timestamp;
        },
        SET_AVAILABLE_PLUGINS: function (state, plugins) {
            state.available = plugins;
        },
        SET_INSTALLED_PLUGIN: function (state, plugin) {
            Vue.set(state.installed, plugin.config.id, plugin);
        },
        SET_BLACKLISTED_PLUGINS: function (state, _a) {
            var scope = _a.scope, plugins = _a.plugins;
            Vue.set(state.blacklisted, scope, plugins);
        },
        SET_WHITELISTED_PLUGINS: function (state, _a) {
            var scope = _a.scope, plugins = _a.plugins;
            Vue.set(state.whitelisted, scope, plugins);
        },
        SET_LOADED_PLUGIN: function (state, data) {
            if (!state.loaded[data.profileId]) {
                Vue.set(state.loaded, data.profileId, {});
            }
            Vue.set(state.loaded[data.profileId], data.config.id, __assign(__assign({}, data), { avatars: [], menuItems: [] }));
        },
        DELETE_LOADED_PLUGIN: function (state, _a) {
            var pluginId = _a.pluginId, profileId = _a.profileId;
            Vue.delete(state.loaded[profileId], pluginId);
        },
        DELETE_INSTALLED_PLUGIN: function (state, pluginId) {
            Vue.delete(state.installed, pluginId);
        },
        SET_PLUGIN_AVATARS: function (state, data) {
            Vue.set(state.loaded[data.profileId][data.pluginId], 'avatars', data.avatars);
        },
        SET_PLUGIN_MENU_ITEMS: function (state, data) {
            Vue.set(state.loaded[data.profileId][data.pluginId], 'menuItems', data.menuItems);
        },
        SET_PLUGIN_THEMES: function (state, data) {
            Vue.set(state.loaded[data.profileId][data.pluginId], 'themes', data.themes);
        },
        SET_PLUGIN_LANGUAGES: function (state, data) {
            Vue.set(state.loaded[data.profileId][data.pluginId], 'languages', data.languages);
        },
        SET_PLUGIN_WALLET_TABS: function (state, data) {
            Vue.set(state.loaded[data.profileId][data.pluginId], 'walletTabs', data.walletTabs);
        },
        SET_PLUGIN_OPTION: function (state, data) {
            if (!state.pluginOptions[data.profileId]) {
                Vue.set(state.pluginOptions, data.profileId, {});
            }
            if (!state.pluginOptions[data.profileId][data.pluginId]) {
                Vue.set(state.pluginOptions[data.profileId], data.pluginId, {});
            }
            Vue.set(state.pluginOptions[data.profileId][data.pluginId], data.key, data.value);
        },
        DELETE_PLUGIN_OPTIONS: function (state, _a) {
            var pluginId = _a.pluginId, profileId = _a.profileId;
            if (state.pluginOptions[profileId] && state.pluginOptions[profileId][pluginId]) {
                Vue.delete(state.pluginOptions[profileId], pluginId);
                if (!Object.keys(state.pluginOptions[profileId]).length) {
                    Vue.delete(state.pluginOptions, profileId);
                }
            }
        },
        SET_IS_PLUGIN_ENABLED: function (state, data) {
            if (!state.enabled[data.profileId]) {
                Vue.set(state.enabled, data.profileId, {});
            }
            Vue.set(state.enabled[data.profileId], data.pluginId, data.enabled);
        }
    },
    actions: {
        reset: function (_a) {
            var commit = _a.commit;
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_b) {
                    commit('RESET_PLUGINS');
                    return [2 /*return*/];
                });
            });
        },
        loadPluginsForProfiles: function (_a) {
            var dispatch = _a.dispatch, rootGetters = _a.rootGetters;
            return __awaiter(this, void 0, void 0, function () {
                var _i, _b, profile;
                return __generator(this, function (_c) {
                    for (_i = 0, _b = rootGetters['profile/all']; _i < _b.length; _i++) {
                        profile = _b[_i];
                        dispatch('loadPluginsForProfile', profile);
                    }
                    return [2 /*return*/];
                });
            });
        },
        loadPluginsForProfile: function (_a, profile) {
            var getters = _a.getters, state = _a.state;
            return __awaiter(this, void 0, void 0, function () {
                var _i, _b, pluginId, error_1;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            if (!state.enabled[profile.id]) {
                                return [2 /*return*/];
                            }
                            _i = 0, _b = Object.keys(state.enabled[profile.id]);
                            _c.label = 1;
                        case 1:
                            if (!(_i < _b.length)) return [3 /*break*/, 6];
                            pluginId = _b[_i];
                            if (!getters.isEnabled(pluginId, profile.id)) {
                                return [3 /*break*/, 5];
                            }
                            if (!getters.isInstalled(pluginId)) {
                                return [3 /*break*/, 5];
                            }
                            if (getters.isLoaded(pluginId, profile.id)) {
                                return [3 /*break*/, 5];
                            }
                            _c.label = 2;
                        case 2:
                            _c.trys.push([2, 4, , 5]);
                            return [4 /*yield*/, this._vm.$plugins.enablePlugin(pluginId, profile.id)];
                        case 3:
                            _c.sent();
                            return [3 /*break*/, 5];
                        case 4:
                            error_1 = _c.sent();
                            this._vm.$logger.error("Could not enable '" + pluginId + "' for profile '" + profile.name + "': " + error_1.message);
                            return [3 /*break*/, 5];
                        case 5:
                            _i++;
                            return [3 /*break*/, 1];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        },
        setEnabled: function (_a, _b) {
            var commit = _a.commit, getters = _a.getters, rootGetters = _a.rootGetters;
            var enabled = _b.enabled, pluginId = _b.pluginId, _c = _b.profileId, profileId = _c === void 0 ? null : _c;
            return __awaiter(this, void 0, void 0, function () {
                var error_2;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            profileId = profileId || rootGetters['session/profileId'];
                            if (getters.isEnabled(pluginId, profileId) === enabled) {
                                return [2 /*return*/];
                            }
                            commit('SET_IS_PLUGIN_ENABLED', {
                                enabled: enabled,
                                pluginId: pluginId,
                                profileId: profileId
                            });
                            _d.label = 1;
                        case 1:
                            _d.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this._vm.$plugins[(enabled ? 'enable' : 'disable') + "Plugin"](pluginId, profileId)];
                        case 2:
                            _d.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            error_2 = _d.sent();
                            commit('SET_IS_PLUGIN_ENABLED', {
                                enabled: !enabled,
                                pluginId: pluginId,
                                profileId: profileId
                            });
                            throw error_2;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        },
        setAvailable: function (_a, plugins) {
            var commit = _a.commit;
            commit('SET_AVAILABLE_PLUGINS', plugins);
            commit('SET_LAST_FETCHED', Date.now());
        },
        setInstalled: function (_a, plugin) {
            var commit = _a.commit;
            commit('SET_INSTALLED_PLUGIN', plugin);
        },
        setBlacklisted: function (_a, _b) {
            var commit = _a.commit, dispatch = _a.dispatch, getters = _a.getters, rootGetters = _a.rootGetters;
            var scope = _b.scope, plugins = _b.plugins;
            return __awaiter(this, void 0, void 0, function () {
                var _i, plugins_1, plugin, _c, _d, profile;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            commit('SET_BLACKLISTED_PLUGINS', { scope: scope, plugins: plugins });
                            _i = 0, plugins_1 = plugins;
                            _e.label = 1;
                        case 1:
                            if (!(_i < plugins_1.length)) return [3 /*break*/, 6];
                            plugin = plugins_1[_i];
                            _c = 0, _d = rootGetters['profile/all'];
                            _e.label = 2;
                        case 2:
                            if (!(_c < _d.length)) return [3 /*break*/, 5];
                            profile = _d[_c];
                            if (!(profile.filterBlacklistedPlugins && getters.isEnabled(plugin, profile.id))) return [3 /*break*/, 4];
                            return [4 /*yield*/, dispatch('setEnabled', { enabled: false, pluginId: plugin, profileId: profile.id })];
                        case 3:
                            _e.sent();
                            _e.label = 4;
                        case 4:
                            _c++;
                            return [3 /*break*/, 2];
                        case 5:
                            _i++;
                            return [3 /*break*/, 1];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        },
        setWhitelisted: function (_a, _b) {
            var commit = _a.commit;
            var scope = _b.scope, plugins = _b.plugins;
            commit('SET_WHITELISTED_PLUGINS', { scope: scope, plugins: plugins });
        },
        setLoaded: function (_a, data) {
            var commit = _a.commit, getters = _a.getters, rootGetters = _a.rootGetters;
            if (!getters.isEnabled(data.config.id, data.profileId)) {
                throw new Error('Plugin is not enabled');
            }
            commit('SET_LOADED_PLUGIN', __assign(__assign({}, data), { profileId: data.profileId || rootGetters['session/profileId'] }));
        },
        deletePlugin: function (_a, _b) {
            var dispatch = _a.dispatch, getters = _a.getters, rootGetters = _a.rootGetters;
            var pluginId = _b.pluginId, _c = _b.removeOptions, removeOptions = _c === void 0 ? false : _c;
            return __awaiter(this, void 0, void 0, function () {
                var _i, _d, profile, error_3;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            if (!getters.installedById(pluginId)) {
                                return [2 /*return*/];
                            }
                            _i = 0, _d = rootGetters['profile/all'];
                            _e.label = 1;
                        case 1:
                            if (!(_i < _d.length)) return [3 /*break*/, 4];
                            profile = _d[_i];
                            return [4 /*yield*/, dispatch('setEnabled', {
                                    enabled: false,
                                    pluginId: pluginId,
                                    profileId: profile.id
                                })];
                        case 2:
                            _e.sent();
                            if (removeOptions) {
                                dispatch('deletePluginOptionsForProfile', { pluginId: pluginId, profileId: profile.id });
                            }
                            _e.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4:
                            if (removeOptions && getters.profileHasPluginOptions(pluginId, 'global')) {
                                dispatch('deletePluginOptionsForProfile', { pluginId: pluginId, profileId: 'global' });
                            }
                            _e.label = 5;
                        case 5:
                            _e.trys.push([5, 7, , 8]);
                            return [4 /*yield*/, this._vm.$plugins.deletePlugin(pluginId)];
                        case 6:
                            _e.sent();
                            return [3 /*break*/, 8];
                        case 7:
                            error_3 = _e.sent();
                            this._vm.$logger.error("Could not delete '" + pluginId + "' plugin: " + error_3.message);
                            return [3 /*break*/, 8];
                        case 8: return [2 /*return*/];
                    }
                });
            });
        },
        deleteLoaded: function (_a, _b) {
            var commit = _a.commit, getters = _a.getters, rootGetters = _a.rootGetters;
            var pluginId = _b.pluginId, _c = _b.profileId, profileId = _c === void 0 ? null : _c;
            profileId = profileId || rootGetters['session/profileId'];
            if (!getters.isLoaded(pluginId, profileId)) {
                return;
            }
            commit('DELETE_LOADED_PLUGIN', {
                pluginId: pluginId,
                profileId: profileId
            });
        },
        deleteInstalled: function (_a, pluginId) {
            var commit = _a.commit, getters = _a.getters;
            if (!getters.installedById(pluginId)) {
                return;
            }
            commit('DELETE_INSTALLED_PLUGIN', pluginId);
        },
        setAvatars: function (_a, data) {
            var commit = _a.commit, getters = _a.getters, rootGetters = _a.rootGetters;
            if (!getters.isEnabled(data.pluginId, data.profileId)) {
                throw new Error('Plugin is not enabled');
            }
            commit('SET_PLUGIN_AVATARS', __assign(__assign({}, data), { profileId: data.profileId || rootGetters['session/profileId'] }));
        },
        setMenuItems: function (_a, data) {
            var commit = _a.commit, getters = _a.getters, rootGetters = _a.rootGetters;
            if (!getters.isEnabled(data.pluginId, data.profileId)) {
                throw new Error('Plugin is not enabled');
            }
            commit('SET_PLUGIN_MENU_ITEMS', __assign(__assign({}, data), { profileId: data.profileId || rootGetters['session/profileId'] }));
        },
        setThemes: function (_a, data) {
            var commit = _a.commit, getters = _a.getters, rootGetters = _a.rootGetters;
            if (!getters.isEnabled(data.pluginId, data.profileId)) {
                throw new Error('Plugin is not enabled');
            }
            commit('SET_PLUGIN_THEMES', __assign(__assign({}, data), { profileId: data.profileId || rootGetters['session/profileId'] }));
        },
        setLanguages: function (_a, _b) {
            var commit = _a.commit, getters = _a.getters, rootGetters = _a.rootGetters;
            var pluginId = _b.pluginId, languages = _b.languages, profileId = _b.profileId;
            if (!getters.isEnabled(pluginId, profileId)) {
                throw new Error('Plugin is not enabled');
            }
            for (var _i = 0, _c = Object.keys(languages); _i < _c.length; _i++) {
                var language = _c[_i];
                if (getters.languages[language]) {
                    throw new Error("Language \"" + language + "\" exists already");
                }
            }
            commit('SET_PLUGIN_LANGUAGES', {
                pluginId: pluginId,
                languages: languages,
                profileId: profileId || rootGetters['session/profileId']
            });
        },
        setWalletTabs: function (_a, data) {
            var commit = _a.commit, getters = _a.getters, rootGetters = _a.rootGetters;
            if (!getters.isEnabled(data.pluginId, data.profileId)) {
                throw new Error('Plugin is not enabled');
            }
            commit('SET_PLUGIN_WALLET_TABS', __assign(__assign({}, data), { profileId: data.profileId || rootGetters['session/profileId'] }));
        },
        setPluginOption: function (_a, data) {
            var commit = _a.commit, getters = _a.getters, rootGetters = _a.rootGetters;
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_b) {
                    if (data.profileId !== 'global' && !getters.isEnabled(data.pluginId, data.profileId)) {
                        throw new Error('Plugin is not enabled');
                    }
                    commit('SET_PLUGIN_OPTION', {
                        pluginId: data.pluginId,
                        profileId: data.profileId === 'global' ? 'global' : rootGetters['session/profileId'],
                        key: data.key,
                        value: data.value
                    });
                    return [2 /*return*/];
                });
            });
        },
        deletePluginOptionsForProfile: function (_a, _b) {
            var commit = _a.commit, rootGetters = _a.rootGetters;
            var pluginId = _b.pluginId, _c = _b.profileId, profileId = _c === void 0 ? null : _c;
            profileId = profileId || rootGetters['session/profileId'];
            commit('DELETE_PLUGIN_OPTIONS', {
                pluginId: pluginId,
                profileId: profileId
            });
        }
    }
};
//# sourceMappingURL=plugin.js.map