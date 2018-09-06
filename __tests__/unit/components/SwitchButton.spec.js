import { mount } from '@vue/test-utils'
import SwitchButton from '@/components/SwitchButton'

describe('SwitchButton', () => {
  it('should render', () => {
    const wrapper = mount(SwitchButton)
    expect(wrapper.isVueInstance()).toBeTruthy()
    expect(wrapper.contains('.SwitchButton')).toBeTruthy()
  })

  it('should toggle when user clicks', () => {
    const wrapper = mount(SwitchButton)
    wrapper.trigger('click')
    expect(wrapper.emitted('change')).toBeTruthy()
  })

  it('should toggle by method', () => {
    const wrapper = mount(SwitchButton)
    wrapper.vm.toggle()
    expect(wrapper.emitted('change')).toBeTruthy()
  })

  it('should be active', () => {
    const wrapper = mount(SwitchButton, {
      propsData: {
        isActive: true
      }
    })
    expect(wrapper.contains('.SwitchButton--active')).toBeTruthy()
  })

  it('should be disabled', () => {
    const wrapper = mount(SwitchButton, {
      propsData: {
        isDisabled: true
      }
    })
    wrapper.trigger('click')
    expect(wrapper.emitted('change')).toBeFalsy()
  })
})
