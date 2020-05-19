import { shallowMount } from '@vue/test-utils';
import useI18nGlobally from '../../__utils__/i18n';
import { PluginManagerCheckmark } from '@/components/PluginManager';
var i18n = useI18nGlobally();
var wrapper;
beforeEach(function () {
    wrapper = shallowMount(PluginManagerCheckmark, { i18n: i18n });
});
describe('PluginManagerCheckmark', function () {
    it('should render', function () {
        expect(wrapper.isVueInstance()).toBeTrue();
    });
    it('should render the official author', function () {
        expect(wrapper.vm.author).toBe('ARK Ecosystem');
    });
});
//# sourceMappingURL=PluginManagerCheckmark.spec.js.map