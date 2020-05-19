import { create as createAvatarsSetup } from '@/services/plugin-manager/setup/avatars-setup';
import { Plugin } from '@/services/plugin-manager/plugin';
var plugin = new Plugin({
    config: {
        id: 1
    }
});
plugin.components = {
    man: {},
    woman: {}
};
var pluginObject = {
    getAvatars: jest.fn(function () { return ['man', 'woman']; })
};
var sandbox = {
    app: {
        $store: {
            dispatch: jest.fn()
        }
    }
};
var profileId = 'profile1';
var avatarsSetup = createAvatarsSetup(plugin, pluginObject, sandbox, profileId);
avatarsSetup();
describe('Avatars Setup', function () {
    it('should call the getAvatars method', function () {
        expect(pluginObject.getAvatars).toHaveBeenCalled();
    });
    it('should populate the avatars field', function () {
        expect(plugin.avatars.length).toBeGreaterThan(0);
    });
    it('should dispatch to vuex', function () {
        expect(sandbox.app.$store.dispatch).toHaveBeenCalled();
    });
});
//# sourceMappingURL=avatars-setup.spec.js.map