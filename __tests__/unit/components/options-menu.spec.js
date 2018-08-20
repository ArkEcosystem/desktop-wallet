import { mount, shallowMount } from '@vue/test-utils'
import OptionsMenu from '@/components/options-menu/options-menu'
import OptionsMenuItem from '@/components/options-menu/options-menu-item'

describe('OptionsMenu', () => {
  describe('render', () => {
    it('should render menu', () => {
      const wrapper = mount(OptionsMenu)
      expect(wrapper.contains('.options-menu')).toBe(true)
    })

    it('should render item', () => {
      const wrapper = mount(OptionsMenuItem, {
        propsData: {
          title: 'Testing component'
        }
      })
      expect(wrapper.contains('.options-menu-item')).toBe(true)
    })

    it('should render item with controls', () => {
      const wrapper = mount(OptionsMenuItem, {
        propsData: {
          title: 'Testing component'
        },
        slots: {
          controls: '<strong>My component</strong>'
        }
      })
      expect(wrapper.contains('.options-menu-item')).toBe(true)
    })

    it('should render menu with child', () => {
      const item = shallowMount(OptionsMenuItem, {
        propsData: {
          title: 'Testing component'
        }
      })

      const wrapper = shallowMount(OptionsMenu, {
        slots: {
          default: item.html()
        }
      })

      expect(wrapper.contains('.options-menu-item')).toBe(true)
    })
  })
})
