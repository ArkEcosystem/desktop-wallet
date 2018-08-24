import { mount } from '@vue/test-utils'
import { SelectMenu, SelectMenuItem, SelectMenuHandler } from '@/components/SelectMenu'

describe('SelectMenu', () => {
  describe('Item', () => {
    it('should render component', () => {
      const wrapper = mount(SelectMenuItem, {
        propsData: {
          value: 'Test'
        }
      })
      expect(wrapper.contains('.SelectMenuItem')).toBeTruthy()
    })

    it('should render with active prop', () => {
      const wrapper = mount(SelectMenuItem, {
        propsData: {
          value: 'Test',
          isActive: true
        }
      })
      expect(wrapper.contains('.SelectMenuItem--active')).toBeTruthy()
    })

    it('should emit click event', () => {
      const wrapper = mount(SelectMenuItem, {
        propsData: {
          value: 'Test'
        }
      })
      const element = wrapper.find('.SelectMenuItem')
      element.trigger('click')
      expect(wrapper.emitted('click')).toBeTruthy()
    })
  })

  describe('Handler', () => {
    it('should render component', () => {
      const wrapper = mount(SelectMenuHandler)
      expect(wrapper.contains('.SelectMenuHandler')).toBeTruthy()
    })

    it('should render component with props', () => {
      const wrapper = mount(SelectMenuHandler, {
        propsData: {
          value: 'Value',
          placeholder: 'Placeholder'
        }
      })
      const handler = wrapper.find('.SelectMenuHandler')
      expect(handler.text()).toBe('Value')
    })

    it('should render component with slots', () => {
      const wrapper = mount(SelectMenuHandler, {
        slots: {
          default: '<strong>Value</strong>'
        }
      })
      expect(wrapper.contains('.SelectMenuHandler')).toBeTruthy()
    })

    it('should emit click event', () => {
      const wrapper = mount(SelectMenuHandler, {
        propsData: {
          value: 'Value'
        }
      })
      const handler = wrapper.find('.SelectMenuHandler')
      handler.trigger('click')
      expect(wrapper.emitted('click')).toBeTruthy()
    })
  })

  describe('Menu', () => {
    it('should render component', () => {
      const wrapper = mount(SelectMenu)
      expect(wrapper.contains('.SelectMenu')).toBeTruthy()
    })

    it('should render component with items', () => {
      const wrapper = mount(SelectMenu, {
        propsData: {
          items: ['first', 'second']
        }
      })
      expect(wrapper.findAll('.SelectMenuItem').length).toBe(2)
    })

    it('should emit select event', () => {
      const wrapper = mount(SelectMenu, {
        propsData: {
          items: ['first', 'second']
        }
      })
      const handler = wrapper.find('.SelectMenuHandler')
      handler.trigger('click')
      const item = wrapper.find('.SelectMenuItem')
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
      const handler = wrapper.find('.SelectMenuHandler')
      handler.trigger('click')
      const active = wrapper.find('.SelectMenuItem--active')
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
      expect(wrapper.contains('.SelectMenuItem')).toBeTruthy()
    })
  })
})
