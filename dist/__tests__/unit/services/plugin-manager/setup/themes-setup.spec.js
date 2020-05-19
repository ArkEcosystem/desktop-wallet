import { create as createThemesSetup } from '@/services/plugin-manager/setup/themes-setup';
jest.mock('fs', function () { return ({
    existsSync: jest.fn(function () { return true; })
}); });
var pluginObject = {
    getThemes: jest.fn(function () { return ({
        test: {
            cssPath: 'styles/themes.css',
            darkMode: true
        }
    }); })
};
var sandbox = {
    app: {
        $store: {
            dispatch: jest.fn()
        }
    }
};
var plugin = {
    fullPath: __dirname,
    config: {
        id: 1
    }
};
var profileId = 'profile1';
var themesSetup = createThemesSetup(plugin, pluginObject, sandbox, profileId);
themesSetup();
describe('Themes Setup', function () {
    it('should call the getThemes method', function () {
        expect(pluginObject.getThemes).toHaveBeenCalled();
    });
    it('should dispatch to vuex', function () {
        expect(sandbox.app.$store.dispatch).toHaveBeenCalled();
    });
});
//# sourceMappingURL=themes-setup.spec.js.map