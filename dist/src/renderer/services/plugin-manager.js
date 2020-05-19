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
import * as adapters from '@/services/plugin-manager/adapters';
import releaseService from '@/services/release';
import { I18N, PLUGINS } from '@config';
import { dayjs } from '@/services/datetime';
import * as fs from 'fs';
import * as fsExtra from 'fs-extra';
import { partition } from 'lodash';
import { upperFirst } from '@/utils';
import * as path from 'path';
import semver from 'semver';
import trash from 'trash';
import * as errors from './plugin-manager/errors';
import { Plugin } from './plugin-manager/plugin';
import { PluginConfiguration } from './plugin-manager/plugin-configuration';
import { PluginSandbox } from './plugin-manager/plugin-sandbox';
import { PluginSetup } from './plugin-manager/plugin-setup';
import { validatePluginPath } from './plugin-manager/utils/validate-plugin-path';
import validatePackageName from 'validate-npm-package-name';
import { reqwest } from '@/utils/http';
var rootPath = path.resolve(__dirname, '../../../');
if (process.env.NODE_ENV === 'production') {
    rootPath = path.resolve(__dirname, '../../');
}
var PluginManager = /** @class */ (function () {
    function PluginManager() {
        this.app = null;
        this.adapter = null;
        this.pluginsPath = null;
        this.plugins = {};
        this.pluginSetups = {};
        this.hasInit = false;
        this.vue = null;
    }
    PluginManager.prototype.setAdapter = function (adapter) {
        this.adapter = adapters[upperFirst(adapter) + 'Adapter'];
    };
    PluginManager.prototype.setApp = function (app) {
        this.app = app;
    };
    PluginManager.prototype.setVue = function (vue) {
        this.vue = vue;
    };
    PluginManager.prototype.init = function (app) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.setApp(app);
                        this.pluginsPath = process.env.NODE_ENV !== 'development' ? PLUGINS.path : PLUGINS.devPath;
                        return [4 /*yield*/, this.app.$store.dispatch('plugin/reset')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.fetchPlugins()];
                    case 2:
                        _a.sent();
                        this.hasInit = true;
                        return [4 /*yield*/, this.app.$store.dispatch('plugin/loadPluginsForProfiles')];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PluginManager.prototype.deletePlugin = function (pluginId) {
        return __awaiter(this, void 0, void 0, function () {
            var plugin, parentDir, pluginCount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.hasInit) {
                            throw new errors.NotInitiatedError();
                        }
                        plugin = this.plugins[pluginId];
                        if (!plugin) {
                            throw new errors.PluginNotFoundError(pluginId);
                        }
                        parentDir = path.dirname(plugin.fullPath);
                        pluginCount = fs.readdirSync(parentDir).filter(function (entry) {
                            return !entry.startsWith('.');
                        }).length;
                        if (!(parentDir !== this.pluginsPath && pluginCount === 1)) return [3 /*break*/, 2];
                        return [4 /*yield*/, trash(parentDir)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, trash(plugin.fullPath)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        this.app.$store.dispatch('plugin/deleteInstalled', plugin.config.id);
                        delete this.plugins[pluginId];
                        return [2 /*return*/];
                }
            });
        });
    };
    PluginManager.prototype.enablePlugin = function (pluginId, profileId) {
        return __awaiter(this, void 0, void 0, function () {
            var plugin, sandbox, setup;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.hasInit) {
                            throw new errors.NotInitiatedError();
                        }
                        plugin = this.plugins[pluginId];
                        if (!plugin) {
                            throw new errors.PluginNotFoundError(pluginId);
                        }
                        if (!this.app.$store.getters['plugin/isEnabled'](plugin.config.id, profileId)) {
                            throw new errors.PluginStatusError('enabled', plugin.config.id);
                        }
                        if (!this.app.$store.getters['plugin/isInstalledSupported'](plugin.config.id)) {
                            throw new errors.PluginWalletVersionError();
                        }
                        return [4 /*yield*/, this.app.$store.dispatch('plugin/setLoaded', {
                                config: plugin.config,
                                fullPath: plugin.fullPath,
                                profileId: profileId
                            })];
                    case 1:
                        _a.sent();
                        sandbox = new PluginSandbox({
                            plugin: plugin,
                            app: this.app
                        });
                        return [4 /*yield*/, sandbox.install()];
                    case 2:
                        _a.sent();
                        setup = new PluginSetup({
                            plugin: plugin,
                            sandbox: sandbox,
                            profileId: profileId,
                            vue: this.vue
                        });
                        return [4 /*yield*/, setup.install()];
                    case 3:
                        _a.sent();
                        this.pluginSetups[pluginId] = setup;
                        return [2 /*return*/];
                }
            });
        });
    };
    PluginManager.prototype.unloadThemes = function (plugin, profileId) {
        return __awaiter(this, void 0, void 0, function () {
            var defaultThemes, profile;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        defaultThemes = ['light', 'dark'];
                        if (!!defaultThemes.includes(this.app.$store.getters['session/theme'])) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.app.$store.dispatch('session/setTheme', defaultThemes[0])];
                    case 1:
                        _a.sent();
                        profile = this.app.$store.getters['profile/byId'](profileId);
                        return [4 /*yield*/, this.app.$store.dispatch('profile/update', __assign(__assign({}, profile), { theme: defaultThemes[0] }))];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PluginManager.prototype.unloadLanguages = function (plugin, profileId) {
        return __awaiter(this, void 0, void 0, function () {
            var profile;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(I18N.defaultLocale !== this.app.$store.getters['session/language'])) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.app.$store.dispatch('session/setLanguage', I18N.defaultLocale)];
                    case 1:
                        _a.sent();
                        profile = this.app.$store.getters['profile/byId'](profileId);
                        return [4 /*yield*/, this.app.$store.dispatch('profile/update', __assign(__assign({}, profile), { language: I18N.defaultLocale }))];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PluginManager.prototype.getWalletTabComponent = function (pluginId) {
        var plugin = this.plugins[pluginId];
        if (!plugin) {
            return {};
        }
        return plugin.getWalletTabComponent();
    };
    PluginManager.prototype.getAvatarComponents = function (pluginId) {
        var plugin = this.plugins[pluginId];
        if (!plugin) {
            return {};
        }
        return plugin.getAvatarComponents();
    };
    // TODO hook to clean up and restore or reset values
    PluginManager.prototype.disablePlugin = function (pluginId, profileId) {
        return __awaiter(this, void 0, void 0, function () {
            var plugin;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.hasInit) {
                            throw new errors.NotInitiatedError();
                        }
                        plugin = this.plugins[pluginId];
                        if (!plugin) {
                            throw new errors.PluginNotFoundError(pluginId);
                        }
                        if (this.app.$store.getters['plugin/isEnabled'](plugin.config.id, profileId)) {
                            throw new errors.PluginStatusError('disabled', plugin.config.id);
                        }
                        if (!plugin.config.permissions.includes('THEMES')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.unloadThemes(plugin, profileId)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!plugin.config.permissions.includes('LANGUAGES')) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.unloadLanguages(plugin, profileId)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [4 /*yield*/, this.app.$store.dispatch('plugin/deleteLoaded', { pluginId: pluginId, profileId: profileId })];
                    case 5:
                        _a.sent();
                        if (!this.pluginSetups[pluginId]) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.pluginSetups[pluginId].destroy()];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    PluginManager.prototype.fetchLogo = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, reqwest(url, {
                            encoding: null,
                            timeout: 100,
                            retry: 0
                        })];
                    case 1:
                        body = (_a.sent()).body;
                        return [2 /*return*/, body.toString('base64')];
                }
            });
        });
    };
    PluginManager.prototype.fetchImages = function (images) {
        return __awaiter(this, void 0, void 0, function () {
            var requests, _i, images_1, imageUrl;
            return __generator(this, function (_a) {
                if (!images || !images.length) {
                    return [2 /*return*/, []];
                }
                requests = [];
                for (_i = 0, images_1 = images; _i < images_1.length; _i++) {
                    imageUrl = images_1[_i];
                    requests.push(reqwest(imageUrl, { encoding: null }).then(function (response) { return response.body.toString('base64'); }));
                }
                return [2 /*return*/, Promise.all(requests)];
            });
        });
    };
    PluginManager.prototype.fetchPluginsFromAdapter = function () {
        return __awaiter(this, void 0, void 0, function () {
            var sessionAdapter, configs, plugins;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sessionAdapter = this.app.$store.getters['session/pluginAdapter'];
                        if (this.adapter !== sessionAdapter) {
                            this.setAdapter(sessionAdapter);
                        }
                        return [4 /*yield*/, this.adapter.all()];
                    case 1:
                        configs = _a.sent();
                        return [4 /*yield*/, Promise.all(configs.map(function (config) { return __awaiter(_this, void 0, void 0, function () {
                                var plugin, _a, _b, _c, _d;
                                return __generator(this, function (_e) {
                                    switch (_e.label) {
                                        case 0: return [4 /*yield*/, PluginConfiguration.sanitize(config)];
                                        case 1:
                                            plugin = _e.sent();
                                            plugin.isGrant = this.app.$store.getters['plugin/isGrant'](plugin.id);
                                            _e.label = 2;
                                        case 2:
                                            _e.trys.push([2, 4, , 5]);
                                            _a = plugin;
                                            return [4 /*yield*/, this.fetchLogo(plugin.logo)];
                                        case 3:
                                            _a.logo = _e.sent();
                                            return [3 /*break*/, 5];
                                        case 4:
                                            _b = _e.sent();
                                            plugin.logo = null;
                                            return [3 /*break*/, 5];
                                        case 5:
                                            _e.trys.push([5, 7, , 8]);
                                            _c = plugin;
                                            return [4 /*yield*/, this.fetchImages(plugin.images)];
                                        case 6:
                                            _c.images = _e.sent();
                                            return [3 /*break*/, 8];
                                        case 7:
                                            _d = _e.sent();
                                            plugin.images = [];
                                            return [3 /*break*/, 8];
                                        case 8: return [2 /*return*/, plugin];
                                    }
                                });
                            }); }))];
                    case 2:
                        configs = _a.sent();
                        configs = configs.filter(function (plugin) {
                            var validName = validatePackageName(plugin.id).validForNewPackages;
                            if (!validName) {
                                console.info(plugin.id + " is not a valid package name");
                            }
                            var minimumVersionSatisfied = !plugin.minimumVersion || semver.gte(releaseService.currentVersion, plugin.minimumVersion);
                            if (!minimumVersionSatisfied) {
                                console.info(plugin.id + " requires a higher wallet version");
                            }
                            return validName && minimumVersionSatisfied;
                        });
                        plugins = configs.reduce(function (plugins, config) {
                            plugins[config.id] = { config: config };
                            return plugins;
                        }, {});
                        this.app.$store.dispatch('plugin/setAvailable', plugins);
                        return [2 /*return*/];
                }
            });
        });
    };
    PluginManager.prototype.parsePluginUrl = function (url) {
        var matches = /https?:\/\/github.com\/([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)[/]?$/.exec(url);
        return {
            owner: matches[1],
            repository: matches[2],
            branch: 'master'
        };
    };
    PluginManager.prototype.fetchPluginFromUrl = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, owner, repository, branch, baseUrl, body, plugin, error_1, _b, error_2, _c, error_3;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _a = this.parsePluginUrl(url), owner = _a.owner, repository = _a.repository, branch = _a.branch;
                        baseUrl = "https://raw.githubusercontent.com/" + owner + "/" + repository + "/" + branch;
                        return [4 /*yield*/, reqwest(baseUrl + "/package.json", { json: true })];
                    case 1:
                        body = (_d.sent()).body;
                        _d.label = 2;
                    case 2:
                        _d.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, PluginConfiguration.sanitize(body)];
                    case 3:
                        plugin = _d.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _d.sent();
                        throw new errors.PluginConfigError(error_1.message);
                    case 5:
                        plugin.source = "https://github.com/" + owner + "/" + repository + "/archive/" + branch + ".zip";
                        plugin.isGrant = this.app.$store.getters['plugin/isGrant'](plugin.id);
                        _d.label = 6;
                    case 6:
                        _d.trys.push([6, 8, , 9]);
                        _b = plugin;
                        return [4 /*yield*/, this.fetchLogo(plugin.logo)];
                    case 7:
                        _b.logo = _d.sent();
                        return [3 /*break*/, 9];
                    case 8:
                        error_2 = _d.sent();
                        plugin.logo = null;
                        return [3 /*break*/, 9];
                    case 9:
                        _d.trys.push([9, 11, , 12]);
                        _c = plugin;
                        return [4 /*yield*/, this.fetchImages(plugin.images)];
                    case 10:
                        _c.images = _d.sent();
                        return [3 /*break*/, 12];
                    case 11:
                        error_3 = _d.sent();
                        plugin.images = [];
                        return [3 /*break*/, 12];
                    case 12: return [2 /*return*/, plugin];
                }
            });
        });
    };
    PluginManager.prototype.fetchPlugins = function (force) {
        if (force === void 0) { force = false; }
        return __awaiter(this, void 0, void 0, function () {
            var requests;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        requests = [this.fetchPluginsFromPath()];
                        if (force || dayjs().isAfter(dayjs(this.app.$store.getters['plugin/lastFetched']).add(PLUGINS.updateInterval.value, PLUGINS.updateInterval.unit))) {
                            requests.push(this.fetchPluginsFromAdapter(), this.fetchPluginsList());
                        }
                        return [4 /*yield*/, Promise.all(requests)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PluginManager.prototype.fetchPluginsFromPath = function () {
        return __awaiter(this, void 0, void 0, function () {
            var dirs, _a, scoped, unscoped, plugins, _loop_1, this_1, _i, scoped_1, scope, _b, plugins_1, plugin, pluginPath, error_4;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        fsExtra.ensureDirSync(this.pluginsPath);
                        dirs = fsExtra.readdirSync(this.pluginsPath).filter(function (entry) {
                            return entry !== '.cache' && fsExtra.lstatSync(_this.pluginsPath + "/" + entry).isDirectory();
                        });
                        _a = partition(dirs, function (entry) {
                            return entry.startsWith('@');
                        }), scoped = _a[0], unscoped = _a[1];
                        plugins = unscoped;
                        _loop_1 = function (scope) {
                            var scopePath = this_1.pluginsPath + "/" + scope;
                            var entries = fs.readdirSync(scopePath).filter(function (entry) {
                                return fs.lstatSync(scopePath + "/" + entry).isDirectory();
                            });
                            plugins.push.apply(plugins, entries.map(function (entry) { return scope + "/" + entry; }));
                        };
                        this_1 = this;
                        for (_i = 0, scoped_1 = scoped; _i < scoped_1.length; _i++) {
                            scope = scoped_1[_i];
                            _loop_1(scope);
                        }
                        _b = 0, plugins_1 = plugins;
                        _c.label = 1;
                    case 1:
                        if (!(_b < plugins_1.length)) return [3 /*break*/, 6];
                        plugin = plugins_1[_b];
                        pluginPath = this.pluginsPath + "/" + plugin;
                        _c.label = 2;
                    case 2:
                        _c.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.fetchPlugin(pluginPath)];
                    case 3:
                        _c.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_4 = _c.sent();
                        console.error("Could not fetch plugin '" + pluginPath + "': " + error_4.message);
                        return [3 /*break*/, 5];
                    case 5:
                        _b++;
                        return [3 /*break*/, 1];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    PluginManager.prototype.fetchPluginsList = function () {
        return __awaiter(this, void 0, void 0, function () {
            var body, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, reqwest(PLUGINS.pluginsUrl + "?ts=" + (new Date()).getTime(), {
                                json: true
                            })];
                    case 1:
                        body = (_a.sent()).body;
                        this.app.$store.dispatch('plugin/setWhitelisted', { scope: 'global', plugins: body.plugins });
                        this.app.$store.dispatch('plugin/setBlacklisted', { scope: 'global', plugins: body.blacklist });
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _a.sent();
                        console.error("Could not fetch plugins from the list '" + PLUGINS.pluginsUrl + ": " + error_5.message);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PluginManager.prototype.fetchPlugin = function (pluginPath, isUpdate) {
        if (isUpdate === void 0) { isUpdate = false; }
        return __awaiter(this, void 0, void 0, function () {
            var packageJson, pluginConfig, error_6, _a, error_7, error_8, _b, error_9, fullPath;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        validatePluginPath(pluginPath);
                        packageJson = JSON.parse(fs.readFileSync(pluginPath + "/package.json"));
                        return [4 /*yield*/, PluginConfiguration.sanitize(packageJson, pluginPath)];
                    case 1:
                        pluginConfig = _c.sent();
                        if (this.plugins[pluginConfig.id] && !isUpdate) {
                            throw new errors.PluginAlreadyLoadedError(pluginConfig.id);
                        }
                        pluginConfig.isGrant = this.app.$store.getters['plugin/isGrant'](pluginConfig.id);
                        _c.label = 2;
                    case 2:
                        _c.trys.push([2, 3, , 8]);
                        pluginConfig.logo = fs.readFileSync(pluginPath + "/logo.png").toString('base64');
                        return [3 /*break*/, 8];
                    case 3:
                        error_6 = _c.sent();
                        _c.label = 4;
                    case 4:
                        _c.trys.push([4, 6, , 7]);
                        _a = pluginConfig;
                        return [4 /*yield*/, this.fetchLogo(pluginConfig.logo)];
                    case 5:
                        _a.logo = _c.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        error_7 = _c.sent();
                        pluginConfig.logo = null;
                        return [3 /*break*/, 7];
                    case 7: return [3 /*break*/, 8];
                    case 8:
                        _c.trys.push([8, 9, , 14]);
                        pluginConfig.images = pluginConfig.images.map(function (image) {
                            return fs.readFileSync(pluginPath + "/images/" + image.split('/').pop()).toString('base64');
                        });
                        return [3 /*break*/, 14];
                    case 9:
                        error_8 = _c.sent();
                        _c.label = 10;
                    case 10:
                        _c.trys.push([10, 12, , 13]);
                        _b = pluginConfig;
                        return [4 /*yield*/, this.fetchImages(pluginConfig.images)];
                    case 11:
                        _b.images = _c.sent();
                        return [3 /*break*/, 13];
                    case 12:
                        error_9 = _c.sent();
                        pluginConfig.images = [];
                        return [3 /*break*/, 13];
                    case 13: return [3 /*break*/, 14];
                    case 14:
                        fullPath = pluginPath.substring(0, 1) === '/' ? pluginPath : path.resolve(pluginPath);
                        return [4 /*yield*/, this.app.$store.dispatch('plugin/setInstalled', {
                                config: pluginConfig,
                                fullPath: fullPath
                            })];
                    case 15:
                        _c.sent();
                        this.plugins[pluginConfig.id] = new Plugin({
                            config: pluginConfig,
                            path: path,
                            fullPath: fullPath,
                            rootPath: rootPath
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    return PluginManager;
}());
export { PluginManager };
export default new PluginManager();
//# sourceMappingURL=plugin-manager.js.map