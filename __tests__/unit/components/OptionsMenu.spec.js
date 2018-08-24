import { mount, shallowMount } from '@vue/test-utils'
import { OptionsMenu, OptionsMenuItem } from '@/components/OptionsMenu'

describe('OptionsMenu', () => {
  describe('render', () => {
    it('should render menu', () => {
      const wrapper = mount(OptionsMenu)
      expect(wrapper.contains('.OptionsMenu')).toBe(true)
    })

    it('should render item', () => {
      const wrapper = mount(OptionsMenuItem, {
        propsData: {
          title: 'Testing component'
        }
      })
      expect(wrapper.contains('.OptionsMenuItem')).toBe(true)
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
      expect(wrapper.contains('.OptionsMenuItem')).toBe(true)
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

      expect(wrapper.contains('.OptionsMenuItem')).toBe(true)
    })
  })
})
