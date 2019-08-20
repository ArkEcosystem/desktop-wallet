import { mount } from '@vue/test-utils'
import WebFrame from '@/components/utils/WebFrame'

describe('WebFrame', () => {
  it('should be instantiated', () => {
    const wrapper = mount(WebFrame)
    expect(wrapper.isVisible()).toBeTrue()
  })

  it('should render an iframe element', () => {
    const wrapper = mount(WebFrame)
    expect(wrapper.find('iframe').exists()).toBeTrue()
  })

  it('should contain the sandbox attribute', () => {
    const wrapper = mount(WebFrame)
    const iframe = wrapper.find('iframe')
    expect(iframe.attributes('sandbox')).toBe('allow-forms allow-scripts allow-same-origin')
  })

  it('should render http url', () => {
    const wrapper = mount(WebFrame, {
      propsData: {
        src: 'http://google.com'
      }
    })
    const iframe = wrapper.find('iframe')
    expect(iframe.attributes('src')).toBe('http://google.com')
  })

  it('should not render file url', () => {
    const wrapper = mount(WebFrame, {
      propsData: {
        src: 'file://index.html'
      }
    })
    const iframe = wrapper.find('iframe')
    expect(iframe.attributes('src')).toBe('about:blank')
  })

  it('should set custom size', () => {
    const wrapper = mount(WebFrame, {
      propsData: {
        width: 500,
        height: 500
      }
    })
    const iframe = wrapper.find('iframe')
    const { width, height } = iframe.attributes()
    expect(width).toBe('500')
    expect(height).toBe('500')
  })
})
