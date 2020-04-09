import { mount } from '@vue/test-utils'
import Navigation from '@/components/Slider/Navigation'

describe('Navigation', () => {
  it('should render', () => {
    const wrapper = mount(Navigation)
    expect(wrapper.isVueInstance()).toBeTruthy()
  })

  it('should accept css class', () => {
    const wrapper = mount(Navigation, {
      propsData: {
        leftButtonClass: 'ml-6',
        rightButtonClass: 'mr-6'
      }
    })
    expect(wrapper.vm.leftButtonClass).toBe('ml-6')
    expect(wrapper.vm.rightButtonClass).toBe('mr-6')
  })
})
