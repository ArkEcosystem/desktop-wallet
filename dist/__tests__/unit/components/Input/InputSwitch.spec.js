import 'reflect-metadata';
import { mount } from '@vue/test-utils';
import InputSwitch from '@/components/Input/InputSwitch.vue';
describe('InputSwitch', function () {
    it('should render', function () {
        var wrapper = mount(InputSwitch);
        expect(wrapper.isVueInstance()).toBeTruthy();
        expect(wrapper.contains('.InputSwitch')).toBeTruthy();
    });
    describe('inner ButtonSwitch', function () {
        it('should toggle when user clicks', function () {
            var wrapper = mount(InputSwitch);
            wrapper.find('.ButtonSwitch').trigger('click');
            expect(wrapper.emitted('change')).toBeTruthy();
        });
        it('should be active', function () {
            var wrapper = mount(InputSwitch, {
                propsData: {
                    isActive: true
                }
            });
            expect(wrapper.contains('.ButtonSwitch--active')).toBeTruthy();
        });
    });
    it('should be disabled', function () {
        var wrapper = mount(InputSwitch, {
            propsData: {
                isDisabled: true
            }
        });
        wrapper.trigger('click');
        expect(wrapper.emitted('change')).toBeFalsy();
    });
    it('should display the `label` prop', function () {
        var label = 'example label';
        var wrapper = mount(InputSwitch, {
            propsData: { label: label }
        });
        expect(wrapper.text()).toContain(label);
    });
    it('should display the `text` prop', function () {
        var text = 'example text';
        var wrapper = mount(InputSwitch, {
            propsData: { text: text }
        });
        expect(wrapper.text()).toContain(text);
    });
});
//# sourceMappingURL=InputSwitch.spec.js.map