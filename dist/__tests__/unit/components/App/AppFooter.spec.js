import { shallowMount } from '@vue/test-utils';
import { AppFooter } from '@/components/App';
var wrapper;
var translation = 'Mock Translation';
var createWrapper = function () {
    wrapper = shallowMount(AppFooter, {
        mocks: {
            $t: function () { return translation; }
        },
        stubs: {
            PortalTarget: true
        }
    });
};
describe('AppFooter', function () {
    beforeEach(function () {
        createWrapper();
    });
    it('should render', function () {
        expect(wrapper.isVueInstance()).toBeTruthy();
        expect(wrapper.contains('.AppFooter')).toBeTruthy();
    });
    it('should display correct translation', function () {
        expect(wrapper.vm.text).toBe(translation);
        expect(wrapper.text()).toBe(translation);
    });
});
//# sourceMappingURL=AppFooter.spec.js.map