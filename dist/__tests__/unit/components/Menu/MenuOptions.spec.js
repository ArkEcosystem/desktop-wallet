import { mount, shallowMount } from '@vue/test-utils';
import { MenuOptions, MenuOptionsItem } from '@/components/Menu';
describe('MenuOptions', function () {
    describe('render', function () {
        it('should render menu', function () {
            var wrapper = mount(MenuOptions);
            expect(wrapper.contains('.MenuOptions')).toBe(true);
        });
        it('should render item', function () {
            var wrapper = mount(MenuOptionsItem, {
                propsData: {
                    title: 'Testing component'
                }
            });
            expect(wrapper.contains('.MenuOptionsItem')).toBe(true);
        });
        it('should render item with controls', function () {
            var wrapper = mount(MenuOptionsItem, {
                propsData: {
                    title: 'Testing component'
                },
                slots: {
                    controls: '<strong>My component</strong>'
                }
            });
            expect(wrapper.contains('.MenuOptionsItem')).toBe(true);
        });
        it('should render menu with child', function () {
            var item = shallowMount(MenuOptionsItem, {
                propsData: {
                    title: 'Testing component'
                }
            });
            var wrapper = shallowMount(MenuOptions, {
                slots: {
                    default: item.html()
                }
            });
            expect(wrapper.contains('.MenuOptionsItem')).toBe(true);
        });
    });
});
//# sourceMappingURL=MenuOptions.spec.js.map