import { mount } from '@vue/test-utils'
import { InputSelect } from '@/components/Input'

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

  describe('when receiving an Array as the `items` prop', () => {
    it('should select the `value` and display it as the text of the option', () => {
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
  })

  describe('when receiving an Object as the `items` prop', () => {
    it('should select the `value` key, but display its value as the text of the option', () => {
      const items = { a: 'label A', b: 'label B', c: 'label C' }
      const value = 'b'

      const wrapper = mount(InputSelect, {
        propsData: {
          name: 'test',
          items,
          label: 'testing',
          value
        }
      })
      const input = wrapper.find('.InputSelect__input')
      expect(input.text()).toBe(items[value])
    })
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
