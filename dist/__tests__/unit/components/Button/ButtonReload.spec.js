import { mount } from '@vue/test-utils';
import { ButtonReload } from '@/components/Button';
describe('ButtonReload', function () {
    var wrapper;
    beforeEach(function () {
        wrapper = mount(ButtonReload);
    });
    it('should render', function () {
        expect(wrapper.contains('.ButtonReload')).toBeTruthy();
    });
    it('should emit click event', function () {
        wrapper.trigger('click');
        expect(wrapper.emitted('click')).toBeTruthy();
    });
});
//# sourceMappingURL=ButtonReload.spec.js.map