import { create as createMenuItemsSetup } from '@/services/plugin-manager/setup/menu-items-setup';
import { Plugin } from '@/services/plugin-manager/plugin';
var plugin = new Plugin({
    config: {
        id: 1
    }
});
plugin.routes = [
    {
        name: '1:test'
    }
];
var pluginObject = {
    getMenuItems: jest.fn(function () { return [
        {
            routeName: 'test'
        }
    ]; })
};
var sandbox = {
    app: {
        $store: {
            dispatch: jest.fn()
        },
        $router: {
            options: {
                routes: []
            }
        }
    }
};
var profileId = 'profile1';
var menuItemsSetup = createMenuItemsSetup(plugin, pluginObject, sandbox, profileId);
menuItemsSetup();
describe('Menu Items Setup', function () {
    it('should call the getMenuItems method', function () {
        expect(pluginObject.getMenuItems).toHaveBeenCalled();
    });
    it('should dispatch to vuex', function () {
        expect(sandbox.app.$store.dispatch).toHaveBeenCalled();
    });
});
//# sourceMappingURL=menu-items-setup.spec.js.map