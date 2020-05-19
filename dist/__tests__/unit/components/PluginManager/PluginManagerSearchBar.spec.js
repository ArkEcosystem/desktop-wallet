import { shallowMount } from '@vue/test-utils';
import useI18nGlobally from '../../__utils__/i18n';
import { PluginManagerSearchBar } from '@/components/PluginManager';
var i18n = useI18nGlobally();
var wrapper;
beforeEach(function () {
    wrapper = shallowMount(PluginManagerSearchBar, { i18n: i18n });
});
describe('PluginManagerSearchBar', function () {
    it('should render', function () {
        expect(wrapper.isVueInstance()).toBeTrue();
    });
    it('should call emitSearch when query changes', function () {
        jest.spyOn(wrapper.vm, 'emitSearch');
        wrapper.vm.query = 'foobar';
        expect(wrapper.vm.emitSearch).toHaveBeenCalled();
    });
    describe('should emit search event', function () {
        it('when query is falsy', function () {
            wrapper.find('input').setValue(null);
            wrapper.find('input').trigger('input');
            setTimeout(function () {
                expect(wrapper.emitted('search')).toBeTruthy();
            }, 500);
            wrapper.find('input').setValue('');
            wrapper.find('input').trigger('input');
            setTimeout(function () {
                expect(wrapper.emitted('search')).toBeTruthy();
            }, 500);
        });
        it('when query has length 3 or higher', function () {
            wrapper.find('input').setValue('foo');
            wrapper.find('input').trigger('input');
            setTimeout(function () {
                expect(wrapper.emitted('search')).toBeTruthy();
            }, 500);
        });
    });
    describe('should not emit search event', function () {
        it('when query has positive length smaller than 3', function () {
            wrapper.find('input').setValue('no');
            wrapper.find('input').trigger('input');
            setTimeout(function () {
                expect(wrapper.emitted('search')).toBeFalsy();
            }, 500);
        });
    });
    it('should reset the input on escape', function () {
        var query = 'foobar';
        wrapper.find('input').setValue(query);
        expect(wrapper.find('input').element.value).toBe(query);
        wrapper.find('input').trigger('keyup.esc');
        expect(wrapper.vm.query).toBe(null);
    });
});
//# sourceMappingURL=PluginManagerSearchBar.spec.js.map