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
import { sanitizeAuthor, sanitizeCategories, sanitizeId, sanitizeImages, sanitizeIsOfficial, sanitizeKeywords, sanitizeLogo, sanitizeMinimumVersion, sanitizePermissions, sanitizeSize, sanitizeSource, sanitizeTitle, sanitizeUrls, sanitizeVersion } from './config-sanitizers';
var PluginConfiguration = /** @class */ (function () {
    function PluginConfiguration(_a) {
        var id = _a.id, author = _a.author, categories = _a.categories, keywords = _a.keywords, description = _a.description, logo = _a.logo, images = _a.images, homepage = _a.homepage, isOfficial = _a.isOfficial, minimumVersion = _a.minimumVersion, permissions = _a.permissions, size = _a.size, source = _a.source, title = _a.title, urls = _a.urls, version = _a.version;
        this.id = id;
        this.author = author;
        this.categories = categories;
        this.keywords = keywords;
        this.description = description;
        this.logo = logo;
        this.images = images;
        this.homepage = homepage;
        this.isOfficial = isOfficial;
        this.minimumVersion = minimumVersion;
        this.permissions = permissions;
        this.size = size;
        this.source = source;
        this.title = title;
        this.urls = urls;
        this.version = version;
    }
    PluginConfiguration.sanitize = function (config, pluginPath) {
        if (pluginPath === void 0) { pluginPath = null; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = PluginConfiguration.bind;
                        _b = {
                            id: sanitizeId(config.name),
                            author: sanitizeAuthor(config),
                            categories: sanitizeCategories(config),
                            keywords: sanitizeKeywords(config.keywords),
                            description: config.description,
                            logo: sanitizeLogo(config),
                            images: sanitizeImages(config),
                            homepage: config.homepage,
                            isOfficial: sanitizeIsOfficial(config.name),
                            minimumVersion: sanitizeMinimumVersion(config),
                            permissions: sanitizePermissions(config)
                        };
                        return [4 /*yield*/, sanitizeSize(config, pluginPath)];
                    case 1: return [2 /*return*/, new (_a.apply(PluginConfiguration, [void 0, (_b.size = (_c.sent()) || 0,
                                _b.source = sanitizeSource(config),
                                _b.title = sanitizeTitle(config),
                                _b.urls = sanitizeUrls(config),
                                _b.version = sanitizeVersion(config.version),
                                _b)]))()];
                }
            });
        });
    };
    PluginConfiguration.prototype.validate = function () {
        if (!this.id) {
            throw new Error('Plugin ID not found');
        }
        else if (!/^[@/a-z-0-9-]+$/.test(this.id)) {
            throw new Error('Invalid Plugin ID');
        }
    };
    return PluginConfiguration;
}());
export { PluginConfiguration };
//# sourceMappingURL=plugin-configuration.js.map