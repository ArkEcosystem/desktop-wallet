import { shallowMount } from '@vue/test-utils';
import useI18nGlobally from '../../../__utils__/i18n';
import { PluginManagerButtonSwitch } from '@/components/PluginManager/PluginManagerButtons';
var i18n = useI18nGlobally();
var wrapper;
beforeEach(function () {
    wrapper = shallowMount(PluginManagerButtonSwitch, { i18n: i18n });
});
describe('PluginManagerButtonSwitch', function () {
    it('should render', function () {
        expect(wrapper.isVueInstance()).toBeTrue();
    });
    it('should toggle when user clicks', function () {
        wrapper.trigger('click');
        expect(wrapper.emitted('change')).toBeTruthy();
    });
    it('should toggle by method', function () {
        wrapper.vm.toggle();
        expect(wrapper.emitted('change')).toBeTruthy();
    });
    it('should not toggle by method if disabled', function () {
        wrapper.setProps({ isDisabled: true });
        expect(wrapper.vm.toggle()).toBeUndefined();
        expect(wrapper.emitted('change')).toBeFalsy();
    });
    it('should be active', function () {
        wrapper.setProps({ isActive: true });
        expect(wrapper.contains('.PluginManagerButtonSwitch--active')).toBeTruthy();
    });
    it('should be disabled', function () {
        wrapper.setProps({ isDisabled: true });
        wrapper.trigger('click');
        expect(wrapper.emitted('change')).toBeFalsy();
    });
});
//# sourceMappingURL=PluginManagerButtonSwitch.spec.js.map