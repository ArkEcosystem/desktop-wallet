var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
export function create(walletApi, app) {
    return function () {
        if (!walletApi.profiles) {
            walletApi.profiles = {};
        }
        walletApi.profiles = __assign(__assign({}, walletApi.profiles), { getCurrent: function () {
                return app.$store.getters['profile/public']();
            } });
    };
}
//# sourceMappingURL=profile-current-sandbox.js.map