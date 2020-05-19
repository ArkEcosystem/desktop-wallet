import { mount } from '@vue/test-utils';
import { MenuTab, MenuTabItem } from '@/components/Menu';
describe('MenuTab', function () {
    it('should render', function () {
        var wrapper = mount(MenuTabItem, {
            propsData: {
                label: 'test',
                tab: 'test',
                isActive: true
            }
        });
        expect(wrapper.isVueInstance()).toBeTruthy();
    });
    it('should be hidden when it is not active', function () {
        var wrapper = mount(MenuTabItem, {
            propsData: {
                label: 'test',
                tab: 'test',
                isActive: false
            }
        });
        var item = wrapper.find('.MenuTabItem');
        expect(item.isVisible()).toBeFalsy();
    });
    it('should toggle the active status', function () {
        var wrapper = mount(MenuTabItem, {
            propsData: {
                label: 'test',
                tab: 'test',
                isActive: false
            }
        });
        expect(wrapper.vm.isActive).toBeFalse();
        wrapper.vm.toggle(true);
        expect(wrapper.vm.isActive).toBeTrue();
    });
    it('should accept slot', function () {
        var slot = 'My MenuTabItem component';
        var wrapper = mount(MenuTabItem, {
            slots: {
                default: slot
            },
            propsData: {
                label: 'test',
                tab: 'test',
                isActive: true
            }
        });
        var item = wrapper.find('.MenuTabItem');
        expect(item.text()).toBe(slot);
    });
    it('should render the menu', function () {
        var wrapper = mount(MenuTab);
        expect(wrapper.isVueInstance()).toBeTruthy();
    });
});
//# sourceMappingURL=MenuTab.spec.js.map