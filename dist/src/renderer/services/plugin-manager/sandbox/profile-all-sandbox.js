export function create(walletApi, app) {
    return function () {
        if (!walletApi.profiles) {
            walletApi.profiles = {};
        }
        walletApi.profiles.all = app.$store.getters['profile/public'](true);
    };
}
//# sourceMappingURL=profile-all-sandbox.js.map