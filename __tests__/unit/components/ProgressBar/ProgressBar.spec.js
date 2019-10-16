import { mount } from '@vue/test-utils'
import { ProgressBar } from '@/components/ProgressBar'

describe('ProgressBar', () => {
  it('should render', () => {
    const wrapper = mount(ProgressBar)
    expect(wrapper.isVueInstance()).toBeTruthy()
    expect(wrapper.contains('.ProgressBar')).toBeTruthy()
  })

  it('should show the bar', () => {
    const wrapper = mount(ProgressBar, {
      propsData: {
        percent: 80
      }
    })
    const progress = wrapper.find('.ProgressBar__bg')
    expect(progress.element.style.width).toBe('80%')
  })

  it('should use custom size', () => {
    const wrapper = mount(ProgressBar, {
      propsData: {
        size: 'large'
      }
    })
    expect(wrapper.contains('.ProgressBar--size-large')).toBeTruthy()
  })

  it('should use custom status', () => {
    const wrapper = mount(ProgressBar, {
      propsData: {
        status: 'active'
      }
    })
    expect(wrapper.contains('.ProgressBar--status-active')).toBeTruthy()
  })
})
