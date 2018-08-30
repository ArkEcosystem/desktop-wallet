import { mount } from '@vue/test-utils'
import InputSwitch from '@/components/InputSwitch'

describe('InputSwitch', () => {
  it('should render', () => {
    const wrapper = mount(InputSwitch)
    expect(wrapper.isVueInstance()).toBeTruthy()
    expect(wrapper.contains('.InputSwitch')).toBeTruthy()
  })

  it('should toggle when user clicks', () => {
    const wrapper = mount(InputSwitch)
    wrapper.trigger('click')
    expect(wrapper.emitted('change')).toBeTruthy()
  })

  it('should toggle by method', () => {
    const wrapper = mount(InputSwitch)
    wrapper.vm.toggle()
    expect(wrapper.emitted('change')).toBeTruthy()
  })

  it('should be active', () => {
    const wrapper = mount(InputSwitch, {
      propsData: {
        isActive: true
      }
    })
    expect(wrapper.contains('.InputSwitch--active')).toBeTruthy()
  })

  it('should be disabled', () => {
    const wrapper = mount(InputSwitch, {
      propsData: {
        isDisabled: true
      }
    })
    wrapper.trigger('click')
    expect(wrapper.emitted('change')).toBeFalsy()
  })
})
