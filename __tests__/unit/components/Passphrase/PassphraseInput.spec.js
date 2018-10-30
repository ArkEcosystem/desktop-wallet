import { merge } from 'lodash'
import Vue from 'vue'
import Vuelidate from 'vuelidate'
import { mount } from '@vue/test-utils'
import { useI18n } from '../../__utils__/i18n'
import { PassphraseInput } from '@/components/Passphrase'
import WalletService from '@/services/wallet'

Vue.use(Vuelidate)
const i18n = useI18n(Vue)

describe('PassphraseInput', () => {
  const mountComponent = config => {
    return mount(PassphraseInput, merge({
      i18n,
      propsData: {
        value: '',
        pubKeyHash: 23
      }
    }, config))
  }

  it('has the right name', () => {
    const wrapper = mountComponent()
    expect(wrapper.name()).toEqual('PassphraseInput')
  })

  it('should render', () => {
    const wrapper = mountComponent()
    expect(wrapper.contains('.PassphraseInput')).toBeTruthy()
  })

  describe('when receiving the `isDisabled` prop', () => {
    it('should be disabled', () => {
      const wrapper = mountComponent({
        propsData: { isDisabled: true }
      })
      const input = wrapper.find('.PassphraseInput__input')
      expect(input.attributes().disabled).toBe('disabled')
    })
  })

  describe('when receiving the `helperText` prop', () => {
    it('should show a helper text', () => {
      const helperText = 'example text'
      const wrapper = mountComponent({
        propsData: { helperText }
      })
      const helper = wrapper.find('.InputField__helper')
      expect(helper.text()).toBe(helperText)
    })
  })

  describe('when the input value changes', () => {
    it('should emit the `input` event', () => {
      const wrapper = mountComponent()
      wrapper.find('.PassphraseInput input').setValue('not empty')

      expect(wrapper.emitted('input')).toBeTruthy()
    })
  })

  describe('when the passphrase is not valid', () => {
    // FIXME: Vuelidate is not updating the $dirty state
    xit('should show the error instead of the helper text', () => {
      WalletService.validatePassphrase = jest.fn(() => false)

      const wrapper = mountComponent()
      wrapper.find('.PassphraseInput input').setValue('not empty')

      const helper = wrapper.find('.InputField__helper')

      expect(wrapper.vm.error).toMatch(/not.*valid/)
      expect(helper.text()).toMatch(/not.*valid/)
    })
  })

  describe('when focus', () => {
    it('should focus the input', async () => {
      const wrapper = mountComponent()
      await wrapper.vm.focus()
      expect(wrapper.vm.isFocused).toBeTrue()
    })

    it('should emit the `focus` event', async () => {
      const wrapper = mountComponent()
      await wrapper.vm.focus()
      expect(wrapper.emitted('focus')).toBeTruthy()
    })
  })
})
