import { mount } from '@vue/test-utils';
import { ProgressBar } from '@/components/ProgressBar';
describe('ProgressBar', function () {
    it('should render', function () {
        var wrapper = mount(ProgressBar);
        expect(wrapper.isVueInstance()).toBeTruthy();
        expect(wrapper.contains('.ProgressBar')).toBeTruthy();
    });
    it('should show the bar', function () {
        var wrapper = mount(ProgressBar, {
            propsData: {
                percent: 80
            }
        });
        var progress = wrapper.find('.ProgressBar__bg');
        expect(progress.element.style.width).toBe('80%');
    });
    it('should use custom size', function () {
        var wrapper = mount(ProgressBar, {
            propsData: {
                size: 'large'
            }
        });
        expect(wrapper.contains('.ProgressBar--size-large')).toBeTruthy();
    });
    it('should use custom status', function () {
        var wrapper = mount(ProgressBar, {
            propsData: {
                status: 'active'
            }
        });
        expect(wrapper.contains('.ProgressBar--status-active')).toBeTruthy();
    });
});
//# sourceMappingURL=ProgressBar.spec.js.map