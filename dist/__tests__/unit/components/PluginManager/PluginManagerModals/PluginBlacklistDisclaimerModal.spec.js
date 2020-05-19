import { mount } from '@vue/test-utils';
import useI18nGlobally from '../../../__utils__/i18n';
import { PluginBlacklistDisclaimerModal } from '@/components/PluginManager/PluginManagerModals';
var i18n = useI18nGlobally();
var wrapper;
beforeEach(function () {
    wrapper = mount(PluginBlacklistDisclaimerModal, {
        i18n: i18n,
        stubs: {
            Portal: true
        }
    });
});
describe('PluginBlacklistDisclaimerModal', function () {
    it('should render', function () {
        expect(wrapper.isVueInstance()).toBeTrue();
    });
    describe('Methods', function () {
        it('should emit continue event', function () {
            wrapper.vm.emitContinue();
            expect(wrapper.emitted('continue')).toBeTruthy();
        });
        it('should emit close event', function () {
            wrapper.vm.emitClose();
            expect(wrapper.emitted('close')).toBeTruthy();
        });
    });
});
//# sourceMappingURL=PluginBlacklistDisclaimerModal.spec.js.map