import { mount } from '@vue/test-utils'
import InputText from '@/components/InputText'

describe('InputText', () => {
  it('should render', () => {
    const wrapper = mount(InputText, {
      propsData: {
        name: 'test',
        label: 'test'
      }
    })
    expect(wrapper.contains('.InputText')).toBeTruthy()
  })

  it('should render with v-model', () => {
    const value = 'testing'
    const wrapper = mount(InputText, {
      propsData: {
        name: 'test',
        label: 'test',
        value
      }
    })
    expect(wrapper.vm.value).toBe(value)
    const input = wrapper.find('.InputText__input')
    expect(input.element.value).toBe(value)
  })

  it('should be disabled', () => {
    const wrapper = mount(InputText, {
      propsData: {
        name: 'test',
        label: 'test',
        isDisabled: true
      }
    })
    const input = wrapper.find('.InputText__input')
    expect(input.attributes().disabled).toBe('disabled')
  })

  it('should be dirty', () => {
    const wrapper = mount(InputText, {
      propsData: {
        name: 'test',
        label: 'test',
        value: 'testing'
      }
    })
    expect(wrapper.vm.isDirty).toBeTrue()
  })

  it('should show a helper text', () => {
    const helperText = 'testing'
    const wrapper = mount(InputText, {
      propsData: {
        name: 'test',
        label: 'test',
        helperText
      }
    })
    const helper = wrapper.find('.InputField__helper')
    expect(helper.text()).toBe(helperText)
  })

  it('should focus the input', () => {
    const wrapper = mount(InputText, {
      propsData: {
        name: 'test',
        label: 'test'
      }
    })
    wrapper.vm.focus()
    expect(wrapper.vm.isFocused).toBeTrue()
  })
})
