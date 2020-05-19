import { mount } from '@vue/test-utils';
import { ButtonClose } from '@/components/Button';
describe('ButtonClose', function () {
    var wrapper;
    beforeEach(function () {
        wrapper = mount(ButtonClose);
    });
    it('should render', function () {
        expect(wrapper.contains('.ButtonClose')).toBeTruthy();
    });
    it('should emit click event', function () {
        wrapper.trigger('click');
        expect(wrapper.emitted('click')).toBeTruthy();
    });
});
//# sourceMappingURL=ButtonClose.spec.js.map