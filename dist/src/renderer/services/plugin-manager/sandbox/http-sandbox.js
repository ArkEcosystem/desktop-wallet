import got from 'got';
var PluginHttp = /** @class */ (function () {
    function PluginHttp(whitelist) {
        this.whitelist = [];
        if (Array.isArray(whitelist)) {
            this.whitelist = whitelist.map(function (regex) {
                return new RegExp(regex);
            });
        }
    }
    PluginHttp.prototype.validateUrl = function (url) {
        var valid = false;
        for (var _i = 0, _a = this.whitelist; _i < _a.length; _i++) {
            var regex = _a[_i];
            if (regex.test(url)) {
                valid = true;
                break;
            }
        }
        if (!valid) {
            throw new Error("URL \"" + url + "\" not allowed");
        }
    };
    PluginHttp.prototype.get = function (url, opts) {
        this.validateUrl(url);
        return got.get(url, opts);
    };
    PluginHttp.prototype.post = function (url, opts) {
        this.validateUrl(url);
        return got.post(url, opts);
    };
    return PluginHttp;
}());
export function create(walletApi, plugin) {
    return function () {
        walletApi.http = new PluginHttp(plugin.config.urls);
    };
}
//# sourceMappingURL=http-sandbox.js.map