import { mount } from '@vue/test-utils';
import { InputField } from '@/components/Input';
describe('InputField', function () {
    it('should render', function () {
        var wrapper = mount(InputField);
        expect(wrapper.contains('.InputField')).toBeTruthy();
    });
    it('should show the label', function () {
        var label = 'testing';
        var wrapper = mount(InputField, {
            propsData: {
                label: label
            }
        });
        var ele = wrapper.find('.InputField__label');
        expect(ele).toBeTruthy();
        expect(ele.text()).toBe(label);
    });
    it('should show the helper text', function () {
        var helperText = 'testing';
        var wrapper = mount(InputField, {
            propsData: {
                helperText: helperText
            }
        });
        var ele = wrapper.find('.InputField__helper');
        expect(ele).toBeTruthy();
        expect(ele.text()).toBe(helperText);
    });
    it('should be dirty', function () {
        var wrapper = mount(InputField, {
            propsData: {
                isDirty: true
            }
        });
        expect(wrapper.contains('.InputField--dirty')).toBeTruthy();
    });
    it('should be disabled', function () {
        var wrapper = mount(InputField, {
            propsData: {
                isDisabled: true
            }
        });
        expect(wrapper.contains('.InputField--disabled')).toBeTruthy();
    });
    it('should be focused', function () {
        var wrapper = mount(InputField, {
            propsData: {
                isFocused: true
            }
        });
        expect(wrapper.contains('.InputField--focused')).toBeTruthy();
    });
    it('should be invalid', function () {
        var wrapper = mount(InputField, {
            propsData: {
                isInvalid: true
            }
        });
        expect(wrapper.contains('.InputField--invalid')).toBeTruthy();
    });
    it('should accept default slot', function () {
        var wrapper = mount(InputField, {
            scopedSlots: {
                default: '<p slot-scope="props">{{ props.inputClass }}</p>'
            }
        });
        expect(wrapper.contains('p')).toBeTruthy();
    });
});
//# sourceMappingURL=InputField.spec.js.map