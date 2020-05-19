import { mount } from '@vue/test-utils';
import useI18nGlobally from '../../../__utils__/i18n';
import { PluginPermissionsModal } from '@/components/PluginManager/PluginManagerModals';
var i18n = useI18nGlobally();
var wrapper;
var mocks = {
    $store: {
        getters: {
            'plugin/isInstalled': jest.fn(function () { return true; })
        }
    }
};
beforeEach(function () {
    wrapper = mount(PluginPermissionsModal, {
        i18n: i18n,
        mocks: mocks,
        propsData: {
            plugin: {
                id: 'test',
                version: '0.0.1'
            },
            isUpdate: true
        },
        stubs: {
            Portal: true
        }
    });
});
describe('PluginPermissionsModal', function () {
    it('should render', function () {
        expect(wrapper.isVueInstance()).toBeTrue();
    });
    describe('Methods', function () {
        it('should emit close event', function () {
            wrapper.vm.emitClose();
            expect(wrapper.emitted('close', wrapper.props('modalRef'))).toBeTruthy();
        });
        it('should emit confirm event', function () {
            wrapper.vm.emitConfirm();
            expect(wrapper.emitted('confirm', wrapper.props('plugin'))).toBeTruthy();
        });
    });
    describe('Computed properties', function () {
        describe('title', function () {
            it('should use alternative title if plugin is not installed', function () {
                wrapper.vm.$store.getters['plugin/isInstalled'] = jest.fn(function () { return false; });
                expect(wrapper.vm.title).toBe('MODAL_PLUGIN_PERMISSIONS.ALTERNATIVE_TITLE');
            });
            it('should use alternative title if plugin is installed but is an update', function () {
                wrapper.vm.$store.getters['plugin/isInstalled'] = jest.fn(function () { return true; });
                wrapper.setProps({ isUpdate: true });
                expect(wrapper.vm.title).toBe('MODAL_PLUGIN_PERMISSIONS.ALTERNATIVE_TITLE');
            });
            it('should use title if plugin is installed and is not an update', function () {
                wrapper.vm.$store.getters['plugin/isInstalled'] = jest.fn(function () { return true; });
                wrapper.setProps({ isUpdate: false });
                expect(wrapper.vm.title).toBe('MODAL_PLUGIN_PERMISSIONS.TITLE');
            });
        });
    });
});
//# sourceMappingURL=PluginPermissionsModal.spec.js.map