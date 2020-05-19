import { mount } from '@vue/test-utils';
import { SliderImageModal } from '@/components/Slider';
var images = [
    'preview-1.png',
    'preview-2.png',
    'preview-3.png',
    'preview-4.png'
];
var stubs = {
    Portal: '<div><slot/></div>'
};
var wrapper;
var createWrapper = function (component, propsData) {
    component = component || SliderImageModal;
    propsData = propsData || {
        images: images,
        closeImage: jest.fn()
    };
    wrapper = mount(component, {
        propsData: propsData,
        stubs: stubs
    });
};
describe('SliderImageModal', function () {
    beforeEach(function () {
        createWrapper();
    });
    it('should render', function () {
        expect(wrapper.isVueInstance()).toBeTruthy();
    });
});
//# sourceMappingURL=SliderImageModal.spec.js.map