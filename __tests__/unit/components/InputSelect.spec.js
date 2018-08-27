import { mount } from '@vue/test-utils'
import InputSelect from '@/components/InputSelect'

describe('InputSelect', () => {
  it('should render', () => {
    const wrapper = mount(InputSelect, {
      propsData: {
        name: 'test',
        label: 'test',
        items: []
      }
    })
    expect(wrapper.contains('.InputSelect')).toBeTruthy()
  })

  it('should render without default value', () => {
    const label = 'testing'
    const wrapper = mount(InputSelect, {
      propsData: {
        name: 'test',
        items: [],
        label
      }
    })
    const input = wrapper.find('.InputSelect__input')
    expect(input.text()).toBe(label)
  })

  it('should render with default value', () => {
    const value = '1'
    const wrapper = mount(InputSelect, {
      propsData: {
        name: 'test',
        items: ['1', '2', '3'],
        label: 'testing',
        value
      }
    })
    const input = wrapper.find('.InputSelect__input')
    expect(input.text()).toBe(value)
  })

  it('should be disabled', () => {
    const wrapper = mount(InputSelect, {
      propsData: {
        name: 'test',
        label: 'test',
        items: [],
        isDisabled: true
      }
    })
    expect(wrapper.contains('.InputField--disabled'))
    const input = wrapper.find('.InputSelect__input')
    input.trigger('click')
    expect(wrapper.emitted('input')).toBeFalsy()
  })
})
