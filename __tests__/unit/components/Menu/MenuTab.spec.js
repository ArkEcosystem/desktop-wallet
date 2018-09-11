import { mount } from '@vue/test-utils'
import { MenuTab, MenuTabItem } from '@/components/Menu'

describe('MenuTab', () => {
  it('should render', () => {
    const wrapper = mount(MenuTabItem, {
      propsData: {
        label: 'test',
        tab: 'test',
        isActive: true
      }
    })
    expect(wrapper.isVueInstance()).toBeTruthy()
  })

  it('should be hidden when it is not active', () => {
    const wrapper = mount(MenuTabItem, {
      propsData: {
        label: 'test',
        tab: 'test',
        isActive: false
      }
    })
    const item = wrapper.find('.MenuTabItem')
    expect(item.isVisible()).toBeFalsy()
  })

  it('should toggle the active status', () => {
    const wrapper = mount(MenuTabItem, {
      propsData: {
        label: 'test',
        tab: 'test',
        isActive: false
      }
    })
    expect(wrapper.vm.isActive).toBeFalse()
    wrapper.vm.toggle(true)
    expect(wrapper.vm.isActive).toBeTrue()
  })

  it('should accept slot', () => {
    const slot = 'My MenuTabItem component'
    const wrapper = mount(MenuTabItem, {
      slots: {
        default: slot
      },
      propsData: {
        label: 'test',
        tab: 'test',
        isActive: true
      }
    })
    const item = wrapper.find('.MenuTabItem')
    expect(item.text()).toBe(slot)
  })

  it('should render the menu', () => {
    const wrapper = mount(MenuTab)
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})
