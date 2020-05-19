import { mount } from '@vue/test-utils';
import WebFrame from '@/components/utils/WebFrame';
describe('WebFrame', function () {
    it('should be instantiated', function () {
        var wrapper = mount(WebFrame);
        expect(wrapper.isVisible()).toBeTrue();
    });
    it('should render an webview element', function () {
        var wrapper = mount(WebFrame);
        expect(wrapper.find('webview').exists()).toBeTrue();
    });
    it('should contain the enableremotemodule attribute', function () {
        var wrapper = mount(WebFrame);
        var webview = wrapper.find('webview');
        expect(webview.attributes('enableremotemodule')).toBe('false');
    });
    it('should contain the preload attribute', function () {
        var wrapper = mount(WebFrame);
        var webview = wrapper.find('webview');
        expect(webview.attributes('preload')).toBeTruthy();
    });
    it('should accept ark uri', function () {
        var wrapper = mount(WebFrame, {
            propsData: {
                src: 'ark:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
            }
        });
        var webview = wrapper.find('webview');
        expect(webview.attributes('src')).toBe('ark:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
    });
    it('should render http url', function () {
        var wrapper = mount(WebFrame, {
            propsData: {
                src: 'http://google.com'
            }
        });
        var webview = wrapper.find('webview');
        expect(webview.attributes('src')).toBe('http://google.com');
    });
    it('should not render file url', function () {
        var wrapper = mount(WebFrame, {
            propsData: {
                src: 'file://index.html'
            }
        });
        var webview = wrapper.find('webview');
        expect(webview.attributes('src')).toBe('about:blank');
    });
    it('should set custom size', function () {
        var wrapper = mount(WebFrame, {
            propsData: {
                width: 500,
                height: 500
            }
        });
        var webview = wrapper.find('webview');
        var _a = webview.attributes(), width = _a.width, height = _a.height;
        expect(width).toBe('500');
        expect(height).toBe('500');
    });
});
//# sourceMappingURL=WebFrame.spec.js.map