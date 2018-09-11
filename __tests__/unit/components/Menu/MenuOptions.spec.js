import { mount, shallowMount } from '@vue/test-utils'
import { MenuOptions, MenuOptionsItem } from '@/components/Menu'

describe('MenuOptions', () => {
  describe('render', () => {
    it('should render menu', () => {
      const wrapper = mount(MenuOptions)
      expect(wrapper.contains('.MenuOptions')).toBe(true)
    })

    it('should render item', () => {
      const wrapper = mount(MenuOptionsItem, {
        propsData: {
          title: 'Testing component'
        }
      })
      expect(wrapper.contains('.MenuOptionsItem')).toBe(true)
    })

    it('should render item with controls', () => {
      const wrapper = mount(MenuOptionsItem, {
        propsData: {
          title: 'Testing component'
        },
        slots: {
          controls: '<strong>My component</strong>'
        }
      })
      expect(wrapper.contains('.MenuOptionsItem')).toBe(true)
    })

    it('should render menu with child', () => {
      const item = shallowMount(MenuOptionsItem, {
        propsData: {
          title: 'Testing component'
        }
      })

      const wrapper = shallowMount(MenuOptions, {
        slots: {
          default: item.html()
        }
      })

      expect(wrapper.contains('.MenuOptionsItem')).toBe(true)
    })
  })
})
