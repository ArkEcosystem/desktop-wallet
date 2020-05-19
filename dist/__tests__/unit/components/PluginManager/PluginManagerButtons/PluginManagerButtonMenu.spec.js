import { shallowMount } from '@vue/test-utils';
import useI18nGlobally from '../../../__utils__/i18n';
import { PluginManagerButtonMenu } from '@/components/PluginManager/PluginManagerButtons';
var i18n = useI18nGlobally();
var wrapper;
beforeEach(function () {
    wrapper = shallowMount(PluginManagerButtonMenu, {
        i18n: i18n,
        propsData: {
            isOpen: true
        }
    });
});
describe('PluginManagerButtonMenu', function () {
    it('should render', function () {
        expect(wrapper.isVueInstance()).toBeTrue();
    });
    it('should emit click event', function () {
        wrapper.trigger('click');
        expect(wrapper.emitted('click')).toBeTruthy();
    });
});
//# sourceMappingURL=PluginManagerButtonMenu.spec.js.map