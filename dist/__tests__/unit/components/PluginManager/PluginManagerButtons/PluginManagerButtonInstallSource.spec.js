import { shallowMount } from '@vue/test-utils';
import useI18nGlobally from '../../../__utils__/i18n';
import { PluginManagerButtonInstallSource } from '@/components/PluginManager/PluginManagerButtons';
var i18n = useI18nGlobally();
var wrapper;
beforeEach(function () {
    wrapper = shallowMount(PluginManagerButtonInstallSource, {
        i18n: i18n,
        propsData: {
            source: 'url'
        }
    });
});
describe('PluginManagerButtonInstallSource', function () {
    it('should render', function () {
        expect(wrapper.isVueInstance()).toBeTrue();
    });
    it('should emit click event', function () {
        wrapper.find('.PluginManagerButtonInstallSource').trigger('click');
        expect(wrapper.emitted('click')).toBeTruthy();
    });
});
//# sourceMappingURL=PluginManagerButtonInstallSource.spec.js.map