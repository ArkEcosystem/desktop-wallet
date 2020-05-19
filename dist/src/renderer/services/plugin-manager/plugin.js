var Plugin = /** @class */ (function () {
    function Plugin(_a) {
        var config = _a.config, path = _a.path, fullPath = _a.fullPath, rootPath = _a.rootPath;
        this.config = config;
        this.path = path;
        this.fullPath = fullPath;
        this.rootPath = rootPath;
        this.globalComponents = {};
        this.components = {};
        this.avatars = [];
        this.routes = [];
    }
    Plugin.prototype.getAvatarComponents = function () {
        if (!this.avatars) {
            return {};
        }
        var components = {};
        for (var _i = 0, _a = this.avatars; _i < _a.length; _i++) {
            var avatarName = _a[_i];
            if (!this.components[avatarName]) {
                continue;
            }
            components[avatarName] = this.components[avatarName];
        }
        return components;
    };
    Plugin.prototype.getWalletTabComponent = function (walletTab) {
        var component = this.components[walletTab.componentName];
        if (!component) {
            throw new Error("The wallet tab component `" + walletTab.componentName + "` has not be found");
        }
        return component;
    };
    return Plugin;
}());
export { Plugin };
//# sourceMappingURL=plugin.js.map