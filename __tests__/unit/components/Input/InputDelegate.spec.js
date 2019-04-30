import { merge } from 'lodash'
import Vue from 'vue'
import Vuelidate from 'vuelidate'
import { mount } from '@vue/test-utils'
import { useI18n } from '../../__utils__/i18n'
import { InputDelegate } from '@/components/Input'
import delegates from '../../__fixtures__/store/delegate'

Vue.use(Vuelidate)
const i18n = useI18n(Vue)

describe('InputDelegate', () => {
  const mountComponent = config => {
    return mount(InputDelegate, merge({
      i18n,
      propsData: {
        value: ''
      },
      mocks: {
        wallet_name: value => value,
        wallet_truncate: value => value,
        $store: {
          getters: {
            'delegate/byUsername': value => value,
            'delegate/byAddress': value => value,
            'delegate/byPublicKey': value => value,
            'delegate/bySessionNetwork': delegates
          }
        }
      }
    }, config))
  }

  it('has the right name', () => {
    const wrapper = mountComponent()
    expect(wrapper.name()).toEqual('InputDelegate')
  })

  it('should render', () => {
    const wrapper = mountComponent()
    expect(wrapper.contains('.InputDelegate')).toBeTruthy()
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
      wrapper.find('.InputDelegate input').setValue('not empty')

      expect(wrapper.emitted('input')).toBeTruthy()
    })

    it('should emit the `valid` event', () => {
      const wrapper = mountComponent()
      wrapper.find('.InputDelegate input').setValue('not empty')

      expect(wrapper.emitted('valid')).toBeTruthy()
    })
  })

  describe('when the value is not valid', () => {
    // FIXME: Vuelidate is not updating the $dirty state
    xit('should show the error instead of the helper text', () => {
      const wrapper = mountComponent()
      wrapper.find('.InputDelegate input').setValue('not empty')

      const helper = wrapper.find('.InputField__helper')

      expect(wrapper.vm.error).toMatch(/could not be found/)
      expect(helper.text()).toMatch(/could not be found/)
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
