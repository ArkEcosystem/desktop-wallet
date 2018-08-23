import { mount } from '@vue/test-utils'
import SelectMenuHandler from '@/components/select-menu/select-menu-handler'
import SelectMenuItem from '@/components/select-menu/select-menu-item'
import SelectMenu from '@/components/select-menu/select-menu'

describe('SelectMenu', () => {
  describe('Item', () => {
    it('should render component', () => {
      const wrapper = mount(SelectMenuItem, {
        propsData: {
          value: 'Test'
        }
      })
      expect(wrapper.contains('.select-menu-item')).toBeTruthy()
    })

    it('should render with active prop', () => {
      const wrapper = mount(SelectMenuItem, {
        propsData: {
          value: 'Test',
          isActive: true
        }
      })
      expect(wrapper.contains('.active')).toBeTruthy()
    })

    it('should emit click event', () => {
      const wrapper = mount(SelectMenuItem, {
        propsData: {
          value: 'Test'
        }
      })
      const element = wrapper.find('.select-menu-item')
      element.trigger('click')
      expect(wrapper.emitted('click')).toBeTruthy()
    })
  })

  describe('Handler', () => {
    it('should render component', () => {
      const wrapper = mount(SelectMenuHandler)
      expect(wrapper.contains('.select-menu-handler')).toBeTruthy()
    })

    it('should render component with props', () => {
      const wrapper = mount(SelectMenuHandler, {
        propsData: {
          value: 'Value',
          placeholder: 'Placeholder'
        }
      })
      const handler = wrapper.find('.select-menu-handler')
      expect(handler.text()).toBe('Value')
    })

    it('should render component with slots', () => {
      const wrapper = mount(SelectMenuHandler, {
        slots: {
          default: '<strong>Value</strong>'
        }
      })
      expect(wrapper.contains('.select-menu-handler')).toBeTruthy()
    })

    it('should emit click event', () => {
      const wrapper = mount(SelectMenuHandler, {
        propsData: {
          value: 'Value'
        }
      })
      const handler = wrapper.find('.select-menu-handler')
      handler.trigger('click')
      expect(wrapper.emitted('click')).toBeTruthy()
    })
  })

  describe('Menu', () => {
    it('should render component', () => {
      const wrapper = mount(SelectMenu)
      expect(wrapper.contains('.select-menu')).toBeTruthy()
    })

    it('should render component with items', () => {
      const wrapper = mount(SelectMenu, {
        propsData: {
          items: ['first', 'second']
        }
      })
      expect(wrapper.findAll('.select-menu-item').length).toBe(2)
    })

    it('should emit select event', () => {
      const wrapper = mount(SelectMenu, {
        propsData: {
          items: ['first', 'second']
        }
      })
      const handler = wrapper.find('.select-menu-handler')
      handler.trigger('click')
      const item = wrapper.find('.select-menu-item')
      item.trigger('click')
      expect(wrapper.emitted('select')).toBeTruthy()
    })

    it('should render component with items and activeItem', () => {
      const wrapper = mount(SelectMenu, {
        propsData: {
          items: ['first', 'second'],
          value: 'second'
        }
      })
      const handler = wrapper.find('.select-menu-handler')
      handler.trigger('click')
      const active = wrapper.find('.active')
      expect(active.text()).toBe('second')
    })

    it('should render component with slots', () => {
      const item = mount(SelectMenuItem, {
        propsData: {
          value: 'Test'
        }
      })
      const wrapper = mount(SelectMenu, {
        slots: {
          default: item.html()
        }
      })
      expect(wrapper.contains('.select-menu-item')).toBeTruthy()
    })
  })
})
