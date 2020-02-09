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
    it('should render a close confirmation modal when click on mask', () => {
      const wrapper = mount(ModalWindow, {
        stubs,
        i18n,
        propsData: {
          confirmClose: true
        }
      })
      const mask = wrapper.find('.ModalWindow')
      mask.trigger('click')
      expect(wrapper.contains('.ModalCloseConfirmation')).toBeTruthy()
    })

    it('should not emit close when backdrop clicked', () => {
      const wrapper = mount(ModalWindow, {
        stubs,
        i18n,
        propsData: {
          confirmClose: true
        }
      })
      const mask = wrapper.find('.ModalWindow')
      mask.trigger('click')
      expect(wrapper.emitted('close')).toBeFalsy()
    })

    it('should emit close when confirm closing', () => {
      const wrapper = mount(ModalWindow, {
        stubs,
        i18n,
        propsData: {
          confirmClose: true
        },
        data () {
          return {
            showConfirmationModal: true
          }
        }
      })
      const button = wrapper.find('.ModalCloseConfirmation__confirm-button')
      button.trigger('click')
      expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('should not emit close when click on confirmation mask', () => {
      const wrapper = mount(ModalWindow, {
        stubs,
        i18n,
        propsData: {
          confirmClose: true
        },
        data () {
          return {
            showConfirmationModal: true
          }
        }
      })
      const button = wrapper.find('.ModalCloseConfirmation__mask')
      button.trigger('click')
      expect(wrapper.emitted('close')).toBeFalsy()
    })

    it('should close the confirmation modal when canceling', () => {
      const wrapper = mount(ModalWindow, {
        stubs,
        i18n,
        propsData: {
          confirmClose: true
        },
        data () {
          return {
            showConfirmationModal: true
          }
        }
      })
      const button = wrapper.find('.ModalCloseConfirmation__cancel-button')
      button.trigger('click')
      expect(wrapper.contains('.ModalCloseConfirmation')).toBeFalsy()
    })
  })

  describe('close popup', () => {
    it('should emit a close event when clicks the close button', () => {
      const wrapper = mount(ModalWindow, { stubs })
      const mask = wrapper.find('.ModalWindow__close-button')
      mask.trigger('click')
      expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('should emit a close event when clicks the mask', () => {
      const wrapper = mount(ModalWindow, { stubs })
      const mask = wrapper.find('.ModalWindow')
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
