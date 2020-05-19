import { shallowMount } from '@vue/test-utils';
import useI18nGlobally from '../../../__utils__/i18n';
import { PluginManagerButtonFilter } from '@/components/PluginManager/PluginManagerButtons';
var i18n = useI18nGlobally();
var wrapper;
beforeEach(function () {
    wrapper = shallowMount(PluginManagerButtonFilter, {
        i18n: i18n,
        mocks: {
            strings_capitalizeFirst: jest.fn()
        },
        propsData: {
            activeFilter: 'all'
        }
    });
});
describe('PluginManagerButtonFilter', function () {
    it('should render', function () {
        expect(wrapper.isVueInstance()).toBeTrue();
    });
    it('should open the dropdown when clicked', function () {
        wrapper.find('.PluginManagerButtonFilter').trigger('click');
        expect(wrapper.vm.isOpen).toBeTrue();
        expect(wrapper.find('.PluginManagerButtonFilter__options').isVisible()).toBeTrue();
    });
    it('should close the dropdown when clicked again', function () {
        wrapper.setData({ isOpen: true });
        wrapper.find('.PluginManagerButtonFilter').trigger('click');
        expect(wrapper.vm.isOpen).toBeFalse();
        expect(wrapper.find('.PluginManagerButtonFilter__options').isVisible()).toBeFalse();
    });
    it('should emit filter-change event', function () {
        jest.spyOn(wrapper.vm, 'emitFilterChange');
        wrapper.setData({ isOpen: true });
        wrapper.find('.PluginManagerButtonFilter__options__option').trigger('click');
        expect(wrapper.vm.isOpen).toBeFalse();
        expect(wrapper.vm.emitFilterChange).toHaveBeenCalledWith('all');
        expect(wrapper.emitted('filter-change')).toBeTruthy();
    });
});
//# sourceMappingURL=PluginManagerButtonFilter.spec.js.map