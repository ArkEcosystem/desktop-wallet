import { merge } from 'lodash'
import Vue from 'vue'
import Vuelidate from 'vuelidate'
import { mount } from '@vue/test-utils'
import { useI18n } from '../../__utils__/i18n'
import { InputAddress } from '@/components/Input'
import WalletService from '@/services/wallet'

Vue.use(Vuelidate)
const i18n = useI18n(Vue)

describe('InputAddress', () => {
  const mountComponent = config => {
    return mount(InputAddress, merge({
      i18n,
      propsData: {
        value: '',
        pubKeyHash: 23
      },
      mocks: {
        wallet_name: value => value
      }
    }, config))
  }

  it('has the right name', () => {
    const wrapper = mountComponent()
    expect(wrapper.name()).toEqual('InputAddress')
  })

  it('should render', () => {
    const wrapper = mountComponent()
    expect(wrapper.contains('.InputAddress')).toBeTruthy()
  })

  describe('when receiving the `isDisabled` prop', () => {
    it('should be disabled', () => {
      const wrapper = mountComponent({
        propsData: { isDisabled: true }
      })
      const input = wrapper.find('.InputAddress__input')
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
      wrapper.find('.InputAddress input').setValue('not empty')

      expect(wrapper.emitted('input')).toBeTruthy()
    })
  })

  describe('when the value is not valid', () => {
    // FIXME: Vuelidate is not updating the $dirty state
    xit('should show the error instead of the helper text', () => {
      WalletService.validateAddress = jest.fn(() => false)

      const wrapper = mountComponent()
      wrapper.find('.InputAddress input').setValue('not empty')

      const helper = wrapper.find('.InputField__helper')

      expect(wrapper.vm.error).toMatch(/not.*valid/)
      expect(helper.text()).toMatch(/not.*valid/)
    })
  })

  describe('when focus', () => {
    it('should focus the input', () => {
      const wrapper = mountComponent()
      wrapper.vm.focus()
      expect(wrapper.vm.isFocused).toBeTrue()
    })

    it('should emit the `focus` event', () => {
      const wrapper = mountComponent()
      wrapper.vm.focus()
      expect(wrapper.emitted('focus')).toBeTruthy()
    })
  })
})
