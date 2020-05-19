import { mount } from '@vue/test-utils';
import Pagination from '@/components/Slider/Pagination';
describe('Pagination', function () {
    it('should render', function () {
        var wrapper = mount(Pagination, {
            propsData: {
                currentIndex: 1,
                pageCount: 2
            }
        });
        expect(wrapper.isVueInstance()).toBeTruthy();
    });
    it('should render an inactive button', function () {
        var wrapper = mount(Pagination, {
            propsData: {
                currentIndex: 1,
                pageCount: 2
            }
        });
        var pagination = wrapper.find('.Pagination__page');
        expect(pagination.contains('.bg-theme-button')).toBeTruthy();
    });
    it('should render an active button', function () {
        var wrapper = mount(Pagination, {
            propsData: {
                currentIndex: 0,
                pageCount: 2
            }
        });
        var pagination = wrapper.find('.Pagination__page');
        expect(pagination.contains('.bg-theme-button-active')).toBeTruthy();
    });
});
//# sourceMappingURL=Pagination.spec.js.map