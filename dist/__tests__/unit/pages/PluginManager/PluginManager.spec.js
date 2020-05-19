import { createLocalVue, mount } from '@vue/test-utils';
import VueRouter from 'vue-router';
import { useI18n } from '../../__utils__/i18n';
import router from '@/router';
import PluginManager from '@/pages/PluginManager';
jest.mock('electron', function () { return ({
    ipcRenderer: {
        on: jest.fn()
    }
}); });
var localVue = createLocalVue();
var i18n = useI18n(localVue);
localVue.use(VueRouter);
describe('pages > PluginManager', function () {
    var mountPage = function () {
        return mount(PluginManager, {
            localVue: localVue,
            router: router,
            i18n: i18n,
            mocks: {
                strings_capitalizeFirst: jest.fn(),
                $store: {
                    getters: {
                        'plugin/filtered': function () { return []; },
                        'session/theme': 'dark',
                        'session/pluginMenuOpen': true
                    },
                    dispatch: function () {
                        //
                    }
                }
            }
        });
    };
    it('should have the right name', function () {
        var wrapper = mountPage();
        expect(wrapper.name()).toEqual('PluginManager');
    });
    it('should render component', function () {
        var wrapper = mountPage();
        expect(wrapper.contains('.PluginManager')).toBeTruthy();
    });
    it('should show side menu by default', function () {
        var wrapper = mountPage();
        expect(wrapper.contains('.PluginManagerSideMenu')).toBeTruthy();
    });
    it('should hide side menu from session', function () {
        var wrapper = mountPage();
        wrapper.vm.$store.getters['session/pluginMenuOpen'] = false;
        expect(wrapper.contains('.PluginManagerSideMenu')).toBeFalsy();
    });
});
//# sourceMappingURL=PluginManager.spec.js.map