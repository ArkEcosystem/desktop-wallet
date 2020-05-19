export function create(walletApi, app) {
    return function () {
        walletApi.alert = {
            error: app.$error,
            success: app.$success,
            info: app.$info,
            warn: app.$warn
        };
    };
}
//# sourceMappingURL=alerts-sandbox.js.map