var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var PluginManagerError = /** @class */ (function (_super) {
    __extends(PluginManagerError, _super);
    function PluginManagerError(message) {
        var _this = _super.call(this, message) || this;
        Error.captureStackTrace(_this, _this.constructor);
        return _this;
    }
    return PluginManagerError;
}(Error));
export { PluginManagerError };
var NotInitiatedError = /** @class */ (function (_super) {
    __extends(NotInitiatedError, _super);
    function NotInitiatedError() {
        return _super.call(this, 'Plugin Manager not initiated') || this;
    }
    return NotInitiatedError;
}(PluginManagerError));
export { NotInitiatedError };
var PluginAlreadyInstalledError = /** @class */ (function (_super) {
    __extends(PluginAlreadyInstalledError, _super);
    function PluginAlreadyInstalledError(plugin) {
        return _super.call(this, "Plugin '" + plugin + "' is already installed") || this;
    }
    return PluginAlreadyInstalledError;
}(PluginManagerError));
export { PluginAlreadyInstalledError };
var PluginAlreadyLoadedError = /** @class */ (function (_super) {
    __extends(PluginAlreadyLoadedError, _super);
    function PluginAlreadyLoadedError(plugin) {
        return _super.call(this, "Plugin '" + plugin + "' has already been loaded") || this;
    }
    return PluginAlreadyLoadedError;
}(PluginManagerError));
export { PluginAlreadyLoadedError };
var PluginDownloadFailedError = /** @class */ (function (_super) {
    __extends(PluginDownloadFailedError, _super);
    function PluginDownloadFailedError(plugin) {
        return _super.call(this, "Plugin '" + plugin + "' could not be downloaded") || this;
    }
    return PluginDownloadFailedError;
}(PluginManagerError));
export { PluginDownloadFailedError };
var PluginStatusError = /** @class */ (function (_super) {
    __extends(PluginStatusError, _super);
    function PluginStatusError(status, plugin) {
        return _super.call(this, "Plugin '" + plugin + "' is not " + status) || this;
    }
    return PluginStatusError;
}(PluginManagerError));
export { PluginStatusError };
var PluginNotFoundError = /** @class */ (function (_super) {
    __extends(PluginNotFoundError, _super);
    function PluginNotFoundError(plugin) {
        return _super.call(this, "Plugin '" + plugin + "' not found") || this;
    }
    return PluginNotFoundError;
}(Error));
export { PluginNotFoundError };
var PluginConfigError = /** @class */ (function (_super) {
    __extends(PluginConfigError, _super);
    function PluginConfigError(message) {
        return _super.call(this, "Plugin configuration could not be parsed: " + message) || this;
    }
    return PluginConfigError;
}(Error));
export { PluginConfigError };
var PluginWalletVersionError = /** @class */ (function (_super) {
    __extends(PluginWalletVersionError, _super);
    function PluginWalletVersionError() {
        return _super.call(this, 'Wallet version is not supported') || this;
    }
    return PluginWalletVersionError;
}(Error));
export { PluginWalletVersionError };
//# sourceMappingURL=errors.js.map