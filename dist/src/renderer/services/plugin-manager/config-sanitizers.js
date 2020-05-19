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
import { difference, intersection, uniq } from 'lodash';
import { PLUGINS } from '@config';
import * as validPermissions from './plugin-permission';
import du from 'du';
import parse from 'parse-author';
import semver from 'semver';
import titlecase from 'titlecase';
var getOption = function (config, option) {
    try {
        return config['desktop-wallet'][option];
    }
    catch (error) {
        return null;
    }
};
var isOfficial = function (name) {
    var scopeRegex = new RegExp("^@" + PLUGINS.officialScope + "/");
    return scopeRegex.test(name);
};
var sanitizeId = function (name) {
    if (!name) {
        return new Error('missing required name');
    }
    return name;
};
var sanitizeIsOfficial = function (name) {
    return isOfficial(name);
};
var sanitizeAuthor = function (config) {
    if (isOfficial(config.name)) {
        return PLUGINS.officialAuthor;
    }
    if (config.author) {
        if (typeof config.author === 'string') {
            return parse(config.author).name;
        }
        return config.author.name;
    }
    if (config.contributors && config.contributors.length) {
        if (typeof config.contributors[0].name === 'string') {
            return parse(config.contributors[0].name).name;
        }
        return config.contributors[0].name;
    }
    return 'unknown';
};
var sanitizeKeywords = function (keywords) {
    for (var _i = 0, _a = PLUGINS.keywords; _i < _a.length; _i++) {
        var keyword = _a[_i];
        if (!keywords.includes(keyword)) {
            throw new Error('missing required keywords');
        }
    }
    return difference(uniq(keywords), PLUGINS.keywords).map(function (keyword) { return titlecase(keyword); });
};
var sanitizeCategories = function (config) {
    var categories = getOption(config, 'categories');
    if (!categories) {
        if (config.categories && config.categories.length) {
            categories = config.categories;
        }
        else if (config.keywords && config.keywords.length) {
            categories = sanitizeKeywords(config.keywords);
        }
    }
    if (categories && categories.length) {
        categories = intersection(categories, PLUGINS.categories);
    }
    else {
        categories = [];
    }
    return categories.length ? categories : ['other'];
};
var sanitizeVersion = function (version) {
    return semver.valid(version) || semver.coerce(version) || '0.0.0';
};
var sanitizeMinimumVersion = function (config) {
    var minimumVersion = getOption(config, 'minimumVersion') || config.minimumVersion;
    return semver.valid(minimumVersion) || semver.coerce(minimumVersion) || '0.0.0';
};
var sanitizeLogo = function (config) {
    var logo = getOption(config, 'logo') || config.logo;
    if (logo && /^https?:\/\/raw.githubusercontent.com[A-Za-z0-9/_.-]+logo\.(png|jpg)$/.test(logo)) {
        return logo;
    }
};
var sanitizeImages = function (config) {
    var images = getOption(config, 'images') || config.images || [];
    return images
        .slice(0, 5)
        .filter(function (image) { return /^https?:\/\/raw.githubusercontent.com[A-Za-z0-9/_.-]+\.(png|jpg)$/.test(image); });
};
var sanitizeName = function (name) {
    var parts = name.split('/');
    var tmp = parts[parts.length > 1 ? 1 : 0]
        .split('-')
        .join(' ');
    return titlecase(tmp);
};
var sanitizePermissions = function (config) {
    var permissions = getOption(config, 'permissions') || config.permissions || [];
    return intersection(uniq(permissions).sort().map(function (permission) {
        return permission.toUpperCase();
    }), Object.keys(validPermissions));
};
var sanitizeSize = function (config, pluginPath) { return __awaiter(void 0, void 0, void 0, function () {
    var size;
    return __generator(this, function (_a) {
        if (config.dist) {
            return [2 /*return*/, config.dist.unpackedSize];
        }
        size = 0;
        if (pluginPath) {
            try {
                size = du(pluginPath);
            }
            catch (error) {
                //
            }
        }
        return [2 /*return*/, size];
    });
}); };
var sanitizeSource = function (config) {
    if (config.dist) {
        return config.dist.tarball;
    }
    return null;
};
var sanitizeTitle = function (config) {
    var title = getOption(config, 'title') || config.title;
    return title ? titlecase(title) : sanitizeName(config.name);
};
var sanitizeUrls = function (config) {
    return getOption(config, 'urls') || config.urls || [];
};
export { sanitizeAuthor, sanitizeCategories, sanitizeId, sanitizeImages, sanitizeIsOfficial, sanitizeKeywords, sanitizeLogo, sanitizeMinimumVersion, sanitizePermissions, sanitizeSize, sanitizeSource, sanitizeTitle, sanitizeUrls, sanitizeVersion };
//# sourceMappingURL=config-sanitizers.js.map