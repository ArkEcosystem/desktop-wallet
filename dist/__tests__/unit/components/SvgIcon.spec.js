import { mount } from '@vue/test-utils';
import SvgIcon from '@/components/SvgIcon';
describe('SvgIcon', function () {
    it('should render', function () {
        var wrapper = mount(SvgIcon, {
            propsData: {
                name: 'test'
            }
        });
        expect(wrapper.isVueInstance()).toBeTrue();
    });
});
//# sourceMappingURL=SvgIcon.spec.js.map