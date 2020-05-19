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
import path from 'path';
import fs from 'fs';
import { castArray } from 'lodash';
import { AVATARS, COMPONENTS, LANGUAGES, MENU_ITEMS, PUBLIC, ROUTES, THEMES, UI_COMPONENTS, WALLET_TABS, WEBFRAME } from './plugin-permission';
import * as AvatarsSetup from './setup/avatars-setup';
import * as ComponentsSetup from './setup/components-setup';
import * as FontAwesomeSetup from './setup/font-awesome-setup';
import * as LanguagesSetup from './setup/languages-setup';
import * as MenuItemsSetup from './setup/menu-items-setup';
import * as RegisterSetup from './setup/register-setup';
import * as RoutesSetup from './setup/routes-setup';
import * as ThemesSetup from './setup/themes-setup';
import * as UiComponentsSetup from './setup/ui-components-setup';
import * as WalletTabsSetup from './setup/wallet-tabs-setup';
import * as WebFrameSetup from './setup/webframe-setup';
var PluginSetup = /** @class */ (function () {
    function PluginSetup(_a) {
        var plugin = _a.plugin, sandbox = _a.sandbox, vue = _a.vue, profileId = _a.profileId;
        this.plugin = plugin;
        this.sandbox = sandbox;
        this.profileId = profileId;
        var localVue = vue.extend();
        localVue.options._base = localVue;
        this.vue = localVue;
        this.pluginObject = this.sandbox.getComponentVM().run(fs.readFileSync(path.join(plugin.fullPath, 'src/index.js')), path.join(plugin.fullPath, 'src/index.js'));
        this.setups = this.__mapPermissionsToSetup();
    }
    PluginSetup.prototype.install = function () {
        return __awaiter(this, void 0, void 0, function () {
            var permissions, priorities, first, rest, _i, first_1, permissionName, _a, rest_1, permissionName;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.__run(this.setups[PUBLIC.name])];
                    case 1:
                        _b.sent();
                        permissions = this.plugin.config.permissions;
                        priorities = [WEBFRAME.name, UI_COMPONENTS.name, COMPONENTS.name, ROUTES.name];
                        first = priorities.filter(function (p) { return permissions.includes(p); });
                        rest = permissions.filter(function (p) { return !priorities.includes(p); });
                        _i = 0, first_1 = first;
                        _b.label = 2;
                    case 2:
                        if (!(_i < first_1.length)) return [3 /*break*/, 5];
                        permissionName = first_1[_i];
                        return [4 /*yield*/, this.__run(this.setups[permissionName])];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5:
                        _a = 0, rest_1 = rest;
                        _b.label = 6;
                    case 6:
                        if (!(_a < rest_1.length)) return [3 /*break*/, 9];
                        permissionName = rest_1[_a];
                        return [4 /*yield*/, this.__run(this.setups[permissionName])];
                    case 7:
                        _b.sent();
                        _b.label = 8;
                    case 8:
                        _a++;
                        return [3 /*break*/, 6];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    PluginSetup.prototype.destroy = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sandbox.destroy()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PluginSetup.prototype.__run = function (setups) {
        if (setups === void 0) { setups = []; }
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, setup;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _i = 0, _a = castArray(setups);
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        setup = _a[_i];
                        return [4 /*yield*/, setup()];
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
    PluginSetup.prototype.__mapPermissionsToSetup = function () {
        var _a;
        return _a = {},
            _a[AVATARS.name] = AvatarsSetup.create(this.plugin, this.pluginObject, this.sandbox, this.profileId),
            _a[WALLET_TABS.name] = WalletTabsSetup.create(this.plugin, this.pluginObject, this.sandbox, this.profileId),
            _a[ROUTES.name] = RoutesSetup.create(this.plugin, this.pluginObject, this.sandbox),
            _a[COMPONENTS.name] = ComponentsSetup.create(this.plugin, this.pluginObject, this.sandbox, this.vue),
            _a[MENU_ITEMS.name] = MenuItemsSetup.create(this.plugin, this.pluginObject, this.sandbox, this.profileId),
            _a[THEMES.name] = ThemesSetup.create(this.plugin, this.pluginObject, this.sandbox, this.profileId),
            _a[LANGUAGES.name] = LanguagesSetup.create(this.plugin, this.pluginObject, this.sandbox, this.profileId),
            _a[PUBLIC.name] = [
                RegisterSetup.create(this.pluginObject),
                FontAwesomeSetup.create(this.plugin)
            ],
            _a[WEBFRAME.name] = WebFrameSetup.create(this.plugin),
            _a[UI_COMPONENTS.name] = UiComponentsSetup.create(this.plugin),
            _a;
    };
    return PluginSetup;
}());
export { PluginSetup };
//# sourceMappingURL=plugin-setup.js.map