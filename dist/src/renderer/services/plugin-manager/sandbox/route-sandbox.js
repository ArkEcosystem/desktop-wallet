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
import { getAllRoutes } from '../utils/get-all-routes';
export function create(walletApi, plugin, app) {
    return function () {
        walletApi.route = {
            get: function () {
                return __assign(__assign({}, app.$route), { name: app.$route.name.split(':')[1], fullName: app.$route.name, matched: [] });
            },
            goTo: function (routeName) {
                var route = getAllRoutes(app, plugin).find(function (route) {
                    return (route.name === routeName ||
                        route.name === [plugin.config.id, routeName].join(':'));
                });
                if (route) {
                    app.$router.push(route);
                }
            }
        };
    };
}
//# sourceMappingURL=route-sandbox.js.map