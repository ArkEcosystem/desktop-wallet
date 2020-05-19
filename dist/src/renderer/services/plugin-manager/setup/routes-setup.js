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
import { normalizeJson } from '../utils/normalize-json';
import { getAllRoutes } from '../utils/get-all-routes';
export function create(plugin, pluginObject, sandbox) {
    return function () {
        var _a;
        if (!Object.prototype.hasOwnProperty.call(pluginObject, 'getRoutes')) {
            return;
        }
        var pluginRoutes = normalizeJson(pluginObject.getRoutes().map(function (route) { return (__assign(__assign({}, route), { name: [plugin.config.id, route.name].join(':') })); }));
        if (pluginRoutes && Array.isArray(pluginRoutes) && pluginRoutes.length) {
            var allRoutes_1 = getAllRoutes(sandbox.app);
            var routes = pluginRoutes.reduce(function (valid, route) {
                if (typeof route.component === 'string' && plugin.components[route.component]) {
                    if (allRoutes_1.every(function (loadedRoute) { return loadedRoute.name !== route.name; })) {
                        valid.push(__assign(__assign({}, route), { component: plugin.components[route.component] }));
                    }
                }
                return valid;
            }, []);
            if (routes.length) {
                (_a = plugin.routes).push.apply(_a, routes);
                sandbox.app.$router.addRoutes(routes);
            }
        }
    };
}
//# sourceMappingURL=routes-setup.js.map