import { mount } from '@vue/test-utils';
import { ButtonLetter } from '@/components/Button';
describe('ButtonLetter', function () {
    var wrapper;
    beforeEach(function () {
        wrapper = mount(ButtonLetter, {
            propsData: {
                value: 'Test'
            }
        });
    });
    it('should render', function () {
        expect(wrapper.contains('.ButtonLetter')).toBeTruthy();
    });
    it('should display the first chart', function () {
        expect(wrapper.vm.letter).toBe('T');
    });
});
//# sourceMappingURL=ButtonLetter.spec.js.map