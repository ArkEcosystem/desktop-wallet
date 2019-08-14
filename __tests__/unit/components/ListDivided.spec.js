import { mount } from '@vue/test-utils'
import { ListDivided, ListDividedItem } from '@/components/ListDivided'

describe('ListDivided', () => {
  it('should render item', () => {
    const wrapper = mount(ListDividedItem, {
      propsData: {
        label: 'test'
      }
    })
    expect(wrapper.isVueInstance())
  })

  it('should show the label', () => {
    const label = 'test'
    const wrapper = mount(ListDividedItem, {
      propsData: {
        label
      }
    })
    const div = wrapper.find('.ListDividedItem__label')
    expect(div.text()).toBe(label)
    expect(div.isVisible()).toBeTrue()
  })

  it('should show the value', () => {
    const value = 'test'
    const wrapper = mount(ListDividedItem, {
      propsData: {
        label: 'test',
        value
      }
    })
    const div = wrapper.find('.ListDividedItem__value')
    expect(div.text()).toBe(value)
    expect(div.isVisible()).toBeTrue()
  })

  it('should accept default slot', () => {
    const wrapper = mount(ListDividedItem, {
      propsData: {
        label: 'test'
      },
      slots: {
        default: '<strong>test</strong>'
      }
    })
    const div = wrapper.find('.ListDividedItem__value')
    expect(div.isVisible()).toBeTrue()
  })

  it('should render list', () => {
    const wrapper = mount(ListDivided)
    expect(wrapper.isVueInstance())
  })

  it('should render list with items', () => {
    const items = {
      address: 'example',
      fee: '0.01'
    }
    const wrapper = mount(ListDivided, {
      propsData: {
        items
      }
    })
    const elements = wrapper.findAll('.ListDividedItem')
    expect(elements.length).toBe(2)
  })
})
