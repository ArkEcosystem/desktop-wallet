import { mount } from '@vue/test-utils';
import Navigation from '@/components/Slider/Navigation';
describe('Navigation', function () {
    it('should render', function () {
        var wrapper = mount(Navigation);
        expect(wrapper.isVueInstance()).toBeTruthy();
    });
    it('should accept css class', function () {
        var wrapper = mount(Navigation, {
            propsData: {
                leftButtonClass: 'ml-6',
                rightButtonClass: 'mr-6'
            }
        });
        expect(wrapper.vm.leftButtonClass).toBe('ml-6');
        expect(wrapper.vm.rightButtonClass).toBe('mr-6');
    });
});
//# sourceMappingURL=Navigation.spec.js.map