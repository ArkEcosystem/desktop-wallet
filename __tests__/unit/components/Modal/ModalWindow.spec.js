import { mount } from '@vue/test-utils'
import ModalWindow from '@/components/Modal'

const stubs = {
  'Portal': true
}

describe('ModalWindow', () => {
  describe('render popup', () => {
    it('should render the popup', () => {
      const wrapper = mount(ModalWindow, { stubs })
      expect(wrapper.contains('.modal-backdrop')).toBe(true)
    })

    it('should render with content', () => {
      const wrapper = mount(ModalWindow, {
        stubs,
        slots: {
          default: ['<strong>My popup modal</strong>']
        }
      })
      expect(wrapper.contains('article')).toBe(true)
    })

    it('should render with a title passed by prop', () => {
      const wrapper = mount(ModalWindow, {
        stubs,
        propsData: {
          title: 'Testing popup component'
        }
      })
      expect(wrapper.contains('header')).toBe(true)
    })

    it('should render with a header passed by slot', () => {
      const wrapper = mount(ModalWindow, {
        stubs,
        slots: {
          header: '<h2>Testing popup component</h2>'
        }
      })
      expect(wrapper.contains('header')).toBe(true)
    })

    it('should render with a message passed by prop', () => {
      const wrapper = mount(ModalWindow, {
        stubs,
        propsData: {
          message: 'Testing popup component'
        }
      })
      expect(wrapper.contains('footer')).toBe(true)
    })

    it('should render with a header passed by slot', () => {
      const wrapper = mount(ModalWindow, {
        stubs,
        slots: {
          footer: '<footer>Testing popup component</footer>'
        }
      })
      expect(wrapper.contains('footer')).toBe(true)
    })
  })

  describe('close popup', () => {
    it('should emit a close event when clicks the close button', () => {
      const wrapper = mount(ModalWindow, { stubs })
      const mask = wrapper.find('button')
      mask.trigger('click')
      expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('should emit a close event when clicks the mask', () => {
      const wrapper = mount(ModalWindow, { stubs })
      const mask = wrapper.find('.modal-backdrop')
      mask.trigger('click')
      expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('should not close when pressing inside the modal', () => {
      const wrapper = mount(ModalWindow, { stubs })
      const modal = wrapper.find('.ModalWindow__container')
      modal.trigger('click')
      expect(wrapper.emitted('close')).toBeFalsy()
    })
  })
})
