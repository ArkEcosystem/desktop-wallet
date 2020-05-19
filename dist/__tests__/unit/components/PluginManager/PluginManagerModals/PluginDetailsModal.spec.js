import { mount } from '@vue/test-utils';
import useI18nGlobally from '../../../__utils__/i18n';
import { PluginDetailsModal } from '@/components/PluginManager/PluginManagerModals';
var i18n = useI18nGlobally();
var wrapper;
var mockDispatch = jest.fn();
var mocks = {
    $store: {
        dispatch: mockDispatch,
        getters: {
            'plugin/isAvailable': jest.fn(function (pluginId) { return pluginId === 'test'; }),
            'plugin/isBlacklisted': jest.fn(function (pluginId) { return pluginId !== 'test'; }),
            'plugin/isEnabled': jest.fn(function (pluginId) { return pluginId === 'test'; }),
            'plugin/isInstalled': jest.fn(function (pluginId) { return pluginId === 'test'; }),
            'plugin/isUpdateAvailable': jest.fn(function (pluginId) { return pluginId !== 'test'; }),
            'plugin/isInstalledSupported': jest.fn(function (pluginId) { return pluginId === 'test'; }),
            'plugin/latestVersion': jest.fn(function (pluginId) { return pluginId === '0.0.1'; })
        }
    }
};
beforeEach(function () {
    mockDispatch.mockReset();
    wrapper = mount(PluginDetailsModal, {
        i18n: i18n,
        mocks: mocks,
        propsData: {
            plugin: {
                id: 'test',
                version: '0.0.1',
                keywords: ['Keyword'],
                categories: ['utility'],
                permissions: []
            }
        },
        stubs: {
            Portal: '<div><slot /></div>'
        }
    });
});
describe('PluginDetailsModal', function () {
    it('should render', function () {
        expect(wrapper.isVueInstance()).toBeTrue();
    });
    it('should render update, delete and report button for installed plugins', function () {
        var buttons = wrapper.findAll('.ButtonIconGeneric');
        expect(buttons.at(0).html().includes('#update')).toBeTrue();
        expect(buttons.at(1).html().includes('#trash')).toBeTrue();
        expect(buttons.at(2).html().includes('#exclamation-mark')).toBeTrue();
    });
    describe('Methods', function () {
        it('should emit close event', function () {
            wrapper.vm.emitClose();
            expect(wrapper.emitted('close')).toBeTruthy();
        });
        it('should emit update event', function () {
            wrapper.vm.emitUpdate();
            expect(wrapper.emitted('update', wrapper.props('plugin'))).toBeTruthy();
        });
        it('should emit remove event', function () {
            wrapper.vm.emitRemove();
            expect(wrapper.emitted('remove', wrapper.props('plugin'))).toBeTruthy();
        });
        it('should emit show-permissions event', function () {
            wrapper.vm.emitShowPermissions();
            expect(wrapper.emitted('show-permissions')).toBeTruthy();
        });
        it('should emit change-status', function () {
            wrapper.vm.toggleStatus(true);
            expect(wrapper.emitted('change-status', true, wrapper.props('plugin').id)).toBeTruthy();
        });
        it('should report the plugin', function () {
            var arg = 'https://ark.io/contact?subject=desktop_wallet_plugin_report&plugin_id=test&plugin_version=0.0.1';
            jest.spyOn(wrapper.vm, 'electron_openExternal');
            wrapper.vm.reportPlugin();
            expect(wrapper.vm.electron_openExternal).toHaveBeenCalledWith(arg);
        });
    });
});
//# sourceMappingURL=PluginDetailsModal.spec.js.map