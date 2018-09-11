import { mount } from '@vue/test-utils'
import { InputField } from '@/components/Input'

describe('InputField', () => {
  it('should render', () => {
    const wrapper = mount(InputField)
    expect(wrapper.contains('.InputField')).toBeTruthy()
  })

  it('should show the label', () => {
    const label = 'testing'
    const wrapper = mount(InputField, {
      propsData: {
        label
      }
    })
    const ele = wrapper.find('.InputField__label')
    expect(ele).toBeTruthy()
    expect(ele.text()).toBe(label)
  })

  it('should show the helper text', () => {
    const helperText = 'testing'
    const wrapper = mount(InputField, {
      propsData: {
        helperText
      }
    })
    const ele = wrapper.find('.InputField__helper')
    expect(ele).toBeTruthy()
    expect(ele.text()).toBe(helperText)
  })

  it('should be dirty', () => {
    const wrapper = mount(InputField, {
      propsData: {
        isDirty: true
      }
    })
    expect(wrapper.contains('.InputField--dirty')).toBeTruthy()
  })

  it('should be disabled', () => {
    const wrapper = mount(InputField, {
      propsData: {
        isDisabled: true
      }
    })
    expect(wrapper.contains('.InputField--disabled')).toBeTruthy()
  })

  it('should be focused', () => {
    const wrapper = mount(InputField, {
      propsData: {
        isFocused: true
      }
    })
    expect(wrapper.contains('.InputField--focused')).toBeTruthy()
  })

  it('should be invalid', () => {
    const wrapper = mount(InputField, {
      propsData: {
        isInvalid: true
      }
    })
    expect(wrapper.contains('.InputField--invalid')).toBeTruthy()
  })

  it('should accept default slot', () => {
    const wrapper = mount(InputField, {
      scopedSlots: {
        default: '<p slot-scope="props">{{ props.inputClass }}</p>'
      }
    })
    expect(wrapper.contains('p')).toBeTruthy()
  })
})
