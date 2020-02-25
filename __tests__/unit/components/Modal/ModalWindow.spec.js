import { mount } from '@vue/test-utils'
import ModalWindow from '@/components/Modal'
import useI18nGlobally from '../../__utils__/i18n'

const i18n = useI18nGlobally()

const stubs = {
  Portal: '<div><slot/></div>'
}

describe('ModalWindow', () => {
  describe('render popup', () => {
    it('should render the popup', () => {
      const wrapper = mount(ModalWindow, { stubs })
      expect(wrapper.contains('.ModalWindow')).toBe(true)
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

  describe('close confirmation modal', () => {
    const options = {
      stubs,
      i18n,
      propsData: {
        confirmClose: true
      }
    }

    describe('render', () => {
      describe('without changes', () => {
        it('should not render when click on mask', () => {
          const wrapper = mount(ModalWindow, options)
          const mask = wrapper.find('.ModalWindow')
          mask.trigger('click')
          expect(wrapper.contains('.ModalCloseConfirmation')).toBeFalsy()
        })
        it('should not render when click on close button', () => {
          const wrapper = mount(ModalWindow, options)
          const mask = wrapper.find('.ModalWindow__close-button')
          mask.trigger('click')
          expect(wrapper.contains('.ModalCloseConfirmation')).toBeFalsy()
        })
      })
      describe('with changes', () => {
        it('should render when click on mask', () => {
          const wrapper = mount(ModalWindow, options)
          wrapper.setData({ showConfirmationModal: true })
          const mask = wrapper.find('.ModalWindow')
          mask.trigger('click')
          expect(wrapper.contains('.ModalCloseConfirmation')).toBeTruthy()
        })

        it('should render when click on close button', () => {
          const wrapper = mount(ModalWindow, options)
          wrapper.setData({ showConfirmationModal: true })
          const mask = wrapper.find('.ModalWindow__close-button')
          mask.trigger('click')
          expect(wrapper.contains('.ModalCloseConfirmation')).toBeTruthy()
        })
      })
    })

    describe('events', () => {
      describe('close', () => {
        it('should emit on confirm', () => {
          const wrapper = mount(ModalWindow, options)
          wrapper.setData({ showConfirmationModal: true })
          const confirmButton = wrapper.find('.ModalCloseConfirmation__confirm-button')
          confirmButton.trigger('click')
          expect(wrapper.emitted('close')).toBeTruthy()
        })

        it('should not emit on cancel', () => {
          const wrapper = mount(ModalWindow, options)
          wrapper.setData({ showConfirmationModal: true })
          const cancelButton = wrapper.find('.ModalCloseConfirmation__cancel-button')
          cancelButton.trigger('click')
          expect(wrapper.emitted('close')).toBeFalsy()
        })
      })

      describe('confirm', () => {
        it('should close the confirmation modal', () => {
          const wrapper = mount(ModalWindow, options)
          wrapper.setData({ showConfirmationModal: true })
          const confirmButton = wrapper.find('.ModalCloseConfirmation__confirm-button')
          confirmButton.trigger('click')
          expect(wrapper.contains('.ModalCloseConfirmation')).toBeFalsy()
        })
        it('should close the modal window', () => {
          const wrapper = mount(ModalWindow, options)
          wrapper.setData({ showConfirmationModal: true })
          const confirmButton = wrapper.find('.ModalCloseConfirmation__confirm-button')
          confirmButton.trigger('click')
          expect(wrapper.contains('.ModalCloseConfirmation')).toBeFalsy()
        })
      })

      describe('cancel', () => {
        it('should close the confirmation modal', () => {
          const wrapper = mount(ModalWindow, options)
          wrapper.setData({ showConfirmationModal: true })
          const cancelButton = wrapper.find('.ModalCloseConfirmation__cancel-button')
          cancelButton.trigger('click')
          expect(wrapper.contains('.ModalCloseConfirmation')).toBeFalsy()
        })
        it('should not close the modal window', () => {
          const wrapper = mount(ModalWindow, options)
          wrapper.setData({ showConfirmationModal: true })
          const cancelButton = wrapper.find('.ModalCloseConfirmation__cancel-button')
          cancelButton.trigger('click')
          expect(wrapper.contains('.ModalWindow')).toBeTruthy()
        })
      })
    })
  })

  describe('close popup', () => {
    it('should emit a close event when clicks the close button', () => {
      const wrapper = mount(ModalWindow, { stubs })
      const mask = wrapper.find('.ModalWindow__close-button')
      mask.trigger('click')
      expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('should not close when clicking inside the modal', () => {
      const wrapper = mount(ModalWindow, { stubs })
      const modal = wrapper.find('.ModalWindow__container')
      modal.trigger('click')
      expect(wrapper.emitted('close')).toBeFalsy()
    })

    it('should not close when mousedown inside the modal', () => {
      const wrapper = mount(ModalWindow, { stubs })
      const modal = wrapper.find('.ModalWindow__container')
      modal.trigger('mousedown')
      expect(wrapper.emitted('close')).toBeFalsy()
    })

    it('should close when firing mousedown inside the mask', () => {
      const wrapper = mount(ModalWindow, { stubs })
      const mask = wrapper.find('.ModalWindow')
      mask.trigger('mousedown')
      expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('should not close event when firing mouseup only inside the mask', () => {
      const wrapper = mount(ModalWindow, { stubs })
      const mask = wrapper.find('.ModalWindow')
      mask.trigger('mouseup')
      expect(wrapper.emitted('close')).toBeFalsy()
    })

    it('should not close event when firing mousedown inside the container and mouseup inside the wrapper', () => {
      const wrapper = mount(ModalWindow, { stubs })
      const modal = wrapper.find('.ModalWindow__container')
      const mask = wrapper.find('.ModalWindow')
      modal.trigger('mousedown')
      mask.trigger('mouseup')
      expect(wrapper.emitted('close')).toBeFalsy()
    })
  })

  describe('resize popup', () => {
    it('should start maximized', () => {
      const wrapper = mount(ModalWindow, { stubs })
      expect(wrapper.contains('.ModalWindow--maximized')).toBe(true)
    })

    it('should not display the resize button by default', () => {
      const wrapper = mount(ModalWindow, { stubs })
      expect(wrapper.contains('.ModalWindow__resize-button')).toBe(false)
    })

    it('should display the resize button', () => {
      const wrapper = mount(ModalWindow, { stubs, propsData: { canResize: true } })
      expect(wrapper.contains('.ModalWindow__resize-button')).toBe(true)
    })

    it('should minimize modal when clicks the resize button', () => {
      const wrapper = mount(ModalWindow, { stubs, propsData: { canResize: true } })
      const button = wrapper.find('.ModalWindow__resize-button')
      button.trigger('click')
      expect(wrapper.contains('.ModalWindow--minimized')).toBe(true)
    })

    it('should not close when pressing on the backdrop while minimized', () => {
      const wrapper = mount(ModalWindow, { stubs, propsData: { canResize: true } })
      const button = wrapper.find('.ModalWindow__resize-button')
      button.trigger('click')
      expect(wrapper.contains('.ModalWindow--minimized')).toBe(true)

      const modal = wrapper.find('.ModalWindow')
      modal.trigger('click')
      expect(wrapper.emitted('close')).toBeFalsy()
    })

    it('should maximize modal when clicks the resize button', () => {
      const wrapper = mount(ModalWindow, { stubs, propsData: { canResize: true } })
      const button = wrapper.find('.ModalWindow__resize-button')
      button.trigger('click')
      expect(wrapper.contains('.ModalWindow--minimized')).toBe(true)
      button.trigger('click')
      expect(wrapper.contains('.ModalWindow--maximized')).toBe(true)
    })
  })
})
