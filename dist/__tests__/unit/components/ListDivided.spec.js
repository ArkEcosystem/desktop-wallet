import { mount } from '@vue/test-utils';
import { ListDivided, ListDividedItem } from '@/components/ListDivided';
describe('ListDivided', function () {
    it('should render item', function () {
        var wrapper = mount(ListDividedItem, {
            propsData: {
                label: 'test'
            }
        });
        expect(wrapper.isVueInstance());
    });
    it('should show the label', function () {
        var label = 'test';
        var wrapper = mount(ListDividedItem, {
            propsData: {
                label: label
            }
        });
        var div = wrapper.find('.ListDividedItem__label');
        expect(div.text()).toBe(label);
        expect(div.isVisible()).toBeTrue();
    });
    it('should show the value', function () {
        var value = 'test';
        var wrapper = mount(ListDividedItem, {
            propsData: {
                label: 'test',
                value: value
            }
        });
        var div = wrapper.find('.ListDividedItem__value');
        expect(div.text()).toBe(value);
        expect(div.isVisible()).toBeTrue();
    });
    it('should accept default slot', function () {
        var wrapper = mount(ListDividedItem, {
            propsData: {
                label: 'test'
            },
            slots: {
                default: '<strong>test</strong>'
            }
        });
        var div = wrapper.find('.ListDividedItem__value');
        expect(div.isVisible()).toBeTrue();
    });
    it('should render list', function () {
        var wrapper = mount(ListDivided);
        expect(wrapper.isVueInstance());
    });
    it('should render list with items', function () {
        var items = {
            address: 'example',
            fee: '0.01'
        };
        var wrapper = mount(ListDivided, {
            propsData: {
                items: items
            }
        });
        var elements = wrapper.findAll('.ListDividedItem');
        expect(elements.length).toBe(2);
    });
});
//# sourceMappingURL=ListDivided.spec.js.map