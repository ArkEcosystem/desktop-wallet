import { mount } from '@vue/test-utils'
import PopupModal from '@/components/PopupModal'

describe('PopupModal', () => {
  describe('render popup', () => {
    it('should render the popup', () => {
      const wrapper = mount(PopupModal)
      expect(wrapper.contains('.PopupModal__mask')).toBe(true)
    })

    it('should render with content', () => {
      const wrapper = mount(PopupModal, {
        slots: {
          default: ['<strong>My popup modal</strong>']
        }
      })
      expect(wrapper.contains('article')).toBe(true)
    })

    it('should render with a title passed by prop', () => {
      const wrapper = mount(PopupModal, {
        propsData: {
          title: 'Testing popup component'
        }
      })
      expect(wrapper.contains('header')).toBe(true)
    })

    it('should render with a header passed by slot', () => {
      const wrapper = mount(PopupModal, {
        slots: {
          header: '<h2>Testing popup component</h2>'
        }
      })
      expect(wrapper.contains('header')).toBe(true)
    })

    it('should render with a message passed by prop', () => {
      const wrapper = mount(PopupModal, {
        propsData: {
          message: 'Testing popup component'
        }
      })
      expect(wrapper.contains('footer')).toBe(true)
    })

    it('should render with a header passed by slot', () => {
      const wrapper = mount(PopupModal, {
        slots: {
          footer: '<span>Testing popup component</span>'
        }
      })
      expect(wrapper.contains('footer')).toBe(true)
    })
  })

  describe('close popup', () => {
    it('should emit a close event when clicks the close button', () => {
      const wrapper = mount(PopupModal)
      const mask = wrapper.find('button')
      mask.trigger('click')
      expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('should emit a close event when clicks the mask', () => {
      const wrapper = mount(PopupModal)
      const mask = wrapper.find('.PopupModal__mask')
      mask.trigger('click')
      expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('should not close when pressing inside the modal', () => {
      const wrapper = mount(PopupModal)
      const modal = wrapper.find('.PopupModal__container')
      modal.trigger('click')
      expect(wrapper.emitted('close')).toBeFalsy()
    })
  })
})
