import { mount } from '@vue/test-utils';
import useI18nGlobally from '../../../__utils__/i18n';
import { PluginBlacklistModal } from '@/components/PluginManager/PluginManagerModals';
var i18n = useI18nGlobally();
var wrapper;
beforeEach(function () {
    wrapper = mount(PluginBlacklistModal, {
        i18n: i18n,
        propsData: {
            plugin: {
                id: 'test',
                version: '0.0.1'
            }
        },
        stubs: {
            Portal: true
        }
    });
});
describe('PluginBlacklistModal', function () {
    it('should render', function () {
        expect(wrapper.isVueInstance()).toBeTrue();
    });
    describe('Methods', function () {
        it('should emit cancel event', function () {
            wrapper.vm.emitCancel();
            expect(wrapper.emitted('cancel')).toBeTruthy();
        });
        it('should emit confirm event', function () {
            wrapper.vm.emitConfirm();
            expect(wrapper.emitted('confirm')).toBeTruthy();
        });
    });
});
//# sourceMappingURL=PluginBlacklistModal.spec.js.map