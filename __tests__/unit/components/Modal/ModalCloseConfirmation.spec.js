import { shallowMount } from '@vue/test-utils'
import useI18nGlobally from '../../__utils__/i18n'
import { ModalCloseConfirmation } from '@/components/Modal'

const i18n = useI18nGlobally()

let wrapper
beforeEach(() => {
  wrapper = shallowMount(ModalCloseConfirmation, {
    i18n
  })
})

describe('ModalCloseConfirmation', () => {
  describe('render popup', () => {
    it('should render the close confirmation modal', () => {
      expect(wrapper.isVueInstance()).toBeTrue()
    })
  })

  describe('close modal capabilities', () => {
    describe('cancel event', () => {
      it('should emit a cancel event when clicks the cancel buttom', () => {
        const mask = wrapper.find('.ModalCloseConfirmation__cancel-button')
        mask.trigger('click')
        expect(wrapper.emitted('cancel')).toBeTruthy()
      })

      it('should emit a cancel event when clicks the mask', () => {
        const mask = wrapper.find('.ModalCloseConfirmation__mask')
        mask.trigger('click')
        expect(wrapper.emitted('cancel')).toBeTruthy()
      })

      it('should not emit a cancel event when pressing inside the modal', () => {
        const modal = wrapper.find('.ModalCloseConfirmation__container')
        modal.trigger('click')
        expect(wrapper.emitted('cancel')).toBeFalsy()
      })
    })

    describe('confirm event', () => {
      it('should emit a confirm event when clicks the confirm buttom', () => {
        const mask = wrapper.find('.ModalCloseConfirmation__confirm-button')
        mask.trigger('click')
        expect(wrapper.emitted('confirm')).toBeTruthy()
      })
    })
  })
})
