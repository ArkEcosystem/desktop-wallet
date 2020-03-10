import { mount } from '@vue/test-utils'
import { MenuDropdown, MenuDropdownItem, MenuDropdownHandler } from '@/components/Menu'

describe('MenuDropdown', () => {
  describe('Item', () => {
    it('should render component', () => {
      const wrapper = mount(MenuDropdownItem, {
        propsData: {
          value: 'Test',
          item: 'Item text'
        }
      })
      expect(wrapper.contains('.MenuDropdownItem')).toBeTruthy()
    })

    it('should render with active prop', () => {
      const wrapper = mount(MenuDropdownItem, {
        propsData: {
          value: 'Test',
          isActive: true,
          item: 'Item text'
        }
      })
      expect(wrapper.contains('.MenuDropdownItem--active')).toBeTruthy()
    })

    it('should emit click event', () => {
      const wrapper = mount(MenuDropdownItem, {
        propsData: {
          value: 'Test',
          item: 'Item text'
        }
      })
      const element = wrapper.find('.MenuDropdownItem__button')
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
          value: 'value',
          item: 'Item text',
          placeholder: 'Placeholder'
        }
      })
      const handler = wrapper.find('.MenuDropdownHandler')
      expect(handler.text()).toBe('Item text')
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
      const wrapper = mount(MenuDropdown, {
        propsData: {
          items: [1, 2, 3]
        }
      })
      wrapper.vm.open()
      expect(wrapper.contains('.MenuDropdown')).toBeTruthy()
    })

    describe('when the `position` is omitted', () => {
      it('should fallback to the default values', () => {
        const wrapper = mount(MenuDropdown)
        expect(wrapper.vm.adjustedPosition).toEqual({
          x: '0',
          y: '120%'
        })
      })
    })

    describe('when the `position` is an object', () => {
      it.each(['x', 'y'])('should merge the provided values with the default values', (dimension) => {
        const wrapper = mount(MenuDropdown, {
          propsData: {
            position: { [dimension]: 'foo' }
          }
        })

        const defaultValues = {
          x: '0',
          y: '120%'
        }

        expect(wrapper.vm.adjustedPosition).toEqual({
          ...defaultValues,
          [dimension]: 'foo'
        })
      })
    })

    describe('when the `items` are an Array', () => {
      it('should render component with `items`', () => {
        const wrapper = mount(MenuDropdown, {
          propsData: {
            items: ['first', 'second']
          }
        })
        wrapper.vm.open()
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
        const item = wrapper.find('.MenuDropdownItem__button')
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
        wrapper.vm.open()
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
        const item = wrapper.find('.MenuDropdownItem__button')
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
          value: 'Test',
          item: 'Item text'
        }
      })
      const wrapper = mount(MenuDropdown, {
        slots: {
          default: item.html()
        }
      })
      expect(wrapper.contains('.MenuDropdownItem')).toBeTruthy()
    })

    it('should not activate items when clicked', () => {
      const wrapper = mount(MenuDropdown, {
        propsData: {
          items: ['first', 'second'],
          value: 'second',
          isHighlighting: false
        }
      })
      const handler = wrapper.find('.MenuDropdownHandler')
      handler.trigger('click')
      const isActive = wrapper.contains('.MenuDropdownItem--active')
      expect(isActive).toBe(false)
    })
  })
})
