import 'reflect-metadata'
import { mount } from '@vue/test-utils'
import InputSwitch from '@/components/Input/InputSwitch.vue'

describe('InputSwitch', () => {
  it('should render', () => {
    const wrapper = mount(InputSwitch)
    expect(wrapper.isVueInstance()).toBeTruthy()
    expect(wrapper.contains('.InputSwitch')).toBeTruthy()
  })

  describe('inner ButtonSwitch', () => {
    it('should toggle when user clicks', () => {
      const wrapper = mount(InputSwitch)
      wrapper.find('.ButtonSwitch').trigger('click')
      expect(wrapper.emitted('change')).toBeTruthy()
    })

    it('should be active', () => {
      const wrapper = mount(InputSwitch, {
        propsData: {
          isActive: true
        }
      })
      expect(wrapper.contains('.ButtonSwitch--active')).toBeTruthy()
    })
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

  it('should display the `label` prop', () => {
    const label = 'example label'
    const wrapper = mount(InputSwitch, {
      propsData: { label }
    })
    expect(wrapper.text()).toContain(label)
  })

  it('should display the `text` prop', () => {
    const text = 'example text'
    const wrapper = mount(InputSwitch, {
      propsData: { text }
    })
    expect(wrapper.text()).toContain(text)
  })
})
