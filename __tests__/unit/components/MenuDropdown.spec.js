import { mount } from '@vue/test-utils'
import { MenuDropdown, MenuDropdownItem, MenuDropdownHandler } from '@/components/MenuDropdown'

describe('MenuDropdown', () => {
  describe('Item', () => {
    it('should render component', () => {
      const wrapper = mount(MenuDropdownItem, {
        propsData: {
          value: 'Test'
        }
      })
      expect(wrapper.contains('.MenuDropdownItem')).toBeTruthy()
    })

    it('should render with active prop', () => {
      const wrapper = mount(MenuDropdownItem, {
        propsData: {
          value: 'Test',
          isActive: true
        }
      })
      expect(wrapper.contains('.MenuDropdownItem--active')).toBeTruthy()
    })

    it('should emit click event', () => {
      const wrapper = mount(MenuDropdownItem, {
        propsData: {
          value: 'Test'
        }
      })
      const element = wrapper.find('.MenuDropdownItem')
      element.trigger('click')
      expect(wrapper.emitted('click')).toBeTruthy()
    })
  })

  describe('Handler', () => {
    it('should render component', () => {
      const wrapper = mount(MenuDropdownHandler)
      expect(wrapper.contains('.MenuDropdownHandler')).toBeTruthy()
    })

    it('should render component with props', () => {
      const wrapper = mount(MenuDropdownHandler, {
        propsData: {
          value: 'Value',
          placeholder: 'Placeholder'
        }
      })
      const handler = wrapper.find('.MenuDropdownHandler')
      expect(handler.text()).toBe('Value')
    })

    it('should render component with slots', () => {
      const wrapper = mount(MenuDropdownHandler, {
        slots: {
          default: '<strong>Value</strong>'
        }
      })
      expect(wrapper.contains('.MenuDropdownHandler')).toBeTruthy()
    })

    it('should emit click event', () => {
      const wrapper = mount(MenuDropdownHandler, {
        propsData: {
          value: 'Value'
        }
      })
      const handler = wrapper.find('.MenuDropdownHandler')
      handler.trigger('click')
      expect(wrapper.emitted('click')).toBeTruthy()
    })
  })

  describe('Menu', () => {
    it('should render component', () => {
      const wrapper = mount(MenuDropdown)
      expect(wrapper.contains('.MenuDropdown')).toBeTruthy()
    })

    describe('when the `items` are an Array', () => {
      it('should render component with `items`', () => {
        const wrapper = mount(MenuDropdown, {
          propsData: {
            items: ['first', 'second']
          }
        })
        expect(wrapper.findAll('.MenuDropdownItem').length).toBe(2)
      })

      it('should emit the selected item on the `select` event', () => {
        const wrapper = mount(MenuDropdown, {
          propsData: {
            items: ['first', 'second'],
            value: 'second'
          }
        })

        const handler = wrapper.find('.MenuDropdownHandler')
        handler.trigger('click')
        const item = wrapper.find('.MenuDropdownItem')
        item.trigger('click')

        expect(wrapper.emitted().select[0]).toEqual(['first'])
      })
    })

    describe('when the `items` are an Object', () => {
      it('should render component with `items`', () => {
        const wrapper = mount(MenuDropdown, {
          propsData: {
            items: {
              first: 'first label',
              second: 'seconf label'
            }
          }
        })
        expect(wrapper.findAll('.MenuDropdownItem').length).toBe(2)
      })

      it('should emit the key of selected item on the `select` event', () => {
        const wrapper = mount(MenuDropdown, {
          propsData: {
            items: {
              first: 'first label',
              second: 'second label'
            },
            value: 'second'
          }
        })

        const handler = wrapper.find('.MenuDropdownHandler')
        handler.trigger('click')
        const item = wrapper.find('.MenuDropdownItem')
        item.trigger('click')

        expect(wrapper.emitted().select[0]).toEqual(['first'])
      })
    })

    it('should render component with items and activeItem', () => {
      const wrapper = mount(MenuDropdown, {
        propsData: {
          items: ['first', 'second'],
          value: 'second'
        }
      })
      const handler = wrapper.find('.MenuDropdownHandler')
      handler.trigger('click')
      const active = wrapper.find('.MenuDropdownItem--active')
      expect(active.text()).toBe('second')
    })

    it('should render component with slots', () => {
      const item = mount(MenuDropdownItem, {
        propsData: {
          value: 'Test'
        }
      })
      const wrapper = mount(MenuDropdown, {
        slots: {
          default: item.html()
        }
      })
      expect(wrapper.contains('.MenuDropdownItem')).toBeTruthy()
    })
  })
})
