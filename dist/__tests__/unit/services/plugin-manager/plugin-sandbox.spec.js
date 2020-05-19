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
import { createLocalVue } from '@vue/test-utils';
import { PluginSandbox } from '@/services/plugin-manager/plugin-sandbox';
import { Plugin } from '@/services/plugin-manager/plugin';
var rootPath = path.resolve(__dirname, '../../../');
var app = createLocalVue();
var plugin = new Plugin({
    rootPath: rootPath,
    fullPath: path.resolve(__dirname),
    config: {
        permissions: []
    }
});
beforeEach(function () {
    plugin.config.permissions = [];
});
describe('Plugin Sandbox', function () {
    it('should parse component vm file with api', function () { return __awaiter(void 0, void 0, void 0, function () {
        var sandbox, pluginVM;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sandbox = new PluginSandbox({
                        app: app,
                        plugin: plugin
                    });
                    return [4 /*yield*/, sandbox.install()];
                case 1:
                    _a.sent();
                    pluginVM = sandbox.getComponentVM();
                    expect(pluginVM.run("\n      module.exports = walletApi\n    ")).toBeDefined();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should parse plugin vm file without api', function () { return __awaiter(void 0, void 0, void 0, function () {
        var sandbox, pluginVM;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sandbox = new PluginSandbox({
                        app: app,
                        plugin: plugin
                    });
                    return [4 /*yield*/, sandbox.install()];
                case 1:
                    _a.sent();
                    pluginVM = sandbox.getPluginVM();
                    expect(function () { return pluginVM.run("\n      module.exports = walletApi\n    "); }).toThrowError('walletApi is not defined');
                    return [2 /*return*/];
            }
        });
    }); });
    it('should read permissions', function () { return __awaiter(void 0, void 0, void 0, function () {
        var sandbox, componentVM;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    plugin.config.permissions = ['ALERTS'];
                    sandbox = new PluginSandbox({
                        app: app,
                        plugin: plugin
                    });
                    return [4 /*yield*/, sandbox.install()];
                case 1:
                    _a.sent();
                    componentVM = sandbox.getComponentVM();
                    expect(componentVM.run("\n      module.exports = walletApi.alert\n    ")).toBeDefined();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should not throw error with nonexistent permission', function () { return __awaiter(void 0, void 0, void 0, function () {
        var sandbox, componentVM;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    plugin.config.permissions = ['SECRETS'];
                    sandbox = new PluginSandbox({
                        app: app,
                        plugin: plugin
                    });
                    return [4 /*yield*/, sandbox.install()];
                case 1:
                    _a.sent();
                    componentVM = sandbox.getComponentVM();
                    expect(componentVM.run("\n      module.exports = walletApi.secrets\n    ")).toBeUndefined();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=plugin-sandbox.spec.js.map