import { mount } from '@vue/test-utils';
import { MenuNavigation, MenuNavigationItem } from '@/components/Menu';
describe('MenuNavigation', function () {
    var wrapper;
    beforeEach(function () {
        wrapper = mount(MenuNavigationItem, {
            provide: {
                switchToId: jest.fn()
            },
            propsData: {
                id: 'test'
            }
        });
    });
    it('should render', function () {
        expect(wrapper.isVueInstance()).toBeTruthy();
    });
    it('should toggle the active status', function () {
        wrapper.setData({
            isActive: true
        });
        expect(wrapper.vm.isActive).toBeTrue();
        wrapper.vm.toggle(false);
        expect(wrapper.vm.isActive).toBeFalse();
    });
    it('should accept slot', function () {
        var slot = 'My MenuNavigationItem component';
        var wrapper = mount(MenuNavigationItem, {
            provide: {
                switchToItem: jest.fn()
            },
            slots: {
                default: slot
            },
            propsData: {
                id: 'test'
            }
        });
        var item = wrapper.find('.MenuNavigationItem');
        expect(item.text()).toBe(slot);
    });
    it('should render the menu', function () {
        var wrapper = mount(MenuNavigation);
        expect(wrapper.isVueInstance()).toBeTruthy();
    });
});
//# sourceMappingURL=MenuNavigation.spec.js.map