import { mount } from '@vue/test-utils'
import IFrameWrapper from '@/components/utils/IFrameWrapper'

describe('IFrameWrapper', () => {
  it('should be instantiated', () => {
    const wrapper = mount(IFrameWrapper)
    expect(wrapper.isVisible()).toBeTrue()
  })

  it('should render an iframe element', () => {
    const wrapper = mount(IFrameWrapper)
    expect(wrapper.find('iframe').exists()).toBeTrue()
  })

  it('should contain the sandbox attribute', () => {
    const wrapper = mount(IFrameWrapper)
    const iframe = wrapper.find('iframe')
    expect(iframe.attributes('sandbox')).toBe('allow-forms allow-scripts')
  })

  it('should render http url', () => {
    const wrapper = mount(IFrameWrapper, {
      propsData: {
        src: 'http://google.com'
      }
    })
    const iframe = wrapper.find('iframe')
    expect(iframe.attributes('src')).toBe('http://google.com')
  })

  it('should not render file url', () => {
    const wrapper = mount(IFrameWrapper, {
      propsData: {
        src: 'file://index.html'
      }
    })
    const iframe = wrapper.find('iframe')
    expect(iframe.attributes('src')).toBe('about:blank')
  })

  it('should set custom size', () => {
    const wrapper = mount(IFrameWrapper, {
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
