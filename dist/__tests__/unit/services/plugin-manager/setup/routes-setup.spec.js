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
import { create as createRoutesSetup } from '@/services/plugin-manager/setup/routes-setup';
import { Plugin } from '@/services/plugin-manager/plugin';
var pluginObject = {
    getRoutes: jest.fn(function () { return [
        {
            name: 'test',
            component: 'test'
        }
    ]; })
};
var plugin;
var sandbox;
var routesSetup;
beforeEach(function () {
    plugin = new Plugin({
        config: {
            id: 1
        }
    });
    plugin.components = {
        test: {}
    };
    sandbox = {
        app: {
            $router: {
                options: {
                    routes: []
                },
                addRoutes: jest.fn()
            }
        }
    };
    routesSetup = createRoutesSetup(plugin, pluginObject, sandbox);
});
describe('Routes Items Setup', function () {
    it('should call the getRoutes method', function () {
        routesSetup();
        expect(pluginObject.getRoutes).toHaveBeenCalled();
    });
    it('should populate the plugin field', function () {
        routesSetup();
        expect(plugin.routes).toHaveLength(1);
    });
    it('should populate app routes', function () {
        routesSetup();
        expect(sandbox.app.$router.addRoutes).toHaveBeenCalled();
    });
    it('should not override app routes', function () {
        var customSandbox = __assign({}, sandbox);
        customSandbox.app.$router.options.routes.push({
            name: 'test'
        });
        var customSetup = createRoutesSetup(plugin, pluginObject, sandbox);
        customSetup();
        expect(plugin.routes.length).toBe(1);
        expect(sandbox.app.$router.addRoutes).toHaveBeenCalledTimes(1);
    });
});
//# sourceMappingURL=routes-setup.spec.js.map