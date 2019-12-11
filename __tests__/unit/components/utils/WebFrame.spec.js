import { mount } from '@vue/test-utils'
import WebFrame from '@/components/utils/WebFrame'

describe('WebFrame', () => {
  it('should be instantiated', () => {
    const wrapper = mount(WebFrame)
    expect(wrapper.isVisible()).toBeTrue()
  })

  it('should render an webview element', () => {
    const wrapper = mount(WebFrame)
    expect(wrapper.find('webview').exists()).toBeTrue()
  })

  it('should contain the enableremotemodule attribute', () => {
    const wrapper = mount(WebFrame)
    const webview = wrapper.find('webview')
    expect(webview.attributes('enableremotemodule')).toBe('false')
  })

  it('should contain the preload attribute', () => {
    const wrapper = mount(WebFrame)
    const webview = wrapper.find('webview')
    expect(webview.attributes('preload')).toBeTruthy()
  })

  it('should accept ark uri', () => {
    const wrapper = mount(WebFrame, {
      propsData: {
        src: 'ark:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
      }
    })
    const webview = wrapper.find('webview')
    expect(webview.attributes('src')).toBe('ark:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA')
  })

  it('should render http url', () => {
    const wrapper = mount(WebFrame, {
      propsData: {
        src: 'http://google.com'
      }
    })
    const webview = wrapper.find('webview')
    expect(webview.attributes('src')).toBe('http://google.com')
  })

  it('should not render file url', () => {
    const wrapper = mount(WebFrame, {
      propsData: {
        src: 'file://index.html'
      }
    })
    const webview = wrapper.find('webview')
    expect(webview.attributes('src')).toBe('about:blank')
  })

  it('should set custom size', () => {
    const wrapper = mount(WebFrame, {
      propsData: {
        width: 500,
        height: 500
      }
    })
    const webview = wrapper.find('webview')
    const { width, height } = webview.attributes()
    expect(width).toBe('500')
    expect(height).toBe('500')
  })
})
