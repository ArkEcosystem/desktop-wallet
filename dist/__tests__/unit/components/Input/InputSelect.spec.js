import { mount } from '@vue/test-utils';
import { InputSelect } from '@/components/Input';
describe('InputSelect', function () {
    it('should render', function () {
        var wrapper = mount(InputSelect, {
            propsData: {
                name: 'test',
                label: 'test',
                items: []
            }
        });
        expect(wrapper.contains('.InputSelect')).toBeTruthy();
    });
    it('should render without default value', function () {
        var label = 'testing';
        var wrapper = mount(InputSelect, {
            propsData: {
                name: 'test',
                items: [],
                label: label
            }
        });
        var input = wrapper.find('.InputSelect__input');
        expect(input.text()).toBe(label);
    });
    describe('when receiving an Array as the `items` prop', function () {
        it('should select the `value` and display it as the text of the option', function () {
            var value = '1';
            var wrapper = mount(InputSelect, {
                propsData: {
                    name: 'test',
                    items: ['1', '2', '3'],
                    label: 'testing',
                    value: value
                }
            });
            var input = wrapper.find('.InputSelect__input');
            expect(input.text()).toBe(value);
        });
    });
    describe('when receiving an Object as the `items` prop', function () {
        it('should select the `value` key, but display its value as the text of the option', function () {
            var items = { a: 'label A', b: 'label B', c: 'label C' };
            var value = 'b';
            var wrapper = mount(InputSelect, {
                propsData: {
                    name: 'test',
                    items: items,
                    label: 'testing',
                    value: value
                }
            });
            var input = wrapper.find('.InputSelect__input');
            expect(input.text()).toBe(items[value]);
        });
    });
    it('should be disabled', function () {
        var wrapper = mount(InputSelect, {
            propsData: {
                name: 'test',
                label: 'test',
                items: [],
                isDisabled: true
            }
        });
        expect(wrapper.contains('.InputField--disabled'));
        var input = wrapper.find('.InputSelect__input');
        input.trigger('click');
        expect(wrapper.emitted('input')).toBeFalsy();
    });
});
//# sourceMappingURL=InputSelect.spec.js.map