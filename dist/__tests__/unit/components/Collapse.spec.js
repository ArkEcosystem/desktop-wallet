import { mount, shallowMount } from '@vue/test-utils';
import { Collapse, CollapseAccordion } from '@/components/Collapse';
describe('Collapse', function () {
    it('should render collapse', function () {
        var wrapper = mount(Collapse);
        expect(wrapper.isVueInstance()).toBeTrue();
    });
    it('should render with default slot', function () {
        var slot = 'My Collapsible content';
        var wrapper = mount(Collapse, {
            propsData: {
                isOpen: true
            },
            slots: {
                default: slot
            }
        });
        expect(wrapper.find('.Collapse__content').isVisible());
    });
    it('should render with handler slot', function () {
        var handler = 'My Collapsible handler';
        var content = 'My Collapsible content';
        var wrapper = mount(Collapse, {
            slots: {
                handler: handler,
                default: content
            }
        });
        var button = wrapper.find('.Collapse__handler');
        button.trigger('click');
        expect(wrapper.find('.Collapse__content').isVisible());
    });
    it('should emit close/open event', function () {
        var wrapper = mount(Collapse);
        wrapper.vm.toggle();
        expect(wrapper.emitted('open')).toBeTruthy();
        wrapper.vm.toggle();
        expect(wrapper.emitted('close')).toBeTruthy();
    });
    it('should disable handler', function () {
        var wrapper = mount(Collapse, {
            propsData: {
                isDisabled: true
            }
        });
        wrapper.vm.toggle();
        expect(wrapper.emitted('open')).toBeFalsy();
    });
    it('should render accordion', function () {
        var wrapper = shallowMount(CollapseAccordion, {
            propsData: {
                items: []
            }
        });
        expect(wrapper.isVueInstance()).toBeTrue();
    });
});
//# sourceMappingURL=Collapse.spec.js.map