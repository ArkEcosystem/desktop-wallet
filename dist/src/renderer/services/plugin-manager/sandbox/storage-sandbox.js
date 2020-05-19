export function create(walletApi, app, plugin) {
    return function () {
        var getOptions = function (global) {
            if (global === void 0) { global = false; }
            return app.$store.getters['plugin/pluginOptions'](plugin.config.id, global ? 'global' : app.$store.getters['session/profileId']);
        };
        walletApi.storage = {
            get: function (key, global) {
                if (global === void 0) { global = false; }
                var options = getOptions(global);
                return options && options[key];
            },
            set: function (key, value, global) {
                if (global === void 0) { global = false; }
                app.$store.dispatch('plugin/setPluginOption', {
                    profileId: global ? 'global' : app.$store.getters['session/profileId'],
                    pluginId: plugin.config.id,
                    key: key,
                    value: value
                });
            },
            clear: function (global) {
                if (global === void 0) { global = false; }
                app.$store.dispatch('plugin/deletePluginOptionsForProfile', {
                    profileId: global ? 'global' : app.$store.getters['session/profileId'],
                    pluginId: plugin.config.id
                });
            },
            getOptions: getOptions
        };
    };
}
//# sourceMappingURL=storage-sandbox.js.map