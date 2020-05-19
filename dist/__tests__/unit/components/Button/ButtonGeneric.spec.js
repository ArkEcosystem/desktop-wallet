import { mount } from '@vue/test-utils';
import { ButtonGeneric } from '@/components/Button';
describe('ButtonGeneric', function () {
    var wrapper;
    beforeEach(function () {
        wrapper = mount(ButtonGeneric, {
            propsData: {
                label: 'Test'
            }
        });
    });
    it('should render', function () {
        expect(wrapper.contains('.ButtonGeneric')).toBeTruthy();
    });
    it('should emit click event', function () {
        wrapper.trigger('click');
        expect(wrapper.emitted('click')).toBeTruthy();
    });
});
//# sourceMappingURL=ButtonGeneric.spec.js.map