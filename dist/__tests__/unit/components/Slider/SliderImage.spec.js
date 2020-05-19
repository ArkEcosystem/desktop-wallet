import { mount } from '@vue/test-utils';
import { SliderImage } from '@/components/Slider';
var images = [
    'preview-1.png',
    'preview-2.png',
    'preview-3.png',
    'preview-4.png'
];
var wrapper;
var createWrapper = function (component, propsData) {
    component = component || SliderImage;
    propsData = propsData || {
        isRow: true,
        images: images
    };
    wrapper = mount(component, {
        propsData: propsData
    });
};
describe('SliderImage', function () {
    beforeEach(function () {
        createWrapper();
    });
    it('should render', function () {
        expect(wrapper.isVueInstance()).toBeTruthy();
    });
    it('should render images in row (thumbnails)', function () {
        var sliderImage = wrapper.find('.SliderImage__container');
        expect(sliderImage.contains('.SliderImage__container--row')).toBeTruthy();
    });
    it('should render images in stack', function () {
        createWrapper(SliderImage, {
            isRow: false,
            images: images
        });
        var sliderImage = wrapper.find('.SliderImage__container');
        expect(sliderImage.contains('.SliderImage__container--stack')).toBeTruthy();
    });
    it('should render if has images', function () {
        expect(wrapper.vm.hasImages).toEqual(true);
    });
    it('should show navigation if "showNavigation" is true', function () {
        createWrapper(SliderImage, {
            isRow: true,
            showNavigation: true,
            images: images
        });
        var _a = wrapper.vm, showNavigation = _a.showNavigation, pageCount = _a.pageCount;
        expect(showNavigation && pageCount > 1).toEqual(true);
    });
    it('should not show navigation if "showNavigation" is false', function () {
        createWrapper(SliderImage, {
            isRow: true,
            showNavigation: false,
            images: images
        });
        var _a = wrapper.vm, showNavigation = _a.showNavigation, pageCount = _a.pageCount;
        expect(showNavigation && pageCount > 1).toEqual(false);
    });
    it('should show pagination if "showPagination" is true', function () {
        createWrapper(SliderImage, {
            isRow: true,
            showPagination: true,
            images: images
        });
        var _a = wrapper.vm, showPagination = _a.showPagination, pageCount = _a.pageCount;
        expect(showPagination && pageCount > 1).toEqual(true);
    });
    it('should not show pagination if "showPagination" is false', function () {
        createWrapper(SliderImage, {
            isRow: true,
            showPagination: false,
            images: images
        });
        var _a = wrapper.vm, showPagination = _a.showPagination, pageCount = _a.pageCount;
        expect(showPagination && pageCount > 1).toEqual(false);
    });
    it('should not show navigation and pagination if page count is less than 1', function () {
        createWrapper(SliderImage, {
            isRow: true,
            images: [
                'preview-1.png'
            ]
        });
        expect(wrapper.vm.pageCount > 1).toEqual(false);
    });
    it('should show two images per page', function () {
        createWrapper(SliderImage, {
            isRow: true,
            perPage: 2,
            images: images
        });
        expect(wrapper.vm.perPage).toBe(2);
    });
});
//# sourceMappingURL=SliderImage.spec.js.map