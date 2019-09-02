import { mount } from '@vue/test-utils'
import { MenuNavigation, MenuNavigationItem } from '@/components/Menu'

describe('MenuNavigation', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(MenuNavigationItem, {
      provide: {
        switchToId: jest.fn()
      },
      propsData: {
        id: 'test'
      }
    })
  })

  it('should render', () => {
    expect(wrapper.isVueInstance()).toBeTruthy()
  })

  it('should toggle the active status', () => {
    wrapper.setData({
      isActive: true
    })
    expect(wrapper.vm.isActive).toBeTrue()
    wrapper.vm.toggle(false)
    expect(wrapper.vm.isActive).toBeFalse()
  })

  it('should accept slot', () => {
    const slot = 'My MenuNavigationItem component'
    const wrapper = mount(MenuNavigationItem, {
      provide: {
        switchToItem: jest.fn()
      },
      slots: {
        default: slot
      },
      propsData: {
        id: 'test'
      }
    })
    const item = wrapper.find('.MenuNavigationItem')
    expect(item.text()).toBe(slot)
  })

  it('should render the menu', () => {
    const wrapper = mount(MenuNavigation)
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})
