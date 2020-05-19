var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { mount } from '@vue/test-utils';
import { MenuDropdown, MenuDropdownItem, MenuDropdownHandler } from '@/components/Menu';
describe('MenuDropdown', function () {
    describe('Item', function () {
        it('should render component', function () {
            var wrapper = mount(MenuDropdownItem, {
                propsData: {
                    value: 'Test',
                    item: 'Item text'
                }
            });
            expect(wrapper.contains('.MenuDropdownItem')).toBeTruthy();
        });
        it('should render with active prop', function () {
            var wrapper = mount(MenuDropdownItem, {
                propsData: {
                    value: 'Test',
                    isActive: true,
                    item: 'Item text'
                }
            });
            expect(wrapper.contains('.MenuDropdownItem--active')).toBeTruthy();
        });
        it('should emit click event', function () {
            var wrapper = mount(MenuDropdownItem, {
                propsData: {
                    value: 'Test',
                    item: 'Item text'
                }
            });
            var element = wrapper.find('.MenuDropdownItem__button');
            element.trigger('click');
            expect(wrapper.emitted('click')).toBeTruthy();
        });
    });
    describe('Handler', function () {
        it('should render component', function () {
            var wrapper = mount(MenuDropdownHandler);
            expect(wrapper.contains('.MenuDropdownHandler')).toBeTruthy();
        });
        it('should render component with props', function () {
            var wrapper = mount(MenuDropdownHandler, {
                propsData: {
                    value: 'value',
                    item: 'Item text',
                    placeholder: 'Placeholder'
                }
            });
            var handler = wrapper.find('.MenuDropdownHandler');
            expect(handler.text()).toBe('Item text');
        });
        it('should render component with slots', function () {
            var wrapper = mount(MenuDropdownHandler, {
                slots: {
                    default: '<strong>Value</strong>'
                }
            });
            expect(wrapper.contains('.MenuDropdownHandler')).toBeTruthy();
        });
        it('should emit click event', function () {
            var wrapper = mount(MenuDropdownHandler, {
                propsData: {
                    value: 'Value'
                }
            });
            var handler = wrapper.find('.MenuDropdownHandler');
            handler.trigger('click');
            expect(wrapper.emitted('click')).toBeTruthy();
        });
    });
    describe('Menu', function () {
        it('should render component', function () {
            var wrapper = mount(MenuDropdown, {
                propsData: {
                    items: [1, 2, 3]
                }
            });
            wrapper.vm.open();
            expect(wrapper.contains('.MenuDropdown')).toBeTruthy();
        });
        describe('when the `position` is omitted', function () {
            it('should fallback to the default values', function () {
                var wrapper = mount(MenuDropdown);
                expect(wrapper.vm.adjustedPosition).toEqual({
                    x: '0',
                    y: '120%'
                });
            });
        });
        describe('when the `position` is an object', function () {
            it.each(['x', 'y'])('should merge the provided values with the default values', function (dimension) {
                var _a, _b;
                var wrapper = mount(MenuDropdown, {
                    propsData: {
                        position: (_a = {}, _a[dimension] = 'foo', _a)
                    }
                });
                var defaultValues = {
                    x: '0',
                    y: '120%'
                };
                expect(wrapper.vm.adjustedPosition).toEqual(__assign(__assign({}, defaultValues), (_b = {}, _b[dimension] = 'foo', _b)));
            });
        });
        describe('when the `items` are an Array', function () {
            it('should render component with `items`', function () {
                var wrapper = mount(MenuDropdown, {
                    propsData: {
                        items: ['first', 'second']
                    }
                });
                wrapper.vm.open();
                expect(wrapper.findAll('.MenuDropdownItem').length).toBe(2);
            });
            it('should emit the selected item on the `select` event', function () {
                var wrapper = mount(MenuDropdown, {
                    propsData: {
                        items: ['first', 'second'],
                        value: 'second'
                    }
                });
                var handler = wrapper.find('.MenuDropdownHandler');
                handler.trigger('click');
                var item = wrapper.find('.MenuDropdownItem__button');
                item.trigger('click');
                expect(wrapper.emitted().select[0]).toEqual(['first']);
            });
        });
        describe('when the `items` are an Object', function () {
            it('should render component with `items`', function () {
                var wrapper = mount(MenuDropdown, {
                    propsData: {
                        items: {
                            first: 'first label',
                            second: 'seconf label'
                        }
                    }
                });
                wrapper.vm.open();
                expect(wrapper.findAll('.MenuDropdownItem').length).toBe(2);
            });
            it('should emit the key of selected item on the `select` event', function () {
                var wrapper = mount(MenuDropdown, {
                    propsData: {
                        items: {
                            first: 'first label',
                            second: 'second label'
                        },
                        value: 'second'
                    }
                });
                var handler = wrapper.find('.MenuDropdownHandler');
                handler.trigger('click');
                var item = wrapper.find('.MenuDropdownItem__button');
                item.trigger('click');
                expect(wrapper.emitted().select[0]).toEqual(['first']);
            });
        });
        it('should render component with items and activeItem', function () {
            var wrapper = mount(MenuDropdown, {
                propsData: {
                    items: ['first', 'second'],
                    value: 'second'
                }
            });
            var handler = wrapper.find('.MenuDropdownHandler');
            handler.trigger('click');
            var active = wrapper.find('.MenuDropdownItem--active');
            expect(active.text()).toBe('second');
        });
        it('should render component with slots', function () {
            var item = mount(MenuDropdownItem, {
                propsData: {
                    value: 'Test',
                    item: 'Item text'
                }
            });
            var wrapper = mount(MenuDropdown, {
                slots: {
                    default: item.html()
                }
            });
            expect(wrapper.contains('.MenuDropdownItem')).toBeTruthy();
        });
        it('should not activate items when clicked', function () {
            var wrapper = mount(MenuDropdown, {
                propsData: {
                    items: ['first', 'second'],
                    value: 'second',
                    isHighlighting: false
                }
            });
            var handler = wrapper.find('.MenuDropdownHandler');
            handler.trigger('click');
            var isActive = wrapper.contains('.MenuDropdownItem--active');
            expect(isActive).toBe(false);
        });
    });
});
//# sourceMappingURL=MenuDropdown.spec.js.map