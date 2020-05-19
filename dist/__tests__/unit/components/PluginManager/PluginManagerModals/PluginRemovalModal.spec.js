import { shallowMount } from '@vue/test-utils';
import useI18nGlobally from '../../../__utils__/i18n';
import { PluginRemovalModal } from '@/components/PluginManager/PluginManagerModals';
var i18n = useI18nGlobally();
var wrapper;
beforeEach(function () {
    wrapper = shallowMount(PluginRemovalModal, {
        i18n: i18n,
        propsData: {
            plugin: {
                id: 'test',
                permissions: []
            }
        },
        mocks: {
            $store: {
                getters: {
                    'plugin/profileHasPluginOptions': function (pluginId) {
                        if (pluginId === 'hasOptions') {
                            return true;
                        }
                        return false;
                    }
                }
            }
        },
        stubs: {
            ListDivided: '<div class="ListDivided" />'
        }
    });
});
describe('PluginRemovalModal', function () {
    it('should render', function () {
        expect(wrapper.isVueInstance()).toBeTrue();
    });
    it('should not render divided list if plugin has no STORAGE permission', function () {
        expect(wrapper.vm.hasStorage).toBeFalse();
        expect(wrapper.find('.ListDivided').exists()).toBeFalse();
    });
    it('should render divided list if plugin has STORAGE permission and data stored', function () {
        wrapper.setProps({
            plugin: {
                id: 'hasOptions',
                permissions: ['STORAGE']
            }
        });
        expect(wrapper.vm.hasStorage).toBeTrue();
        expect(wrapper.find('.ListDivided').exists()).toBeTrue();
    });
    it('should not render divided list if plugin has STORAGE permission but no data stored', function () {
        wrapper.setProps({
            plugin: {
                id: 'test',
                permissions: ['STORAGE']
            }
        });
        expect(wrapper.vm.hasStorage).toBeFalse();
        expect(wrapper.find('.ListDivided').exists()).toBeFalse();
    });
    describe('Methods', function () {
        it('should emit cancel event', function () {
            wrapper.vm.emitCancel();
            expect(wrapper.emitted('cancel')).toBeTruthy();
        });
        it('should emit confirm event', function () {
            wrapper.vm.emitConfirm();
            expect(wrapper.emitted('confirm', wrapper.vm.removeOptions)).toBeTruthy();
        });
        it('should toggle removeOptions by method', function () {
            expect(wrapper.vm.removeOptions).toBeFalse();
            wrapper.vm.toggleRemoveOptions();
            expect(wrapper.vm.removeOptions).toBeTrue();
        });
    });
});
//# sourceMappingURL=PluginRemovalModal.spec.js.map