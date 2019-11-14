import { shallowMount } from '@vue/test-utils'
import { PluginManagerButtonSwitch } from '@/components/PluginManager/PluginManagerButtons'

let wrapper

beforeEach(() => {
  wrapper = shallowMount(PluginManagerButtonSwitch)
})

describe('PluginManagerButtonSwitch', () => {
  it('should render', () => {
    expect(wrapper.isVueInstance()).toBeTrue()
  })

  it('should toggle when user clicks', () => {
    wrapper.trigger('click')
    expect(wrapper.emitted('change')).toBeTruthy()
  })

  it('should toggle by method', () => {
    wrapper.vm.toggle()
    expect(wrapper.emitted('change')).toBeTruthy()
  })

  it('should be active', () => {
    wrapper.setProps({ isActive: true })
    expect(wrapper.contains('.PluginManagerButtonSwitch--active')).toBeTruthy()
  })

  it('should be disabled', () => {
    wrapper.setProps({ isDisabled: true })
    wrapper.trigger('click')
    expect(wrapper.emitted('change')).toBeFalsy()
  })
})
